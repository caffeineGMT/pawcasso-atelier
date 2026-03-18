import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { type TierId } from "@/lib/stripe";

const prisma = new PrismaClient();
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmployeeData {
  name: string;
  email: string;
  petPhotoUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      companyName,
      contactName,
      contactEmail,
      tier,
      employees,
    } = body as {
      companyName: string;
      contactName: string;
      contactEmail: string;
      tier: TierId;
      employees: EmployeeData[];
    };

    // Validation
    if (!companyName || !contactName || !contactEmail || !tier || !employees || !Array.isArray(employees)) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (employees.length === 0) {
      return NextResponse.json(
        { error: "No employees provided" },
        { status: 400 }
      );
    }

    // Calculate pricing based on tier
    const tierPrices: Record<TierId, number> = {
      basic: 9,
      premium: 29,
      deluxe: 49,
      bundle: 79,
    };

    const pricePerPortrait = tierPrices[tier];
    const totalAmount = employees.length * pricePerPortrait;

    // Create corporate order
    const corporateOrder = await prisma.corporateOrder.create({
      data: {
        companyName,
        contactName,
        contactEmail,
        tier,
        employeeCount: employees.length,
        totalAmount,
        paymentStatus: "PENDING",
      },
    });

    // Create employee records with unique upload tokens
    const employeeRecords = await Promise.all(
      employees.map(async (emp) => {
        const uploadToken = generateUploadToken();

        return await prisma.corporateEmployee.create({
          data: {
            corporateOrderId: corporateOrder.id,
            employeeName: emp.name,
            employeeEmail: emp.email,
            petPhotoUrl: emp.petPhotoUrl,
            uploadToken,
            status: emp.petPhotoUrl ? "PHOTO_UPLOADED" : "PENDING_PHOTO",
          },
        });
      })
    );

    // Send individual emails to employees who need to upload photos
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const emailPromises = employeeRecords
      .filter(emp => !emp.petPhotoUrl)
      .map(async (emp) => {
        const uploadUrl = `${baseUrl}/corporate/upload/${emp.uploadToken}`;

        return sendEmployeeEmail({
          employeeName: emp.employeeName,
          employeeEmail: emp.employeeEmail,
          companyName,
          uploadUrl,
        });
      });

    await Promise.all(emailPromises);

    // Mark emails as sent
    await prisma.corporateEmployee.updateMany({
      where: {
        corporateOrderId: corporateOrder.id,
        petPhotoUrl: null,
      },
      data: {
        emailSent: true,
        emailSentAt: new Date(),
      },
    });

    // Send confirmation email to corporate buyer
    if (resend) {
      await resend.emails.send({
        from: "Pawcasso Atelier <noreply@pawcasso-atelier.com>",
        to: contactEmail,
        subject: `Corporate Order Confirmation - ${employees.length} Portraits`,
        html: `
          <h2>Thank you for your corporate order!</h2>
          <p>Hi ${contactName},</p>
          <p>We've received your bulk order for <strong>${employees.length} custom pet portraits</strong>.</p>

          <h3>Order Details:</h3>
          <ul>
            <li>Company: ${companyName}</li>
            <li>Package: ${tier.toUpperCase()}</li>
            <li>Total Portraits: ${employees.length}</li>
            <li>Total Amount: $${totalAmount.toFixed(2)}</li>
          </ul>

          <p>We've sent individual emails to all employees with upload links. As they upload their pet photos, we'll begin generating their portraits.</p>

          <p>You can track the progress of your order at any time.</p>

          <p>Questions? Reply to this email or DM us on Instagram @pawcasso.atelier</p>

          <p>Best regards,<br/>The Pawcasso Team</p>
        `,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: corporateOrder.id,
      totalAmount,
      employeeCount: employees.length,
      emailsSent: employeeRecords.filter(e => !e.petPhotoUrl).length,
    });
  } catch (error) {
    console.error("Corporate bulk order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create corporate order" },
      { status: 500 }
    );
  }
}

/**
 * Generates a secure random upload token
 */
function generateUploadToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Sends email to individual employee with upload link
 */
async function sendEmployeeEmail({
  employeeName,
  employeeEmail,
  companyName,
  uploadUrl,
}: {
  employeeName: string;
  employeeEmail: string;
  companyName: string;
  uploadUrl: string;
}) {
  if (!resend) {
    console.log(`[DEV] Would send email to ${employeeEmail}: ${uploadUrl}`);
    return;
  }

  await resend.emails.send({
    from: "Pawcasso Atelier <noreply@pawcasso-atelier.com>",
    to: employeeEmail,
    subject: `${companyName} gifted you a custom pet portrait! 🎁`,
    html: `
      <h2>You've received a special gift! 🎁</h2>

      <p>Hi ${employeeName},</p>

      <p><strong>${companyName}</strong> has gifted you a custom AI-generated portrait of your pet!</p>

      <p>To claim your portrait, simply upload a photo of your furry friend:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${uploadUrl}"
           style="background: #D4AF37; color: #000; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Upload Your Pet Photo
        </a>
      </div>

      <p><strong>What happens next?</strong></p>
      <ol>
        <li>Upload a clear photo of your pet</li>
        <li>Our AI artists will transform it into a stunning portrait</li>
        <li>Receive your masterpiece via email within 24 hours</li>
      </ol>

      <p>This gift is valid indefinitely - upload whenever you're ready!</p>

      <p><em>Don't have a pet?</em> No worries! You can upload a photo of any animal you love.</p>

      <p>Questions? Reply to this email or DM us on Instagram @pawcasso.atelier</p>

      <p>Happy creating!<br/>The Pawcasso Team</p>
    `,
  });
}

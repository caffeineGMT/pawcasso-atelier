import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Example API route with proper error handling
 */

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate input
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Simulate processing (replace with actual email sending logic)
    console.log("Contact form submission:", { name, email, subject, message });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, send email here using Resend or similar
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "contact@pawcasso-atelier.com",
    //   to: "support@pawcasso-atelier.com",
    //   subject: `Contact Form: ${subject}`,
    //   html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong><br/>${message}</p>`,
    // });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    // Handle different types of errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}

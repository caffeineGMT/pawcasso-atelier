import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getStripeCustomerId } from "@/lib/stripe";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      from: "Pawcasso Atelier <login@pawcasso-atelier.com>",
      sendVerificationRequest: async ({ identifier: email, url }) => {
        if (!resend) {
          console.error("Resend API key not configured");
          throw new Error("Email service not configured");
        }

        try {
          await resend.emails.send({
            from: "Pawcasso Atelier <login@pawcasso-atelier.com>",
            to: email,
            subject: "Sign in to your Pawcasso dashboard",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F8F7F4;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F8F7F4; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                          <!-- Header -->
                          <tr>
                            <td style="padding: 40px 40px 20px; text-align: center;">
                              <h1 style="margin: 0; font-size: 32px; font-family: 'Playfair Display', serif; color: #E07A5F;">Pawcasso Atelier</h1>
                            </td>
                          </tr>

                          <!-- Content -->
                          <tr>
                            <td style="padding: 20px 40px;">
                              <h2 style="margin: 0 0 16px; font-size: 24px; color: #2B2D42; font-weight: 600;">Sign in to your dashboard</h2>
                              <p style="margin: 0 0 24px; font-size: 16px; color: #4A4A4A; line-height: 1.6;">
                                Click the button below to securely sign in to your Pawcasso dashboard. This link will expire in 24 hours.
                              </p>
                            </td>
                          </tr>

                          <!-- Button -->
                          <tr>
                            <td style="padding: 0 40px 32px;">
                              <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td align="center">
                                    <a href="${url}" style="display: inline-block; padding: 16px 48px; background-color: #E07A5F; color: #ffffff; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 16px;">Sign in to Dashboard</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          <!-- Alternative link -->
                          <tr>
                            <td style="padding: 0 40px 32px;">
                              <p style="margin: 0; font-size: 14px; color: #4A4A4A; line-height: 1.6;">
                                Or copy and paste this link into your browser:
                              </p>
                              <p style="margin: 8px 0 0; font-size: 12px; color: #3D5A80; word-break: break-all;">
                                ${url}
                              </p>
                            </td>
                          </tr>

                          <!-- Footer -->
                          <tr>
                            <td style="padding: 24px 40px 40px; border-top: 1px solid #E5E5E5;">
                              <p style="margin: 0; font-size: 12px; color: #4A4A4A; line-height: 1.6;">
                                If you didn't request this email, you can safely ignore it.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `,
          });
        } catch (error) {
          console.error("Failed to send magic link email:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user?.email) {
        const stripeCustomerId = await getStripeCustomerId(session.user.email);
        (session.user as any).stripeCustomerId = stripeCustomerId;
        (session.user as any).id = user.id;

        // Add admin status from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { isAdmin: true },
        });
        (session.user as any).isAdmin = dbUser?.isAdmin || false;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

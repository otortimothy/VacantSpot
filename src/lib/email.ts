import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface InquiryEmailProps {
  landlordEmail: string;
  landlordName: string;
  seekerName: string;
  seekerEmail: string;
  message: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyId: string;
}

export async function sendInquiryNotification({
  landlordEmail,
  landlordName,
  seekerName,
  seekerEmail,
  message,
  propertyTitle,
  propertyAddress,
  propertyId,
}: InquiryEmailProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const propertyUrl = `${siteUrl}/properties/${propertyId}`;
  const dashboardUrl = `${siteUrl}/dashboard`;

  const { data, error } = await resend.emails.send({
   from: "VacantSpot <onboarding@resend.dev>",
    to: landlordEmail,
    subject: `New Inspection Request for "${propertyTitle}"`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New Inspection Request</title>
        </head>
        <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:40px 40px 36px;">
                      <p style="margin:0 0 12px;font-size:13px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.7);">VacantSpot</p>
                      <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">New Inspection Request 🏠</h1>
                      <p style="margin:12px 0 0;font-size:16px;color:rgba(255,255,255,0.85);">Someone wants to inspect your property.</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px;">
                      
                      <p style="margin:0 0 24px;font-size:16px;color:#475569;">Hi <strong>${landlordName}</strong>,</p>
                      <p style="margin:0 0 32px;font-size:16px;color:#475569;line-height:1.6;">
                        A house seeker has submitted an inspection request for your property on VacantSpot. Here are the details:
                      </p>

                      <!-- Property Box -->
                      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
                        <p style="margin:0 0 4px;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;">Property</p>
                        <p style="margin:0;font-size:18px;font-weight:800;color:#0f172a;">${propertyTitle}</p>
                        <p style="margin:4px 0 0;font-size:14px;color:#64748b;">📍 ${propertyAddress}</p>
                      </div>

                      <!-- Seeker Box -->
                      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px 24px;margin-bottom:24px;">
                        <p style="margin:0 0 12px;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;">House Seeker</p>
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding-bottom:8px;">
                              <span style="font-size:13px;color:#64748b;font-weight:600;">Name</span><br/>
                              <span style="font-size:15px;font-weight:800;color:#0f172a;">${seekerName}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <span style="font-size:13px;color:#64748b;font-weight:600;">Email</span><br/>
                              <a href="mailto:${seekerEmail}" style="font-size:15px;font-weight:800;color:#3b82f6;text-decoration:none;">${seekerEmail}</a>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Message Box -->
                      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:16px;padding:20px 24px;margin-bottom:32px;">
                        <p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#92400e;">Their Message</p>
                        <p style="margin:0;font-size:15px;color:#1c1917;line-height:1.7;font-style:italic;">"${message}"</p>
                      </div>

                      <!-- CTA Buttons -->
                      <table cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td style="padding-right:8px;" width="50%">
                            <a href="mailto:${seekerEmail}?subject=Re: Inspection Request for ${propertyTitle}&body=Hi ${seekerName},%0D%0A%0D%0AThank you for your interest in ${propertyTitle}.%0D%0A%0D%0A"
                               style="display:block;text-align:center;background:#0f172a;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;padding:14px 20px;border-radius:12px;">
                              Reply to Seeker
                            </a>
                          </td>
                          <td style="padding-left:8px;" width="50%">
                            <a href="${dashboardUrl}"
                               style="display:block;text-align:center;background:#f1f5f9;color:#0f172a;text-decoration:none;font-size:14px;font-weight:800;padding:14px 20px;border-radius:12px;border:1px solid #e2e8f0;">
                              View Dashboard
                            </a>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f8fafc;padding:24px 40px;border-top:1px solid #e2e8f0;">
                      <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;line-height:1.6;">
                        This message was sent via the VacantSpot inquiry system to protect both parties' privacy.<br/>
                        <a href="${propertyUrl}" style="color:#3b82f6;text-decoration:none;font-weight:600;">View Property Listing</a>
                        &nbsp;·&nbsp;
                        <a href="${dashboardUrl}" style="color:#3b82f6;text-decoration:none;font-weight:600;">Go to Dashboard</a>
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

  if (error) {
    console.error("Failed to send inquiry email:", error);
    // Don't throw — email failure shouldn't block the inquiry submission
  }

  return { data, error };
}

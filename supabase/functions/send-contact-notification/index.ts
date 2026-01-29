import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactData {
  id: string;
  type: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  service_type?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { contact }: { contact: ContactData } = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const isQuote = contact.type === 'quote';
    const title = isQuote ? 'New Quote Request' : 'New Contact Submission';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec008c 0%, #8b5fbf 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #ec008c; }
            .message-box { background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${title}!</h1>
              <p>You have received a new ${isQuote ? 'quote request' : 'general enquiry'} from ${isQuote ? 'a potential customer' : 'a visitor'}</p>
            </div>
            <div class="content">
              <div class="details">
                <h2>Contact Information</h2>
                <div class="detail-row">
                  <span class="detail-label">Name:</span> ${contact.name}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span> ${contact.email}
                </div>
                ${contact.phone ? `
                <div class="detail-row">
                  <span class="detail-label">Phone:</span> ${contact.phone}
                </div>
                ` : ""}
                ${contact.company ? `
                <div class="detail-row">
                  <span class="detail-label">Company:</span> ${contact.company}
                </div>
                ` : ""}
                ${contact.subject ? `
                <div class="detail-row">
                  <span class="detail-label">Subject:</span> ${contact.subject}
                </div>
                ` : ""}
                ${contact.service_type ? `
                <div class="detail-row">
                  <span class="detail-label">Service Type:</span> ${contact.service_type}
                </div>
                ` : ""}
              </div>

              <div class="details">
                <h2>Message</h2>
                <div class="message-box">
                  ${contact.message.replace(/\n/g, '<br/>')}
                </div>
              </div>

              <div class="footer">
                ${contact.id ? `<p>Submission ID: ${contact.id}</p>` : ''}
                <p>Type: ${contact.type === 'quote' ? 'Quote Request' : 'General Enquiry'}</p>
                <p>This is an automated notification from SaniLady</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "SaniLady <onboarding@resend.dev>",
        to: ["ronchimbo@gmail.com"],
        subject: isQuote
          ? `New Quote Request from ${contact.name || contact.email}`
          : `New Contact: ${contact.subject || 'General Enquiry'}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend error:", emailData);
      throw new Error(`Failed to send email: ${JSON.stringify(emailData)}`);
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailData.id }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

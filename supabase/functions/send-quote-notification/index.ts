import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QuoteData {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name: string;
  service_type: string;
  property_size: string;
  employee_count: number;
  bin_count: number;
  estimated_cost: number;
  special_requirements: string;
  additional_services: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { quote }: { quote: QuoteData } = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const serviceTypeDisplay = quote.service_type
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ec008c 0%, #8b5fbf 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .quote-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #ec008c; }
            .price { font-size: 32px; font-weight: bold; color: #ec008c; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Quote Request!</h1>
              <p>You have received a new quote request from a potential customer</p>
            </div>
            <div class="content">
              <div class="quote-details">
                <h2>Customer Information</h2>
                <div class="detail-row">
                  <span class="detail-label">Name:</span> ${quote.customer_name || "Not provided"}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span> ${quote.customer_email || "Not provided"}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Phone:</span> ${quote.customer_phone || "Not provided"}
                </div>
                <div class="detail-row">
                  <span class="detail-label">Company:</span> ${quote.company_name || "Not provided"}
                </div>
              </div>

              <div class="quote-details">
                <h2>Service Details</h2>
                <div class="detail-row">
                  <span class="detail-label">Service Type:</span> ${serviceTypeDisplay}
                </div>
                ${quote.property_size !== "N/A" ? `
                <div class="detail-row">
                  <span class="detail-label">Facility Size:</span> ${quote.property_size}
                </div>
                ` : ""}
                ${quote.employee_count > 0 ? `
                <div class="detail-row">
                  <span class="detail-label">Number of Employees:</span> ${quote.employee_count}
                </div>
                ` : ""}
                ${quote.bin_count > 0 ? `
                <div class="detail-row">
                  <span class="detail-label">Number of Bins:</span> ${quote.bin_count}
                </div>
                ` : ""}
                ${quote.additional_services.length > 0 ? `
                <div class="detail-row">
                  <span class="detail-label">Additional Services:</span> ${quote.additional_services.join(", ")}
                </div>
                ` : ""}
                ${quote.special_requirements ? `
                <div class="detail-row">
                  <span class="detail-label">Special Requirements:</span><br/>
                  ${quote.special_requirements}
                </div>
                ` : ""}
              </div>

              <div class="price">
                £${quote.estimated_cost.toFixed(2)}/month
              </div>

              <p style="text-align: center; margin-top: 20px;">
                <a href="${Deno.env.get("SUPABASE_URL")}/dashboard/admin/quotes"
                   style="background: #ec008c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
                  View in Dashboard
                </a>
              </p>

              <div class="footer">
                <p>Quote ID: ${quote.id}</p>
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
        subject: `New Quote Request from ${quote.customer_name || quote.customer_email || "Customer"}`,
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
    console.error("Error in send-quote-notification:", error);
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

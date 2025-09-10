const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail", // let nodemailer handle Gmail config
  auth: {
    user: process.env.GMAIL_USER_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendNewEnquiryEmail = async (to, subject) => {
  try {
    await transporter.sendMail({
      from: `"Wezi Medical Centre" <${process.env.GMAIL_USER_EMAIL}>`,
      to,
      subject,
      replyTo: process.env.GMAIL_USER_EMAIL,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
      },
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; color: #052e16; line-height: 1.5; background:#f9fafb; padding:20px;">
            <div style="max-width:600px;margin:auto;background:white;padding:20px;border-radius:8px;box-shadow:0 2px 6px rgba(0,0,0,0.1)">
              <h2 style="color:#2563eb; margin-bottom:15px;">Wezi Medical Centre</h2>
              <p>Hello,</p>
              <p>You have a <strong>new enquiry</strong> waiting for you. Please log in to your account to review it.</p>
              <p style="margin-top:20px;">Warm Regards,<br>Wezi Medical Centre Team</p>
              <hr style="margin-top:20px;">
              <p style="font-size:12px;color:#6b7280;">This is an automated message. If you did not expect this, please ignore it.</p>
            </div>
          </body>
        </html>
      `,
      text: `Hello, You have a new enquiry waiting for you. Please check your dashboard. Warm Regards, Wezi Medical Centre Team`, 
    });

    console.log("Enquiry alert Email sent successfully to", to);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

sendNewEnquiryEmail("thukutajones10@gmail.com", "NEW ENQUIRY ALERT");

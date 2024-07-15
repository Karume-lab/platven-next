import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
//-----------------------------------------------------------------------------
export async function sendMail({
  toEmail,
  html,
  subject,
  text,
}: {
  toEmail: string;
  subject?: string;
  text?: string;
  html?: string;
}) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: subject,
    text,
    html,
  } as Mail.Options;

  const info = await transporter.sendMail(mailOptions);
  console.log("Message sent: %s", info.messageId);
  return info;
}

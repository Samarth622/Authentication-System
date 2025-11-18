import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "cb8663dff11e83",
    pass: "90264ff00f8222",
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const sender = {
      address: "hello@demomailtrap.com",
      name: "OTP Verification",
    };

    await transport.sendMail({
      from: sender,
      to,
      subject,
      text,
      category: "OTP Verification",
    });

    console.log("Email sent to:", to);
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Email sending failed");
  }
};

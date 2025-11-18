import nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const transport = nodemailer.createTransport(
  MailtrapTransport({
    token: process.env.MAILTRAP_TOKEN,
  })
);

export const sendEmail = async (to, subject, text) => {
  try {
    const sender = {
      address: "hello@demomailtrap.co",
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

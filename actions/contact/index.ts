"use server";

import ContactEmailTemplate from "@/react-email-starter/emails/contact-email-template";
import { Resend } from "resend";

interface Props {
  name: string;
  email: string;
  inqueryMessage: string;
}

export async function sendEmail(input: Props) {
  if (
    !input ||
    typeof input.name !== "string" ||
    typeof input.email !== "string" ||
    typeof input.inqueryMessage !== "string"
  ) {
    return { success: false, message: "Please fill in all the required fields." };
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const inqueryMessage = input.inqueryMessage.trim();

  if (!name || !email || !inqueryMessage) {
    return {
      success: false,
      message: "Please fill in all the required fields.",
    };
  }

  if (name.length > 100 || email.length > 254 || inqueryMessage.length > 5000) {
    return {
      success: false,
      message: "Please limit your name to 100, email to 254, and inquiry to 5,000 characters.",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || /[\r\n]/.test(email)) {
    return {
      success: false,
      message: "Please provide a valid email address.",
    };
  }

  if (/[\r\n]/.test(name)) {
    return { success: false, message: "Please enter your name on a single line." };
  }

  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      message: "Email delivery is temporarily unavailable. Please email us directly or try again later.",
    };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Credence Contact <lead@anisurrahmanroni.com>",
      to: ["monirhrabby.personal@gmail.com"],
      replyTo: email,

      subject: `New Inquiry from ${name}`,
      react: ContactEmailTemplate({
        name,
        email,
        inquery: inqueryMessage,
      }),
    });

    if (error || !data?.id) {
      return {
        success: false,
        message: "Failed to send your message. Please try again or email us directly.",
      };
    }

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred while sending the email.",
    };
  }
}

"use server";
import CareerApplicationEmail from "@/components/emails/CareerApplicationEmail";
import { resend } from "@/lib/resend";
import { z } from "zod";

const careerApplicationSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email("Invalid email address."),
  role: z.string().min(1, "Role is required."),
  message: z.string().min(1, "Message is required."),
});

export async function sendCareerApplication(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const parsed = careerApplicationSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: parsed.error.errors.map((e) => e.message).join(", "),
    };
  }

  const { fullName, email, role, message } = parsed.data;

  try {
    await resend.emails.send({
      from: "HyperWear Careers <no-reply@hyperwear.io>",
      to: "hyperwear.store@gmail.com",
      subject: `New Career Application: ${role}`,
      replyTo: email,
      react: CareerApplicationEmail({
        fullName,
        email,
        role,
        message,
      }),
    });
    return { success: "Application sent successfully!" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to send application." };
  }
} 
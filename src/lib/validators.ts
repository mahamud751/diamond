import { z } from "zod";

export const orderSchema = z.object({
  packageId: z.string().min(1, "Choose a package."),
  quantity: z.coerce.number().int().min(1).max(10),
  recipientUid: z.string().trim().min(3, "Enter the UID that should receive the diamonds.").max(40),
  customerName: z.string().trim().min(2, "Enter the name for this order.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(8, "Enter a phone number the desk can use.").max(24),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "UPAY", "BANK"]),
  senderNumber: z.string().trim().min(4, "Enter the number or account you paid from.").max(40),
  transactionId: z.string().trim().min(4, "Enter the transaction ID.").max(80),
  note: z.string().trim().max(500).optional(),
});

export const reviewSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  role: z.string().trim().max(80).optional(),
  quote: z.string().trim().min(10, "Write a short note.").max(600),
  rating: z.coerce.number().int().min(1).max(5),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().max(24).optional(),
  subject: z.string().trim().min(2, "Add a subject.").max(120),
  message: z.string().trim().min(10, "Write a short message.").max(2000),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter the email on the account."),
  password: z.string().min(1, "Enter your password.").max(72),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().max(24).optional(),
  password: z.string().min(8, "Use at least 8 characters.").max(72),
});

export const withdrawalSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(8, "Enter a phone or WhatsApp number we can reach.").max(24),
  uid: z.string().trim().min(3, "Enter your Chamet UID.").max(40),
  amount: z.string().trim().min(1, "Enter the amount you want to withdraw.").max(40),
  method: z.enum(["BKASH", "NAGAD", "ROCKET", "UPAY", "BANK"], { message: "Choose a payout method." }),
  account: z.string().trim().min(4, "Enter the number or account to pay.").max(120),
  note: z.string().trim().max(800).optional(),
});

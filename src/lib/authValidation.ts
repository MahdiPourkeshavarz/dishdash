import { z } from "zod";

const nameRegex = /^[\u0600-\u06FF\sA-Za-z]+$/;

export const SignUpSchema = z.object({
  fullName: z
    .string()
    .min(3, "نام کامل باید حداقل ۳ کاراکتر باشد")
    .regex(nameRegex, "نام فقط می‌تواند شامل حروف باشد"),
  username: z
    .string()
    .min(3, "نام کاربری باید حداقل ۳ کاراکتر باشد")
    .regex(/^[a-zA-Z0-9_]+$/, "فقط حروف انگلیسی، اعداد و _ مجاز است"),
  email: z.string().email("ایمیل معتبر نیست"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(/[A-Z]/, "رمز عبور باید شامل حداقل یک حرف بزرگ باشد")
    .regex(/[a-z]/, "رمز عبور باید شامل حداقل یک حرف کوچک باشد")
    .regex(/[0-9]/, "رمز عبور باید شامل حداقل یک عدد باشد")
    .regex(/[^a-zA-Z0-9]/, "رمز عبور باید شامل حداقل یک کاراکتر خاص باشد"),
});

export const SignInSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست"),
  password: z.string().min(1, "رمز عبور نمی‌تواند خالی باشد"),
});

export type SignUpData = z.infer<typeof SignUpSchema>;
export type SignInData = z.infer<typeof SignInSchema>;

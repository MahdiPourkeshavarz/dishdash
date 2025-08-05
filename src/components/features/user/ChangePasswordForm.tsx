/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { z } from "zod";
import { Input } from "../auth/Input";
import { useChangePassword } from "@/hooks/useUpdatePassword";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z
    .string()
    .min(8, "حداقل ۸ کاراکتر")
    .regex(/[A-Z]/, "یک حرف بزرگ انگلیسی")
    .regex(/[a-z]/, "یک حرف کوچک انگلیسی")
    .regex(/[0-9]/, "یک عدد")
    .regex(/[^a-zA-Z0-9]/, "یک کاراکتر خاص (!@#...)"),
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const [error, setError] = useState<string>("");

  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmit = (data: PasswordFormData) => {
    changePassword(data, {
      onSuccess: () => {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      },
      onError: (error: any) => {
        console.log(error);
        setError("تغییر رمز موفقیت آمیز نبود");
      },
    });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const buttonText = isPending
    ? "در حال تغییر..."
    : isSubmitSuccessful
    ? "رمز با موفقیت تغییر کرد"
    : "تغییر رمز عبور";

  const buttonClassName = `w-full mt-2 p-2 rounded-lg font-semibold transition-colors text-white disabled:opacity-75 ${
    isSubmitSuccessful ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"
  }`;

  return (
    <form
      className="flex flex-col items-center gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="رمز عبور فعلی"
        type="password"
        dir="ltr"
        {...register("currentPassword")}
        error={errors.currentPassword?.message}
        autoComplete="off"
      />
      <Input
        label="رمز عبور جدید"
        type="password"
        dir="ltr"
        {...register("newPassword")}
        error={errors.newPassword?.message}
        autoComplete="off"
      />

      {error && (
        <p className="text-red-500 text-sm text-center -mb-2">{error}</p>
      )}

      <motion.button
        type="submit"
        disabled={isPending || isSubmitSuccessful}
        className={buttonClassName}
        whileTap={{ scale: 0.95 }}
      >
        {buttonText}
      </motion.button>
    </form>
  );
};

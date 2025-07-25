/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";
import { z } from "zod";
import { Input } from "../auth/Input";
import { useChangePassword } from "@/hooks/useUpdatePassword";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است"),
  newPassword: z.string().min(8, "رمز عبور جدید باید حداقل 8 کاراکتر باشد"),
});

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: changePassword, isPending } = useChangePassword();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationResult = passwordSchema.safeParse({
      currentPassword,
      newPassword,
    });

    if (!validationResult.success) {
      const newErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    changePassword(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setIsSuccess(true);

          setTimeout(() => {
            onSuccess();
          }, 500);
        },
        onError: (error: any) => {
          alert(`Error: ${error.response?.data?.message || error.message}`);
        },
      }
    );
  };

  const buttonText = isPending
    ? "در حال تغییر..."
    : isSuccess
    ? "رمز با موفقیت تغییر کرد"
    : "تغییر رمز عبور";

  const buttonClassName = `w-full mt-2 p-2 rounded-lg font-semibold transition-colors text-white disabled:opacity-75 ${
    isSuccess ? "bg-green-600" : "bg-blue-600 hover:bg-blue-500"
  }`;

  return (
    <form className="flex flex-col items-center gap-4" onSubmit={handleSubmit}>
      <Input
        label="رمز عبور فعلی"
        type="password"
        dir="ltr"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        error={errors.currentPassword}
        autoComplete="off"
      />
      <Input
        label="رمز عبور جدید"
        type="password"
        dir="ltr"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={errors.newPassword}
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={isPending || isSuccess}
        className={buttonClassName}
      >
        {buttonText}
      </button>
    </form>
  );
};

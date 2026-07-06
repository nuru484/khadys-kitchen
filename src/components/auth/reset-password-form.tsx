"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { useResetPasswordMutation } from "@/redux/auth/auth-api";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/validations/auth-schema";

/** The reset form. `token` comes from the emailed link's `?token=` param and is
 *  merged into the request body (the backend expects `{ token, password }`). */
export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      await resetPassword({ token, password: values.password }).unwrap();
      notify.success("Password reset", {
        description: "Sign in with your new password.",
      });
      router.replace("/login");
    } catch (err) {
      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);
      if (hasFieldErrors && fieldErrors?.password) {
        setError("password", { message: fieldErrors.password });
      }
      notify.error("Couldn't reset your password", { description: message });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <TextField
        label="New password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={errors.password?.message}
        {...register("password")}
      />
      <TextField
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        error={errors.confirm?.message}
        {...register("confirm")}
      />
      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        isLoading={isLoading}
        loadingText="Saving…"
      >
        Set new password
      </Button>
    </form>
  );
}

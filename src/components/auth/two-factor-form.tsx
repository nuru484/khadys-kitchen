"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import {
  useVerifyTwoFactorMutation,
  useResendTwoFactorCodeMutation,
} from "@/redux/auth/auth-api";
import { twoFactorSchema, type TwoFactorValues } from "@/validations/auth-schema";

interface TwoFactorFormProps {
  /** The email the challenge was issued for, shown for context. */
  email: string;
  redirectTo: string;
  /** Return to the credentials step (e.g. wrong account). */
  onBack: () => void;
}

export function TwoFactorForm({ email, redirectTo, onBack }: TwoFactorFormProps) {
  const router = useRouter();
  const [verify, { isLoading }] = useVerifyTwoFactorMutation();
  const [resend, { isLoading: isResending }] = useResendTwoFactorCodeMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<TwoFactorValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (values: TwoFactorValues) => {
    try {
      await verify(values).unwrap();
      notify.success("Welcome back");
      router.replace(redirectTo);
    } catch (err) {
      const { message, fieldErrors, hasFieldErrors } = extractApiError(err);
      if (hasFieldErrors && fieldErrors?.code) {
        setError("code", { message: fieldErrors.code });
      }
      notify.error("That code didn't work", { description: message });
    }
  };

  const onResend = async () => {
    try {
      await resend().unwrap();
      notify.success("New code sent", { description: `Check ${email}.` });
    } catch (err) {
      notify.error("Couldn't resend the code", {
        description: extractApiError(err).message,
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
      <p className="text-[14.5px] leading-[1.6] text-ink/65">
        We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>.
        Enter it below to finish signing in.
      </p>
      <TextField
        label="Verification code"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="123456"
        maxLength={6}
        error={errors.code?.message}
        {...register("code")}
      />
      <Button
        type="submit"
        size="lg"
        className="mt-1 w-full"
        isLoading={isLoading}
        loadingText="Verifying…"
      >
        Verify &amp; sign in
      </Button>
      <div className="flex items-center justify-between text-[13.5px]">
        <button
          type="button"
          onClick={onBack}
          className="cursor-pointer font-semibold text-ink/60 transition-colors hover:text-ink"
        >
          ← Use a different account
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={isResending}
          className="cursor-pointer font-semibold text-accent transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResending ? "Sending…" : "Resend code"}
        </button>
      </div>
    </form>
  );
}

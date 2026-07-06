import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

// Decoupled from the network: mock the RTK Query hook so the test exercises the
// form's behaviour (validation, the neutral confirmation) in isolation.
const { forgotTrigger } = vi.hoisted(() => ({ forgotTrigger: vi.fn() }));
vi.mock("@/redux/auth/auth-api", () => ({
  useForgotPasswordMutation: () => [forgotTrigger, { isLoading: false }],
}));
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: unknown; children: ReactNode }) => (
    <a href={String(href)} {...rest}>
      {children}
    </a>
  ),
}));

beforeEach(() => {
  forgotTrigger.mockReset();
  forgotTrigger.mockReturnValue({ unwrap: () => Promise.resolve({ message: "ok" }) });
});
afterEach(() => cleanup());

describe("ForgotPasswordForm", () => {
  it("submits the email and shows the neutral confirmation", async () => {
    render(<ForgotPasswordForm />);

    await userEvent.type(screen.getByLabelText(/email/i), "khady@khadyskitchen.com");
    await userEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() =>
      expect(screen.getByText(/password-reset link is on its way/i)).toBeInTheDocument(),
    );
    expect(screen.getByText("khady@khadyskitchen.com")).toBeInTheDocument();
    expect(forgotTrigger).toHaveBeenCalledWith({ email: "khady@khadyskitchen.com" });
  });

  it("validates the email client-side and does not call the API", async () => {
    render(<ForgotPasswordForm />);

    await userEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => expect(screen.getByText(/enter your email/i)).toBeInTheDocument());
    expect(forgotTrigger).not.toHaveBeenCalled();
  });
});

import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

// Decoupled from the network and the router: mock the mutation hook and useRouter
// so the test focuses on validation + the success handoff.
const { resetTrigger, replace } = vi.hoisted(() => ({
  resetTrigger: vi.fn(),
  replace: vi.fn(),
}));
vi.mock("@/redux/auth/auth-api", () => ({
  useResetPasswordMutation: () => [resetTrigger, { isLoading: false }],
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace }) }));

const TOKEN = "a".repeat(40); // reset tokens are long opaque strings
const STRONG = "Str0ng!Pass";

beforeEach(() => {
  resetTrigger.mockReset();
  replace.mockReset();
  resetTrigger.mockReturnValue({ unwrap: () => Promise.resolve({ message: "ok" }) });
});
afterEach(() => cleanup());

describe("ResetPasswordForm", () => {
  it("rejects mismatched passwords without calling the API", async () => {
    render(<ResetPasswordForm token={TOKEN} />);

    await userEvent.type(screen.getByLabelText(/new password/i), STRONG);
    await userEvent.type(screen.getByLabelText(/confirm password/i), "Different1!");
    await userEvent.click(screen.getByRole("button", { name: /set new password/i }));

    await waitFor(() => expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument());
    expect(resetTrigger).not.toHaveBeenCalled();
  });

  it("enforces the backend password policy client-side", async () => {
    render(<ResetPasswordForm token={TOKEN} />);

    await userEvent.type(screen.getByLabelText(/new password/i), "weak");
    await userEvent.type(screen.getByLabelText(/confirm password/i), "weak");
    await userEvent.click(screen.getByRole("button", { name: /set new password/i }));

    await waitFor(() => expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument());
    expect(resetTrigger).not.toHaveBeenCalled();
  });

  it("submits { token, password } and redirects to /login on success", async () => {
    render(<ResetPasswordForm token={TOKEN} />);

    await userEvent.type(screen.getByLabelText(/new password/i), STRONG);
    await userEvent.type(screen.getByLabelText(/confirm password/i), STRONG);
    await userEvent.click(screen.getByRole("button", { name: /set new password/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
    expect(resetTrigger).toHaveBeenCalledWith({ token: TOKEN, password: STRONG });
  });
});

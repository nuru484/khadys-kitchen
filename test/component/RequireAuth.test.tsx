import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { RequireAuth } from "@/components/auth/require-auth";

// Mock the data layer + router so the guard's decisions are tested in isolation.
const { getMe, logoutTrigger, replace, current } = vi.hoisted(() => ({
  getMe: vi.fn(),
  logoutTrigger: vi.fn(),
  replace: vi.fn(),
  current: { user: null as unknown },
}));

vi.mock("@/redux/auth/auth-api", () => ({
  useGetMeQuery: () => getMe(),
  useLogoutMutation: () => [logoutTrigger, { isLoading: false }],
}));
vi.mock("@/hooks/use-current-user", () => ({ useCurrentUser: () => current.user }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/admin",
}));

beforeEach(() => {
  getMe.mockReset();
  logoutTrigger.mockReset();
  replace.mockReset();
  current.user = null;
  logoutTrigger.mockReturnValue({ unwrap: () => Promise.resolve({}) });
});
afterEach(() => cleanup());

describe("RequireAuth", () => {
  it("renders the console when /me confirms the session", () => {
    getMe.mockReturnValue({ data: { data: { user: { id: "u1" } } }, isError: false });
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.getByText("console")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("clears the session and redirects to /login when /me fails", async () => {
    getMe.mockReturnValue({ data: undefined, isError: true });
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.queryByText("console")).not.toBeInTheDocument();
    await waitFor(() => expect(logoutTrigger).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith("/login?from=%2Fadmin"),
    );
  });

  it("renders optimistically from a persisted user while /me is in flight", () => {
    getMe.mockReturnValue({ data: undefined, isError: false });
    current.user = { id: "u1" };
    render(
      <RequireAuth>
        <div>console</div>
      </RequireAuth>,
    );
    expect(screen.getByText("console")).toBeInTheDocument();
  });
});

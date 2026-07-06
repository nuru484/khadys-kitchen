// @vitest-environment node
//
// The data layer runs in the node environment: jsdom ships an AbortSignal that
// isn't an undici AbortSignal, so fetchBaseQuery's Request construction throws
// under jsdom. Node's real fetch/Request/AbortSignal are internally consistent.
import { afterEach, describe, it, expect, vi } from "vitest";
import { makeTestStore } from "../helpers/store";
import { authApi } from "@/redux/auth/auth-api";
import { userLoggedIn } from "@/redux/auth/auth-slice";
import { UserRole, type IUser } from "@/types/user.types";

const USER: IUser = {
  id: "u1",
  firstName: "Khady",
  lastName: "Asante",
  email: "khady@khadyskitchen.com",
  phone: null,
  profilePicture: null,
  role: UserRole.ADMIN,
  twoFactorEnabled: false,
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Stub global fetch with a (url) -> Response resolver, recording every URL. */
function stubFetch(resolver: (url: string) => Response) {
  const calls: string[] = [];
  const mock = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : (input as Request).url ?? String(input);
    calls.push(url);
    return resolver(url);
  });
  vi.stubGlobal("fetch", mock);
  return { calls };
}

afterEach(() => vi.unstubAllGlobals());

describe("auth session wiring", () => {
  it("login stores the user unwrapped from data.data.user", async () => {
    stubFetch(() => json({ message: "Login successful", data: { user: USER } }));
    const store = makeTestStore();

    await store.dispatch(
      authApi.endpoints.login.initiate({ email: USER.email, password: "x" }),
    );

    // If the nesting were wrong this would be `{ user: USER }`, not `USER`.
    expect(store.getState().auth.user).toEqual(USER);
  });

  it("a 2FA challenge does not create a session", async () => {
    stubFetch(() =>
      json({ message: "Enter the code", data: { requiresTwoFactor: true, email: "kh***@x.com" } }),
    );
    const store = makeTestStore();

    const res = await store.dispatch(
      authApi.endpoints.login.initiate({ email: USER.email, password: "x" }),
    );

    expect(store.getState().auth.user).toBeNull();
    expect(res.data?.data).toMatchObject({ requiresTwoFactor: true });
  });

  it("getMe validates the session and stores the user", async () => {
    stubFetch(() => json({ message: "Current user", data: { user: USER } }));
    const store = makeTestStore();

    await store.dispatch(authApi.endpoints.getMe.initiate());

    expect(store.getState().auth.user).toEqual(USER);
  });

  it("getMe on an invalid session clears the user (fail-closed)", async () => {
    // Both /me and the refresh it triggers return 401.
    stubFetch(() => json({ status: "error", message: "Unauthorized" }, 401));
    const store = makeTestStore();
    store.dispatch(userLoggedIn({ user: USER })); // seed a stale user

    await store.dispatch(authApi.endpoints.getMe.initiate());

    expect(store.getState().auth.user).toBeNull();
  });

  it("a 401 triggers a single silent refresh, then retries the request", async () => {
    let meCount = 0;
    const { calls } = stubFetch((url) => {
      if (url.includes("/auth/refresh-token")) {
        return json({ message: "Session refreshed", data: { user: USER } });
      }
      if (url.includes("/auth/me")) {
        meCount += 1;
        return meCount === 1 ? json({ message: "no" }, 401) : json({ message: "Current user", data: { user: USER } });
      }
      return json({ message: "unexpected" }, 404);
    });
    const store = makeTestStore();

    await store.dispatch(authApi.endpoints.getMe.initiate());

    expect(store.getState().auth.user).toEqual(USER);
    expect(calls.filter((u) => u.includes("/auth/refresh-token"))).toHaveLength(1);
    expect(calls.filter((u) => u.includes("/auth/me"))).toHaveLength(2); // original + retry
  });
});

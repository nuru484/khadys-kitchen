import { describe, it, expect } from "vitest";
import { isTwoFactorChallenge, type LoginData } from "@/types/auth.types";
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

describe("isTwoFactorChallenge (login contract)", () => {
  it("detects the backend challenge shape { requiresTwoFactor, email }", () => {
    const data: LoginData = { requiresTwoFactor: true, email: "kh***@khadyskitchen.com" };
    expect(isTwoFactorChallenge(data)).toBe(true);
  });

  it("treats a wrapped session user { user } as a full login", () => {
    const data: LoginData = { user: USER };
    expect(isTwoFactorChallenge(data)).toBe(false);
  });
});

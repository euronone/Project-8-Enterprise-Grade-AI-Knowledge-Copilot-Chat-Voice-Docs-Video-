import { describe, it, expect } from "vitest";
import {
  emailSchema,
  passwordSchema,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  feedbackSchema,
} from "@/lib/validators";

describe("emailSchema", () => {
  it("accepts valid email", () => {
    expect(emailSchema.safeParse("user@test.com").success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(emailSchema.safeParse("notanemail").success).toBe(false);
  });

  it("rejects empty string", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
  });
});

describe("passwordSchema", () => {
  it("accepts valid password", () => {
    expect(passwordSchema.safeParse("Str0ng!Pass").success).toBe(true);
  });

  it("rejects short password", () => {
    const result = passwordSchema.safeParse("Sh0!");
    expect(result.success).toBe(false);
  });

  it("rejects password without uppercase", () => {
    const result = passwordSchema.safeParse("nouppcase1!");
    expect(result.success).toBe(false);
  });

  it("rejects password without number", () => {
    const result = passwordSchema.safeParse("NoNumber!!");
    expect(result.success).toBe(false);
  });

  it("rejects password without special character", () => {
    const result = passwordSchema.safeParse("NoSpecial1");
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid login", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(true);
  });

  it("rejects missing email", () => {
    expect(loginSchema.safeParse({ password: "x" }).success).toBe(false);
  });

  it("rejects empty password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "John Doe",
    email: "john@test.com",
    password: "Str0ng!Pass",
    confirmPassword: "Str0ng!Pass",
    organizationName: "Acme Inc",
  };

  it("accepts valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    expect(registerSchema.safeParse({ ...valid, confirmPassword: "Different1!" }).success).toBe(false);
  });

  it("rejects short name", () => {
    expect(registerSchema.safeParse({ ...valid, name: "J" }).success).toBe(false);
  });

  it("rejects short organization name", () => {
    expect(registerSchema.safeParse({ ...valid, organizationName: "A" }).success).toBe(false);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "a@b.com" }).success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "bad" }).success).toBe(false);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts valid reset data", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "NewStr0ng!",
        confirmPassword: "NewStr0ng!",
        token: "abc123",
      }).success
    ).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    expect(
      resetPasswordSchema.safeParse({
        password: "NewStr0ng!",
        confirmPassword: "Different1!",
        token: "abc123",
      }).success
    ).toBe(false);
  });
});

describe("feedbackSchema", () => {
  it("accepts thumbs_up", () => {
    expect(feedbackSchema.safeParse({ rating: "thumbs_up" }).success).toBe(true);
  });

  it("accepts thumbs_down with comment", () => {
    expect(feedbackSchema.safeParse({ rating: "thumbs_down", comment: "Not helpful" }).success).toBe(true);
  });

  it("rejects invalid rating", () => {
    expect(feedbackSchema.safeParse({ rating: "neutral" }).success).toBe(false);
  });
});

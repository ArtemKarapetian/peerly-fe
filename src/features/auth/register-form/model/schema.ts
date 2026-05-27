import { TFunction } from "i18next";
import { z } from "zod";

import { checkPasswordStrength } from "@/shared/lib/password";

export type RegistrableRole = "Student" | "Teacher";

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RegistrableRole;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildRegisterSchema(t: TFunction, lang: "ru" | "en") {
  return z
    .object({
      firstName: z.string().trim().min(1, t("auth.enterFirstName")),
      lastName: z.string().trim().min(1, t("auth.enterLastName")),
      email: z
        .string()
        .trim()
        .min(1, t("auth.enterEmail"))
        .regex(emailRegex, t("auth.invalidEmail")),
      password: z.string().min(1, t("auth.enterPassword")),
      confirmPassword: z.string().min(1, t("auth.repeatPassword")),
      role: z.enum(["Student", "Teacher"]),
    })
    .superRefine((data, ctx) => {
      if (data.password) {
        const strength = checkPasswordStrength(
          data.password,
          [data.firstName, data.lastName, data.email].filter(Boolean),
          lang,
        );
        if (!strength.isStrongEnough) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["password"],
            message: strength.warning || t("auth.passwordTooWeak"),
          });
        }
      }
      if (data.confirmPassword && data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["confirmPassword"],
          message: t("auth.passwordsDontMatch"),
        });
      }
    });
}

export const registerFormDefaults: RegisterFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "Student",
};

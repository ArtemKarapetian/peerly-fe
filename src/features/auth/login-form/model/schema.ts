import { TFunction } from "i18next";
import { z } from "zod";

export interface LoginFormValues {
  email: string;
  password: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function buildLoginSchema(t: TFunction) {
  return z.object({
    email: z.string().trim().min(1, t("auth.enterEmail")).regex(emailRegex, t("auth.invalidEmail")),
    password: z.string().min(1, t("auth.enterPassword")),
  });
}

export const loginFormDefaults: LoginFormValues = {
  email: "",
  password: "",
};

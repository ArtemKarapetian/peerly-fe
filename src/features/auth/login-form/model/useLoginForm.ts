import { zodResolver } from "@hookform/resolvers/zod";
import { type TFunction } from "i18next";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ApiError, humanizeApiError } from "@/shared/api";

import { defaultRouteForRole, useAuth } from "@/entities/user";

import { buildLoginSchema, loginFormDefaults, type LoginFormValues } from "./schema";

const GENERIC_VALIDATION_TITLES = new Set([
  "One or more validation errors occurred.",
  "Validation failed",
]);

function statusFallback(status: number, t: TFunction): string {
  switch (status) {
    case 400:
      return t("auth.badRequest");
    case 401:
      return t("auth.invalidCredentials");
    case 403:
      return t("auth.accountForbidden");
    case 404:
      return t("auth.userNotFound");
    case 429:
      return t("auth.tooManyAttempts");
    default:
      return status >= 500 ? t("auth.serverError") : t("auth.loginFailed");
  }
}

export function getLoginErrorMessage(err: unknown, t: TFunction): string {
  if (err instanceof ApiError) {
    const humanized = humanizeApiError(err, "");
    if (humanized && !GENERIC_VALIDATION_TITLES.has(humanized)) {
      return humanized;
    }
    return statusFallback(err.status, t);
  }
  if (err instanceof TypeError) return t("auth.networkError");
  return t("auth.loginFailed");
}

export function useLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const schema = useMemo(() => buildLoginSchema(t), [t]);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: loginFormDefaults,
    mode: "onTouched",
  });

  const [submitError, setSubmitError] = useState("");

  const submit = form.handleSubmit(async (values) => {
    setSubmitError("");
    try {
      const session = await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      void navigate(defaultRouteForRole(session.role));
    } catch (err) {
      setSubmitError(getLoginErrorMessage(err, t));
    }
  });

  return {
    form,
    submit,
    submitError,
    clearSubmitError: () => setSubmitError(""),
    isSubmitting: form.formState.isSubmitting,
  };
}

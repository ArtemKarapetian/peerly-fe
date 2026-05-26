import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { STORAGE_KEYS } from "@/shared/config/constants";
import { ROUTES } from "@/shared/config/routes";
import { checkPasswordStrength } from "@/shared/lib/password";

import { useAuth } from "@/entities/user";

import { buildRegisterSchema, registerFormDefaults, type RegisterFormValues } from "./schema";

export function useRegisterForm() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("ru") ? "ru" : "en";
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const schema = useMemo(() => buildRegisterSchema(t, lang), [t, lang]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: registerFormDefaults,
    mode: "onTouched",
  });

  const [submitError, setSubmitError] = useState("");
  const password = form.watch("password");
  const firstName = form.watch("firstName");
  const lastName = form.watch("lastName");
  const email = form.watch("email");

  const passwordStrength = useMemo(() => {
    if (!password) return null;
    return checkPasswordStrength(password, [firstName, lastName, email].filter(Boolean), lang);
  }, [password, firstName, lastName, email, lang]);

  const submit = form.handleSubmit(async (values) => {
    setSubmitError("");
    const trimmedEmail = values.email.trim().toLowerCase();
    const fullName = `${values.firstName.trim()} ${values.lastName.trim()}`.trim();
    try {
      await registerUser({
        email: trimmedEmail,
        password: values.password,
        name: fullName,
        role: values.role,
      });
      localStorage.setItem(STORAGE_KEYS.pendingVerificationEmail, trimmedEmail);
      toast.success(t("auth.accountCreated"), { description: t("auth.checkYourEmail") });
      void navigate(ROUTES.verifyEmail);
    } catch (err) {
      setSubmitError(humanizeApiError(err, t("auth.registrationError")));
    }
  });

  return {
    form,
    submit,
    submitError,
    passwordStrength,
    clearSubmitError: () => setSubmitError(""),
    isSubmitting: form.formState.isSubmitting,
  };
}

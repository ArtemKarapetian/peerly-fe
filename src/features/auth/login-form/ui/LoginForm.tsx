import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { Card } from "@/shared/ui";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { useLoginForm } from "../model/useLoginForm";

export function LoginForm() {
  const { t } = useTranslation();
  const { form, submit, submitError, clearSubmitError, isSubmitting } = useLoginForm();
  const {
    register,
    formState: { errors, touchedFields },
  } = form;

  return (
    <Card className="space-y-6 tablet:p-8">
      <div className="space-y-2">
        <h1 className="text-page-h1 font-medium text-foreground tracking-[-0.5px]">
          {t("auth.login")}
        </h1>
        <p className="text-15 text-muted-foreground">{t("auth.loginSubtitle")}</p>
      </div>

      {submitError && (
        <div
          role="alert"
          className="bg-destructive/10 border-2 border-destructive/50 rounded-lg px-4 py-3 flex items-start gap-3"
        >
          <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive font-medium whitespace-pre-line">{submitError}</p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          clearSubmitError();
          void submit(e);
        }}
        className="space-y-4"
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isSubmitting}
          error={touchedFields.email ? errors.email?.message : ""}
          {...register("email")}
        />

        <PasswordInput
          label={t("auth.password")}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isSubmitting}
          error={touchedFields.password ? errors.password?.message : ""}
          {...register("password")}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting || !form.formState.isValid}
          >
            {isSubmitting ? t("auth.loggingIn") : t("auth.signIn")}
          </Button>
        </div>
      </form>

      <div className="space-y-3 pt-2">
        <div className="text-center border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">{t("auth.noAccount")}</p>
          <Link to={ROUTES.register} className="text-sm font-medium text-primary hover:underline">
            {t("auth.createAccount")}
          </Link>
        </div>
      </div>
    </Card>
  );
}

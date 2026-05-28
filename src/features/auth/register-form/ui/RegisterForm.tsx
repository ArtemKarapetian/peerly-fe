import { GraduationCap, BookOpen, AlertCircle } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { type PasswordStrength } from "@/shared/lib/password";
import { Card } from "@/shared/ui";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { type RegistrableRole } from "../model/schema";
import { useRegisterForm } from "../model/useRegisterForm";

const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-warning",
  "bg-success",
  "bg-success",
] as const;

function PasswordStrengthMeter({ strength }: { strength: PasswordStrength }) {
  const { t } = useTranslation();
  const labelKeys = [
    "auth.strength.veryWeak",
    "auth.strength.weak",
    "auth.strength.fair",
    "auth.strength.good",
    "auth.strength.strong",
  ];
  return (
    <div className="space-y-1" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${strength.score > i ? STRENGTH_COLORS[strength.score] : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t(labelKeys[strength.score])}</p>
      {strength.suggestions.length > 0 && (
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
          {strength.suggestions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const ROLE_OPTIONS: ReadonlyArray<{
  value: RegistrableRole;
  titleKey: string;
  Icon: typeof GraduationCap;
}> = [
  { value: "Student", titleKey: "auth.roleStudentTitle", Icon: GraduationCap },
  { value: "Teacher", titleKey: "auth.roleTeacherTitle", Icon: BookOpen },
];

export function RegisterForm() {
  const { t } = useTranslation();
  const { form, submit, submitError, passwordStrength, clearSubmitError, isSubmitting } =
    useRegisterForm();
  const {
    register,
    formState: { errors, touchedFields },
    watch,
  } = form;

  const passwordValue = watch("password");

  return (
    <div className="w-full max-w-[540px]">
      <Card className="space-y-6 tablet:p-8">
        <div className="space-y-2">
          <h1 className="text-page-h1 font-medium text-foreground tracking-[-0.5px]">
            {t("auth.register")}
          </h1>
          <p className="text-15 text-muted-foreground">{t("auth.registerSubtitle")}</p>
        </div>

        {submitError && (
          <div
            role="alert"
            className="bg-destructive/10 border-2 border-destructive/50 rounded-lg px-4 py-3 flex items-start gap-3"
          >
            <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive font-medium whitespace-pre-line">
              {submitError}
            </p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            clearSubmitError();
            void submit(e);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            <Input
              label={t("auth.firstName")}
              type="text"
              placeholder={t("auth.firstNamePlaceholder")}
              autoComplete="given-name"
              disabled={isSubmitting}
              error={touchedFields.firstName ? errors.firstName?.message : ""}
              {...register("firstName")}
            />
            <Input
              label={t("auth.lastName")}
              type="text"
              placeholder={t("auth.lastNamePlaceholder")}
              autoComplete="family-name"
              disabled={isSubmitting}
              error={touchedFields.lastName ? errors.lastName?.message : ""}
              {...register("lastName")}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="ivan.petrov@university.edu"
            autoComplete="email"
            disabled={isSubmitting}
            error={touchedFields.email ? errors.email?.message : ""}
            {...register("email")}
          />

          <div className="space-y-1.5">
            <PasswordInput
              label={t("auth.password")}
              placeholder="••••••••"
              autoComplete="new-password"
              disabled={isSubmitting}
              error={touchedFields.password ? errors.password?.message : ""}
              helperText={!touchedFields.password && !errors.password ? t("auth.passwordHint") : ""}
              {...register("password")}
            />
            {passwordValue && passwordStrength && (
              <PasswordStrengthMeter strength={passwordStrength} />
            )}
          </div>

          <PasswordInput
            label={t("auth.confirmPassword")}
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isSubmitting}
            error={touchedFields.confirmPassword ? errors.confirmPassword?.message : ""}
            {...register("confirmPassword")}
          />

          <Controller
            control={form.control}
            name="role"
            render={({ field }) => (
              <fieldset className="space-y-2">
                <legend className="block text-sm text-foreground mb-2">{t("auth.role")}</legend>
                <div className="grid grid-cols-2 gap-3">
                  {ROLE_OPTIONS.map(({ value, titleKey, Icon }) => {
                    const selected = field.value === value;
                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() => field.onChange(value)}
                        disabled={isSubmitting}
                        aria-pressed={selected}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          selected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border hover:border-primary/40 bg-card text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-4" />
                        <span>{t(titleKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={
                isSubmitting ||
                !form.formState.isValid ||
                (form.formState.isSubmitSuccessful && !form.formState.isDirty)
              }
            >
              {isSubmitting ? t("auth.creating") : t("auth.createAccount")}
            </Button>
          </div>
        </form>

        <div className="text-center border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">{t("auth.alreadyHaveAccount")}</p>
          <Link to={ROUTES.login} className="text-sm font-medium text-primary hover:underline">
            {t("auth.signIn")}
          </Link>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {t("auth.agreeWith")}{" "}
              <Link to={ROUTES.terms} className="text-primary hover:underline">
                {t("auth.termsOfUse")}
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

import { useTranslation } from "react-i18next";

import { Card, FormErrorAlert } from "@/shared/ui";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { useRegisterForm } from "../model/useRegisterForm";

import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { RegisterFooter } from "./RegisterFooter";
import { RoleSelectorField } from "./RoleSelectorField";

export function RegisterForm() {
  const { t } = useTranslation();
  const { form, submit, submitError, passwordStrength, clearSubmitError, isSubmitting } =
    useRegisterForm();
  const {
    register,
    formState: { errors, touchedFields, isValid, isSubmitSuccessful, isDirty },
    watch,
  } = form;

  const passwordValue = watch("password");
  const submitDisabled = isSubmitting || !isValid || (isSubmitSuccessful && !isDirty);

  const handleSubmit = (e: React.FormEvent) => {
    clearSubmitError();
    void submit(e);
  };

  return (
    <div className="w-full max-w-[540px]">
      <Card className="space-y-6 tablet:p-8">
        <div className="space-y-2">
          <h1 className="text-page-h1 font-medium text-foreground tracking-[-0.5px]">
            {t("auth.register")}
          </h1>
          <p className="text-15 text-muted-foreground">{t("auth.registerSubtitle")}</p>
        </div>

        {submitError && <FormErrorAlert message={submitError} />}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <RoleSelectorField control={form.control} disabled={isSubmitting} />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={submitDisabled}
            >
              {isSubmitting ? t("auth.creating") : t("auth.createAccount")}
            </Button>
          </div>
        </form>

        <RegisterFooter />
      </Card>
    </div>
  );
}

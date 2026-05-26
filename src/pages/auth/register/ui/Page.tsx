import { GraduationCap, BookOpen, AlertCircle } from "lucide-react";
import { useMemo, useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { STORAGE_KEYS } from "@/shared/config/constants";
import { checkPasswordStrength } from "@/shared/lib/password";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { useAuth } from "@/entities/user";

import { PublicLayout } from "@/widgets/public-layout";

type RegistrableRole = "Student" | "Teacher";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-warning",
  "bg-success",
  "bg-success",
] as const;

function PasswordStrengthMeter({ score, suggestions }: { score: number; suggestions: string[] }) {
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
            className={`h-1 flex-1 rounded-full ${score > i ? STRENGTH_COLORS[score] : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-[12px] text-muted-foreground">{t(labelKeys[score])}</p>
      {suggestions.length > 0 && (
        <ul className="text-[12px] text-muted-foreground list-disc pl-4 space-y-0.5">
          {suggestions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("ru") ? "ru" : "en";
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<RegistrableRole>("Student");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const passwordStrength = useMemo(() => {
    if (!password) return null;
    return checkPasswordStrength(password, [firstName, lastName, email].filter(Boolean), lang);
  }, [password, firstName, lastName, email, lang]);

  const validateField = (field: keyof FormErrors, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "firstName":
        if (!value.trim()) newErrors.firstName = t("auth.enterFirstName");
        else delete newErrors.firstName;
        break;

      case "lastName":
        if (!value.trim()) newErrors.lastName = t("auth.enterLastName");
        else delete newErrors.lastName;
        break;

      case "email":
        if (!value.trim()) newErrors.email = t("auth.enterEmail");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = t("auth.invalidEmail");
        else delete newErrors.email;
        break;

      case "password": {
        if (!value) newErrors.password = t("auth.enterPassword");
        else {
          const result = checkPasswordStrength(
            value,
            [firstName, lastName, email].filter(Boolean),
            lang,
          );
          if (!result.isStrongEnough) {
            newErrors.password = result.warning || t("auth.passwordTooWeak");
          } else delete newErrors.password;
        }

        if (confirmPassword && value !== confirmPassword)
          newErrors.confirmPassword = t("auth.passwordsDontMatch");
        else if (confirmPassword && value === confirmPassword) delete newErrors.confirmPassword;
        break;
      }

      case "confirmPassword":
        if (!value) newErrors.confirmPassword = t("auth.repeatPassword");
        else if (value !== password) newErrors.confirmPassword = t("auth.passwordsDontMatch");
        else delete newErrors.confirmPassword;
        break;
    }

    setErrors(newErrors);
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched({ ...touched, [field]: true });
    const map = { firstName, lastName, email, password, confirmPassword };
    validateField(field, map[field]);
  };

  const isFormValid = () =>
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    password !== "" &&
    (passwordStrength?.isStrongEnough ?? false) &&
    confirmPassword !== "" &&
    password === confirmPassword &&
    Object.keys(errors).length === 0;

  const displayName = () => `${firstName.trim()} ${lastName.trim()}`.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    validateField("firstName", firstName);
    validateField("lastName", lastName);
    validateField("email", email);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      await register({
        email: trimmedEmail,
        password,
        name: displayName(),
        role,
      });

      localStorage.setItem(STORAGE_KEYS.pendingVerificationEmail, trimmedEmail);
      toast.success(t("auth.accountCreated"), { description: t("auth.checkYourEmail") });
      void navigate("/verify-email");
    } catch (err) {
      setSubmitError(humanizeApiError(err, t("auth.registrationError")));
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 tablet:py-12">
        <div className="w-full max-w-[540px]">
          <div className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
                {t("auth.register")}
              </h1>
              <p className="text-[15px] text-muted-foreground">{t("auth.registerSubtitle")}</p>
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

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                <Input
                  label={t("auth.firstName")}
                  type="text"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setSubmitError("");
                    if (touched.firstName) validateField("firstName", e.target.value);
                  }}
                  onBlur={() => handleBlur("firstName")}
                  placeholder={t("auth.firstNamePlaceholder")}
                  autoComplete="given-name"
                  disabled={isLoading}
                  error={touched.firstName ? errors.firstName : ""}
                />
                <Input
                  label={t("auth.lastName")}
                  type="text"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setSubmitError("");
                    if (touched.lastName) validateField("lastName", e.target.value);
                  }}
                  onBlur={() => handleBlur("lastName")}
                  placeholder={t("auth.lastNamePlaceholder")}
                  autoComplete="family-name"
                  disabled={isLoading}
                  error={touched.lastName ? errors.lastName : ""}
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setSubmitError("");
                  if (touched.email) validateField("email", e.target.value);
                }}
                onBlur={() => handleBlur("email")}
                placeholder="ivan.petrov@university.edu"
                autoComplete="email"
                disabled={isLoading}
                error={touched.email ? errors.email : ""}
              />

              <div className="space-y-1.5">
                <PasswordInput
                  label={t("auth.password")}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSubmitError("");
                    if (touched.password) validateField("password", e.target.value);
                  }}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  disabled={isLoading}
                  error={touched.password ? errors.password : ""}
                  helperText={!touched.password && !errors.password ? t("auth.passwordHint") : ""}
                />
                {password && (
                  <PasswordStrengthMeter
                    score={passwordStrength?.score ?? 0}
                    suggestions={passwordStrength?.suggestions ?? []}
                  />
                )}
              </div>

              <PasswordInput
                label={t("auth.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setSubmitError("");
                  if (touched.confirmPassword) validateField("confirmPassword", e.target.value);
                }}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                error={touched.confirmPassword ? errors.confirmPassword : ""}
              />

              <fieldset className="space-y-2">
                <legend className="block text-sm text-foreground mb-2">{t("auth.role")}</legend>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      {
                        value: "Student" as const,
                        title: t("auth.roleStudentTitle"),
                        Icon: GraduationCap,
                      },
                      {
                        value: "Teacher" as const,
                        title: t("auth.roleTeacherTitle"),
                        Icon: BookOpen,
                      },
                    ] satisfies ReadonlyArray<{
                      value: RegistrableRole;
                      title: string;
                      Icon: typeof GraduationCap;
                    }>
                  ).map(({ value, title, Icon }) => {
                    const selected = role === value;
                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setRole(value)}
                        disabled={isLoading}
                        aria-pressed={selected}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          selected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border hover:border-primary/40 bg-card text-muted-foreground"
                        }`}
                      >
                        <Icon className="size-4" />
                        <span>{title}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={!isFormValid()}
                >
                  {isLoading ? t("auth.creating") : t("auth.createAccount")}
                </Button>
              </div>
            </form>

            <div className="text-center border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">{t("auth.alreadyHaveAccount")}</p>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                {t("auth.signIn")}
              </Link>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  {t("auth.agreeWith")}{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    {t("auth.termsOfUse")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

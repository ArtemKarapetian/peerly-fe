import { GraduationCap, BookOpen } from "lucide-react";
import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ApiError } from "@/shared/api";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { useAuth } from "@/entities/user";

import { PublicLayout } from "@/widgets/public-layout";

type RegistrableRole = "Student" | "Teacher";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<RegistrableRole>("Student");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  });

  const validateField = (field: keyof FormErrors, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "email":
        if (!value.trim()) newErrors.email = t("auth.enterEmail");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = t("auth.invalidEmail");
        else delete newErrors.email;
        break;

      case "username":
        if (!value.trim()) newErrors.username = t("auth.enterUsername");
        else if (value.length < 3) newErrors.username = t("auth.minChars", { count: 3 });
        else if (!/^[a-zA-Z0-9._-]+$/.test(value)) newErrors.username = t("auth.usernameChars");
        else delete newErrors.username;
        break;

      case "password":
        if (!value) newErrors.password = t("auth.enterPassword");
        else if (value.length < 8) newErrors.password = t("auth.minChars", { count: 8 });
        else delete newErrors.password;

        if (confirmPassword && value !== confirmPassword)
          newErrors.confirmPassword = t("auth.passwordsDontMatch");
        else if (confirmPassword && value === confirmPassword) delete newErrors.confirmPassword;
        break;

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
    const map = { firstName, lastName, email, username, password, confirmPassword };
    validateField(field, map[field]);
  };

  const isFormValid = () =>
    email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    username.trim() !== "" &&
    username.length >= 3 &&
    /^[a-zA-Z0-9._-]+$/.test(username) &&
    password !== "" &&
    password.length >= 8 &&
    confirmPassword !== "" &&
    password === confirmPassword &&
    Object.keys(errors).length === 0;

  const displayName = () => {
    const full = `${firstName.trim()} ${lastName.trim()}`.trim();
    return full || username.trim();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({
      firstName: false,
      lastName: false,
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
    });
    validateField("email", email);
    validateField("username", username);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      await register({
        email: email.trim().toLowerCase(),
        password,
        userName: displayName(),
        role,
      });

      toast.success(t("auth.accountCreated"), { description: t("auth.canLoginNow") });
      const target = role === "Teacher" ? "/teacher/courses" : "/student/courses";
      setTimeout(() => void navigate(target), 500);
    } catch (err) {
      const detail =
        err instanceof ApiError ? (err.body as { detail?: string } | null)?.detail : undefined;
      toast.error(t("auth.registrationError"), { description: detail ?? t("auth.tryAgain") });
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

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                <Input
                  label={t("auth.firstName")}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t("auth.firstNamePlaceholder")}
                  autoComplete="given-name"
                  disabled={isLoading}
                />
                <Input
                  label={t("auth.lastName")}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t("auth.lastNamePlaceholder")}
                  autoComplete="family-name"
                  disabled={isLoading}
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) validateField("email", e.target.value);
                }}
                onBlur={() => handleBlur("email")}
                placeholder="ivan.petrov@university.edu"
                autoComplete="email"
                disabled={isLoading}
                error={touched.email ? errors.email : ""}
              />

              <Input
                label={t("auth.username")}
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (touched.username) validateField("username", e.target.value);
                }}
                onBlur={() => handleBlur("username")}
                placeholder="ivan.petrov"
                autoComplete="username"
                disabled={isLoading}
                error={touched.username ? errors.username : ""}
                helperText={
                  !touched.username && !errors.username ? t("auth.minChars", { count: 3 }) : ""
                }
              />

              <PasswordInput
                label={t("auth.password")}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) validateField("password", e.target.value);
                }}
                onBlur={() => handleBlur("password")}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                error={touched.password ? errors.password : ""}
                helperText={
                  !touched.password && !errors.password ? t("auth.minChars", { count: 8 }) : ""
                }
              />

              <PasswordInput
                label={t("auth.confirmPassword")}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
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

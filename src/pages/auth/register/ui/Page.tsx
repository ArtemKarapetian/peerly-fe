import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";

import { userExists, registerUser } from "@/entities/user/model/userStorage.ts";

import { PublicLayout } from "@/widgets/public-layout";

/**
 * RegisterPage - Account creation screen
 *
 * Features:
 * - First/Last name optional
 * - Username, Email, Password required
 * - Real-time validation
 * - Stores user in localStorage
 * - Success toast + navigate to login
 */

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  // Feature flag for email confirmation (reserved for future use)
  // const _enableEmailConfirmation = isFlagEnabled("enableEmailConfirmation");

  // Validate individual field
  const validateField = (field: keyof FormErrors, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case "email":
        if (!value.trim()) {
          newErrors.email = t("auth.enterEmail");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = t("auth.invalidEmail");
        } else {
          const check = userExists("", value);
          if (check.exists && check.field === "email") {
            newErrors.email = t("auth.emailTaken");
          } else {
            delete newErrors.email;
          }
        }
        break;

      case "username":
        if (!value.trim()) {
          newErrors.username = t("auth.enterUsername");
        } else if (value.length < 3) {
          newErrors.username = t("auth.minChars", { count: 3 });
        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
          newErrors.username = t("auth.usernameChars");
        } else {
          const check = userExists(value, "");
          if (check.exists && check.field === "username") {
            newErrors.username = t("auth.usernameTaken");
          } else {
            delete newErrors.username;
          }
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = t("auth.enterPassword");
        } else if (value.length < 8) {
          newErrors.password = t("auth.minChars", { count: 8 });
        } else {
          delete newErrors.password;
        }

        // Also validate confirm password if it's filled
        if (confirmPassword && value !== confirmPassword) {
          newErrors.confirmPassword = t("auth.passwordsDontMatch");
        } else if (confirmPassword && value === confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = t("auth.repeatPassword");
        } else if (value !== password) {
          newErrors.confirmPassword = t("auth.passwordsDontMatch");
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }

    setErrors(newErrors);
  };

  // Handle blur events
  const handleBlur = (field: keyof FormErrors) => {
    setTouched({ ...touched, [field]: true });

    const valueMap = {
      firstName,
      lastName,
      email,
      username,
      password,
      confirmPassword,
    };

    validateField(field, valueMap[field]);
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      username.trim() !== "" &&
      username.length >= 3 &&
      /^[a-zA-Z0-9._-]+$/.test(username) &&
      password !== "" &&
      password.length >= 8 &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      Object.keys(errors).length === 0
    );
  };

  // Handle form work
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all required fields as touched
    setTouched({
      firstName: false, // Optional
      lastName: false, // Optional
      email: true,
      username: true,
      password: true,
      confirmPassword: true,
    });

    // Validate required fields
    validateField("email", email);
    validateField("username", username);
    validateField("password", password);
    validateField("confirmPassword", confirmPassword);

    // Check if form is valid
    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      // Register user in localStorage
      registerUser({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      // Show success toast
      toast.success(t("auth.accountCreated"), {
        description: t("auth.canLoginNow"),
      });

      // Navigate to login
      setTimeout(() => {
        void navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(t("auth.registrationError"), {
        description: t("auth.tryAgain"),
      });
      setIsLoading(false);
    }
  };

  return (
    <PublicLayout maxWidth="md" showLoginButton={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 tablet:py-12">
        <div className="w-full max-w-[540px]">
          {/* Card */}
          <div className="bg-card border-2 border-border rounded-xl p-6 tablet:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
                {t("auth.register")}
              </h1>
              <p className="text-[15px] text-muted-foreground">{t("auth.registerSubtitle")}</p>
            </div>

            {/* Registration form */}
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              {/* First Name & Last Name (Optional) */}
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

              {/* Email (Required) */}
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

              {/* Username (Required) */}
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

              {/* Password (Required) */}
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

              {/* Confirm Password (Required) */}
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

              {/* Submit button */}
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

            {/* Footer link */}
            <div className="text-center border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">{t("auth.alreadyHaveAccount")}</p>
              <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                {t("auth.signIn")}
              </Link>

              {/* Terms link */}
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

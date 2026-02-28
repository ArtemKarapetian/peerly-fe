import { useState, FormEvent } from "react";
import { PublicLayout } from "@/widgets/public-layout";
import { Button } from "@/shared/ui/button.tsx";
import { Input, PasswordInput } from "@/shared/ui/input.tsx";
import { userExists, registerUser } from "@/entities/user/model/userStorage.ts";
import { toast } from "sonner";

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

export function RegisterPage() {
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
          newErrors.email = "Введите email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Некорректный формат email";
        } else {
          const check = userExists("", value);
          if (check.exists && check.field === "email") {
            newErrors.email = "Email уже зарегистрирован";
          } else {
            delete newErrors.email;
          }
        }
        break;

      case "username":
        if (!value.trim()) {
          newErrors.username = "Введите логин";
        } else if (value.length < 3) {
          newErrors.username = "Минимум 3 символа";
        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
          newErrors.username = "Только буквы, цифры, ., _, -";
        } else {
          const check = userExists(value, "");
          if (check.exists && check.field === "username") {
            newErrors.username = "Логин занят";
          } else {
            delete newErrors.username;
          }
        }
        break;

      case "password":
        if (!value) {
          newErrors.password = "Введите пароль";
        } else if (value.length < 8) {
          newErrors.password = "Минимум 8 символов";
        } else {
          delete newErrors.password;
        }

        // Also validate confirm password if it's filled
        if (confirmPassword && value !== confirmPassword) {
          newErrors.confirmPassword = "Пароли не совпадают";
        } else if (confirmPassword && value === confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;

      case "confirmPassword":
        if (!value) {
          newErrors.confirmPassword = "Повторите пароль";
        } else if (value !== password) {
          newErrors.confirmPassword = "Пароли не совпадают";
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
      toast.success("Аккаунт создан", {
        description: "Теперь вы можете войти с вашими учетными данными",
      });

      // Navigate to login
      setTimeout(() => {
        window.location.hash = "/login";
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Ошибка регистрации", {
        description: "Попробуйте еще раз",
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
                Регистрация
              </h1>
              <p className="text-[15px] text-muted-foreground">
                Создайте аккаунт для доступа к платформе peer review
              </p>
            </div>

            {/* Registration form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name (Optional) */}
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                <Input
                  label="Имя (необязательно)"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Иван"
                  autoComplete="given-name"
                  disabled={isLoading}
                />

                <Input
                  label="Фамилия (необязательно)"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Петров"
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
                label="Логин"
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
                helperText={!touched.username && !errors.username ? "Минимум 3 символа" : ""}
              />

              {/* Password (Required) */}
              <PasswordInput
                label="Пароль"
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
                helperText={!touched.password && !errors.password ? "Минимум 8 символов" : ""}
              />

              {/* Confirm Password (Required) */}
              <PasswordInput
                label="Подтвердите пароль"
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
                  {isLoading ? "Создание..." : "Создать аккаунт"}
                </Button>
              </div>
            </form>

            {/* Footer link */}
            <div className="text-center border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">Уже есть аккаунт?</p>
              <a href="#/login" className="text-sm font-medium text-primary hover:underline">
                Войти
              </a>

              {/* Terms link */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Регистрируясь, вы соглашаетесь с{" "}
                  <a href="#/terms" className="text-primary hover:underline">
                    Условиями использования
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

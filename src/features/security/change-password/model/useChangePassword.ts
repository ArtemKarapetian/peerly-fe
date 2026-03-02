import { useState, useRef, useEffect } from "react";

interface PasswordData {
  current: string;
  new: string;
  confirm: string;
}

interface ShowPasswords {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export function useChangePassword() {
  const [passwordData, setPasswordData] = useState<PasswordData>({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState<ShowPasswords>({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const validatePassword = (): boolean => {
    const errors: string[] = [];

    if (!passwordData.current) {
      errors.push("Введите текущий пароль");
    }
    if (!passwordData.new) {
      errors.push("Введите новый пароль");
    }
    if (passwordData.new && passwordData.new.length < 8) {
      errors.push("Новый пароль должен содержать минимум 8 символов");
    }
    if (passwordData.new && !/[A-Z]/.test(passwordData.new)) {
      errors.push("Пароль должен содержать заглавную букву");
    }
    if (passwordData.new && !/[0-9]/.test(passwordData.new)) {
      errors.push("Пароль должен содержать цифру");
    }
    if (passwordData.new !== passwordData.confirm) {
      errors.push("Пароли не совпадают");
    }

    setPasswordErrors(errors);
    return errors.length === 0;
  };

  const handleChangePassword = () => {
    if (validatePassword()) {
      setPasswordData({ current: "", new: "", confirm: "" });
      setPasswordErrors([]);
      setShowSuccess(true);
      timerRef.current = setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    setPasswordData({ current: "", new: "", confirm: "" });
    setPasswordErrors([]);
  };

  const togglePasswordVisibility = (field: keyof ShowPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return {
    passwordData,
    setPasswordData,
    showPasswords,
    togglePasswordVisibility,
    passwordErrors,
    showSuccess,
    handleChangePassword,
    handleCancel,
  };
}

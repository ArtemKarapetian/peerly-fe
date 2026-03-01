import { useCallback, useEffect, useRef, useState } from "react";

export function useProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Иван",
    lastName: "Петров",
    username: "ivan.petrov",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    setShowSuccess(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowSuccess(false), 3000);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  return {
    isEditing,
    formData,
    setFormData,
    showSuccess,
    handleSave,
    handleCancel,
    startEditing,
  };
}

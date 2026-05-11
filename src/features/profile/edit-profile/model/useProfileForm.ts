import { useCallback, useEffect, useRef, useState } from "react";

import { getSession } from "@/shared/api";

export function useProfileForm() {
  const [isEditing, setIsEditing] = useState(false);
  const session = getSession();
  const [formData, setFormData] = useState({
    name: session?.userName ?? "",
    email: session?.email ?? "",
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

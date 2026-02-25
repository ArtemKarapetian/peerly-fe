export function validateAppealMessage(message: string): string[] {
  const errors: string[] = [];

  if (!message.trim()) {
    errors.push("Сообщение обязательно для заполнения");
  } else if (message.trim().length < 20) {
    errors.push("Сообщение должно содержать минимум 20 символов");
  }

  return errors;
}

export function validateExtensionRequest(desiredDate: string, reason: string): string[] {
  const errors: string[] = [];
  if (!desiredDate) errors.push("Укажите желаемый новый дедлайн");
  if (!reason.trim()) errors.push("Укажите причину запроса");
  return errors;
}

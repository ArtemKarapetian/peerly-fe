import { AlertCircle } from "lucide-react";

interface FormErrorAlertProps {
  message: string;
}

export function FormErrorAlert({ message }: FormErrorAlertProps) {
  return (
    <div
      role="alert"
      className="bg-destructive/10 border-2 border-destructive/50 rounded-lg px-4 py-3 flex items-start gap-3"
    >
      <AlertCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden />
      <p className="text-sm text-destructive font-medium whitespace-pre-line">{message}</p>
    </div>
  );
}

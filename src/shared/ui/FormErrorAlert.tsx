import { AlertCircle } from "lucide-react";

interface FormErrorAlertProps {
  message: string;
}

export function FormErrorAlert({ message }: FormErrorAlertProps) {
  return (
    <div
      role="alert"
      className="bg-error/10 border-2 border-error/50 rounded-lg px-4 py-3 flex items-start gap-3"
    >
      <AlertCircle className="size-5 text-error flex-shrink-0 mt-0.5" aria-hidden />
      <p className="text-sm text-error font-medium whitespace-pre-line">{message}</p>
    </div>
  );
}

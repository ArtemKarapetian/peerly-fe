import { AlertCircle } from "lucide-react";

export function UploadErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 bg-error-light border border-error rounded-sm p-3">
      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
      <p className="text-13 text-destructive">{message}</p>
    </div>
  );
}

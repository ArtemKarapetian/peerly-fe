import { AlertTriangle } from "lucide-react";

export function DeleteWarningCard() {
  return (
    <div className="bg-destructive/5 dark:bg-destructive/10 border-2 border-destructive/20 rounded-[20px] p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-destructive mb-2">Удаление аккаунта</h1>
          <p className="text-sm text-muted-foreground">
            Это действие необратимо и приведёт к безвозвратной потере всех ваших данных, включая
            оценки, отзывы и доступ к курсам.
          </p>
        </div>
      </div>
    </div>
  );
}

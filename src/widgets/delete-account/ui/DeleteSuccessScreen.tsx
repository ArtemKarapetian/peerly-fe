import { CheckCircle } from "lucide-react";

interface DeleteSuccessScreenProps {
  onGoToLanding: () => void;
}

export function DeleteSuccessScreen({ onGoToLanding }: DeleteSuccessScreenProps) {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Аккаунт удалён</h1>
          <p className="text-muted-foreground">
            Ваш аккаунт и все связанные данные успешно удалены из системы Peerly.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-left">
          <p className="text-sm text-muted-foreground">
            Мы сожалеем, что вы покидаете нас. Если вы передумаете, вы всегда можете создать новый
            аккаунт.
          </p>
        </div>

        <button
          onClick={onGoToLanding}
          className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          На главную страницу
        </button>
      </div>
    </div>
  );
}

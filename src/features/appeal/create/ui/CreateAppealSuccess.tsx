import { CheckCircle, ArrowRight } from "lucide-react";

type Props = {
  onGoToAppeals: () => void;
  onGoToCourse: () => void;
};

export function CreateAppealSuccess({ onGoToAppeals, onGoToCourse }: Props) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-[500px] text-center">
        <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-accent-foreground" />
        </div>
        <h1 className="text-[28px] font-medium text-foreground mb-3">Апелляция отправлена</h1>
        <p className="text-[16px] text-muted-foreground mb-8">
          Ваш запрос на пересмотр оценки отправлен преподавателю. Вы получите уведомление, когда
          будет получен ответ.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onGoToAppeals}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium inline-flex items-center gap-2"
          >
            Мои апелляции
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onGoToCourse}
            className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium"
          >
            Вернуться к курсу
          </button>
        </div>
      </div>
    </div>
  );
}

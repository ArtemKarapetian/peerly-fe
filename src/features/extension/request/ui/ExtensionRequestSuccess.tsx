import { CheckCircle, AlertCircle } from "lucide-react";

type Props = {
  backToTaskHref: string;
  backToCoursesHref: string;
};

export function ExtensionRequestSuccess({ backToTaskHref, backToCoursesHref }: Props) {
  return (
    <div className="max-w-[600px] mx-auto">
      <div className="mt-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Запрос отправлен</h1>
          <p className="text-muted-foreground">
            Ваш запрос на продление дедлайна получен преподавателем. Вы получите уведомление, когда
            он будет рассмотрен.
          </p>
        </div>

        <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-[12px] p-4 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground/80">
              <strong>Что дальше?</strong>
              <p className="mt-1 text-muted-foreground">
                Преподаватель рассмотрит ваш запрос в ближайшее время. Статус запроса вы можете
                отслеживать на странице задания.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <a
            href={backToTaskHref}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Вернуться к заданию
          </a>
          <a
            href={backToCoursesHref}
            className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            К курсам
          </a>
        </div>
      </div>
    </div>
  );
}

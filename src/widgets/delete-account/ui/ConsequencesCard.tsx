const CONSEQUENCES = [
  {
    title: "Потеря доступа:",
    text: "вы больше не сможете войти в систему",
  },
  {
    title: "Удаление работ:",
    text: "все ваши сабмишены и файлы будут удалены",
  },
  {
    title: "Потеря отзывов:",
    text: "все написанные вами рецензии будут удалены",
  },
  {
    title: "История оценок:",
    text: "весь ваш прогресс и оценки будут потеряны",
  },
  {
    title: "Личные данные:",
    text: "вся информация профиля и настройки удаляются",
  },
];

export function ConsequencesCard() {
  return (
    <div className="bg-card border border-border rounded-[20px] p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Что произойдёт при удалении аккаунта:
      </h2>

      <ul className="space-y-3">
        {CONSEQUENCES.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">
              <strong className="text-foreground">{item.title}</strong> {item.text}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-[12px]">
        <p className="text-sm text-foreground/80">
          <strong>Важно:</strong> Если вы уже провели peer review для других студентов, удаление
          может повлиять на их оценки. Рекомендуем сначала связаться с преподавателем курса.
        </p>
      </div>
    </div>
  );
}

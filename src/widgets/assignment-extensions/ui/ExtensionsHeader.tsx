import { Plus } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
  onAdd: () => void;
};

export function ExtensionsHeader({
  title = "Продления дедлайнов",
  description = 'Управление исключениями по дедлайнам для задания "Peer Review Essay"',
  onAdd,
}: Props) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        <Plus className="w-5 h-5" />
        Добавить продление
      </button>
    </div>
  );
}

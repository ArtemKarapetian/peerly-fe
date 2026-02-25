import { ExtensionStatus, getExtensionStatusLabel } from "@/entities/extension";

type Props = {
  value: ExtensionStatus | "all";
  onChange: (v: ExtensionStatus | "all") => void;
};

export function ExtensionsFilters({ value, onChange }: Props) {
  const options = ["all", "requested", "approved", "manual", "denied"] as const;

  return (
    <div className="bg-card border border-border rounded-[12px] p-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Фильтр:</span>
        <div className="flex gap-2">
          {options.map((status) => (
            <button
              key={status}
              onClick={() => onChange(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                value === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {status === "all" ? "Все" : getExtensionStatusLabel(status as ExtensionStatus)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

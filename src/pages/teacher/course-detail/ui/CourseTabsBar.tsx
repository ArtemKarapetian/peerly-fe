interface Tab<K extends string> {
  key: K;
  label: string;
}

interface CourseTabsBarProps<K extends string> {
  tabs: Tab<K>[];
  activeTab: K;
  onChange: (key: K) => void;
}

export function CourseTabsBar<K extends string>({
  tabs,
  activeTab,
  onChange,
}: CourseTabsBarProps<K>) {
  return (
    <div className="flex gap-0 border-b border-border">
      {tabs.map((tab) => {
        const active = tab.key === activeTab;
        const stateClass = active
          ? "text-brand-primary border-brand-primary"
          : "text-muted-foreground hover:text-foreground border-transparent";
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`-mb-px px-6 py-4 text-base font-medium border-b-2 transition-colors ${stateClass}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

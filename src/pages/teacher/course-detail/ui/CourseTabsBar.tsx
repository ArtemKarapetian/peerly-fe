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
    <div className="border-b-2 border-border">
      <div className="flex gap-0">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          const stateClass = active
            ? "text-brand-primary"
            : "text-muted-foreground hover:text-foreground";
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`relative px-6 py-4 text-base font-medium transition-colors ${stateClass}`}
            >
              {tab.label}
              {active && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

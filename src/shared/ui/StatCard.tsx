interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
  /** Reduced padding and type size — for dashboards with many cards */
  compact?: boolean;
}

export function StatCard({ label, value, icon, accent, compact = false }: StatCardProps) {
  return (
    <div
      className={`bg-white border border-[--surface-border] rounded-[var(--radius-lg)] px-4 flex items-center gap-3 shadow-[var(--shadow-sm)] ${compact ? "py-2.5" : "py-3"}`}
    >
      <div
        className={`rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 ${compact ? "w-7 h-7" : "w-8 h-8"}`}
        style={{ backgroundColor: accent + "1a" }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p
          className={`font-semibold tracking-[-0.5px] text-[--text-primary] leading-none mb-0.5 ${compact ? "text-[17px]" : "text-[19px]"}`}
        >
          {value}
        </p>
        <p className="text-[11px] text-[--text-secondary] truncate">{label}</p>
      </div>
    </div>
  );
}

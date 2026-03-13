interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  accent: string;
}

export function StatCard({ label, value, icon, accent }: StatCardProps) {
  return (
    <div className="bg-white border border-[--surface-border] rounded-[var(--radius-lg)] px-4 py-3 flex items-center gap-3 shadow-[var(--shadow-sm)]">
      <div
        className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
        style={{ backgroundColor: accent + "1a" }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[19px] font-semibold tracking-[-0.5px] text-[--text-primary] leading-none mb-0.5">
          {value}
        </p>
        <p className="text-[11px] text-[--text-secondary] truncate">{label}</p>
      </div>
    </div>
  );
}

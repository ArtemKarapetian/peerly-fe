import { useTranslation } from "react-i18next";

import { type PasswordStrength } from "@/shared/lib/password";

const STRENGTH_COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-warning",
  "bg-success",
  "bg-success",
] as const;

const LABEL_KEYS = [
  "auth.strength.veryWeak",
  "auth.strength.weak",
  "auth.strength.fair",
  "auth.strength.good",
  "auth.strength.strong",
];

export function PasswordStrengthMeter({ strength }: { strength: PasswordStrength }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${
              strength.score > i ? STRENGTH_COLORS[strength.score] : "bg-muted"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{t(LABEL_KEYS[strength.score])}</p>
      {strength.suggestions.length > 0 && (
        <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
          {strength.suggestions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

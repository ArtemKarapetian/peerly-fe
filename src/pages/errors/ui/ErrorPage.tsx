import { type LucideIcon } from "lucide-react";
import { type ReactNode } from "react";

interface ErrorPageAction {
  label: ReactNode;
  onClick: () => void;
  variant?: "primary" | "outline";
}

interface ErrorPageProps {
  code: string;
  Icon: LucideIcon;
  tone?: "error" | "muted";
  title: ReactNode;
  description: ReactNode;
  actions: [ErrorPageAction, ErrorPageAction];
}

const ICON_BG: Record<NonNullable<ErrorPageProps["tone"]>, string> = {
  error: "bg-error/10 text-error",
  muted: "bg-muted text-muted-foreground",
};

const BUTTON_VARIANT: Record<NonNullable<ErrorPageAction["variant"]>, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium",
  outline: "border border-border hover:bg-accent transition-colors font-medium",
};

export function ErrorPage({
  code,
  Icon,
  tone = "error",
  title,
  description,
  actions,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${ICON_BG[tone]}`}
          >
            <Icon className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-semibold text-foreground/40">{code}</h1>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        </div>

        <p className="text-muted-foreground">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`px-6 py-2.5 rounded-lg ${BUTTON_VARIANT[action.variant ?? (i === 0 ? "primary" : "outline")]}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

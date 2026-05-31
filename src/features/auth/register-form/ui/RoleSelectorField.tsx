import { BookOpen, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { type RegisterFormValues, type RegistrableRole } from "../model/schema";

interface RoleOption {
  value: RegistrableRole;
  titleKey: string;
  Icon: LucideIcon;
}

const ROLE_OPTIONS: ReadonlyArray<RoleOption> = [
  { value: "Student", titleKey: "auth.roleStudentTitle", Icon: GraduationCap },
  { value: "Teacher", titleKey: "auth.roleTeacherTitle", Icon: BookOpen },
];

interface RoleSelectorFieldProps {
  control: Control<RegisterFormValues>;
  disabled: boolean;
}

export function RoleSelectorField({ control, disabled }: RoleSelectorFieldProps) {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name="role"
      render={({ field }) => (
        <fieldset className="space-y-2">
          <legend className="block text-sm text-foreground mb-2">{t("auth.role")}</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((option) => (
              <RoleOptionButton
                key={option.value}
                option={option}
                selected={field.value === option.value}
                disabled={disabled}
                onSelect={() => field.onChange(option.value)}
              />
            ))}
          </div>
        </fieldset>
      )}
    />
  );
}

function RoleOptionButton({
  option,
  selected,
  disabled,
  onSelect,
}: {
  option: RoleOption;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const { Icon, titleKey } = option;
  const variant = selected
    ? "border-primary bg-primary/5 text-foreground"
    : "border-border hover:border-primary/40 bg-card text-muted-foreground";
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${variant}`}
    >
      <Icon className="size-4" />
      <span>{t(titleKey)}</span>
    </button>
  );
}

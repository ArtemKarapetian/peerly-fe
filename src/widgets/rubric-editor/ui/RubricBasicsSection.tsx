import { useTranslation } from "react-i18next";

import { Label, SectionHeader, TextField } from "@/shared/ui";

interface RubricBasicsSectionProps {
  name: string;
  onUpdate: (updates: { name?: string }) => void;
}

export function RubricBasicsSection({ name, onUpdate }: RubricBasicsSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="mb-8 space-y-4">
      <SectionHeader as="h3" className="tracking-[-0.5px] mb-0">
        {t("widget.rubricEditor.basicInfo")}
      </SectionHeader>

      <div>
        <Label className="text-13">{t("widget.rubricEditor.rubricName")}</Label>
        <TextField value={name} onChange={(e) => onUpdate({ name: e.target.value })} />
      </div>
    </section>
  );
}

import { FileText, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Material {
  name: string;
  size: string;
  type: string;
}

// Materials data is populated with translation keys in the component below

export function TaskMaterials() {
  const { t } = useTranslation();

  const materials: Material[] = [
    {
      name: t("widget.taskMaterials.mockFile1Name"),
      size: t("widget.taskMaterials.mockFile1Size"),
      type: "PDF",
    },
    {
      name: t("widget.taskMaterials.mockFile2Name"),
      size: t("widget.taskMaterials.mockFile2Size"),
      type: "Figma",
    },
    {
      name: t("widget.taskMaterials.mockFile3Name"),
      size: t("widget.taskMaterials.mockFile3Size"),
      type: "DOCX",
    },
  ];

  return (
    <div className="bg-muted rounded-[16px] p-4 desktop:p-6 mb-4 desktop:mb-6">
      <h2 className="text-[20px] desktop:text-[24px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.96px] text-foreground mb-4">
        {t("widget.taskMaterials.title")}
      </h2>

      <div className="space-y-2">
        {materials.map((material, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-[12px] hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-brand-primary-light p-2 rounded-[8px]">
                <FileText className="size-5 text-foreground" />
              </div>
              <div>
                <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground">
                  {material.name}
                </p>
                <p className="text-[12px] desktop:text-[14px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.42px] text-muted-foreground">
                  {material.size} • {material.type}
                </p>
              </div>
            </div>
            <Download className="size-5 text-muted-foreground hover:text-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

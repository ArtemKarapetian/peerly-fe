import { Shield, Code, FileCheck, UserX, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AssignmentFormData } from "../model/types";

/**
 * StepPlugins - Шаг 5: Плагины и автоматические проверки
 *
 * - Проверка на плагиат
 * - Линтинг кода
 * - Проверка форматов файлов
 * - Анонимизация данных
 */

interface StepPluginsProps {
  data: AssignmentFormData;
  onUpdate: (updates: Partial<AssignmentFormData>) => void;
}

export function StepPlugins({ data, onUpdate }: StepPluginsProps) {
  const { t } = useTranslation();

  const toggleFormatRule = (rule: string) => {
    const rules = data.formatRules || [];
    if (rules.includes(rule)) {
      onUpdate({ formatRules: rules.filter((r) => r !== rule) });
    } else {
      onUpdate({ formatRules: [...rules, rule] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[24px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("feature.assignmentCreate.plugins.title")}
        </h2>
        <p className="text-[15px] text-muted-foreground">
          {t("feature.assignmentCreate.plugins.subtitle")}
        </p>
      </div>

      {/* Plagiarism Check */}
      <div className="bg-card border-2 border-border rounded-[16px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-muted rounded-[8px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.plugins.plagiarismTitle")}
              </h3>
              <p className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.plugins.plagiarismDesc")}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.enablePlagiarismCheck}
              onChange={(e) => onUpdate({ enablePlagiarismCheck: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
          </label>
        </div>

        {data.enablePlagiarismCheck && (
          <div className="ml-13 pl-5 border-l-2 border-border">
            <label className="block text-[13px] font-medium text-foreground mb-2">
              {t("feature.assignmentCreate.plugins.plagiarismThreshold")}
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={data.plagiarismThreshold}
                onChange={(e) => onUpdate({ plagiarismThreshold: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-[16px] font-medium text-foreground w-12 text-right">
                {data.plagiarismThreshold}%
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground mt-2">
              {t("feature.assignmentCreate.plugins.plagiarismThresholdHint", {
                threshold: data.plagiarismThreshold,
              })}
            </p>
          </div>
        )}
      </div>

      {/* Linter */}
      <div className="bg-card border-2 border-border rounded-[16px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-muted rounded-[8px] flex items-center justify-center">
              <Code className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.plugins.linterTitle")}
              </h3>
              <p className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.plugins.linterDesc")}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.enableLinter}
              onChange={(e) => onUpdate({ enableLinter: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
          </label>
        </div>

        {data.enableLinter && (
          <div className="ml-13 pl-5 border-l-2 border-border">
            <label className="block text-[13px] font-medium text-foreground mb-2">
              {t("feature.assignmentCreate.plugins.linterConfigLabel")}
            </label>
            <select
              value={data.linterConfig}
              onChange={(e) => onUpdate({ linterConfig: e.target.value })}
              className="w-full px-3 py-2 border-2 border-border rounded-[8px] text-[14px] focus:outline-none focus:border-brand-primary bg-card"
            >
              <option value="">
                {t("feature.assignmentCreate.plugins.linterPresetPlaceholder")}
              </option>
              <option value="eslint-recommended">ESLint Recommended</option>
              <option value="airbnb">Airbnb Style Guide</option>
              <option value="google">Google Style Guide</option>
              <option value="standard">JavaScript Standard</option>
              <option value="custom">{t("feature.assignmentCreate.plugins.linterCustom")}</option>
            </select>
            <p className="text-[12px] text-muted-foreground mt-2">
              {t("feature.assignmentCreate.plugins.linterHint")}
            </p>
          </div>
        )}
      </div>

      {/* Format Check */}
      <div className="bg-card border-2 border-border rounded-[16px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-muted rounded-[8px] flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.plugins.formatCheckTitle")}
              </h3>
              <p className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.plugins.formatCheckDesc")}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.enableFormatCheck}
              onChange={(e) => onUpdate({ enableFormatCheck: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
          </label>
        </div>

        {data.enableFormatCheck && (
          <div className="ml-13 pl-5 border-l-2 border-border">
            <label className="block text-[13px] font-medium text-foreground mb-3">
              {t("feature.assignmentCreate.plugins.allowedFormats")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                "pdf",
                "docx",
                "txt",
                "zip",
                "rar",
                "jpg",
                "png",
                "py",
                "js",
                "html",
                "css",
                "md",
              ].map((format) => (
                <label key={format} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.formatRules?.includes(format) || false}
                    onChange={() => toggleFormatRule(format)}
                    className="w-4 h-4 rounded border-2 border-border text-brand-primary focus:ring-ring"
                  />
                  <span className="text-[13px] text-foreground uppercase">.{format}</span>
                </label>
              ))}
            </div>
            <p className="text-[12px] text-muted-foreground mt-3">
              {t("feature.assignmentCreate.plugins.formatCheckHint")}
            </p>
          </div>
        )}
      </div>

      {/* Anonymization */}
      <div className="bg-card border-2 border-border rounded-[16px] p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-muted rounded-[8px] flex items-center justify-center">
              <UserX className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-foreground mb-1">
                {t("feature.assignmentCreate.plugins.anonymizationTitle")}
              </h3>
              <p className="text-[13px] text-muted-foreground">
                {t("feature.assignmentCreate.plugins.anonymizationDesc")}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.enableAnonymization}
              onChange={(e) => onUpdate({ enableAnonymization: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
          </label>
        </div>

        {data.enableAnonymization && (
          <div className="ml-13 pl-5 border-l-2 border-border">
            <p className="text-[13px] text-muted-foreground">
              {t("feature.assignmentCreate.plugins.anonymizationDetails")}
            </p>
            <div className="mt-3 bg-muted rounded-[8px] p-3">
              <p className="text-[12px] text-foreground mb-1 font-medium">
                {t("feature.assignmentCreate.plugins.anonymizationReplaced")}
              </p>
              <ul className="text-[12px] text-muted-foreground space-y-1 ml-4 list-disc">
                <li>{t("feature.assignmentCreate.plugins.anonymizationName")}</li>
                <li>{t("feature.assignmentCreate.plugins.anonymizationEmail")}</li>
                <li>{t("feature.assignmentCreate.plugins.anonymizationStudentId")}</li>
                <li>{t("feature.assignmentCreate.plugins.anonymizationOther")}</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-info-light border border-info rounded-[12px] p-4">
        <div className="flex items-start gap-2">
          <Settings className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <div className="text-[13px] text-foreground">
            <p className="font-medium mb-1">
              {t("feature.assignmentCreate.plugins.allOptionalTitle")}
            </p>
            <p className="text-muted-foreground">
              {t("feature.assignmentCreate.plugins.allOptionalText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

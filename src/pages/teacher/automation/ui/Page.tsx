import { Plus, Pencil, Trash2, Zap, CheckCircle2, XCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import {
  type AutomationRule,
  getAllRules,
  toggleRuleEnabled,
  deleteRule,
  getTriggerLabel,
  getConditionLabel,
  getActionLabel,
} from "@/entities/automation-rule";

import { CreateRuleModal } from "@/features/automation-rule/create";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherAutomationPage - Manage automation rules
 */
export default function TeacherAutomationPage() {
  const { t } = useTranslation();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  const loadRules = useCallback(() => {
    setRules(getAllRules());
  }, []);

  const handleToggleEnabled = (id: string) => {
    const updated = toggleRuleEnabled(id);
    if (updated) {
      loadRules();
      toast.success(
        updated.enabled
          ? t("teacher.automation.ruleEnabled")
          : t("teacher.automation.ruleDisabled"),
      );
    }
  };

  const handleDelete = (id: string) => {
    if (confirm(t("teacher.automation.deleteConfirm"))) {
      deleteRule(id);
      loadRules();
      toast.success(t("teacher.automation.ruleDeleted"));
    }
  };

  const handleEdit = (rule: AutomationRule) => {
    setEditingRule(rule);
    setShowCreateModal(true);
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    setEditingRule(null);
    loadRules();
  };

  const getConditionsSummary = (rule: AutomationRule) => {
    if (rule.conditions.length === 0) return t("teacher.automation.noConditions");
    return rule.conditions.map((c) => getConditionLabel(c)).join(", ");
  };

  const getActionsSummary = (rule: AutomationRule) => {
    if (rule.actions.length === 0) return t("teacher.automation.noActions");
    return rule.actions.map((a) => getActionLabel(a)).join(", ");
  };

  return (
    <AppShell title={t("teacher.automation.title")}>
      <div className="max-w-[1400px]">
        <Breadcrumbs items={[{ label: t("teacher.automation.breadcrumb") }]} />

        <div className="mt-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
                {t("teacher.automation.title")}
              </h1>
              <p className="text-muted-foreground">{t("teacher.automation.subtitle")}</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Plus className="w-5 h-5" />
              {t("teacher.automation.createRule")}
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-info-light border border-info rounded-[12px] p-4 mb-6">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-foreground mb-1">
                  {t("teacher.automation.howRulesWork")}
                </h3>
                <p className="text-sm text-info">{t("teacher.automation.howRulesWorkDesc")}</p>
              </div>
            </div>
          </div>

          {/* Rules Table */}
          <div className="bg-card border border-border rounded-[20px] overflow-hidden">
            {rules.length === 0 ? (
              <div className="p-12 text-center">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">{t("teacher.automation.noRules")}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("teacher.automation.createFirstDesc")}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  <Plus className="w-4 h-4" />
                  {t("teacher.automation.createRule")}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-[50px]">
                        {t("teacher.automation.statusCol")}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t("teacher.automation.nameCol")}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t("teacher.automation.triggerCol")}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t("teacher.automation.conditionsCol")}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        {t("teacher.automation.actionsCol")}
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-[60px]">
                        {t("teacher.automation.priorityCol")}
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground w-[120px]">
                        {t("teacher.automation.actionsColHeader")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((rule) => (
                      <tr
                        key={rule.id}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleEnabled(rule.id)}
                            className={`p-1.5 rounded transition-colors ${
                              rule.enabled
                                ? "text-success hover:bg-success-light"
                                : "text-muted-foreground hover:bg-muted"
                            }`}
                            title={
                              rule.enabled
                                ? t("teacher.automation.enabledTitle")
                                : t("teacher.automation.disabledTitle")
                            }
                          >
                            {rule.enabled ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-foreground">{rule.name}</div>
                            {rule.description && (
                              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {rule.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-info-light text-info border border-info">
                            {getTriggerLabel(rule.trigger)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-muted-foreground max-w-[250px] truncate">
                            {getConditionsSummary(rule)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-muted-foreground max-w-[250px] truncate">
                            {getActionsSummary(rule)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-foreground">
                            {rule.priority}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(rule)}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                              title={t("teacher.automation.editTitle")}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(rule.id)}
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                              title={t("teacher.automation.deleteTitle")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {rules.length > 0 && (
            <div className="mt-6 grid grid-cols-2 tablet:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-[12px] p-4">
                <div className="text-2xl font-semibold text-foreground mb-1">{rules.length}</div>
                <div className="text-sm text-muted-foreground">
                  {t("teacher.automation.totalRules")}
                </div>
              </div>
              <div className="bg-card border border-border rounded-[12px] p-4">
                <div className="text-2xl font-semibold text-success mb-1">
                  {rules.filter((r) => r.enabled).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("teacher.automation.activeRules")}
                </div>
              </div>
              <div className="bg-card border border-border rounded-[12px] p-4">
                <div className="text-2xl font-semibold text-muted-foreground mb-1">
                  {rules.filter((r) => !r.enabled).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("teacher.automation.disabledRules")}
                </div>
              </div>
              <div className="bg-card border border-border rounded-[12px] p-4">
                <div className="text-2xl font-semibold text-info mb-1">
                  {rules.reduce((sum, r) => sum + r.actions.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("teacher.automation.totalActions")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && <CreateRuleModal existingRule={editingRule} onClose={handleModalClose} />}
    </AppShell>
  );
}

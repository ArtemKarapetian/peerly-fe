import { Plus, Pencil, Trash2, Zap, CheckCircle2, XCircle } from "lucide-react";
import { useState, useCallback } from "react";
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
      toast.success(updated.enabled ? "Правило включено" : "Правило выключено");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Вы уверены, что хотите удалить это правило?")) {
      deleteRule(id);
      loadRules();
      toast.success("Правило удалено");
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
    if (rule.conditions.length === 0) return "Нет условий";
    return rule.conditions.map((c) => getConditionLabel(c)).join(", ");
  };

  const getActionsSummary = (rule: AutomationRule) => {
    if (rule.actions.length === 0) return "Нет действий";
    return rule.actions.map((a) => getActionLabel(a)).join(", ");
  };

  return (
    <AppShell title="Автоматизация">
      <div className="max-w-[1400px]">
        <Breadcrumbs items={[{ label: "Автоматизация" }]} />

        <div className="mt-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
                Правила автоматизации
              </h1>
              <p className="text-muted-foreground">
                Создавайте IF/THEN правила для автоматической обработки событий
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              <Plus className="w-5 h-5" />
              Создать правило
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[12px] p-4 mb-6">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Как работают правила автоматизации
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Правила автоматически в��полняются при наступлении событий (триггеров). Вы можете
                  задать условия для более точного контроля и определить действия, которые будут
                  применены.
                </p>
              </div>
            </div>
          </div>

          {/* Rules Table */}
          <div className="bg-card border border-border rounded-[20px] overflow-hidden">
            {rules.length === 0 ? (
              <div className="p-12 text-center">
                <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">Нет правил автоматизации</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Создайте первое правило для автоматизации рутинных задач
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Создать правило
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-[50px]">
                        Статус
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Название
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Триггер
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Условия
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Действия
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-[60px]">
                        Приоритет
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground w-[120px]">
                        Действия
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
                                ? "text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
                                : "text-muted-foreground hover:bg-muted"
                            }`}
                            title={rule.enabled ? "Включено" : "Выключено"}
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
                          <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
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
                              title="Редактировать"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(rule.id)}
                              className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                              title="Удалить"
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
                <div className="text-sm text-muted-foreground">Всего правил</div>
              </div>
              <div className="bg-card border border-border rounded-[12px] p-4">
                <div className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-1">
                  {rules.filter((r) => r.enabled).length}
                </div>
                <div className="text-sm text-muted-foreground">Активных</div>
              </div>
              <div className="bg-card border border-border rounded-[12px] p-4">
                <div className="text-2xl font-semibold text-muted-foreground mb-1">
                  {rules.filter((r) => !r.enabled).length}
                </div>
                <div className="text-sm text-muted-foreground">Отключено</div>
              </div>
              <div className="bg-card border border-border rounded-[12px] p-4">
                <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                  {rules.reduce((sum, r) => sum + r.actions.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Действий</div>
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

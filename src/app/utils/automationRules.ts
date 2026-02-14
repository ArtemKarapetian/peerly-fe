/**
 * Automation Rules Utilities
 *
 * Manages IF/THEN automation rules for teachers
 */

export type TriggerType =
  | "AssignmentCreated"
  | "SubmissionUploaded"
  | "SubmissionUpdated"
  | "BeforeReviewAssign"
  | "ReviewSubmitted"
  | "BeforeGradePublish"
  | "Scheduled";

export type ConditionType =
  | "plagiarism_score"
  | "missing_reviews"
  | "submission_delay_days"
  | "review_comment_length"
  | "grade_deviation"
  | "peer_scores_variance";

export type ConditionOperator = ">" | "<" | ">=" | "<=" | "==" | "!=";

export interface Condition {
  type: ConditionType;
  operator: ConditionOperator;
  value: number;
}

export type ActionType =
  | "flag_submission"
  | "flag_review"
  | "require_moderation"
  | "reassign_reviewer"
  | "apply_penalty"
  | "send_notification";

export interface Action {
  type: ActionType;
  parameters?: {
    message?: string;
    penaltyPercent?: number;
  };
}

export interface RuleScope {
  courseIds?: string[];
  assignmentIds?: string[];
  applyToAll?: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  priority: number;
  trigger: TriggerType;
  conditions: Condition[];
  actions: Action[];
  scope: RuleScope;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "peerly_automation_rules";

// Demo rules
const DEMO_RULES: AutomationRule[] = [
  {
    id: "rule1",
    name: "Флаг коротких рецензий",
    description: "Отмечает рецензии с недостаточным количеством текста",
    enabled: true,
    priority: 1,
    trigger: "ReviewSubmitted",
    conditions: [{ type: "review_comment_length", operator: "<", value: 50 }],
    actions: [
      { type: "flag_review" },
      { type: "send_notification", parameters: { message: "Рецензия требует проверки" } },
    ],
    scope: { applyToAll: true },
    createdAt: "2025-01-20T10:00:00",
    updatedAt: "2025-01-20T10:00:00",
  },
  {
    id: "rule2",
    name: "Проверка на плагиат",
    description: "Требует модерацию при высоком балле плагиата",
    enabled: true,
    priority: 2,
    trigger: "SubmissionUploaded",
    conditions: [{ type: "plagiarism_score", operator: ">", value: 70 }],
    actions: [{ type: "flag_submission" }, { type: "require_moderation" }],
    scope: { applyToAll: true },
    createdAt: "2025-01-18T09:00:00",
    updatedAt: "2025-01-22T14:30:00",
  },
  {
    id: "rule3",
    name: "Штраф за опоздание",
    description: "Применяет штраф за сдачу после дедлайна",
    enabled: false,
    priority: 3,
    trigger: "SubmissionUploaded",
    conditions: [{ type: "submission_delay_days", operator: ">", value: 0 }],
    actions: [{ type: "apply_penalty", parameters: { penaltyPercent: 10 } }],
    scope: { applyToAll: true },
    createdAt: "2025-01-15T11:00:00",
    updatedAt: "2025-01-15T11:00:00",
  },
];

function getRules(): AutomationRule[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_RULES));
      return DEMO_RULES;
    }
    return JSON.parse(stored);
  } catch {
    return DEMO_RULES;
  }
}

function saveRules(rules: AutomationRule[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
}

export function getAllRules(): AutomationRule[] {
  return getRules().sort((a, b) => a.priority - b.priority);
}

export function getRule(id: string): AutomationRule | undefined {
  return getRules().find((rule) => rule.id === id);
}

export function createRule(
  rule: Omit<AutomationRule, "id" | "createdAt" | "updatedAt">,
): AutomationRule {
  const rules = getRules();
  const newRule: AutomationRule = {
    ...rule,
    id: `rule${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  rules.push(newRule);
  saveRules(rules);
  return newRule;
}

export function updateRule(id: string, updates: Partial<AutomationRule>): AutomationRule | null {
  const rules = getRules();
  const index = rules.findIndex((rule) => rule.id === id);

  if (index === -1) return null;

  rules[index] = {
    ...rules[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveRules(rules);
  return rules[index];
}

export function deleteRule(id: string): boolean {
  const rules = getRules();
  const filtered = rules.filter((rule) => rule.id !== id);

  if (filtered.length === rules.length) return false;

  saveRules(filtered);
  return true;
}

export function toggleRuleEnabled(id: string): AutomationRule | null {
  const rule = getRule(id);
  if (!rule) return null;

  return updateRule(id, { enabled: !rule.enabled });
}

// Helper functions for labels
export function getTriggerLabel(trigger: TriggerType): string {
  const labels: Record<TriggerType, string> = {
    AssignmentCreated: "Задание создано",
    SubmissionUploaded: "Работа загружена",
    SubmissionUpdated: "Работа обновлена",
    BeforeReviewAssign: "Перед назначением рецензий",
    ReviewSubmitted: "Рецензия отправлена",
    BeforeGradePublish: "Перед публикацией оценок",
    Scheduled: "По расписанию",
  };
  return labels[trigger];
}

export function getConditionLabel(condition: Condition): string {
  const typeLabels: Record<ConditionType, string> = {
    plagiarism_score: "Балл плагиата",
    missing_reviews: "Пропущенных рецензий",
    submission_delay_days: "Дней опоздания",
    review_comment_length: "Длина комментария",
    grade_deviation: "Отклонение оценки",
    peer_scores_variance: "Разброс оценок",
  };

  const operatorLabels: Record<ConditionOperator, string> = {
    ">": ">",
    "<": "<",
    ">=": "≥",
    "<=": "≤",
    "==": "=",
    "!=": "≠",
  };

  return `${typeLabels[condition.type]} ${operatorLabels[condition.operator]} ${condition.value}`;
}

export function getActionLabel(action: Action): string {
  const labels: Record<ActionType, string> = {
    flag_submission: "Отметить работу",
    flag_review: "Отметить рецензию",
    require_moderation: "Требовать модерацию",
    reassign_reviewer: "Переназначить рецензента",
    apply_penalty: `Штраф ${action.parameters?.penaltyPercent || 0}%`,
    send_notification: "Отправить уведомление",
  };
  return labels[action.type];
}

export function getRuleHumanReadable(rule: AutomationRule): string {
  const trigger = getTriggerLabel(rule.trigger);
  const conditions = rule.conditions.map((c) => getConditionLabel(c)).join(" И ");
  const actions = rule.actions.map((a) => getActionLabel(a)).join(", ");

  return `КОГДА ${trigger}${conditions ? ` И ${conditions}` : ""} ТО ${actions}`;
}

// Simulate testing a rule
export function testRule(): { matches: number; samples: string[] } {
  // Demo simulation
  const matches = Math.floor(Math.random() * 10) + 1;
  const samples = [
    'Работа студента "Анна Смирнова"',
    'Рецензия от "Иван Петров"',
    "Submission #457",
  ].slice(0, Math.min(matches, 3));

  return { matches, samples };
}

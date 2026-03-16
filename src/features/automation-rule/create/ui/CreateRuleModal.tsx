import { X, ChevronRight, ChevronLeft, Play, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  AutomationRule,
  TriggerType,
  ConditionType,
  ConditionOperator,
  Condition,
  ActionType,
  Action,
  RuleScope,
  createRule,
  updateRule,
  getTriggerLabel,
  getRuleHumanReadable,
  testRule,
} from "@/entities/automation-rule";

interface CreateRuleModalProps {
  existingRule?: AutomationRule | null;
  onClose: () => void;
}

const TRIGGERS: TriggerType[] = [
  "AssignmentCreated",
  "SubmissionUploaded",
  "SubmissionUpdated",
  "BeforeReviewAssign",
  "ReviewSubmitted",
  "BeforeGradePublish",
  "Scheduled",
];

const CONDITION_TYPES: ConditionType[] = [
  "plagiarism_score",
  "missing_reviews",
  "submission_delay_days",
  "review_comment_length",
  "grade_deviation",
  "peer_scores_variance",
];

const ACTION_TYPES: ActionType[] = [
  "flag_submission",
  "flag_review",
  "require_moderation",
  "reassign_reviewer",
  "apply_penalty",
  "send_notification",
];

const OPERATORS: ConditionOperator[] = [">", "<", ">=", "<=", "==", "!="];

export function CreateRuleModal({ existingRule, onClose }: CreateRuleModalProps) {
  const { t } = useTranslation();
  const isEditing = !!existingRule;
  const [step, setStep] = useState(1);

  const [name, setName] = useState(existingRule?.name || "");
  const [description, setDescription] = useState(existingRule?.description || "");
  const [trigger, setTrigger] = useState<TriggerType>(existingRule?.trigger || "ReviewSubmitted");
  const [conditions, setConditions] = useState<Condition[]>(existingRule?.conditions || []);
  const [actions, setActions] = useState<Action[]>(existingRule?.actions || []);
  const [scope, setScope] = useState<RuleScope>(existingRule?.scope || { applyToAll: true });
  const [priority, setPriority] = useState(existingRule?.priority || 1);
  const [enabled, setEnabled] = useState(existingRule?.enabled ?? true);

  const [testResults, setTestResults] = useState<{ matches: number; samples: string[] } | null>(
    null,
  );

  const handleAddCondition = () => {
    setConditions([...conditions, { type: "plagiarism_score", operator: ">", value: 0 }]);
  };

  const handleUpdateCondition = (index: number, updates: Partial<Condition>) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions(newConditions);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleAddAction = () => {
    setActions([...actions, { type: "flag_review" }]);
  };

  const handleUpdateAction = (index: number, updates: Partial<Action>) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], ...updates };
    setActions(newActions);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleTestRule = () => {
    const results = testRule();
    setTestResults(results);
    toast.info(t("feature.createRule.matchesFound", { count: results.matches }));
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error(t("feature.createRule.enterRuleName"));
      return;
    }

    if (actions.length === 0) {
      toast.error(t("feature.createRule.addAtLeastOneAction"));
      return;
    }

    const ruleData = {
      name,
      description,
      enabled,
      priority,
      trigger,
      conditions,
      actions,
      scope,
    };

    if (isEditing && existingRule) {
      updateRule(existingRule.id, ruleData);
      toast.success(t("feature.createRule.ruleUpdated"));
    } else {
      createRule(ruleData);
      toast.success(t("feature.createRule.ruleCreated"));
    }

    onClose();
  };

  const getConditionTypeLabel = (type: ConditionType): string => {
    const keys: Record<ConditionType, string> = {
      plagiarism_score: "feature.createRule.condPlagiarismScore",
      missing_reviews: "feature.createRule.condMissingReviews",
      submission_delay_days: "feature.createRule.condSubmissionDelay",
      review_comment_length: "feature.createRule.condCommentLength",
      grade_deviation: "feature.createRule.condGradeDeviation",
      peer_scores_variance: "feature.createRule.condScoresVariance",
    };
    return t(keys[type]);
  };

  const getActionTypeLabel = (type: ActionType): string => {
    const keys: Record<ActionType, string> = {
      flag_submission: "feature.createRule.actFlagSubmission",
      flag_review: "feature.createRule.actFlagReview",
      require_moderation: "feature.createRule.actRequireModeration",
      reassign_reviewer: "feature.createRule.actReassignReviewer",
      apply_penalty: "feature.createRule.actApplyPenalty",
      send_notification: "feature.createRule.actSendNotification",
    };
    return t(keys[type]);
  };

  // Build human-readable summary
  const buildSummary = () => {
    if (!trigger || actions.length === 0) {
      return t("feature.createRule.configureTriggerAndActions");
    }

    const rule: AutomationRule = {
      id: "preview",
      name,
      description,
      enabled,
      priority,
      trigger,
      conditions,
      actions,
      scope,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return getRuleHumanReadable(rule);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-[20px] max-w-[1200px] w-full my-8">
        <div className="flex gap-0 h-[calc(100vh-4rem)] max-h-[800px]">
          {/* Left: Form */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {isEditing ? t("feature.createRule.editRule") : t("feature.createRule.createRule")}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Steps indicator */}
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center gap-2">
                    <button
                      onClick={() => setStep(s)}
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-medium transition-colors ${
                        step === s
                          ? "bg-primary text-primary-foreground"
                          : step > s
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s}
                    </button>
                    {s < 4 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {step === 1 && t("feature.createRule.step1")}
                {step === 2 && t("feature.createRule.step2")}
                {step === 3 && t("feature.createRule.step3")}
                {step === 4 && t("feature.createRule.step4")}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Basic Info (always visible) */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("feature.createRule.ruleNameLabel")} *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("feature.createRule.ruleNamePlaceholder")}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t("feature.createRule.descriptionLabel")}
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("feature.createRule.descriptionPlaceholder")}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Step 1: Trigger */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {t("feature.createRule.selectTrigger")}
                  </h3>
                  <div className="space-y-2">
                    {TRIGGERS.map((t) => (
                      <label
                        key={t}
                        className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="trigger"
                          checked={trigger === t}
                          onChange={() => setTrigger(t)}
                          className="w-4 h-4 text-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{getTriggerLabel(t)}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Conditions */}
              {step === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {t("feature.createRule.conditionsOptional")}
                    </h3>
                    <button
                      onClick={handleAddCondition}
                      className="text-sm text-primary hover:underline"
                    >
                      + {t("feature.createRule.addCondition")}
                    </button>
                  </div>

                  {conditions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p className="mb-2">{t("feature.createRule.noConditions")}</p>
                      <p className="text-sm">{t("feature.createRule.ruleWillAlwaysFire")}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {conditions.map((condition, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 border border-border rounded-lg"
                        >
                          <select
                            value={condition.type}
                            onChange={(e) =>
                              handleUpdateCondition(index, {
                                type: e.target.value as ConditionType,
                              })
                            }
                            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                          >
                            {CONDITION_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {getConditionTypeLabel(type)}
                              </option>
                            ))}
                          </select>
                          <select
                            value={condition.operator}
                            onChange={(e) =>
                              handleUpdateCondition(index, {
                                operator: e.target.value as ConditionOperator,
                              })
                            }
                            className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                          >
                            {OPERATORS.map((op) => (
                              <option key={op} value={op}>
                                {op}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={condition.value}
                            onChange={(e) =>
                              handleUpdateCondition(index, {
                                value: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                          />
                          <button
                            onClick={() => handleRemoveCondition(index)}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Actions */}
              {step === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {t("feature.createRule.actionsRequired")} *
                    </h3>
                    <button
                      onClick={handleAddAction}
                      className="text-sm text-primary hover:underline"
                    >
                      + {t("feature.createRule.addAction")}
                    </button>
                  </div>

                  {actions.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-muted-foreground mb-2">
                        {t("feature.createRule.noActions")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("feature.createRule.addAtLeastOneAction")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {actions.map((action, index) => (
                        <div key={index} className="p-4 border border-border rounded-lg">
                          <div className="flex items-start gap-3 mb-3">
                            <select
                              value={action.type}
                              onChange={(e) =>
                                handleUpdateAction(index, { type: e.target.value as ActionType })
                              }
                              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                            >
                              {ACTION_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {getActionTypeLabel(type)}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleRemoveAction(index)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Action-specific parameters */}
                          {action.type === "apply_penalty" && (
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {t("feature.createRule.penaltyPercent")}
                              </label>
                              <input
                                type="number"
                                value={action.parameters?.penaltyPercent || 10}
                                onChange={(e) =>
                                  handleUpdateAction(index, {
                                    parameters: {
                                      ...action.parameters,
                                      penaltyPercent: parseFloat(e.target.value) || 0,
                                    },
                                  })
                                }
                                className="w-32 px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                                min="0"
                                max="100"
                              />
                            </div>
                          )}
                          {action.type === "send_notification" && (
                            <div>
                              <label className="block text-sm font-medium text-foreground mb-2">
                                {t("feature.createRule.notificationText")}
                              </label>
                              <input
                                type="text"
                                value={action.parameters?.message || ""}
                                onChange={(e) =>
                                  handleUpdateAction(index, {
                                    parameters: { ...action.parameters, message: e.target.value },
                                  })
                                }
                                placeholder={t("feature.createRule.messagePlaceholder")}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Scope */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {t("feature.createRule.scopeTitle")}
                  </h3>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <input
                        type="radio"
                        checked={scope.applyToAll}
                        onChange={() => setScope({ applyToAll: true })}
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-medium text-foreground">
                          {t("feature.createRule.allCoursesAndAssignments")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("feature.createRule.ruleAppliesEverywhere")}
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                      <input
                        type="radio"
                        checked={!scope.applyToAll}
                        onChange={() =>
                          setScope({ applyToAll: false, courseIds: [], assignmentIds: [] })
                        }
                        className="w-4 h-4 text-primary"
                      />
                      <div>
                        <div className="font-medium text-foreground">
                          {t("feature.createRule.selective")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("feature.createRule.selectSpecific")}
                        </div>
                      </div>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("feature.createRule.priority")}
                      </label>
                      <input
                        type="number"
                        value={priority}
                        onChange={(e) => setPriority(parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-32 px-4 py-2.5 border border-border rounded-lg bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("feature.createRule.priorityHint")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">
                          {t("feature.createRule.enableImmediately")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t("feature.createRule.ruleStartsAfterSave")}
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => setEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-switch-background peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                {t("common.back")}
              </button>

              <div className="flex gap-2">
                {step < 4 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {t("common.next")}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    {isEditing
                      ? t("feature.createRule.saveChanges")
                      : t("feature.createRule.createRule")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary & Test */}
          <div className="w-[400px] border-l border-border flex flex-col bg-muted/30">
            <div className="p-6 border-b border-border">
              <h3 className="font-semibold text-foreground mb-1">
                {t("feature.createRule.rulePreview")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("feature.createRule.readableDescription")}
              </p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-card border border-border rounded-lg p-4 mb-4">
                <div className="text-sm text-foreground font-mono leading-relaxed">
                  {buildSummary()}
                </div>
              </div>

              <button
                onClick={handleTestRule}
                disabled={actions.length === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                {t("feature.createRule.testRule")}
              </button>

              {testResults && (
                <div className="mt-4 bg-card border border-border rounded-lg p-4">
                  <div className="font-medium text-foreground mb-2">
                    {t("feature.createRule.testResults")}
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {t("feature.createRule.matchesFoundLabel")}:{" "}
                    <strong>{testResults.matches}</strong>
                  </div>
                  {testResults.samples.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {t("feature.createRule.examples")}:
                      </div>
                      <ul className="space-y-1">
                        {testResults.samples.map((sample, i) => (
                          <li
                            key={i}
                            className="text-xs text-foreground bg-muted/50 px-2 py-1 rounded"
                          >
                            {sample}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

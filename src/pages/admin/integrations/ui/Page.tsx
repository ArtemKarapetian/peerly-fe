import {
  Link2,
  Lock,
  AlertCircle,
  Plus,
  X,
  Trash2,
  CheckCircle,
  XCircle,
  Send,
  Clock,
  ExternalLink,
  Eye,
} from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminIntegrationsPage - Integration keys & webhooks
 */

interface Webhook {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  status: "active" | "inactive" | "error";
  lastDelivery?: WebhookDelivery;
  createdAt: Date;
}

interface WebhookDelivery {
  timestamp: Date;
  event: string;
  status: "success" | "failed";
  responseCode?: number;
  responseTime?: number;
}

interface WebhookEventDef {
  value: string;
  label: string;
  descriptionKey: string;
}

const WEBHOOK_EVENTS: WebhookEventDef[] = [
  {
    value: "assignment.created",
    label: "Assignment Created",
    descriptionKey: "admin.integrationsPage.eventDescriptions.assignmentCreated",
  },
  {
    value: "work.uploaded",
    label: "Submission Uploaded",
    descriptionKey: "admin.integrationsPage.eventDescriptions.workUploaded",
  },
  {
    value: "review.submitted",
    label: "Review Submitted",
    descriptionKey: "admin.integrationsPage.eventDescriptions.reviewSubmitted",
  },
  {
    value: "course.updated",
    label: "Course Updated",
    descriptionKey: "admin.integrationsPage.eventDescriptions.courseUpdated",
  },
  {
    value: "user.registered",
    label: "User Registered",
    descriptionKey: "admin.integrationsPage.eventDescriptions.userRegistered",
  },
];

interface StoredWebhook {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  status: "active" | "inactive" | "error";
  createdAt: string;
  lastDelivery?: {
    timestamp: string;
    event: string;
    status: "success" | "failed";
    responseCode?: number;
    responseTime?: number;
  };
}

const getInitialWebhooks = (): Webhook[] => {
  const stored = localStorage.getItem("admin_webhooks");
  if (stored) {
    const parsed: StoredWebhook[] = JSON.parse(stored) as StoredWebhook[];
    return parsed.map((w) => ({
      ...w,
      createdAt: new Date(w.createdAt),
      lastDelivery: w.lastDelivery
        ? {
            ...w.lastDelivery,
            timestamp: new Date(w.lastDelivery.timestamp),
          }
        : undefined,
    }));
  }
  return [];
};

export default function AdminIntegrationsPage() {
  const { t } = useTranslation();
  const [webhooks, setWebhooks] = useState<Webhook[]>(getInitialWebhooks);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSecretModal, setShowSecretModal] = useState<string | null>(null);

  const [formName, setFormName] = useState("");
  const [formUrl, setFormUrl] = useState("");
  const [formSecret, setFormSecret] = useState("");
  const [formEvents, setFormEvents] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const logAuditEntry = useCallback((action: string, resource: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem("admin_audit_logs") || "[]") as Record<
      string,
      unknown
    >[];
    logs.unshift({
      id: `audit-${Date.now()}`,
      userId: "webhook-system",
      adminId: "u3",
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("admin_audit_logs", JSON.stringify(logs));
  }, []);

  const saveWebhooks = useCallback((newWebhooks: Webhook[]) => {
    setWebhooks(newWebhooks);
    localStorage.setItem("admin_webhooks", JSON.stringify(newWebhooks));
  }, []);

  const generateSecret = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let secret = "whsec_";
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formName.trim()) {
      errors.name = t("admin.integrationsPage.formErrors.enterName");
    }

    if (!formUrl.trim()) {
      errors.url = t("admin.integrationsPage.formErrors.enterUrl");
    } else if (!formUrl.startsWith("http://") && !formUrl.startsWith("https://")) {
      errors.url = t("admin.integrationsPage.formErrors.urlProtocol");
    }

    if (formEvents.length === 0) {
      errors.events = t("admin.integrationsPage.formErrors.selectEvent");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const newWebhook: Webhook = {
      id: `wh-${Date.now()}`,
      name: formName,
      url: formUrl,
      secret: formSecret || generateSecret(),
      events: formEvents,
      status: "active",
      createdAt: new Date(),
    };

    saveWebhooks([...webhooks, newWebhook]);
    logAuditEntry(
      "CREATE_WEBHOOK",
      "Webhook",
      t("admin.integrationsPage.auditCreated", { name: formName }),
    );

    setFormName("");
    setFormUrl("");
    setFormSecret("");
    setFormEvents([]);
    setFormErrors({});
    setShowCreateModal(false);

    alert(t("admin.integrationsPage.webhookCreated", { name: formName }));
  };

  const handleDelete = (webhook: Webhook) => {
    if (!confirm(t("admin.integrationsPage.confirmDelete", { name: webhook.name }))) return;

    saveWebhooks(webhooks.filter((w) => w.id !== webhook.id));
    logAuditEntry(
      "DELETE_WEBHOOK",
      "Webhook",
      t("admin.integrationsPage.auditDeleted", { name: webhook.name }),
    );
    alert(t("admin.integrationsPage.webhookDeleted", { name: webhook.name }));
  };

  const handleToggleStatus = (webhook: Webhook) => {
    const newStatus = webhook.status === "active" ? ("inactive" as const) : ("active" as const);
    const updated = webhooks.map((w) => (w.id === webhook.id ? { ...w, status: newStatus } : w));
    saveWebhooks(updated);
    logAuditEntry(
      newStatus === "active" ? "ENABLE_WEBHOOK" : "DISABLE_WEBHOOK",
      "Webhook",
      `Webhook ${webhook.name} ${newStatus === "active" ? t("admin.integrationsPage.auditEnabled") : t("admin.integrationsPage.auditDisabled")}`,
    );
  };

  const handleTestWebhook = useCallback(
    (webhook: Webhook) => {
      const testEvent = webhook.events[0] || "test.event";
      const isSuccess = Math.random() > 0.2;

      const delivery: WebhookDelivery = {
        timestamp: new Date(),
        event: testEvent,
        status: isSuccess ? "success" : "failed",
        responseCode: isSuccess ? 200 : 500,
        responseTime: Math.floor(Math.random() * 500) + 100,
      };

      const updated = webhooks.map((w) =>
        w.id === webhook.id
          ? {
              ...w,
              lastDelivery: delivery,
              status: isSuccess ? ("active" as const) : ("error" as const),
            }
          : w,
      );
      saveWebhooks(updated);

      logAuditEntry(
        "TEST_WEBHOOK",
        "Webhook",
        t("admin.integrationsPage.auditTestSent", { name: webhook.name }),
      );

      alert(
        isSuccess
          ? t("admin.integrationsPage.testSuccess", { time: delivery.responseTime })
          : t("admin.integrationsPage.testFailed", {
              code: delivery.responseCode,
              time: delivery.responseTime,
            }),
      );
    },
    [webhooks, logAuditEntry, saveWebhooks, t],
  );

  const toggleEvent = (event: string) => {
    if (formEvents.includes(event)) {
      setFormEvents(formEvents.filter((e) => e !== event));
    } else {
      setFormEvents([...formEvents, event]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[11px] font-medium">
            <CheckCircle className="w-3 h-3" />
            {t("admin.integrationsPage.statusActive")}
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[11px] font-medium">
            <Clock className="w-3 h-3" />
            {t("admin.integrationsPage.statusInactive")}
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-light text-error rounded-[6px] text-[11px] font-medium">
            <XCircle className="w-3 h-3" />
            {t("admin.integrationsPage.statusError")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell title={t("admin.integrations.title")}>
      <Breadcrumbs items={[{ label: t("nav.integrations") }]} />

      <PageHeader
        title={t("admin.integrations.title")}
        subtitle={t("admin.integrations.subtitle")}
      />

      <div className="space-y-8">
        {/* External Integrations Section */}
        <div>
          <h2 className="text-[20px] font-medium text-foreground mb-4">
            {t("admin.integrationsPage.externalIntegrations")}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Moodle Integration */}
            <div className="bg-card border-2 border-border rounded-[20px] p-6 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-warning-light rounded-[12px] flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-medium text-foreground mb-1">Moodle</h3>
                    <p className="text-[13px] text-muted-foreground">
                      {t("admin.integrationsPage.moodleDesc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-[8px] text-[12px] font-medium">
                  <Lock className="w-3 h-3" />
                  Out of MVP
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                    Moodle URL
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="https://your-moodle.edu"
                    className="w-full px-4 py-2 border-2 border-border rounded-[8px] text-[14px] bg-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                    API Token
                  </label>
                  <input
                    type="password"
                    disabled
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2 border-2 border-border rounded-[8px] text-[14px] bg-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                disabled
                className="w-full px-4 py-2 bg-border text-muted-foreground rounded-[8px] text-[14px] font-medium cursor-not-allowed"
              >
                {t("admin.integrationsPage.connectUnavailable")}
              </button>
            </div>

            {/* Office 365 Integration */}
            <div className="bg-card border-2 border-border rounded-[20px] p-6 opacity-60">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-info-light rounded-[12px] flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-medium text-foreground mb-1">Office 365</h3>
                    <p className="text-[13px] text-muted-foreground">
                      {t("admin.integrationsPage.office365Desc")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-[8px] text-[12px] font-medium">
                  <Lock className="w-3 h-3" />
                  Out of MVP
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                    Client ID
                  </label>
                  <input
                    type="text"
                    disabled
                    placeholder="00000000-0000-0000-0000-000000000000"
                    className="w-full px-4 py-2 border-2 border-border rounded-[8px] text-[14px] bg-muted cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    disabled
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-2 border-2 border-border rounded-[8px] text-[14px] bg-muted cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                disabled
                className="w-full px-4 py-2 bg-border text-muted-foreground rounded-[8px] text-[14px] font-medium cursor-not-allowed"
              >
                {t("admin.integrationsPage.connectUnavailable")}
              </button>
            </div>
          </div>
        </div>

        {/* Webhooks Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-medium text-foreground">
              {t("admin.integrationsPage.webhooks")}
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
            >
              <Plus className="w-4 h-4" />
              {t("admin.integrationsPage.createWebhook")}
            </button>
          </div>

          {webhooks.length > 0 ? (
            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="bg-card border-2 border-border rounded-[20px] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[18px] font-medium text-foreground">{webhook.name}</h3>
                        {getStatusBadge(webhook.status)}
                      </div>
                      <div className="flex items-center gap-2 text-[13px] text-muted-foreground mb-2">
                        <ExternalLink className="w-3 h-3" />
                        <span className="font-mono">{webhook.url}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {webhook.events.map((event) => {
                          const eventInfo = WEBHOOK_EVENTS.find((e) => e.value === event);
                          return (
                            <span
                              key={event}
                              className="px-2 py-1 bg-muted text-foreground rounded-[6px] text-[11px]"
                            >
                              {eventInfo?.label || event}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {webhook.lastDelivery && (
                    <div className="p-4 bg-muted rounded-[12px] mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                          {t("admin.integrationsPage.lastDelivery")}
                        </span>
                        {webhook.lastDelivery.status === "success" ? (
                          <span className="text-[11px] text-success font-medium">
                            {t("admin.integrationsPage.deliverySuccess")}
                          </span>
                        ) : (
                          <span className="text-[11px] text-error font-medium">
                            {t("admin.integrationsPage.deliveryFailed")}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-[12px]">
                        <div>
                          <span className="text-muted-foreground">
                            {t("admin.integrationsPage.eventLabel")}
                          </span>
                          <p className="text-foreground font-medium mt-1">
                            {webhook.lastDelivery.event}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("admin.integrationsPage.responseCodeLabel")}
                          </span>
                          <p className="text-foreground font-medium mt-1">
                            {webhook.lastDelivery.responseCode}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {t("admin.integrationsPage.timeLabel")}
                          </span>
                          <p className="text-foreground font-medium mt-1">
                            {webhook.lastDelivery.responseTime}ms
                          </p>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-2">
                        {webhook.lastDelivery.timestamp.toLocaleString("ru-RU")}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTestWebhook(webhook)}
                      className="flex items-center gap-2 px-3 py-2 bg-brand-primary text-primary-foreground rounded-[8px] hover:bg-brand-primary-hover transition-colors text-[13px] font-medium"
                    >
                      <Send className="w-4 h-4" />
                      {t("admin.integrationsPage.testBtn")}
                    </button>
                    <button
                      onClick={() => handleToggleStatus(webhook)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-[8px] transition-colors text-[13px] font-medium ${
                        webhook.status === "active"
                          ? "border-2 border-border text-foreground hover:bg-muted"
                          : "bg-success text-primary-foreground hover:bg-success"
                      }`}
                    >
                      {webhook.status === "active"
                        ? t("admin.integrationsPage.disableBtn")
                        : t("admin.integrationsPage.enableBtn")}
                    </button>
                    <button
                      onClick={() => setShowSecretModal(webhook.secret)}
                      className="flex items-center gap-2 px-3 py-2 border-2 border-border text-foreground rounded-[8px] hover:bg-muted transition-colors text-[13px] font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Secret
                    </button>
                    <button
                      onClick={() => handleDelete(webhook)}
                      className="ml-auto flex items-center gap-2 px-3 py-2 border-2 border-error text-error rounded-[8px] hover:bg-error-light transition-colors text-[13px] font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t("admin.integrationsPage.deleteBtn")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
              <Link2 className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <h3 className="text-[18px] font-medium text-foreground mb-2">
                {t("admin.integrationsPage.noWebhooks")}
              </h3>
              <p className="text-[14px] text-muted-foreground mb-4">
                {t("admin.integrationsPage.noWebhooksHint")}
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
              >
                <Plus className="w-4 h-4" />
                {t("admin.integrationsPage.createFirstWebhook")}
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-info-light border-2 border-brand-primary rounded-[16px] p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-foreground mb-1">
                {t("admin.integrationsPage.aboutWebhooksTitle")}
              </h4>
              <p className="text-[13px] text-muted-foreground">
                {t("admin.integrationsPage.aboutWebhooksText")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create Webhook Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-card rounded-[20px] w-full max-w-[700px] max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b-2 border-border flex items-center justify-between">
              <h2 className="text-[20px] font-medium text-foreground">
                {t("admin.integrationsPage.createWebhookModal")}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-muted rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    {t("admin.integrationsPage.nameLabel")} <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder={t("admin.integrationsPage.namePlaceholder")}
                    className={`w-full px-4 py-3 border-2 rounded-[12px] text-[15px] focus:outline-none transition-colors ${
                      formErrors.name
                        ? "border-error focus:border-error"
                        : "border-border focus:border-brand-primary"
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[12px] text-error mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    {t("admin.integrationsPage.endpointUrl")} <span className="text-error">*</span>
                  </label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                    className={`w-full px-4 py-3 border-2 rounded-[12px] text-[15px] focus:outline-none transition-colors font-mono ${
                      formErrors.url
                        ? "border-error focus:border-error"
                        : "border-border focus:border-brand-primary"
                    }`}
                  />
                  {formErrors.url && (
                    <p className="text-[12px] text-error mt-1 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {formErrors.url}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    {t("admin.integrationsPage.secretLabel")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formSecret}
                      onChange={(e) => setFormSecret(e.target.value)}
                      placeholder={t("admin.integrationsPage.secretPlaceholder")}
                      className="flex-1 px-4 py-3 border-2 border-border rounded-[12px] text-[15px] focus:border-brand-primary focus:outline-none transition-colors font-mono"
                    />
                    <button
                      onClick={() => setFormSecret(generateSecret())}
                      className="px-4 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted transition-colors text-[13px] font-medium"
                    >
                      {t("admin.integrationsPage.generateBtn")}
                    </button>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    {t("admin.integrationsPage.secretUsedFor")}
                  </p>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-2">
                    {t("admin.integrationsPage.eventsLabel")} <span className="text-error">*</span>
                  </label>
                  <div className="space-y-2">
                    {WEBHOOK_EVENTS.map((event) => (
                      <label
                        key={event.value}
                        className="flex items-start gap-3 p-3 border-2 border-border rounded-[12px] cursor-pointer hover:bg-muted transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formEvents.includes(event.value)}
                          onChange={() => toggleEvent(event.value)}
                          className="w-5 h-5 text-brand-primary rounded-[4px] mt-0.5"
                        />
                        <div className="flex-1">
                          <p className="text-[14px] font-medium text-foreground">{event.label}</p>
                          <p className="text-[12px] text-muted-foreground mt-0.5">
                            {t(event.descriptionKey)}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {formErrors.events && (
                    <p className="text-[12px] text-error mt-2 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {formErrors.events}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t-2 border-border flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted transition-colors text-[14px] font-medium"
              >
                {t("admin.integrationsPage.cancel")}
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
              >
                {t("admin.integrationsPage.create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show Secret Modal */}
      {showSecretModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSecretModal(null)}
        >
          <div
            className="bg-card rounded-[20px] w-full max-w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b-2 border-border flex items-center justify-between">
              <h2 className="text-[18px] font-medium text-foreground">
                {t("admin.integrationsPage.webhookSecret")}
              </h2>
              <button
                onClick={() => setShowSecretModal(null)}
                className="p-2 hover:bg-muted rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-6">
              <div className="p-4 bg-muted rounded-[12px] border-2 border-border mb-4">
                <p className="text-[14px] font-mono text-foreground break-all">{showSecretModal}</p>
              </div>
              <p className="text-[13px] text-muted-foreground">
                {t("admin.integrationsPage.secretWarning")}
              </p>
            </div>
            <div className="px-6 py-4 border-t-2 border-border">
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(showSecretModal);
                  alert(t("admin.integrationsPage.secretCopied"));
                }}
                className="w-full px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
              >
                {t("admin.integrationsPage.copyToClipboard")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

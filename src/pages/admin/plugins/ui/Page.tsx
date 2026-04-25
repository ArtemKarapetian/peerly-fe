import {
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
  Trash2,
  Settings,
  FileText,
  X,
  RefreshCw,
  Package,
} from "lucide-react";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

interface Plugin {
  id: string;
  name: string;
  descriptionKey: string;
  version: string;
  category: string;
  status: "healthy" | "degraded" | "error" | "not-installed";
  installed: boolean;
  lastRun?: Date;
  config?: Record<string, string>;
  configSchema?: ConfigField[];
}

interface ConfigField {
  key: string;
  labelKey: string;
  type: "text" | "number" | "select" | "boolean";
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

const createInitialPlugins = (): Plugin[] => {
  const now = Date.now();
  return [
    {
      id: "plagiarism-scanner",
      name: "Plagiarism Scanner",
      descriptionKey: "admin.pluginsPage.pluginDescriptions.plagiarismScanner",
      version: "2.1.0",
      category: "Quality Assurance",
      status: "healthy",
      installed: true,
      lastRun: new Date(now - 2 * 60 * 60 * 1000),
      config: {
        apiKey: "demo-api-key-123",
        threshold: "85",
        checkInternet: "true",
      },
      configSchema: [
        {
          key: "apiKey",
          labelKey: "admin.pluginsPage.configLabels.apiKeyPlaceholder",
          type: "text",
          required: true,
          placeholder: "API Key",
        },
        {
          key: "threshold",
          labelKey: "admin.pluginsPage.configLabels.matchThreshold",
          type: "number",
          required: true,
          validation: { min: 0, max: 100 },
        },
        {
          key: "checkInternet",
          labelKey: "admin.pluginsPage.configLabels.checkInternet",
          type: "boolean",
          required: false,
        },
      ],
    },
    {
      id: "code-linter",
      name: "Code Linter",
      descriptionKey: "admin.pluginsPage.pluginDescriptions.codeLinter",
      version: "3.4.2",
      category: "Code Quality",
      status: "healthy",
      installed: true,
      lastRun: new Date(now - 30 * 60 * 1000),
      config: {
        language: "javascript",
        strictness: "medium",
        autofix: "false",
      },
      configSchema: [
        {
          key: "language",
          labelKey: "admin.pluginsPage.configLabels.programmingLanguage",
          type: "select",
          required: true,
          options: ["javascript", "python", "java", "cpp", "csharp"],
        },
        {
          key: "strictness",
          labelKey: "admin.pluginsPage.configLabels.strictness",
          type: "select",
          required: true,
          options: ["low", "medium", "high"],
        },
        {
          key: "autofix",
          labelKey: "admin.pluginsPage.configLabels.autoFix",
          type: "boolean",
          required: false,
        },
      ],
    },
    {
      id: "file-validator",
      name: "File Format Validator",
      descriptionKey: "admin.pluginsPage.pluginDescriptions.fileValidator",
      version: "1.8.5",
      category: "Validation",
      status: "degraded",
      installed: true,
      lastRun: new Date(now - 5 * 60 * 60 * 1000),
      config: {
        maxSize: "10",
        allowedFormats: "pdf,docx,txt",
        scanViruses: "true",
      },
      configSchema: [
        {
          key: "maxSize",
          labelKey: "admin.pluginsPage.configLabels.maxSize",
          type: "number",
          required: true,
          validation: { min: 1, max: 100 },
        },
        {
          key: "allowedFormats",
          labelKey: "admin.pluginsPage.configLabels.allowedFormats",
          type: "text",
          required: true,
          placeholder: "pdf,docx,txt",
        },
        {
          key: "scanViruses",
          labelKey: "admin.pluginsPage.configLabels.scanViruses",
          type: "boolean",
          required: false,
        },
      ],
    },
    {
      id: "anonymizer",
      name: "Anonymizer",
      descriptionKey: "admin.pluginsPage.pluginDescriptions.anonymizer",
      version: "2.0.3",
      category: "Privacy",
      status: "healthy",
      installed: true,
      lastRun: new Date(now - 1 * 60 * 60 * 1000),
      config: {
        mode: "full",
        preserveMetadata: "false",
      },
      configSchema: [
        {
          key: "mode",
          labelKey: "admin.pluginsPage.configLabels.anonymizationMode",
          type: "select",
          required: true,
          options: ["full", "partial", "minimal"],
        },
        {
          key: "preserveMetadata",
          labelKey: "admin.pluginsPage.configLabels.preserveMetadata",
          type: "boolean",
          required: false,
        },
      ],
    },
    {
      id: "toxicity-checker",
      name: "Toxicity Checker",
      descriptionKey: "admin.pluginsPage.pluginDescriptions.toxicityChecker",
      version: "1.5.0",
      category: "Moderation",
      status: "healthy",
      installed: true,
      lastRun: new Date(now - 15 * 60 * 1000),
      config: {
        sensitivity: "medium",
        autoBlock: "false",
        language: "ru",
      },
      configSchema: [
        {
          key: "sensitivity",
          labelKey: "admin.pluginsPage.configLabels.sensitivity",
          type: "select",
          required: true,
          options: ["low", "medium", "high"],
        },
        {
          key: "autoBlock",
          labelKey: "admin.pluginsPage.configLabels.autoBlock",
          type: "boolean",
          required: false,
        },
        {
          key: "language",
          labelKey: "admin.pluginsPage.configLabels.moderationLanguage",
          type: "select",
          required: true,
          options: ["ru", "en", "multi"],
        },
      ],
    },
    {
      id: "ai-grader",
      name: "AI Auto-Grader",
      descriptionKey: "admin.pluginsPage.pluginDescriptions.aiGrader",
      version: "1.0.0",
      category: "AI/ML",
      status: "not-installed",
      installed: false,
      configSchema: [
        {
          key: "model",
          labelKey: "admin.pluginsPage.configLabels.mlModel",
          type: "select",
          required: true,
          options: ["gpt-4", "claude", "local"],
        },
        {
          key: "confidence",
          labelKey: "admin.pluginsPage.configLabels.minConfidence",
          type: "number",
          required: true,
          validation: { min: 0, max: 100 },
        },
      ],
    },
    {
      id: "slack-integration",
      name: "Slack Integration",
      descriptionKey: "admin.pluginsPage.pluginDescriptions.slackIntegration",
      version: "2.3.1",
      category: "Integration",
      status: "not-installed",
      installed: false,
      configSchema: [
        {
          key: "webhookUrl",
          labelKey: "admin.pluginsPage.configLabels.apiKeyPlaceholder",
          type: "text",
          required: true,
          placeholder: "https://hooks.slack.com/...",
        },
        {
          key: "channel",
          labelKey: "admin.pluginsPage.configLabels.defaultChannel",
          type: "text",
          required: true,
          placeholder: "#general",
        },
      ],
    },
    {
      id: "citation-checker",
      name: "Citation Checker",
      descriptionKey: "admin.pluginsPage.pluginDescriptions.citationChecker",
      version: "1.2.0",
      category: "Quality Assurance",
      status: "not-installed",
      installed: false,
      configSchema: [
        {
          key: "style",
          labelKey: "admin.pluginsPage.configLabels.citationStyle",
          type: "select",
          required: true,
          options: ["APA", "MLA", "Chicago", "GOST"],
        },
      ],
    },
  ];
};

const INITIAL_PLUGINS = createInitialPlugins();

export default function AdminPluginsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"installed" | "available">("installed");
  const [configModal, setConfigModal] = useState<{
    plugin: Plugin;
    config: Record<string, string>;
  } | null>(null);
  const [configErrors, setConfigErrors] = useState<Record<string, string>>({});
  const [plugins, setPlugins] = useState<Plugin[]>(INITIAL_PLUGINS);

  const installedPlugins = plugins.filter((p) => p.installed);
  const availablePlugins = plugins.filter((p) => !p.installed);

  const handleInstall = (plugin: Plugin) => {
    setPlugins(
      plugins.map((p) =>
        p.id === plugin.id
          ? { ...p, installed: true, status: "healthy", lastRun: new Date(), config: {} }
          : p,
      ),
    );
    logAuditEntry(
      "INSTALL_PLUGIN",
      "Plugin",
      t("admin.pluginsPage.auditInstalled", { name: plugin.name }),
    );
    alert(t("admin.pluginsPage.pluginInstalled", { name: plugin.name }));
  };

  const handleUninstall = (plugin: Plugin) => {
    if (!confirm(t("admin.pluginsPage.confirmUninstall", { name: plugin.name }))) return;

    setPlugins(
      plugins.map((p) =>
        p.id === plugin.id
          ? { ...p, installed: false, status: "not-installed", lastRun: undefined, config: {} }
          : p,
      ),
    );
    logAuditEntry(
      "UNINSTALL_PLUGIN",
      "Plugin",
      t("admin.pluginsPage.auditUninstalled", { name: plugin.name }),
    );
    alert(t("admin.pluginsPage.pluginUninstalled", { name: plugin.name }));
  };

  const handleUpdate = (plugin: Plugin) => {
    const newVersion = `${parseInt(plugin.version.split(".")[0]) + 1}.0.0`;
    setPlugins(
      plugins.map((p) =>
        p.id === plugin.id ? { ...p, version: newVersion, lastRun: new Date() } : p,
      ),
    );
    logAuditEntry(
      "UPDATE_PLUGIN",
      "Plugin",
      t("admin.pluginsPage.auditUpdated", { name: plugin.name, version: newVersion }),
    );
    alert(t("admin.pluginsPage.pluginUpdated", { name: plugin.name, version: newVersion }));
  };

  const handleConfigure = (plugin: Plugin) => {
    setConfigModal({
      plugin,
      config: { ...plugin.config },
    });
    setConfigErrors({});
  };

  const handleViewLogs = (plugin: Plugin) => {
    void navigate(`/admin/logs?plugin=${plugin.id}`);
  };

  const validateConfig = (config: Record<string, string>, schema: ConfigField[]): boolean => {
    const errors: Record<string, string> = {};

    schema.forEach((field) => {
      const value = config[field.key];

      if (field.required && (!value || value.trim() === "")) {
        errors[field.key] = t("admin.pluginsPage.requiredField");
        return;
      }

      if (field.type === "number" && value) {
        const num = parseFloat(value);
        if (isNaN(num)) {
          errors[field.key] = t("admin.pluginsPage.enterNumber");
        } else if (field.validation?.min !== undefined && num < field.validation.min) {
          errors[field.key] = t("admin.pluginsPage.minimum", { value: field.validation.min });
        } else if (field.validation?.max !== undefined && num > field.validation.max) {
          errors[field.key] = t("admin.pluginsPage.maximum", { value: field.validation.max });
        }
      }
    });

    setConfigErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveConfig = () => {
    if (!configModal) return;

    const { plugin, config } = configModal;
    if (!plugin.configSchema || !validateConfig(config, plugin.configSchema)) {
      return;
    }

    setPlugins(plugins.map((p) => (p.id === plugin.id ? { ...p, config } : p)));

    logAuditEntry(
      "CONFIGURE_PLUGIN",
      "Plugin",
      t("admin.pluginsPage.auditConfigured", { name: plugin.name }),
    );
    setConfigModal(null);
    alert(t("admin.pluginsPage.pluginConfigured", { name: plugin.name }));
  };

  const logAuditEntry = useCallback((action: string, resource: string, details: string) => {
    const logs = JSON.parse(localStorage.getItem("admin_audit_logs") || "[]") as Record<
      string,
      unknown
    >[];
    logs.unshift({
      id: `audit-${Date.now()}`,
      userId: "plugin-system",
      adminId: "u3",
      action,
      resource,
      details,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("admin_audit_logs", JSON.stringify(logs));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[11px] font-medium">
            <CheckCircle className="w-3 h-3" />
            {t("admin.pluginsPage.statusHealthy")}
          </span>
        );
      case "degraded":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[11px] font-medium">
            <AlertTriangle className="w-3 h-3" />
            {t("admin.pluginsPage.statusDegraded")}
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-light text-error rounded-[6px] text-[11px] font-medium">
            <XCircle className="w-3 h-3" />
            {t("admin.pluginsPage.statusError")}
          </span>
        );
      case "not-installed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[11px] font-medium">
            {t("admin.pluginsPage.statusNotInstalled")}
          </span>
        );
      default:
        return null;
    }
  };

  const renderPluginCard = (plugin: Plugin) => (
    <div
      key={plugin.id}
      className="bg-card border-2 border-border rounded-[20px] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 bg-info-light rounded-[12px] flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-brand-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-[18px] font-medium text-foreground mb-1">{plugin.name}</h3>
            <p className="text-[13px] text-muted-foreground">{t(plugin.descriptionKey)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4 pb-4 border-b-2 border-border">
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">{t("admin.pluginsPage.versionLabel")}</span>
          <span className="text-foreground font-medium font-mono">{plugin.version}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">{t("admin.pluginsPage.categoryLabel")}</span>
          <span className="text-foreground">{plugin.category}</span>
        </div>
        <div className="flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">{t("admin.pluginsPage.statusLabel")}</span>
          {getStatusBadge(plugin.status)}
        </div>
        {plugin.lastRun && (
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-muted-foreground">{t("admin.pluginsPage.lastRunLabel")}</span>
            <span className="text-foreground">{plugin.lastRun.toLocaleString("ru-RU")}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {plugin.installed ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleConfigure(plugin)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-brand-primary text-primary-foreground rounded-[8px] hover:bg-brand-primary-hover transition-colors text-[13px] font-medium"
              >
                <Settings className="w-4 h-4" />
                {t("admin.pluginsPage.configure")}
              </button>
              <button
                onClick={() => handleViewLogs(plugin)}
                className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-border text-foreground rounded-[8px] hover:bg-muted transition-colors text-[13px] font-medium"
              >
                <FileText className="w-4 h-4" />
                {t("admin.pluginsPage.logs")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleUpdate(plugin)}
                className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-border text-foreground rounded-[8px] hover:bg-muted transition-colors text-[13px] font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                {t("admin.pluginsPage.update")}
              </button>
              <button
                onClick={() => handleUninstall(plugin)}
                className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-error text-error rounded-[8px] hover:bg-error-light transition-colors text-[13px] font-medium"
              >
                <Trash2 className="w-4 h-4" />
                {t("admin.pluginsPage.uninstall")}
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => handleInstall(plugin)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success text-primary-foreground rounded-[12px] hover:bg-success transition-colors text-[14px] font-medium"
          >
            <Download className="w-5 h-5" />
            {t("admin.pluginsPage.install")}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <AppShell title={t("admin.plugins.title")}>
      <Breadcrumbs items={[{ label: t("admin.plugins.title") }]} />

      <PageHeader title={t("admin.plugins.title")} subtitle={t("admin.plugins.subtitle")} />

      <div>
        <div className="flex gap-2 mb-6 border-b-2 border-border">
          <button
            onClick={() => setActiveTab("installed")}
            className={`px-6 py-3 text-[15px] font-medium transition-colors relative ${
              activeTab === "installed"
                ? "text-brand-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("admin.pluginsPage.tabInstalled")}
            {activeTab === "installed" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary" />
            )}
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-info-light text-brand-primary rounded-[6px] text-[12px] font-medium">
              {installedPlugins.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("available")}
            className={`px-6 py-3 text-[15px] font-medium transition-colors relative ${
              activeTab === "available"
                ? "text-brand-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("admin.pluginsPage.tabAvailable")}
            {activeTab === "available" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary" />
            )}
            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 bg-muted text-muted-foreground rounded-[6px] text-[12px] font-medium">
              {availablePlugins.length}
            </span>
          </button>
        </div>

        {activeTab === "installed" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installedPlugins.map(renderPluginCard)}
          </div>
        )}

        {activeTab === "available" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlugins.map(renderPluginCard)}
          </div>
        )}

        {activeTab === "installed" && installedPlugins.length === 0 && (
          <div className="text-center py-16 bg-card border-2 border-border rounded-[20px]">
            <Package className="w-16 h-16 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-[20px] font-medium text-foreground mb-2">
              {t("admin.pluginsPage.noPluginsInstalled")}
            </h3>
            <p className="text-[14px] text-muted-foreground mb-4">
              {t("admin.pluginsPage.goToAvailable")}
            </p>
          </div>
        )}
      </div>

      {configModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
          onClick={() => setConfigModal(null)}
        >
          <div
            className="bg-card rounded-[20px] w-full max-w-[600px] max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b-2 border-border flex items-center justify-between">
              <div>
                <h2 className="text-[20px] font-medium text-foreground">
                  {t("admin.pluginsPage.configurePlugin")}
                </h2>
                <p className="text-[13px] text-muted-foreground mt-1">{configModal.plugin.name}</p>
              </div>
              <button
                onClick={() => setConfigModal(null)}
                className="p-2 hover:bg-muted rounded-[8px] transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4">
                {configModal.plugin.configSchema?.map((field) => (
                  <div key={field.key}>
                    <label className="block text-[13px] font-medium text-foreground mb-2">
                      {t(field.labelKey)}
                      {field.required && <span className="text-error ml-1">*</span>}
                    </label>

                    {field.type === "text" && (
                      <input
                        type="text"
                        value={configModal.config[field.key] || ""}
                        onChange={(e) =>
                          setConfigModal({
                            ...configModal,
                            config: { ...configModal.config, [field.key]: e.target.value },
                          })
                        }
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-3 border-2 rounded-[12px] text-[15px] focus:outline-none transition-colors ${
                          configErrors[field.key]
                            ? "border-error focus:border-error"
                            : "border-border focus:border-brand-primary"
                        }`}
                      />
                    )}

                    {field.type === "number" && (
                      <input
                        type="number"
                        value={configModal.config[field.key] || ""}
                        onChange={(e) =>
                          setConfigModal({
                            ...configModal,
                            config: { ...configModal.config, [field.key]: e.target.value },
                          })
                        }
                        min={field.validation?.min}
                        max={field.validation?.max}
                        className={`w-full px-4 py-3 border-2 rounded-[12px] text-[15px] focus:outline-none transition-colors ${
                          configErrors[field.key]
                            ? "border-error focus:border-error"
                            : "border-border focus:border-brand-primary"
                        }`}
                      />
                    )}

                    {field.type === "select" && (
                      <select
                        value={configModal.config[field.key] || ""}
                        onChange={(e) =>
                          setConfigModal({
                            ...configModal,
                            config: { ...configModal.config, [field.key]: e.target.value },
                          })
                        }
                        className={`w-full px-4 py-3 border-2 rounded-[12px] text-[15px] focus:outline-none transition-colors ${
                          configErrors[field.key]
                            ? "border-error focus:border-error"
                            : "border-border focus:border-brand-primary"
                        }`}
                      >
                        <option value="">{t("admin.pluginsPage.selectPlaceholder")}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.type === "boolean" && (
                      <label className="flex items-center gap-3 p-4 border-2 border-border rounded-[12px] cursor-pointer hover:bg-muted transition-colors">
                        <input
                          type="checkbox"
                          checked={configModal.config[field.key] === "true"}
                          onChange={(e) =>
                            setConfigModal({
                              ...configModal,
                              config: {
                                ...configModal.config,
                                [field.key]: e.target.checked ? "true" : "false",
                              },
                            })
                          }
                          className="w-5 h-5 text-brand-primary rounded-[4px]"
                        />
                        <span className="text-[14px] text-muted-foreground">
                          {t(field.labelKey)}
                        </span>
                      </label>
                    )}

                    {configErrors[field.key] && (
                      <p className="text-[12px] text-error mt-1 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        {configErrors[field.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t-2 border-border flex gap-3">
              <button
                onClick={() => setConfigModal(null)}
                className="flex-1 px-4 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted transition-colors text-[14px] font-medium"
              >
                {t("admin.pluginsPage.cancel")}
              </button>
              <button
                onClick={handleSaveConfig}
                className="flex-1 px-4 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
              >
                {t("admin.pluginsPage.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

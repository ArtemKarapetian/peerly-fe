import { Check, Pencil, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { Button } from "@/shared/ui/button.tsx";

import { useAuth, useRole } from "@/entities/user";

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Student":
      return "bg-accent text-accent-foreground";
    case "Teacher":
      return "bg-accent text-accent-foreground";
    case "Admin":
      return "bg-destructive/20 text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getRoleLabelKey = (role: string) => {
  switch (role) {
    case "Student":
      return "roles.student";
    case "Teacher":
      return "roles.teacher";
    case "Admin":
      return "roles.admin";
    default:
      return "";
  }
};

export function UserInfoCard() {
  const { t } = useTranslation();
  const { currentRole } = useRole();
  const { session, refreshMe, updateMyName } = useAuth();
  const name = session?.userName ?? "";
  const email = session?.email ?? "";

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  useEffect(() => {
    if (!editing) setDraft(name);
  }, [name, editing]);

  const trimmed = draft.trim();
  const canSave = trimmed.length > 0 && trimmed !== name && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await updateMyName(trimmed);
      toast.success(t("feature.profile.nameUpdated"));
      setEditing(false);
    } catch (err) {
      toast.error(humanizeApiError(err, t("feature.profile.updateFailed")));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(name);
    setEditing(false);
  };

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
      <h2 className="text-[20px] font-medium text-foreground mb-6">
        {t("feature.profile.userInfo")}
      </h2>

      <div className="flex items-start gap-6 mb-6 pb-6 border-b border-border">
        <div className="w-20 h-20 bg-brand-primary-lighter text-brand-primary rounded-full flex items-center justify-center shrink-0">
          <User className="w-10 h-10 text-accent-foreground" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-[24px] font-medium text-foreground tracking-[-0.5px]">
              {name || email || t("widget.profileDropdown.defaultUser")}
            </h3>
            <span
              className={`inline-flex px-3 py-1 rounded-[8px] text-[13px] font-medium ${getRoleBadgeColor(currentRole)}`}
            >
              {getRoleLabelKey(currentRole) ? t(getRoleLabelKey(currentRole)) : currentRole}
            </span>
          </div>
          <p className="text-[15px] text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            {t("feature.profile.name")}
          </label>
          {editing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
                className="flex-1 px-4 py-3 border-2 border-border rounded-[12px] text-[15px] bg-background focus:border-brand-primary focus:outline-none"
              />
              <Button
                variant="primary"
                size="md"
                onClick={() => void handleSave()}
                disabled={!canSave}
                isLoading={saving}
                aria-label={t("common.save")}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={handleCancel}
                disabled={saving}
                aria-label={t("common.cancel")}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                disabled
                className="flex-1 px-4 py-3 border-2 border-border rounded-[12px] text-[15px] bg-muted text-muted-foreground cursor-not-allowed"
              />
              <Button
                variant="outline"
                size="md"
                onClick={() => setEditing(true)}
                aria-label={t("common.edit")}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            {t("feature.profile.email")}
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] bg-muted text-muted-foreground cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );
}

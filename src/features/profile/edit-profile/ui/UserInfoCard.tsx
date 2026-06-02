import { Check, Pencil, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { Card, Field, TextField } from "@/shared/ui";
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
    <Card className="mb-6">
      <h2 className="text-xl font-medium text-foreground mb-6">{t("feature.profile.userInfo")}</h2>

      <div className="flex items-start gap-6 mb-6 pb-6 border-b border-border">
        <div className="w-20 h-20 bg-brand-primary-lighter text-brand-primary rounded-full flex items-center justify-center shrink-0">
          <User className="w-10 h-10 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
            <h3 className="text-2xl font-medium text-foreground tracking-[-0.5px] [overflow-wrap:anywhere]">
              {name || email || t("widget.profileDropdown.defaultUser")}
            </h3>
            {currentRole && (
              <span
                className={`inline-flex shrink-0 px-3 py-1 rounded-sm text-13 font-medium ${getRoleBadgeColor(currentRole)}`}
              >
                {getRoleLabelKey(currentRole) ? t(getRoleLabelKey(currentRole)) : currentRole}
              </span>
            )}
          </div>
          <p className="text-15 text-muted-foreground break-all">{email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <Field label={t("feature.profile.name")}>
          {editing ? (
            <div className="flex gap-2">
              <TextField
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoFocus
                className="flex-1"
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
              <TextField value={name} disabled className="flex-1" />
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
        </Field>

        <Field label={t("feature.profile.email")}>
          <TextField type="email" value={email} disabled />
        </Field>
      </div>
    </Card>
  );
}

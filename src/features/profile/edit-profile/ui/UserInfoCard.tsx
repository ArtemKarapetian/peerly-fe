import { User, Edit2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useRole } from "@/entities/user";

import { useProfileForm } from "../model/useProfileForm";

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
  const { isEditing, formData, setFormData, showSuccess, handleSave, handleCancel, startEditing } =
    useProfileForm();

  return (
    <>
      {showSuccess && (
        <div className="mb-6 p-4 bg-accent rounded-[12px] flex items-center gap-3">
          <Edit2 className="w-5 h-5 text-accent-foreground" />
          <p className="text-[14px] text-accent-foreground font-medium">
            {t("feature.profile.changesSaved")}
          </p>
        </div>
      )}

      <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-[20px] font-medium text-foreground">
            {t("feature.profile.userInfo")}
          </h2>
          {!isEditing && (
            <button
              onClick={startEditing}
              className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-[12px] hover:bg-muted/50 transition-colors"
            >
              <Edit2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-[14px] text-foreground">{t("common.edit")}</span>
            </button>
          )}
        </div>

        {/* Avatar and Name */}
        <div className="flex items-start gap-6 mb-6 pb-6 border-b border-border">
          <div className="w-20 h-20 bg-brand-primary-lighter text-brand-primary rounded-full flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-[24px] font-medium text-foreground tracking-[-0.5px]">
                {formData.firstName} {formData.lastName}
              </h3>
              <span
                className={`inline-flex px-3 py-1 rounded-[8px] text-[13px] font-medium ${getRoleBadgeColor(currentRole)}`}
              >
                {getRoleLabelKey(currentRole) ? t(getRoleLabelKey(currentRole)) : currentRole}
              </span>
            </div>
            <p className="text-[15px] text-muted-foreground">@{formData.username}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("feature.profile.firstName")}
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground transition-colors ${
                  isEditing
                    ? "bg-card focus:border-accent focus:outline-none"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("feature.profile.lastName")}
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground transition-colors ${
                  isEditing
                    ? "bg-card focus:border-accent focus:outline-none"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("feature.profile.username")}
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground transition-colors ${
                isEditing
                  ? "bg-card focus:border-accent focus:outline-none"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[15px] font-medium"
            >
              {t("feature.profile.saveChanges")}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium"
            >
              {t("common.cancel")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

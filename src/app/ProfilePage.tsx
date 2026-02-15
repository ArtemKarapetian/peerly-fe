import { useState } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { User, Edit2, LogOut, AlertTriangle, MessageCircle } from "lucide-react";
import { useAuth } from "@/app/providers/auth.tsx";
import { useRole } from "@/app/providers/role.tsx";
import { useFeatureFlags } from "@/app/providers/feature-flags.tsx";

/**
 * ProfilePage - User Profile Information
 *
 * Shows user info card with avatar, name, username, role badge and edit functionality
 * Includes Danger Zone with Log out button
 */

export default function ProfilePage() {
  const { logout } = useAuth();
  const { currentRole } = useRole();
  const { flags } = useFeatureFlags();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Иван",
    lastName: "Петров",
    username: "ivan.petrov",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogout = () => {
    if (confirm("Вы уверены, что хотите выйти из системы?")) {
      logout();
      window.location.hash = "/login";
    }
  };

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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "Student":
        return "Студент";
      case "Teacher":
        return "Преподаватель";
      case "Admin":
        return "Администратор";
      default:
        return role;
    }
  };

  return (
    <AppShell title="Профиль">
      <Breadcrumbs items={[{ label: "Профиль" }]} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">Профиль</h1>
        <p className="text-[16px] text-muted-foreground mb-8">Управление личной информацией</p>

        {showSuccess && (
          <div className="mb-6 p-4 bg-accent rounded-[12px] flex items-center gap-3">
            <Edit2 className="w-5 h-5 text-accent-foreground" />
            <p className="text-[14px] text-accent-foreground font-medium">Изменения сохранены!</p>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-[20px] font-medium text-foreground">Информация о пользователе</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-[12px] hover:bg-muted/50 transition-colors"
              >
                <Edit2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-[14px] text-foreground">Редактировать</span>
              </button>
            )}
          </div>

          {/* Avatar and Name */}
          <div className="flex items-start gap-6 mb-6 pb-6 border-b border-border">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center shrink-0">
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
                  {getRoleLabel(currentRole)}
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
                  Имя
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
                  Фамилия
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
                Имя пользователя
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
                Сохранить изменения
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border-2 border-border text-foreground rounded-[12px] hover:bg-muted/50 transition-colors text-[15px] font-medium"
              >
                Отмена
              </button>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-card border-2 border-destructive rounded-[20px] p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-[20px] font-medium text-destructive mb-2">Опасная зона</h2>
              <p className="text-[14px] text-muted-foreground mb-4">
                Выйти из системы или удалить аккаунт
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-[12px] hover:bg-muted/80 transition-colors text-[14px] font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из системы
                </button>
                {/* Delete Account - Hidden behind feature flag (OFF by default) */}
                {flags.deleteAccount && (
                  <button
                    onClick={() => {
                      window.location.hash = "/offboarding/delete-account";
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-[12px] hover:bg-destructive/80 transition-colors text-[14px] font-medium"
                  >
                    Удалить аккаунт
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Support Chat Link - Only visible when feature flag is enabled */}
        {flags.supportChat && (
          <div className="bg-card border-2 border-border rounded-[20px] p-6">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-accent-foreground flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-[20px] font-medium text-foreground mb-2">Поддержка</h2>
                <p className="text-[14px] text-muted-foreground mb-4">
                  Нужна помощь? Свяжитесь с нашей службой поддержки
                </p>
                <a
                  href="#/support/chat"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-[12px] hover:bg-accent/80 transition-colors text-[14px] font-medium"
                >
                  <MessageCircle className="w-4 h-4" />
                  Чат с поддержкой
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

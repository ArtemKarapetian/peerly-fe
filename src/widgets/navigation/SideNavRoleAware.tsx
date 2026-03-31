import {
  Book,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileCheck,
  MessageSquare,
  BookOpen,
  Bell,
  Users,
  Layers,
  BarChart3,
  Settings,
  Database,
  Plug,
  Zap,
  Shield,
  Megaphone,
  Clock,
  Shuffle,
  Scale,
  Archive,
  AlertTriangle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { isFlagEnabled, type FeatureFlags } from "@/shared/lib/feature-flags";

import { useRole } from "@/entities/user";

import { RoleSwitcherPopover } from "./RoleSwitcherPopover.tsx";

type SideNavVariant =
  | "desktop-expanded"
  | "desktop-collapsed"
  | "tablet-collapsed"
  | "tablet-expanded"
  | "mobile-drawer";

interface SideNavProps {
  variant: SideNavVariant;
  isOpen?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  hash: string;
  flag?: keyof FeatureFlags;
}

/* Shared focus ring for all interactive sidebar elements */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--brand-primary]/25";

export function SideNav({ variant, isOpen = false, onClose, onToggleCollapse }: SideNavProps) {
  const { t } = useTranslation();
  const { currentRole } = useRole();
  const isCollapsed = variant === "desktop-collapsed" || variant === "tablet-collapsed";
  const isMobileDrawer = variant === "mobile-drawer";
  const showToggleButton =
    variant === "desktop-expanded" ||
    variant === "desktop-collapsed" ||
    variant === "tablet-collapsed" ||
    variant === "tablet-expanded";

  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (hash: string, navItems: NavItem[]) => {
    if (currentPath === hash) return true;
    // Don't match parent path if a more specific sibling route matches
    // e.g. /reviews should NOT match when on /reviews/received
    const hasMoreSpecificMatch = navItems.some(
      (item) =>
        item.hash !== hash && item.hash.startsWith(hash + "/") && currentPath.startsWith(item.hash),
    );
    if (hasMoreSpecificMatch) return false;
    return currentPath.startsWith(hash + "/");
  };

  const getNavItems = (): NavItem[] => {
    switch (currentRole) {
      case "Student":
        return [
          { icon: LayoutDashboard, label: t("nav.home"), hash: "/dashboard" },
          { icon: Book, label: t("nav.courses"), hash: "/courses" },
          { icon: FileCheck, label: t("nav.reviews"), hash: "/reviews" },
          { icon: MessageSquare, label: t("nav.receivedReviews"), hash: "/reviews/received" },
          { icon: BookOpen, label: t("nav.gradebook"), hash: "/gradebook" },
          { icon: Bell, label: t("nav.notifications"), hash: "/inbox" },
          { icon: AlertTriangle, label: t("nav.appeals"), hash: "/appeals" },
        ];
      case "Teacher":
        return [
          { icon: Book, label: t("nav.courses"), hash: "/teacher/courses" },
          { icon: FileCheck, label: t("nav.assignments"), hash: "/teacher/assignments" },
          { icon: Layers, label: t("nav.rubrics"), hash: "/teacher/rubrics" },
          { icon: Shuffle, label: t("nav.distribution"), hash: "/teacher/distribution" },
          { icon: Archive, label: t("nav.studentSubmissions"), hash: "/teacher/submissions" },
          { icon: Shield, label: t("nav.moderation"), hash: "/teacher/moderation" },
          { icon: Scale, label: t("nav.appeals"), hash: "/teacher/appeals" },
          {
            icon: Megaphone,
            label: t("nav.announcements"),
            hash: "/teacher/announcements",
            flag: "enableAnnouncements",
          },
          {
            icon: Clock,
            label: t("nav.extensions"),
            hash: "/teacher/extensions",
            flag: "enableExtensions",
          },
          {
            icon: BarChart3,
            label: t("nav.analytics"),
            hash: "/teacher/analytics",
            flag: "enableAnalytics",
          },
          {
            icon: Zap,
            label: t("nav.automation"),
            hash: "/teacher/automation",
            flag: "enableAutomation",
          },
        ];
      case "Admin":
        return [
          { icon: LayoutDashboard, label: t("nav.overview"), hash: "/admin/overview" },
          { icon: Book, label: t("nav.allCourses"), hash: "/admin/courses" },
          { icon: Users, label: t("nav.users"), hash: "/admin/users" },
          { icon: Database, label: t("nav.organizations"), hash: "/admin/orgs" },
          {
            icon: Plug,
            label: t("nav.pluginCatalog"),
            hash: "/admin/plugins",
            flag: "enablePlugins",
          },
          {
            icon: Zap,
            label: t("nav.integrations"),
            hash: "/admin/integrations",
            flag: "enableIntegrations",
          },
          { icon: Settings, label: t("nav.settings"), hash: "/admin/settings" },
        ];
    }
  };

  const navItems = getNavItems().filter((item) => !item.flag || isFlagEnabled(item.flag));

  const navItemClass = (active: boolean) =>
    active
      ? "bg-brand-primary-light text-[--brand-primary] font-medium hover:bg-[--brand-primary-light]"
      : "text-[--text-secondary] hover:bg-surface-hover hover:text-[--text-primary]";

  const footerItemClass =
    "text-[--text-secondary] hover:bg-surface-hover hover:text-[--text-primary]";

  // ── Mobile Drawer ──────────────────────────────────────────────────────
  if (isMobileDrawer) {
    return (
      <div
        className={`fixed inset-y-0 left-0 z-50 bg-sidebar transform transition-transform duration-300 w-[272px] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ boxShadow: "2px 0 8px rgba(0,0,0,0.08)" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-[56px] px-4 border-b border-[--surface-border] shrink-0">
            <Link
              to="/dashboard"
              className="text-[16px] font-semibold text-[--text-primary] tracking-[-0.4px] hover:opacity-70 transition-opacity"
            >
              Peerly
            </Link>
            <button
              onClick={onClose}
              className={`w-6 h-6 flex items-center justify-center rounded-[5px] text-[--text-tertiary] hover:bg-surface-hover hover:text-[--text-primary] transition-colors duration-150 ${focusRing}`}
              aria-label={t("nav.closeMenu")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-2 px-2.5 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.hash, navItems);
              return (
                <Link
                  key={item.hash}
                  to={item.hash}
                  onClick={() => onClose?.()}
                  className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-[6px] transition-colors duration-150 ${focusRing} ${navItemClass(active)}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-[14px]">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher */}
          <div className="border-t border-[--surface-border] pt-2 shrink-0">
            <RoleSwitcherPopover collapsed={false} />
          </div>

          {/* Profile & Settings */}
          <div className="border-t border-[--surface-border] shrink-0 px-2.5 py-2 space-y-0.5 pb-3">
            <Link
              to="/profile"
              onClick={() => onClose?.()}
              className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-[6px] transition-colors duration-150 ${focusRing} ${footerItemClass}`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span className="text-[14px]">{t("nav.profile")}</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => onClose?.()}
              className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-[6px] transition-colors duration-150 ${focusRing} ${footerItemClass}`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="text-[14px]">{t("nav.settings")}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop / Tablet Sidebar ───────────────────────────────────────────
  return (
    <div
      className={`bg-sidebar border-r border-sidebar-border h-screen flex flex-col shrink-0 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-[56px] px-4 border-b border-[--surface-border] shrink-0">
        {!isCollapsed && (
          <Link
            to="/dashboard"
            className="text-[16px] font-semibold text-[--text-primary] tracking-[-0.4px] hover:opacity-70 transition-opacity"
          >
            Peerly
          </Link>
        )}
        {showToggleButton && (
          <button
            onClick={onToggleCollapse}
            className={`w-6 h-6 flex items-center justify-center rounded-[5px] text-[--text-tertiary] hover:bg-surface-hover hover:text-[--text-primary] transition-colors duration-150 ${focusRing} ${isCollapsed ? "mx-auto" : ""}`}
            aria-label={isCollapsed ? t("nav.expand") : t("nav.collapse")}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2.5 overflow-y-auto space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.hash, navItems);
          return (
            <Link
              key={item.hash}
              to={item.hash}
              className={`flex items-center rounded-[6px] transition-colors duration-150 py-[7px] ${focusRing} ${
                isCollapsed ? "justify-center px-2" : "gap-2.5 px-2.5"
              } ${navItemClass(active)}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="text-[14px]">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0">
        {/* Role Switcher */}
        <div className="border-t border-[--surface-border] pt-2">
          <RoleSwitcherPopover collapsed={isCollapsed} />
        </div>

        {/* Profile & Settings */}
        <div className="border-t border-[--surface-border] px-2.5 py-2 space-y-0.5 pb-3">
          <Link
            to="/profile"
            className={`flex items-center rounded-[6px] transition-colors duration-150 py-[7px] ${focusRing} ${footerItemClass} ${
              isCollapsed ? "justify-center px-2" : "gap-2.5 px-2.5"
            }`}
            title={isCollapsed ? t("nav.profile") : undefined}
          >
            <User className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="text-[14px]">{t("nav.profile")}</span>}
          </Link>
          <Link
            to="/settings"
            className={`flex items-center rounded-[6px] transition-colors duration-150 py-[7px] ${focusRing} ${footerItemClass} ${
              isCollapsed ? "justify-center px-2" : "gap-2.5 px-2.5"
            }`}
            title={isCollapsed ? t("nav.settings") : undefined}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="text-[14px]">{t("nav.settings")}</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}

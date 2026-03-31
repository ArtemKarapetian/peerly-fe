import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

/**
 * LandingPage - Яркая и красочная главная страница Peerly
 * С цветными фонами, иллюстрациями и акцентными секциями
 */

// Импорт иллюстраций из Figma
import imgHero from "@/shared/assets/1316612187f4274840308d8544bb1f10cdcc9818.png";
import imgTeacher from "@/shared/assets/7177166acba64f35340faa0b6f56005880826629.png";
import imgSettings from "@/shared/assets/8a7431ce52feae07a5df11170b187a4a3d8ac9c2.png";
import imgPlatform from "@/shared/assets/eb9aaf49f5066472e938555cd5aa00e6418c7a26.png";

import { useAuth } from "@/entities/user";

import { PublicLayout } from "@/widgets/public-layout";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Скролл наверх при загрузке страницы
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PublicLayout showTopBar={false} showLoginButton={false} showFooter={false}>
      {/* Custom Top Bar for Landing */}
      <div className="w-full bg-background border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-semibold text-primary hover:opacity-80 transition-opacity"
          >
            Peerly
          </Link>

          {/* Top Right Links */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => void navigate("/dashboard")}
                className="inline-flex items-center justify-center px-5 py-2 bg-[--brand-primary] hover:bg-[--brand-primary-hover] text-primary-foreground text-sm font-medium rounded-[var(--radius-md)] transition-all"
              >
                {t("page.landing.openDashboard")}
              </button>
            ) : (
              <button
                onClick={() => void navigate("/register")}
                className="inline-flex items-center justify-center px-5 py-2 bg-[--brand-primary] hover:bg-[--brand-primary-hover] text-primary-foreground text-sm font-medium rounded-[var(--radius-md)] transition-all"
              >
                {t("page.landing.getStarted")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-brand-primary-lighter rounded-bl-[20px] rounded-br-[20px]">
        <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12 py-16 tablet:py-20 desktop:py-24">
          <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-16 items-center">
            {/* Text Content - Left */}
            <div className="space-y-6 tablet:space-y-8">
              {/* Heading */}
              <h1 className="text-5xl tablet:text-6xl desktop:text-7xl font-semibold text-foreground leading-[1.1]">
                {t("page.landing.heroTitle")}
              </h1>

              {/* Description */}
              <p className="text-base tablet:text-lg text-foreground/80">
                {t("page.landing.heroDescription")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col tablet:flex-row items-start tablet:items-center gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => void navigate("/dashboard")}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground font-medium rounded-[var(--radius-md)] shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                  >
                    {t("page.landing.openDashboard")}
                  </button>
                ) : (
                  <button
                    onClick={() => void navigate("/register")}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground font-medium rounded-[var(--radius-md)] shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2"
                  >
                    {t("page.landing.getStarted")}
                  </button>
                )}
              </div>
            </div>

            {/* Hero Illustration - Right */}
            <div className="flex justify-center desktop:justify-end">
              <div className="w-full max-w-[400px] desktop:max-w-[450px]">
                <img src={imgHero} alt="Peer-review illustration" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="w-full bg-muted py-16 tablet:py-20 desktop:py-24">
        <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12">
          <div className="text-center space-y-6 max-w-[860px] mx-auto">
            <h2 className="text-sm font-medium text-foreground/60 uppercase tracking-wide">
              {t("page.landing.introLabel")}
            </h2>
            <h3 className="text-4xl tablet:text-5xl desktop:text-6xl font-semibold text-foreground leading-[1.1]">
              {t("page.landing.introTitle")}
            </h3>
            <p className="text-base text-foreground/70">{t("page.landing.introSubtitle")}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-muted pb-16 tablet:pb-20 desktop:pb-24">
        <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12 space-y-8">
          {/* Feature 1 - Самостоятельная платформа */}
          <div className="bg-brand-primary-lighter rounded-[20px] p-6 tablet:p-10 desktop:p-12">
            <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 items-center">
              <div className="order-2 desktop:order-1 flex justify-center">
                <img
                  src={imgPlatform}
                  alt={t("page.landing.feature1Title")}
                  className="w-full max-w-[320px] tablet:max-w-[400px] h-auto"
                />
              </div>
              <div className="order-1 desktop:order-2 space-y-4 tablet:space-y-6">
                <h3 className="text-3xl tablet:text-4xl font-semibold text-foreground leading-[1.1]">
                  {t("page.landing.feature1Title")}
                </h3>
                <p className="text-base text-foreground/80">{t("page.landing.feature1Desc")}</p>
              </div>
            </div>
          </div>

          {/* Feature 2 - Снижение нагрузки */}
          <div className="bg-brand-primary-lighter rounded-[20px] p-6 tablet:p-10 desktop:p-12">
            <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 items-center">
              <div className="space-y-4 tablet:space-y-6">
                <h3 className="text-3xl tablet:text-4xl font-semibold text-foreground leading-[1.1]">
                  {t("page.landing.feature2Title")}
                </h3>
                <p className="text-base text-foreground/80">{t("page.landing.feature2Desc")}</p>
              </div>
              <div className="flex justify-center">
                <img
                  src={imgTeacher}
                  alt={t("page.landing.feature2Title")}
                  className="w-full max-w-[360px] tablet:max-w-[440px] h-auto"
                />
              </div>
            </div>
          </div>

          {/* Feature 3 - Гибкая настройка */}
          <div className="bg-brand-primary-lighter rounded-[20px] p-6 tablet:p-10 desktop:p-12">
            <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 items-center">
              <div className="order-2 desktop:order-1 flex justify-center">
                <img
                  src={imgSettings}
                  alt={t("page.landing.feature3Title")}
                  className="w-full max-w-[280px] tablet:max-w-[360px] h-auto"
                />
              </div>
              <div className="order-1 desktop:order-2 space-y-4 tablet:space-y-6">
                <h3 className="text-3xl tablet:text-4xl font-semibold text-foreground leading-[1.1]">
                  {t("page.landing.feature3Title")}
                </h3>
                <p className="text-base text-foreground/80">{t("page.landing.feature3Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="w-full bg-card py-16 tablet:py-20 desktop:py-24">
        <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12">
          {/* Header */}
          <div className="grid grid-cols-1 desktop:grid-cols-2 gap-8 desktop:gap-12 mb-12 tablet:mb-16 desktop:mb-20">
            <h2 className="text-4xl tablet:text-5xl desktop:text-6xl font-semibold text-foreground leading-[1.1]">
              {t("page.landing.rolesTitle")}
            </h2>
            <p className="text-base text-foreground/70 desktop:pt-4">
              {t("page.landing.rolesDesc")}
            </p>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-8">
            {/* Students */}
            <div className="border-l-2 border-foreground pl-6 tablet:pl-8 space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl tablet:text-3xl font-semibold text-foreground">
                  {t("page.landing.roleStudentsTitle")}
                </h3>
                <p className="text-base font-medium text-foreground/80">
                  {t("page.landing.roleStudentsSubtitle")}
                </p>
              </div>
              <p className="text-base text-foreground/70">{t("page.landing.roleStudentsDesc")}</p>
            </div>

            {/* Teachers */}
            <div className="border-l-2 border-foreground pl-6 tablet:pl-8 space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl tablet:text-3xl font-semibold text-foreground">
                  {t("page.landing.roleTeachersTitle")}
                </h3>
                <p className="text-base font-medium text-foreground/80">
                  {t("page.landing.roleTeachersSubtitle")}
                </p>
              </div>
              <p className="text-base text-foreground/70">{t("page.landing.roleTeachersDesc")}</p>
            </div>

            {/* Admin */}
            <div className="border-l-2 border-foreground pl-6 tablet:pl-8 space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl tablet:text-3xl font-semibold text-foreground">
                  {t("page.landing.roleAdminTitle")}
                </h3>
                <p className="text-base font-medium text-foreground/80">
                  {t("page.landing.roleAdminSubtitle")}
                </p>
              </div>
              <p className="text-base text-foreground/70">{t("page.landing.roleAdminDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="w-full bg-muted py-16 tablet:py-20 desktop:py-28">
        <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12">
          <div className="text-center space-y-8 tablet:space-y-10">
            <h2 className="text-4xl tablet:text-5xl desktop:text-6xl font-semibold text-foreground leading-[1.1] max-w-[900px] mx-auto">
              {t("page.landing.ctaTitle")}
            </h2>
            <div className="flex flex-col tablet:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={() => void navigate("/dashboard")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground font-medium rounded-[var(--radius-md)] shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 text-base h-11"
                >
                  {t("page.landing.openDashboard")}
                </button>
              ) : (
                <button
                  onClick={() => void navigate("/register")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground font-medium rounded-[var(--radius-md)] shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 text-base h-11"
                >
                  {t("page.landing.getStarted")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border bg-background py-8">
        <div className="max-w-[1200px] mx-auto px-6 tablet:px-8 desktop:px-12">
          <div className="flex flex-col tablet:flex-row justify-between items-center gap-4">
            {/* Links */}
            <nav className="flex items-center gap-6">
              <Link
                to="/help"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("page.landing.footerHelp")}
              </Link>
              <Link
                to="/status"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("page.landing.footerStatus")}
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Peerly</p>
          </div>
        </div>
      </footer>
    </PublicLayout>
  );
}

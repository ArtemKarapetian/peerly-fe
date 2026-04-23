import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAuth } from "@/entities/user";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  DeleteWarningCard,
  ConsequencesCard,
  ConfirmationForm,
  DeleteSuccessScreen,
} from "@/widgets/delete-account";

export default function DeleteAccountPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const CRUMBS = getCrumbs();
  const { logout } = useAuth();
  const [step, setStep] = useState<"confirm" | "success">("confirm");

  const handleDelete = () => {
    const keysToKeep = ["theme"];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    setStep("success");
  };

  const handleGoToLanding = () => {
    void logout();
    void navigate("/");
  };

  if (step === "success") {
    return <DeleteSuccessScreen onGoToLanding={handleGoToLanding} />;
  }

  return (
    <AppShell title={t("widget.deleteAccount.pageTitle")}>
      <div className="max-w-[800px]">
        <Breadcrumbs items={[CRUMBS.settings, { label: t("widget.deleteAccount.pageTitle") }]} />

        <div className="mt-6 space-y-6">
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 text-sm text-accent-blue hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("widget.deleteAccount.backToSettings")}
          </Link>

          <DeleteWarningCard />
          <ConsequencesCard />
          <ConfirmationForm onDelete={handleDelete} />
        </div>
      </div>
    </AppShell>
  );
}

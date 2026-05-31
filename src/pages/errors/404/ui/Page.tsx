import { SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { useAuth } from "@/entities/user";

import { ErrorPage } from "../../ui/ErrorPage";

export default function Error404Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const actions: [{ label: string; onClick: () => void }, { label: string; onClick: () => void }] =
    isAuthenticated
      ? [
          { label: t("errors.toDashboard"), onClick: () => void navigate(ROUTES.dashboard) },
          { label: t("errors.toCourses"), onClick: () => void navigate(ROUTES.courses) },
        ]
      : [
          { label: t("auth.signIn"), onClick: () => void navigate(ROUTES.login) },
          { label: t("errors.toHome"), onClick: () => void navigate(ROUTES.landing) },
        ];
  return (
    <ErrorPage
      code="404"
      Icon={SearchX}
      tone="muted"
      title={t("errors.notFound")}
      description={t("errors.notFoundDesc")}
      actions={actions}
    />
  );
}

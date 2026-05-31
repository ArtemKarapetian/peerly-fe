import { ServerCrash } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { useAuth } from "@/entities/user";

import { ErrorPage } from "../../ui/ErrorPage";

export default function Error500Page() {
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
      code="500"
      Icon={ServerCrash}
      title={t("errors.serverError")}
      description={t("errors.serverErrorDesc")}
      actions={actions}
    />
  );
}

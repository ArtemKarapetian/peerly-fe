import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { ErrorPage } from "../../ui/ErrorPage";

export default function Error401Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <ErrorPage
      code="401"
      Icon={AlertCircle}
      title={t("errors.authRequired")}
      description={t("errors.authRequiredDesc")}
      actions={[
        { label: t("auth.signIn"), onClick: () => void navigate(ROUTES.login) },
        { label: t("errors.toHome"), onClick: () => void navigate(ROUTES.landing) },
      ]}
    />
  );
}

import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";

import { ErrorPage } from "../../ui/ErrorPage";

export default function Error403Page() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <ErrorPage
      code="403"
      Icon={ShieldAlert}
      title={t("errors.accessDenied")}
      description={t("errors.accessDeniedDesc")}
      actions={[
        { label: t("errors.toDashboard"), onClick: () => void navigate(ROUTES.dashboard) },
        { label: t("errors.toCourses"), onClick: () => void navigate(ROUTES.courses) },
      ]}
    />
  );
}

import { CheckCircle, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  backToTaskHref: string;
  backToCoursesHref: string;
};

export function ExtensionRequestSuccess({ backToTaskHref, backToCoursesHref }: Props) {
  const { t } = useTranslation();

  return (
    <div className="max-w-[600px] mx-auto">
      <div className="mt-12 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {t("feature.extension.success.title")}
          </h1>
          <p className="text-muted-foreground">{t("feature.extension.success.description")}</p>
        </div>

        <div className="bg-info-light border border-info rounded-[12px] p-4 text-left">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground/80">
              <strong>{t("feature.extension.success.whatNext")}</strong>
              <p className="mt-1 text-muted-foreground">
                {t("feature.extension.success.whatNextDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center pt-4">
          <a
            href={backToTaskHref}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            {t("feature.extension.success.backToTask")}
          </a>
          <a
            href={backToCoursesHref}
            className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            {t("feature.extension.success.toCourses")}
          </a>
        </div>
      </div>
    </div>
  );
}

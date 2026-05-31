import { useTranslation } from "react-i18next";

interface TextSubsectionProps {
  titleKey: string;
  textKey: string;
  bulletKeys?: readonly string[];
}

export function TextSubsection({ titleKey, textKey, bulletKeys }: TextSubsectionProps) {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="text-xl font-medium text-foreground mb-3">{t(titleKey)}</h3>
      <p className="text-15 text-muted-foreground leading-relaxed">{t(textKey)}</p>
      {bulletKeys && bulletKeys.length > 0 && (
        <ul className="list-disc list-inside space-y-2 text-15 text-muted-foreground ml-4 mt-3">
          {bulletKeys.map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

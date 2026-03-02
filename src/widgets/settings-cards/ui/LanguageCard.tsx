import { Globe } from "lucide-react";
import { useState } from "react";

type Language = "ru" | "en";

export function LanguageCard() {
  const [language, setLanguage] = useState<Language>("ru");

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
          <Globe className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-[20px] font-medium text-foreground">Язык</h2>
      </div>

      <p className="text-[14px] text-muted-foreground mb-4">Выберите язык интерфейса</p>

      <div className="inline-flex bg-muted rounded-[12px] p-1">
        <button
          onClick={() => setLanguage("ru")}
          className={`px-6 py-2 rounded-[8px] text-[14px] font-medium transition-all ${
            language === "ru"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🇷🇺 Русский
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`px-6 py-2 rounded-[8px] text-[14px] font-medium transition-all ${
            language === "en"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          🇬🇧 English
        </button>
      </div>

      <p className="text-[13px] text-muted-foreground mt-3 italic">
        * Переключение языка влияет только на интерфейс
      </p>
    </div>
  );
}

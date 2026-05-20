import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import * as zxcvbnCommon from "@zxcvbn-ts/language-common";
import * as zxcvbnEn from "@zxcvbn-ts/language-en";

import ruTranslations from "./translations.ru";

type Lang = "ru" | "en";

let configuredLang: Lang | null = null;

function ensureConfigured(lang: Lang) {
  if (configuredLang === lang) return;
  zxcvbnOptions.setOptions({
    dictionary: {
      ...zxcvbnCommon.dictionary,
      ...zxcvbnEn.dictionary,
    },
    graphs: zxcvbnCommon.adjacencyGraphs,
    translations: lang === "ru" ? ruTranslations : zxcvbnEn.translations,
  });
  configuredLang = lang;
}

export const MIN_PASSWORD_SCORE = 3;

export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrength {
  score: PasswordScore;
  isStrongEnough: boolean;
  warning: string;
  suggestions: string[];
}

export function checkPasswordStrength(
  password: string,
  userInputs?: string[],
  language: Lang = "ru",
): PasswordStrength {
  ensureConfigured(language);
  const result = zxcvbn(password, userInputs);
  const score = result.score as PasswordScore;
  return {
    score,
    isStrongEnough: score >= MIN_PASSWORD_SCORE,
    warning: result.feedback.warning ?? "",
    suggestions: result.feedback.suggestions ?? [],
  };
}

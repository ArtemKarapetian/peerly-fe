import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { STORAGE_KEYS } from "@/shared/config/constants";

import en from "./locales/en.json";
import ru from "./locales/ru.json";

const savedLang = localStorage.getItem(STORAGE_KEYS.language) || "ru";

void i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

document.documentElement.lang = savedLang;

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(STORAGE_KEYS.language, lng);
  document.documentElement.lang = lng;
});

export default i18n;

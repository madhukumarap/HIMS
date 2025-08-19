// i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Translation from "./DoctorAppointmentMScreen.json";

const resources = {
  en: {
    translation: Translation["en"],
  },
  fr: {
    translation: Translation["fr"],
  },
};

const storedLanguage = localStorage.getItem("SelectedLanguage");
const defaultLanguage = storedLanguage || "en"; // Fallback to 'en' if no language is stored

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;

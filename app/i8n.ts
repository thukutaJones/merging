import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../public/locales/en/common.json";
import chichewa from "../public/locales/ny/common.json";
import tumbuka from "../public/locales/tk/common.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ch: { translation: chichewa },
      tb: { translation: tumbuka },
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;

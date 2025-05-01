import i18n, { InitOptions, ResourceLanguage } from "i18next";
import { initReactI18next } from "react-i18next";
import English from "./Json/translation/english.json";
import ChineseSimplified from "./Json/translation/chines-simplified.json";
import ChineseTraditional from "./Json/translation/chines-traditional.json";
import German from "./Json/translation/german.json";
import Italian from "./Json/translation/italian.json";
import Japanese from "./Json/translation/japanese.json";
import Korean from "./Json/translation/korean.json";
import { LanguagePreferences } from "./constants";
 
 

 
interface IExtendedReactOptions {
  useSuspense?: boolean;
  wait?: boolean;
}

interface ITranslationResources extends ResourceLanguage {
  translation: Record<string, string | Record<string, string>>;
}

interface I18nConfig extends InitOptions {
  resources: Record<string, ITranslationResources>;
}

const i18nConfig: I18nConfig = {
  resources: {
    [LanguagePreferences.EN]: { translation: English },
    [LanguagePreferences.CNSM]: { translation: ChineseSimplified },
    [LanguagePreferences.CNTR]: { translation: ChineseTraditional },
    [LanguagePreferences.DE]: { translation: German },
    [LanguagePreferences.IT]: { translation: Italian },
    [LanguagePreferences.JA]: { translation: Japanese },
    [LanguagePreferences.KO]: { translation: Korean },
  },
  lng: LanguagePreferences.EN,
  fallbackLng: LanguagePreferences.EN,
  keySeparator: ".",
  interpolation: {
    escapeValue: false,
  },

  react: {
    // wait: true,
    useSuspense: true, // or true depending on your preference
  } as IExtendedReactOptions,
};

i18n.use(initReactI18next).init(i18nConfig);

export default i18n;

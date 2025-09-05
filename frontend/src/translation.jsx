import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("SelectedLanguage") || "en");

  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("SelectedLanguage", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

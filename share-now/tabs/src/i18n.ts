// <copyright file="i18n.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-xhr-backend';

const locale = "en-US";

i18n
  .use(Backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    lng: locale,
    fallbackLng: locale,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });
export default i18n;

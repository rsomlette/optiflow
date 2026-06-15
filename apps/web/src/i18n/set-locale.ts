"use server";

import { cookies } from "next/headers";
import { type Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./locale";

export async function setUserLocale(locale: string) {
  const validated = SUPPORTED_LOCALES.includes(locale as Locale)
    ? locale
    : DEFAULT_LOCALE;
  const cookieStore = await cookies();
  cookieStore.set("locale", validated, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

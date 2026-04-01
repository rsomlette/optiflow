"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { setUserLocale } from "@/i18n/set-locale";
import { Button } from "@/components/ui/button";

export function LocaleSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  function toggleLocale() {
    const next = locale === "en" ? "fr" : "en";
    startTransition(() => {
      setUserLocale(next);
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      disabled={isPending}
    >
      {locale === "en" ? "FR" : "EN"}
    </Button>
  );
}

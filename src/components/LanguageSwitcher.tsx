"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <select
      defaultValue={locale}
      onChange={onSelectChange}
      disabled={isPending}
      className="bg-transparent text-sm font-medium text-foreground cursor-pointer focus:outline-none appearance-none pr-2 py-1 hover:opacity-70 transition-opacity disabled:opacity-50"
      aria-label="Select language"
    >
      <option value="en">en</option>
      <option value="de">de</option>
    </select>
  );
}
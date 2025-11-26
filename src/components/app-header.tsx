'use client';

import { KioskConnectLogo } from '@/components/icons';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useI18n } from '@/lib/i18n';

export function AppHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <KioskConnectLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary font-headline">
            {t('app.appName')}
          </span>
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

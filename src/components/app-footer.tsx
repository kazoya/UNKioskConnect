'use client';

import { useI18n } from '@/lib/i18n';

export function AppFooter() {
  const { t, dir } = useI18n();

  return (
    <footer className="mt-auto border-t bg-card">
      <div className={`container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8`}>
        <div className={`text-center ${dir === 'rtl' ? 'sm:text-right' : 'sm:text-left'}`}>
          <p className="text-sm font-semibold text-primary">
            {t('app.footer.organization')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('app.footer.copyright')} &copy; {new Date().getFullYear()}
          </p>
        </div>
        <div className={`text-center text-sm text-muted-foreground ${dir === 'rtl' ? 'sm:text-left' : 'sm:text-right'}`}>
          {t('app.footer.support')}
        </div>
      </div>
    </footer>
  );
}

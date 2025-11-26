'use client';

import { AuthForm } from '@/components/auth-form';
import { KioskConnectLogo } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useI18n } from '@/lib/i18n';

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <KioskConnectLogo className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-headline font-bold text-primary">
              {t('app.appName')}
            </h1>
          </div>
          <CardTitle className="text-2xl">{t('common.welcome')}</CardTitle>
          <CardDescription>
            {t('auth.welcomeMessage')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 pt-4">
          <AuthForm />
        </CardContent>
      </Card>
    </div>
  );
}

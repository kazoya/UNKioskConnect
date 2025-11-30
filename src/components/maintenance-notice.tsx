'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Wrench, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function MaintenanceNotice() {
  const { t, dir } = useI18n();

  return (
    <Alert className="mb-6 border-primary/50 bg-primary/5">
      <Info className="h-5 w-5 text-primary" />
      <AlertTitle className="text-lg font-semibold text-primary mb-2">
        {t('maintenance.title')}
      </AlertTitle>
      <AlertDescription className="space-y-3">
        <p className="text-base leading-relaxed">
          {t('maintenance.message')}
        </p>
        
        <Card className="mt-4 border-primary/20 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              {t('maintenance.statusTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>{t('maintenance.status1')}</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>{t('maintenance.status2')}</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>{t('maintenance.status3')}</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p>{t('maintenance.status4')}</p>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground mt-4 pt-3 border-t border-primary/10">
          {t('maintenance.reassurance')}
        </p>
      </AlertDescription>
    </Alert>
  );
}


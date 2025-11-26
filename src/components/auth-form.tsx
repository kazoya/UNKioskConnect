'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/firebase/auth/mutations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useI18n } from '@/lib/i18n';

const createFormSchema = (t: (key: string) => string) => z.object({
  email: z.string().email({ message: t('auth.emailRequired') }),
  password: z
    .string()
    .min(6, { message: t('auth.passwordRequired') }),
  displayName: z.string().optional(),
});

export function AuthForm() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('login');
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const formSchema = createFormSchema(t);
  type AuthFormValues = z.infer<typeof formSchema>;

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      displayName: '',
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);
    setError(null);

    if (!auth || !firestore) {
      setError(t('auth.firebaseNotInitialized'));
      setIsLoading(false);
      return;
    }

    try {
      if (activeTab === 'signup') {
        await signUp(auth, firestore, values);
      } else {
        await signIn(auth, values);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t('auth.unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">{t('common.login')}</TabsTrigger>
          <TabsTrigger value="signup">{t('common.signup')}</TabsTrigger>
        </TabsList>
        <TabsContent value="login" />
        <TabsContent value="signup" />
      </Tabs>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {activeTab === 'signup' && (
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.fullName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('auth.namePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('auth.emailPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.password')}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t('auth.passwordPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? t('common.loading')
              : activeTab === 'login'
              ? t('common.login')
              : t('common.createAccount')}
          </Button>
        </form>
      </Form>
    </div>
  );
}

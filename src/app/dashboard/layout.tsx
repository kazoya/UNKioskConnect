'use client';

import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
           <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
             <Skeleton className="h-8 w-48" />
           </div>
        </header>
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
             <div className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="h-48 rounded-lg" />
                  <Skeleton className="h-48 rounded-lg" />
                   <Skeleton className="h-48 rounded-lg" />
                </div>
             </div>
          </div>
        </main>
      </div>
    )
  }


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}

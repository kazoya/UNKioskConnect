'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { User, Calendar, LogOut, ArrowRight, Settings, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';

export default function DashboardPage() {
  const { user, claims } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { t, dir } = useI18n();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/');
    }
  };
  
  const isAdmin = claims?.role === 'admin';

  const menuItems = [
    {
      title: t('dashboard.bookEvent'),
      description: t('dashboard.bookEventDesc'),
      href: '/dashboard/events',
      icon: <PlusCircle className="h-12 w-12 text-accent" />,
      show: true,
    },
    {
      title: t('dashboard.myBookings'),
      description: t('dashboard.myBookingsDesc'),
      href: '/dashboard/bookings',
      icon: <Calendar className="h-12 w-12 text-accent" />,
      show: true,
    },
    {
      title: t('dashboard.manageEvents'),
      description: t('dashboard.manageEventsDesc'),
      href: '/dashboard/admin/events',
      icon: <Settings className="h-12 w-12 text-accent" />,
      show: isAdmin,
    },
    {
      title: t('dashboard.manageUsers'),
      description: t('dashboard.manageUsersDesc'),
      href: '/dashboard/admin/users',
      icon: <User className="h-12 w-12 text-accent" />,
      show: isAdmin,
    },
  ];


  return (
    <div className="flex flex-col gap-8">
      <div className={`flex flex-col items-center gap-4 text-center ${dir === 'rtl' ? 'md:text-right' : 'md:text-left'} md:flex-row`}>
        <Avatar className="h-24 w-24 border-4 border-accent">
          <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
          <AvatarFallback>
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold font-headline text-primary">
            {t('dashboard.welcome', { name: user?.displayName || user?.email || '' })}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('dashboard.whatToDo')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.filter(item => item.show).map((item) => (
          <Link href={item.href} key={item.href} className="group">
            <Card className="flex h-full flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className={`flex-row items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                {item.icon}
                <div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`flex items-center text-sm font-semibold text-accent ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                  {t('common.go')}{' '}
                  <ArrowRight className={`h-4 w-4 transition-transform ${dir === 'rtl' ? 'mr-2 group-hover:-translate-x-1 rotate-180' : 'ml-2 group-hover:translate-x-1'}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Card onClick={handleLogout} className="group flex h-full cursor-pointer flex-col justify-between overflow-hidden border-destructive/50 bg-destructive/10 text-destructive-foreground transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-destructive/20">
          <CardHeader className={`flex-row items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
            <LogOut className="h-12 w-12 text-destructive" />
            <div>
              <CardTitle className="text-2xl text-destructive">
                {t('common.logout')}
              </CardTitle>
              <CardDescription className="text-destructive/80">
                {t('dashboard.logoutDesc')}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center text-sm font-semibold text-destructive ${dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
              {t('common.logout')}{' '}
              <ArrowRight className={`h-4 w-4 transition-transform ${dir === 'rtl' ? 'mr-2 group-hover:-translate-x-1 rotate-180' : 'ml-2 group-hover:translate-x-1'}`} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

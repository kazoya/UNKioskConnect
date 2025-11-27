'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ar';

interface Translations {
  [key: string]: string | Translations;
}

const translations: Record<Locale, Translations> = {
  en: {
    common: {
      welcome: 'Welcome',
      login: 'Log In',
      signup: 'Sign Up',
      logout: 'Log Out',
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      loading: 'Loading...',
      createAccount: 'Create Account',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      close: 'Close',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      go: 'Go',
    },
    auth: {
      welcomeMessage: 'Log in or create an account to manage your events.',
      emailPlaceholder: 'jane.doe@example.com',
      passwordPlaceholder: '••••••••',
      namePlaceholder: 'Jane Doe',
      emailRequired: 'Please enter a valid email.',
      passwordRequired: 'Password must be at least 6 characters.',
      firebaseNotInitialized: 'Firebase not initialized. Please try again later.',
      unexpectedError: 'An unexpected error occurred.',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome, {name}',
      whatToDo: 'What would you like to do today?',
      bookEvent: 'Book an Event',
      bookEventDesc: 'Browse and book new events.',
      myBookings: 'My Bookings',
      myBookingsDesc: 'View and manage your upcoming events.',
      manageEvents: 'Manage Events',
      manageEventsDesc: 'Admin: Create, edit, or remove events.',
      manageUsers: 'Manage Users',
      manageUsersDesc: 'Admin: View and manage user roles.',
      reports: 'Reports & Analytics',
      reportsDesc: 'Admin: View booking statistics and analytics.',
      calendar: 'Events Calendar',
      calendarDesc: 'Admin: View events and bookings on a calendar.',
      aiAssistant: 'AI Assistant',
      aiAssistantDesc: 'Get help and answers from the AI assistant.',
      accountSettings: 'Account Settings',
      accountSettingsDesc: 'Manage your profile and preferences.',
      logoutDesc: 'End your session and return to the login screen.',
    },
    app: {
      title: 'Skills4Work Event Management',
      description: 'Online Event Booking and Management System',
      appName: 'Skills4Work Events',
      footer: {
        organization: 'Leaders International for Economic Development',
        copyright: 'Skills4Work',
        support: 'For assistance, please contact support.',
      },
    },
    language: {
      switch: 'Switch Language',
      english: 'English',
      arabic: 'العربية',
    },
  },
  ar: {
    common: {
      welcome: 'مرحباً',
      login: 'تسجيل الدخول',
      signup: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      fullName: 'الاسم الكامل',
      loading: 'جاري التحميل...',
      createAccount: 'إنشاء حساب',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      submit: 'إرسال',
      search: 'بحث',
      filter: 'تصفية',
      close: 'إغلاق',
      confirm: 'تأكيد',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      go: 'انتقل',
    },
    auth: {
      welcomeMessage: 'قم بتسجيل الدخول أو إنشاء حساب لإدارة فعالياتك.',
      emailPlaceholder: 'jane.doe@example.com',
      passwordPlaceholder: '••••••••',
      namePlaceholder: 'جين دو',
      emailRequired: 'يرجى إدخال بريد إلكتروني صحيح.',
      passwordRequired: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
      firebaseNotInitialized: 'لم يتم تهيئة Firebase. يرجى المحاولة مرة أخرى لاحقاً.',
      unexpectedError: 'حدث خطأ غير متوقع.',
    },
    dashboard: {
      title: 'لوحة التحكم',
      welcome: 'مرحباً، {name}',
      whatToDo: 'ماذا تريد أن تفعل اليوم؟',
      bookEvent: 'حجز فعالية',
      bookEventDesc: 'تصفح واحجز فعاليات جديدة.',
      myBookings: 'حجوزاتي',
      myBookingsDesc: 'عرض وإدارة فعالياتك القادمة.',
      manageEvents: 'إدارة الفعاليات',
      manageEventsDesc: 'المسؤول: إنشاء أو تعديل أو حذف الفعاليات.',
      manageUsers: 'إدارة المستخدمين',
      manageUsersDesc: 'المسؤول: عرض وإدارة أدوار المستخدمين.',
      reports: 'التقارير والتحليلات',
      reportsDesc: 'المسؤول: عرض إحصائيات الحجوزات والتحليلات.',
      calendar: 'تقويم الفعاليات',
      calendarDesc: 'المسؤول: عرض الفعاليات والحجوزات على التقويم.',
      aiAssistant: 'المساعد الذكي',
      aiAssistantDesc: 'احصل على المساعدة والإجابات من المساعد الذكي.',
      accountSettings: 'إعدادات الحساب',
      accountSettingsDesc: 'إدارة ملفك الشخصي والتفضيلات.',
      logoutDesc: 'إنهاء جلستك والعودة إلى شاشة تسجيل الدخول.',
    },
    app: {
      title: 'إدارة فعاليات Skills4Work',
      description: 'نظام حجز وإدارة الفعاليات عبر الإنترنت',
      appName: 'فعاليات Skills4Work',
      footer: {
        organization: 'قادة الدولي للتنمية الاقتصادية',
        copyright: 'Skills4Work',
        support: 'للحصول على المساعدة، يرجى الاتصال بالدعم.',
      },
    },
    language: {
      switch: 'تغيير اللغة',
      english: 'English',
      arabic: 'العربية',
    },
  },
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'ar')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    // Update HTML dir attribute
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLocale;
  };

  useEffect(() => {
    // Set initial dir and lang
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return value;
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}


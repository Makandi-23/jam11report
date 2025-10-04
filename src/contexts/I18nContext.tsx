import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface I18nContextType {
  language: 'en' | 'sw';
  setLanguage: (lang: 'en' | 'sw') => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.reports': 'My Reports',
    'nav.reportIssue': 'Report Issue',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Landing Page
    'landing.hero.title': 'Make Your Community Better',
    'landing.hero.subtitle': 'Report issues, track progress, and work together to improve your neighborhood',
    'landing.hero.cta.resident': 'Get Started as Resident',
    'landing.hero.cta.admin': 'Admin Login',
    
    // Features
    'features.reporting.title': 'Easy Reporting',
    'features.reporting.desc': 'Quickly report community issues with photos and location',
    'features.tracking.title': 'Track Progress',
    'features.tracking.desc': 'See real-time updates on reported issues',
    'features.voting.title': 'Community Voting',
    'features.voting.desc': 'Vote on issues to prioritize what matters most',
    
    // Auth
    'auth.login.title': 'Welcome Back',
    'auth.login.subtitle': 'Sign in to your account',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login.button': 'Sign In',
    'auth.register.link': 'Create account',
    'auth.forgot.password': 'Forgot password?',
    
    // Dashboard
    'dashboard.greeting': 'Hey {name} 👋, ready to make {ward} even better today?',
    'dashboard.stats.open': 'Open Reports',
    'dashboard.stats.progress': 'In Progress',
    'dashboard.stats.resolved': 'Resolved',
    'dashboard.urgent.title': 'Top Urgent Issues',
    'dashboard.recent.title': 'Recent Reports',
    
    // Reports
    'reports.title': 'Community Reports',
    'reports.filter.category': 'Category',
    'reports.filter.status': 'Status',
    'reports.filter.search': 'Search reports...',
    'reports.filter.clear': 'Clear Filters',
    'reports.vote': 'Vote',
    'reports.voted': 'Voted',
    'reports.votes': 'votes',
    
    // Status
    'status.pending': 'Pending',
    'status.in-progress': 'In Progress',
    'status.resolved': 'Resolved',
    
    // Categories
    'category.security': 'Security',
    'category.environment': 'Environment',
    'category.health': 'Health',
    'category.other': 'Other',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    
    // Admin Analytics
    'admin.analytics.title': 'Analytics & Trends',
    'admin.analytics.subtitle': 'Insights into community reporting patterns',
    'admin.analytics.export': 'Export',
    'admin.analytics.refresh': 'Refresh',
    'admin.analytics.comparison': 'Compare with previous period',
    
    // Admin Residents
    'admin.residents.title': 'Residents Management',
    'admin.residents.subtitle': 'Manage community members and their engagement',
    'admin.residents.total': 'Total Residents',
    'admin.residents.active': 'Active Residents',
    'admin.residents.suspended': 'Suspended Residents',
    'admin.residents.viewProfile': 'View Profile',
    'admin.residents.suspend': 'Suspend',
    'admin.residents.activate': 'Activate',
    
    // Admin Settings
    'admin.settings.title': 'Settings',
    'admin.settings.subtitle': 'Manage your admin profile and system configuration',
    'admin.settings.profile': 'Admin Profile',
    'admin.settings.system': 'System Settings',
    'admin.settings.categories': 'Categories',
    'admin.settings.wards': 'Wards',
    'admin.settings.save': 'Save Changes',
    'admin.settings.reset': 'Reset Defaults',
  },
  sw: {
    // Navigation
    'nav.dashboard': 'Dashibodi',
    'nav.reports': 'Ripoti Zangu',
    'nav.reportIssue': 'Ripoti Tatizo',
    'nav.contact': 'Mawasiliano',
    'nav.login': 'Ingia',
    'nav.register': 'Jisajili',
    'nav.logout': 'Toka',
    
    // Landing Page
    'landing.hero.title': 'Fanya Jamii Yako Bora',
    'landing.hero.subtitle': 'Ripoti matatizo, fuatilia maendeleo, na fanya kazi pamoja kuboresha mtaa wako',
    'landing.hero.cta.resident': 'Anza kama Mkazi',
    'landing.hero.cta.admin': 'Ingia kama Msimamizi',
    
    // Features
    'features.reporting.title': 'Uripotiaji Rahisi',
    'features.reporting.desc': 'Ripoti matatizo ya kijamii haraka kwa picha na mahali',
    'features.tracking.title': 'Fuatilia Maendeleo',
    'features.tracking.desc': 'Ona masasisho ya wakati halisi juu ya matatizo yaliyoripotiwa',
    'features.voting.title': 'Kupiga Kura kwa Jamii',
    'features.voting.desc': 'Piga kura juu ya matatizo ili kuweka kipaumbele kwa yale muhimu zaidi',
    
    // Auth
    'auth.login.title': 'Karibu Tena',
    'auth.login.subtitle': 'Ingia kwenye akaunti yako',
    'auth.email': 'Barua pepe',
    'auth.password': 'Nenosiri',
    'auth.login.button': 'Ingia',
    'auth.register.link': 'Tengeneza akaunti',
    'auth.forgot.password': 'Umesahau nenosiri?',
    
    // Dashboard
    'dashboard.greeting': 'Hujambo {name} 👋, uko tayari kufanya {ward} bora zaidi leo?',
    'dashboard.stats.open': 'Ripoti Zilizofunguliwa',
    'dashboard.stats.progress': 'Zinaendelea',
    'dashboard.stats.resolved': 'Zimetatuliwa',
    'dashboard.urgent.title': 'Matatizo ya Haraka Zaidi',
    'dashboard.recent.title': 'Ripoti za Hivi Karibuni',
    
    // Reports
    'reports.title': 'Ripoti za Jamii',
    'reports.filter.category': 'Kategoria',
    'reports.filter.status': 'Hali',
    'reports.filter.search': 'Tafuta ripoti...',
    'reports.filter.clear': 'Futa Vichujio',
    'reports.vote': 'Piga Kura',
    'reports.voted': 'Umepiga Kura',
    'reports.votes': 'kura',
    
    // Status
    'status.pending': 'Inasubiri',
    'status.in-progress': 'Inaendelea',
    'status.resolved': 'Imetatuliwa',
    
    // Categories
    'category.security': 'Usalama',
    'category.environment': 'Mazingira',
    'category.health': 'Afya',
    'category.other': 'Nyingine',
    
    // Common
    'common.loading': 'Inapakia...',
    'common.error': 'Kuna tatizo lililotokea',
    'common.submit': 'Wasilisha',
    'common.cancel': 'Ghairi',
    'common.save': 'Hifadhi',
    'common.edit': 'Hariri',
    'common.delete': 'Futa',
    'common.view': 'Angalia',
    
    // Admin Analytics
    'admin.analytics.title': 'Takwimu na Mielekeo',
    'admin.analytics.subtitle': 'Maarifa kuhusu mifumo ya kuripoti kwa jamii',
    'admin.analytics.export': 'Hamisha',
    'admin.analytics.refresh': 'Onyesha Upya',
    'admin.analytics.comparison': 'Linganisha na kipindi kilichopita',
    
    // Admin Residents
    'admin.residents.title': 'Usimamizi wa Wakazi',
    'admin.residents.subtitle': 'Simamia wanajamii na ushiriki wao',
    'admin.residents.total': 'Wakazi Wote',
    'admin.residents.active': 'Wakazi Hai',
    'admin.residents.suspended': 'Wakazi Waliosimamishwa',
    'admin.residents.viewProfile': 'Angalia Wasifu',
    'admin.residents.suspend': 'Simamisha',
    'admin.residents.activate': 'Washa',
    
    // Admin Settings
    'admin.settings.title': 'Mipangilio',
    'admin.settings.subtitle': 'Simamia wasifu wako wa msimamizi na usanidi wa mfumo',
    'admin.settings.profile': 'Wasifu wa Msimamizi',
    'admin.settings.system': 'Mipangilio ya Mfumo',
    'admin.settings.categories': 'Makundi',
    'admin.settings.wards': 'Kata',
    'admin.settings.save': 'Hifadhi Mabadiliko',
    'admin.settings.reset': 'Rudisha Chaguo-msingi',
  }
};

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'sw'>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('jamiireport_lang') as 'en' | 'sw';
    if (storedLang) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: 'en' | 'sw') => {
    setLanguageState(lang);
    localStorage.setItem('jamiireport_lang', lang);
  };

  const t = (key: string, params?: Record<string, string>) => {
    let translation = translations[language][key] || key;
    
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
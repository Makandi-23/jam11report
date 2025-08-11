import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition ${
            language === 'en'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('sw')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition ${
            language === 'sw'
              ? 'bg-white text-primary shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          SW
        </button>
      </div>
    </div>
  );
};

export default LanguageToggle;
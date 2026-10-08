import React from 'react';
import {
  User,
  Globe,
  Sun,
  Moon,
  Eye,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { UserProfile } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';
import { useTheme } from '../modules/theme/ThemeContext';

interface SettingsViewProps {
  user: UserProfile | null;
  onSignOut: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onSignOut,
  onResetData,
}) => {
  const { t, language, setLanguage } = useI18n();
  const { theme, setTheme, comfortMode, toggleComfortMode } = useTheme();

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
        <h2 className="text-xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
          {t('settings_title', 'Settings')}
        </h2>
        <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
          Manage your personal workspace preferences and accessibility options.
        </p>
      </div>

      {/* 1. Profile Summary */}
      <div className="p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] font-bold text-sm flex items-center justify-center border border-[#879B87]/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
              {user?.name || 'Patient'}
            </h3>
            <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8]">
              {user?.email} · Age: {user?.age}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Language Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
          <span>{t('settings_language', 'Language')}</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
              language === 'en'
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] text-[#2F322E] dark:text-[#F3EFE8]'
                : 'border-[#E3DCCF] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8]'
            }`}
          >
            <span>English (US / UK)</span>
            {language === 'en' && <Check className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />}
          </button>

          <button
            onClick={() => setLanguage('hi')}
            className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
              language === 'hi'
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] text-[#2F322E] dark:text-[#F3EFE8]'
                : 'border-[#E3DCCF] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8]'
            }`}
          >
            <span>हिंदी (Hindi)</span>
            {language === 'hi' && <Check className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />}
          </button>
        </div>
      </div>

      {/* 3. Appearance Theme */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8] flex items-center gap-2">
          <Sun className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
          <span>{t('settings_theme', 'Appearance & Theme')}</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              theme === 'light'
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] text-[#2F322E] dark:text-[#F3EFE8]'
                : 'border-[#E3DCCF] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              theme === 'dark'
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] text-[#2F322E] dark:text-[#F3EFE8]'
                : 'border-[#E3DCCF] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8]'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${
              theme === 'system'
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] text-[#2F322E] dark:text-[#F3EFE8]'
                : 'border-[#E3DCCF] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8]'
            }`}
          >
            <span>System</span>
          </button>
        </div>
      </div>

      {/* 4. Accessibility Comfort Mode */}
      <div className="p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8] flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
            <span>{t('comfort_mode', 'Comfort Mode')}</span>
          </h4>
          <p className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
            Increases text readability, button hit targets, and contrast for relaxed reading.
          </p>
        </div>

        <button
          onClick={toggleComfortMode}
          className={`w-12 h-6 rounded-full transition-colors cursor-pointer relative p-0.5 shrink-0 ${
            comfortMode ? 'bg-[#5A7359] dark:bg-[#879B87]' : 'bg-[#D8D0C2] dark:bg-[#363D34]'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
              comfortMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 5. Medical Disclaimer Notice */}
      <div className="p-4 rounded-xl bg-[#F5F2EA] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] text-[11px] text-[#6D716B] dark:text-[#BDC2B8] leading-relaxed">
        <div className="font-semibold text-[#2F322E] dark:text-[#F3EFE8] flex items-center gap-1.5 mb-1">
          <ShieldCheck className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
          <span>Clinical Information Scope</span>
        </div>
        {t('medical_disclaimer_notice')}
      </div>

      {/* 6. Danger / Sign Out Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E3DCCF] dark:border-[#363D34]">
        <button
          onClick={onResetData}
          className="text-xs text-[#92958F] dark:text-[#889083] hover:text-[#B2614B] flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('settings_clear_data', 'Reset Local Data')}</span>
        </button>

        <button
          onClick={onSignOut}
          className="px-4 py-2 rounded-lg border border-[#B2614B]/40 text-xs font-semibold text-[#B2614B] hover:bg-[#B2614B]/10 transition cursor-pointer flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('settings_sign_out', 'Sign out')}</span>
        </button>
      </div>
    </div>
  );
};

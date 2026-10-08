import React from 'react';
import { Sun, Moon, Sparkles, LogOut, Eye, Check } from 'lucide-react';
import { useTheme } from '../modules/theme/ThemeContext';
import { useI18n } from '../modules/i18n/I18nContext';
import { UserProfile } from '../modules/types';

interface TopHeaderProps {
  user: UserProfile | null;
  isDemoMode: boolean;
  onExitDemo: () => void;
  onStartDemo: () => void;
  title?: string;
  subtitle?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  isDemoMode,
  onExitDemo,
  onStartDemo,
  title,
  subtitle,
}) => {
  const { effectiveTheme, toggleTheme, comfortMode, toggleComfortMode } = useTheme();
  const { language, setLanguage, t } = useI18n();

  return (
    <header className="sticky top-0 z-30 bg-[#FCFBF7]/90 dark:bg-[#1C201C]/90 backdrop-blur-md border-b border-[#E3DCCF] dark:border-[#363D34] px-4 md:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: View context */}
        <div className="flex flex-col">
          {title && (
            <h1 className="text-base md:text-lg font-semibold text-[#2F322E] dark:text-[#F3EFE8] leading-tight flex items-center gap-2">
              {title}
              {isDemoMode && (
                <span className="text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] border border-[#A8B7A5]/30">
                  {t('demo_mode_badge', 'DEMO DATA')}
                </span>
              )}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Controls: Language, Theme Toggle, Comfort Mode, User */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Demo Mode switcher */}
          {isDemoMode ? (
            <button
              onClick={onExitDemo}
              className="text-xs font-medium px-2.5 py-1 rounded-md border border-[#D8D0C2] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#EEEAE1] dark:hover:bg-[#282C27] flex items-center gap-1.5 transition cursor-pointer"
              title="Return to real personal mode"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('exit_demo', 'Exit Demo')}</span>
            </button>
          ) : (
            <button
              onClick={onStartDemo}
              className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#DCE5D9] dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8] hover:bg-[#C9D9C5] dark:hover:bg-[#2F342E] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
              <span className="hidden sm:inline">{t('explore_demo', 'Explore Demo')}</span>
            </button>
          )}

          {/* Bilingual Language Selector: EN | हिंदी */}
          <div className="flex items-center rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#FFFFFF] dark:bg-[#282C27] p-0.5 text-xs font-medium shadow-2xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${
                language === 'en'
                  ? 'bg-[#5A7359] dark:bg-[#879B87] text-white font-semibold'
                  : 'text-[#6D716B] dark:text-[#BDC2B8] hover:text-[#2F322E] dark:hover:text-[#F3EFE8]'
              }`}
            >
              EN
            </button>
            <span className="text-[#D8D0C2] dark:text-[#363D34] px-0.5">|</span>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-md transition cursor-pointer ${
                language === 'hi'
                  ? 'bg-[#5A7359] dark:bg-[#879B87] text-white font-semibold'
                  : 'text-[#6D716B] dark:text-[#BDC2B8] hover:text-[#2F322E] dark:hover:text-[#F3EFE8]'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Compact Theme Toggle: ☼ / ☾ */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={effectiveTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-8 h-8 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#FFFFFF] dark:bg-[#282C27] text-[#6D716B] dark:text-[#BDC2B8] hover:text-[#2F322E] dark:hover:text-[#F3EFE8] hover:bg-[#EEEAE1] dark:hover:bg-[#2F342E] flex items-center justify-center transition cursor-pointer shadow-2xs group"
          >
            {effectiveTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#CBA457] group-hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-[#5A7359] group-hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Accessibility Comfort Mode Toggle */}
          <button
            onClick={toggleComfortMode}
            title={t('comfort_mode', 'Comfort Mode (Larger readable typography)')}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${
              comfortMode
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] text-[#2F322E] dark:text-[#F3EFE8]'
                : 'border-[#E3DCCF] dark:border-[#363D34] bg-[#FFFFFF] dark:bg-[#282C27] text-[#6D716B] dark:text-[#BDC2B8]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
            <span>Aa</span>
            {comfortMode && <Check className="w-3 h-3 text-[#5A7359] dark:text-[#95A895]" />}
          </button>

          {/* User Profile Avatar */}
          {user && (
            <div className="flex items-center gap-2 pl-1 border-l border-[#E3DCCF] dark:border-[#363D34]">
              <div className="w-8 h-8 rounded-full bg-[#E3DCCF] dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8] border border-[#D8D0C2] dark:border-[#363D34] flex items-center justify-center text-xs font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden xl:inline text-xs font-medium text-[#2F322E] dark:text-[#F3EFE8] max-w-[100px] truncate">
                {user.name || 'Patient'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

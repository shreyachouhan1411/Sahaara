import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useI18n } from '../modules/i18n/I18nContext';
import { UserProfile } from '../modules/types';

interface LoginOnboardingProps {
  onComplete: (user: UserProfile) => void;
  onStartDemo: () => void;
}

export const LoginOnboarding: React.FC<LoginOnboardingProps> = ({
  onComplete,
  onStartDemo,
}) => {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }

    const newUser: UserProfile = {
      name: name.trim(),
      email: email.trim() || 'patient@sahaara.local',
      age: age ? parseInt(age, 10) : 40,
      signedInAt: new Date().toISOString(),
      allergies: [],
      conditions: [],
    };

    onComplete(newUser);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EA] dark:bg-[#151815] flex flex-col justify-between p-4 md:p-8 transition-colors select-none text-[#2F322E] dark:text-[#F3EFE8]">
      {/* Top Brand Bar */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#5A7359] dark:bg-[#879B87] text-[#FCFBF7] dark:text-[#151815] flex items-center justify-center font-bold text-base shadow-xs">
            S
          </div>
          <div>
            <span className="font-semibold text-lg tracking-wider text-[#2F322E] dark:text-[#F3EFE8] block leading-none">
              SAHAARA
            </span>
            <span className="text-[10px] tracking-wide text-[#6D716B] dark:text-[#BDC2B8] uppercase font-medium mt-0.5 block">
              Patient Prescription Safety
            </span>
          </div>
        </div>

        {/* Demo Fast Access button for judges */}
        <button
          onClick={onStartDemo}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#DCE5D9] dark:bg-[#242D23] text-[#2F322E] dark:text-[#F3EFE8] hover:bg-[#C9D9C5] dark:hover:bg-[#2F382E] border border-[#A8B7A5]/40 dark:border-[#363D34] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
          <span>{t('explore_demo', 'Explore Demo')}</span>
        </button>
      </div>

      {/* Center Onboarding Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs">
          <div className="mb-6 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5A7359] dark:text-[#95A895] block mb-1">
              Personal Workspace
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium leading-tight">
              {t('login_title', 'Welcome to Sahaara')}
            </h2>
            <p className="text-xs md:text-sm text-[#6D716B] dark:text-[#BDC2B8] mt-2 leading-relaxed">
              {t(
                'login_subtitle',
                'A calmer way to understand your medicines and stay on top of your day.'
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="text-xs p-2.5 rounded-lg bg-[#B2614B]/15 border border-[#B2614B]/30 text-[#B2614B]">
                {error}
              </div>
            )}

            {/* Field 1: Name */}
            <div>
              <label className="block text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8] mb-1.5">
                {t('field_name', 'Full Name')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder={t('field_name_placeholder', 'e.g. Shreya Chouhan')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-sm text-[#2F322E] dark:text-[#F3EFE8] focus:outline-none focus:ring-1 focus:ring-[#879B87] transition"
              />
            </div>

            {/* Field 2: Email */}
            <div>
              <label className="block text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8] mb-1.5">
                {t('field_email', 'Email Address')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('field_email_placeholder', 'e.g. shreya@example.com')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-sm text-[#2F322E] dark:text-[#F3EFE8] focus:outline-none focus:ring-1 focus:ring-[#879B87] transition"
              />
            </div>

            {/* Field 3: Age */}
            <div>
              <label className="block text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8] mb-1.5">
                {t('field_age', 'Age')}
              </label>
              <input
                type="number"
                min="1"
                max="125"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder={t('field_age_placeholder', 'e.g. 42')}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-sm text-[#2F322E] dark:text-[#F3EFE8] focus:outline-none focus:ring-1 focus:ring-[#879B87] transition"
              />
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="mt-2 w-full py-2.5 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <span>{t('btn_continue', 'Continue')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E3DCCF] dark:border-[#363D34]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-[#FFFFFF] dark:bg-[#282C27] px-2 text-[#92958F] dark:text-[#889083]">
                Or explore without typing
              </span>
            </div>
          </div>

          <button
            onClick={onStartDemo}
            className="w-full py-2.5 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] bg-[#F5F2EA] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] hover:bg-[#DCE5D9] dark:hover:bg-[#282C27] font-medium text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
            <span>{t('btn_start_demo', 'Start Demo Journey (Sample Patient)')}</span>
          </button>
        </div>
      </div>

      {/* Footer calm note */}
      <div className="max-w-md mx-auto w-full text-center pb-2">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
          <span>Patient data stored locally on device. No password or unnecessary forms.</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Printer } from 'lucide-react';
import { useI18n } from '../modules/i18n/I18nContext';

interface ChecklistItem {
  id: string;
  label: string;
  labelHi: string;
  status: 'ready' | 'attention';
  note: string;
  noteHi: string;
}

interface BeforeYouGoCardProps {
  items: ChecklistItem[];
  onOpenAppointmentBrief: () => void;
}

export const BeforeYouGoCard: React.FC<BeforeYouGoCardProps> = ({
  items,
  onOpenAppointmentBrief,
}) => {
  const { t, language } = useI18n();

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 shadow-xs flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E3DCCF] dark:border-[#363D34]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895]">
              Pre-Appointment Checklist
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] font-medium">
              Clinical Readiness
            </span>
          </div>
          <h3 className="text-base font-serif font-medium text-[#2F322E] dark:text-[#F3EFE8]">
            {t('verify_before_title', 'Before You Go')}
          </h3>
          <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8]">
            {t(
              'verify_before_subtitle',
              'Pre-appointment & travel safety checklist to prevent surprises.'
            )}
          </p>
        </div>

        <button
          onClick={onOpenAppointmentBrief}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] hover:bg-[#F5F2EA] dark:hover:bg-[#282C27] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
          <span>{t('appointment_brief_title', 'Appointment Brief')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {items.map((item) => {
          const isReady = item.status === 'ready';
          const label = language === 'hi' && item.labelHi ? item.labelHi : item.label;
          const note = language === 'hi' && item.noteHi ? item.noteHi : item.note;

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isReady
                  ? 'bg-[#FCFBF7] dark:bg-[#222621] border-[#E3DCCF] dark:border-[#363D34]'
                  : 'bg-[#FCFBF7] dark:bg-[#222621] border-[#D8D0C2] dark:border-[#363D34]'
              }`}
            >
              {isReady ? (
                <CheckCircle2 className="w-4 h-4 text-[#5A7359] dark:text-[#95A895] shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#B7924F] dark:text-[#CBA457] shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold text-[#2F322E] dark:text-[#F3EFE8] block leading-snug">
                  {label}
                </span>
                <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] mt-0.5 block">
                  {note}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

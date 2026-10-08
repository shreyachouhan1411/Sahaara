import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useI18n } from '../modules/i18n/I18nContext';

interface ClarityCardProps {
  point1: string;
  point2: string;
  point3: string;
  point1Hi?: string;
  point2Hi?: string;
  point3Hi?: string;
  onExploreMore?: () => void;
}

export const ClarityCard: React.FC<ClarityCardProps> = ({
  point1,
  point2,
  point3,
  point1Hi,
  point2Hi,
  point3Hi,
  onExploreMore,
}) => {
  const { t, language } = useI18n();

  const p1 = language === 'hi' && point1Hi ? point1Hi : point1;
  const p2 = language === 'hi' && point2Hi ? point2Hi : point2;
  const p3 = language === 'hi' && point3Hi ? point3Hi : point3;

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-7 shadow-xs">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8] leading-tight">
              {t('clarity_card_title', "Today's Clarity")}
            </h3>
            <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
              {t('clarity_card_subtitle', '3 things worth knowing today')}
            </span>
          </div>
        </div>

        {onExploreMore && (
          <button
            onClick={onExploreMore}
            className="text-xs font-medium text-[#5A7359] dark:text-[#95A895] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Review timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-[#DCE5D9] dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8] text-[11px] font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-[10px] uppercase font-bold text-[#6D716B] dark:text-[#BDC2B8] tracking-wider">
              Next Action
            </span>
          </div>
          <p className="text-xs text-[#2F322E] dark:text-[#F3EFE8] leading-relaxed">
            {p1}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-[#DCE5D9] dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8] text-[11px] font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-[10px] uppercase font-bold text-[#6D716B] dark:text-[#BDC2B8] tracking-wider">
              Safety Radar
            </span>
          </div>
          <p className="text-xs text-[#2F322E] dark:text-[#F3EFE8] leading-relaxed">
            {p2}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-[#DCE5D9] dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8] text-[11px] font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-[10px] uppercase font-bold text-[#6D716B] dark:text-[#BDC2B8] tracking-wider">
              Care Plan Match
            </span>
          </div>
          <p className="text-xs text-[#2F322E] dark:text-[#F3EFE8] leading-relaxed">
            {p3}
          </p>
        </div>
      </div>
    </div>
  );
};

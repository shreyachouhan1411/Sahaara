import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { SafetyFinding, SafetyLevel } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';

interface SafetyRadarCardProps {
  level: SafetyLevel;
  findings: SafetyFinding[];
}

export const SafetyRadarCard: React.FC<SafetyRadarCardProps> = ({ level, findings }) => {
  const { t, language } = useI18n();
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = () => {
    switch (level) {
      case 'clear':
        return {
          title: t('safety_radar_clear', 'Looks consistent'),
          desc: t(
            'safety_radar_clear_desc',
            'Everything available appears consistent and no adverse interactions detected.'
          ),
          icon: ShieldCheck,
          badgeBg: 'bg-[#DCE5D9] dark:bg-[#242D23]',
          textColor: 'text-[#5A7359] dark:text-[#95A895]',
          borderColor: 'border-[#A8B7A5]/40 dark:border-[#363D34]',
        };
      case 'review':
        return {
          title: t('safety_radar_review', 'Worth reviewing'),
          desc: t(
            'safety_radar_review_desc',
            'Something deserves a closer look with your doctor or pharmacist.'
          ),
          icon: ShieldAlert,
          badgeBg: 'bg-[#B7924F]/20 dark:bg-[#2F2B20]',
          textColor: 'text-[#635A51] dark:text-[#CBA457]',
          borderColor: 'border-[#B7924F]/30 dark:border-[#363D34]',
        };
      case 'unverified':
      default:
        return {
          title: t('safety_radar_unverified', 'Could not verify'),
          desc: t(
            'safety_radar_unverified_desc',
            'The available image information was not sufficient to verify all parameters.'
          ),
          icon: AlertTriangle,
          badgeBg: 'bg-[#D9DCD7] dark:bg-[#282C27]',
          textColor: 'text-[#6D716B] dark:text-[#BDC2B8]',
          borderColor: 'border-[#D8D0C2] dark:border-[#363D34]',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl border ${config.borderColor} bg-[#FFFFFF] dark:bg-[#282C27] p-5 md:p-6 shadow-xs transition-colors`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl ${config.badgeBg} ${config.textColor} flex items-center justify-center shrink-0 mt-0.5`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6D716B] dark:text-[#BDC2B8]">
                {t('safety_radar_title', 'Safety Radar')}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badgeBg} ${config.textColor}`}
              >
                {config.title}
              </span>
            </div>
            <p className="text-xs md:text-sm text-[#6D716B] dark:text-[#BDC2B8] leading-relaxed max-w-2xl">
              {config.desc}
            </p>
          </div>
        </div>

        {findings.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] text-[#2F322E] dark:text-[#F3EFE8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621] flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <span>{findings.length} findings</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Expandable findings drawer */}
      {isExpanded && findings.length > 0 && (
        <div className="mt-5 pt-4 border-t border-[#E3DCCF] dark:border-[#363D34] flex flex-col gap-3">
          {findings.map((finding) => (
            <div
              key={finding.id}
              className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex flex-col gap-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                  {language === 'hi' && finding.titleHi ? finding.titleHi : finding.title}
                </span>
                <span className="text-[10px] uppercase font-bold text-[#6D716B] dark:text-[#BDC2B8] px-1.5 py-0.5 rounded-xs bg-[#EEEAE1] dark:bg-[#282C27]">
                  {finding.severity}
                </span>
              </div>
              <p className="text-[#6D716B] dark:text-[#BDC2B8] leading-relaxed">
                {language === 'hi' && finding.descriptionHi
                  ? finding.descriptionHi
                  : finding.description}
              </p>
              <div className="flex items-start gap-1.5 mt-1 pt-2 border-t border-dashed border-[#E3DCCF] dark:border-[#363D34] text-[#5A7359] dark:text-[#95A895] font-medium">
                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  {language === 'hi' && finding.actionRecommendationHi
                    ? finding.actionRecommendationHi
                    : finding.actionRecommendation}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calm Medical Disclaimer */}
      <div className="mt-4 pt-3 border-t border-[#E3DCCF] dark:border-[#363D34] text-[10px] text-[#92958F] dark:text-[#889083] flex items-center gap-1.5">
        <Info className="w-3 h-3 text-[#5A7359] dark:text-[#95A895] shrink-0" />
        <span>{t('safety_disclaimer')}</span>
      </div>
    </div>
  );
};

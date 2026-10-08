import React from 'react';
import {
  FileText,
  Camera,
  ShieldAlert,
  Activity,
  HelpCircle,
  Clock,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { HealthEvent } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';

interface HealthThreadViewProps {
  events: HealthEvent[];
}

export const HealthThreadView: React.FC<HealthThreadViewProps> = ({ events }) => {
  const { t, language } = useI18n();

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'prescription':
        return FileText;
      case 'scan':
        return Camera;
      case 'safety':
        return ShieldAlert;
      case 'lab_report':
        return Activity;
      case 'appointment':
        return HelpCircle;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
      <div className="pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895]">
            Longitudinal Health Journey
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] font-medium">
            Chronological
          </span>
        </div>
        <h2 className="text-xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
          {t('health_thread_title', 'Health Thread')}
        </h2>
        <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
          {t(
            'health_thread_subtitle',
            'A chronological thread connecting your prescriptions, scans, safety reviews, and lab tests.'
          )}
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:bg-[#E3DCCF] dark:before:bg-[#363D34] flex flex-col gap-6">
        {events.map((evt, idx) => {
          const Icon = getEventIcon(evt.category);
          const title = language === 'hi' && evt.titleHi ? evt.titleHi : evt.title;
          const description =
            language === 'hi' && evt.descriptionHi ? evt.descriptionHi : evt.description;

          return (
            <div key={evt.id || idx} className="relative flex items-start gap-4 group">
              {/* Bullet Node */}
              <div className="absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full bg-[#FCFBF7] dark:bg-[#222621] border-2 border-[#5A7359] dark:border-[#95A895] text-[#5A7359] dark:text-[#95A895] flex items-center justify-center text-xs shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-[#5A7359] dark:bg-[#95A895]" />
              </div>

              {/* Event Content Card */}
              <div className="flex-1 p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87] transition flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
                    <h3 className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                      {title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
                    <span className="font-medium px-2 py-0.5 rounded-md bg-[#EEEAE1] dark:bg-[#282C27]">
                      {evt.date}
                    </span>
                    {evt.time && <span>{evt.time}</span>}
                  </div>
                </div>

                <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

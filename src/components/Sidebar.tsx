import React from 'react';
import {
  Home,
  Clock,
  Package,
  Scan,
  GitCompare,
  Activity,
  HelpCircle,
  FileSpreadsheet,
  Users,
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { useI18n } from '../modules/i18n/I18nContext';

export type ActiveNavTab =
  | 'home'
  | 'my_day'
  | 'medicines'
  | 'scan'
  | 'prescription_match'
  | 'health_thread'
  | 'questions'
  | 'lab_reports'
  | 'care_circle'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  onOpenAppointmentBrief: () => void;
  isDemoMode: boolean;
  onStartDemo: () => void;
  needsReviewCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAppointmentBrief,
  isDemoMode,
  onStartDemo,
  needsReviewCount = 0,
}) => {
  const { t } = useI18n();

  const mainNavItems = [
    { id: 'home' as ActiveNavTab, label: t('nav_home', 'Home'), icon: Home },
    { id: 'my_day' as ActiveNavTab, label: t('nav_my_day', 'My Day'), icon: Clock },
    {
      id: 'medicines' as ActiveNavTab,
      label: t('nav_medicines', 'Medicines'),
      icon: Package,
      badge: needsReviewCount > 0 ? String(needsReviewCount) : undefined,
    },
    { id: 'scan' as ActiveNavTab, label: t('nav_scan', 'Scan'), icon: Scan, isAction: true },
    { id: 'prescription_match' as ActiveNavTab, label: t('nav_prescription_match', 'Prescription Match'), icon: GitCompare },
    { id: 'health_thread' as ActiveNavTab, label: t('nav_health_thread', 'Health Thread'), icon: Activity },
    { id: 'questions' as ActiveNavTab, label: t('nav_questions', 'Doctor Questions'), icon: HelpCircle },
    { id: 'lab_reports' as ActiveNavTab, label: t('nav_lab_reports', 'Lab Reports'), icon: FileSpreadsheet },
  ];

  const secondaryNavItems = [
    { id: 'care_circle' as ActiveNavTab, label: t('nav_care_circle', 'Care Circle'), icon: Users },
    { id: 'settings' as ActiveNavTab, label: t('nav_settings', 'Settings'), icon: Settings },
  ];

  return (
    <aside className="w-[245px] shrink-0 hidden md:flex flex-col justify-between border-r border-[#E3DCCF] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#1C201C] h-screen sticky top-0 py-5 px-4 select-none transition-colors">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#5A7359] dark:bg-[#879B87] text-[#FCFBF7] dark:text-[#151815] flex items-center justify-center font-bold text-base shadow-xs">
              S
            </div>
            <div>
              <span className="font-semibold text-lg tracking-wider text-[#2F322E] dark:text-[#F3EFE8] block leading-none">
                SAHAARA
              </span>
              <span className="text-[10px] tracking-wide text-[#6D716B] dark:text-[#BDC2B8] uppercase font-medium mt-1 block">
                Prescription Safety
              </span>
            </div>
          </div>
        </div>

        {/* Demo Mode status callout in sidebar */}
        {!isDemoMode ? (
          <button
            onClick={onStartDemo}
            className="w-full text-left p-2.5 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#F5F2EA] dark:bg-[#282C27] hover:bg-[#DCE5D9] dark:hover:bg-[#2F342E] transition flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
              <div className="text-xs">
                <div className="font-medium text-[#2F322E] dark:text-[#F3EFE8]">
                  {t('explore_demo', 'Explore Demo')}
                </div>
                <div className="text-[10px] text-[#6D716B] dark:text-[#BDC2B8]">
                  Judge evaluation sample
                </div>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#6D716B] dark:text-[#BDC2B8] group-hover:translate-x-0.5 transition" />
          </button>
        ) : (
          <div className="px-2.5 py-1.5 rounded-md bg-[#DCE5D9] dark:bg-[#242D23] border border-[#879B87]/30 text-[#5A7359] dark:text-[#95A895] text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5A7359] dark:bg-[#95A895] animate-pulse" />
            {t('demo_mode_badge', 'DEMO DATA')} · Sample Patient
          </div>
        )}

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#DCE5D9] dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8] shadow-xs'
                    : 'text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#EEEAE1] dark:hover:bg-[#282C27] hover:text-[#2F322E] dark:hover:text-[#F3EFE8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-[#5A7359] dark:text-[#95A895]'
                        : 'text-[#92958F] dark:text-[#889083]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-[#B7924F]/20 text-[#635A51] dark:text-[#CBA457]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Appointment Brief Quick Action */}
        <div className="pt-1">
          <button
            onClick={onOpenAppointmentBrief}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#EEEAE1] dark:hover:bg-[#282C27] border border-dashed border-[#D8D0C2] dark:border-[#363D34] transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
            <span>{t('nav_appointment_brief', 'Appointment Brief')}</span>
          </button>
        </div>
      </div>

      {/* Footer / Secondary Navigation */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[#E3DCCF] dark:border-[#363D34]">
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer text-left ${
                isActive
                  ? 'bg-[#DCE5D9] dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8]'
                  : 'text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#EEEAE1] dark:hover:bg-[#282C27]'
              }`}
            >
              <Icon className="w-4 h-4 text-[#92958F] dark:text-[#889083]" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="mt-2 px-3 py-2 rounded-lg bg-[#EEEAE1] dark:bg-[#151815] text-[10px] text-[#6D716B] dark:text-[#889083] leading-tight">
          <div className="font-semibold text-[#2F322E] dark:text-[#F3EFE8] flex items-center gap-1 mb-0.5">
            <ShieldCheck className="w-3 h-3 text-[#5A7359] dark:text-[#95A895]" />
            PS 6 Safety Engine
          </div>
          Informational & verification aid.
        </div>
      </div>
    </aside>
  );
};

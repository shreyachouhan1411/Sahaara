import React, { useState } from 'react';
import { Home, Clock, Scan, Package, MoreHorizontal, GitCompare, Activity, HelpCircle, FileSpreadsheet, Users, Settings } from 'lucide-react';
import { ActiveNavTab } from './Sidebar';
import { useI18n } from '../modules/i18n/I18nContext';

interface MobileNavProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  needsReviewCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  needsReviewCount = 0,
}) => {
  const { t } = useI18n();
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  const mainTabs = [
    { id: 'home' as ActiveNavTab, label: t('nav_home', 'Home'), icon: Home },
    { id: 'my_day' as ActiveNavTab, label: t('nav_my_day', 'My Day'), icon: Clock },
    { id: 'scan' as ActiveNavTab, label: t('nav_scan', 'Scan'), icon: Scan, isCenter: true },
    {
      id: 'medicines' as ActiveNavTab,
      label: t('nav_medicines', 'Cabinet'),
      icon: Package,
      badge: needsReviewCount > 0 ? String(needsReviewCount) : undefined,
    },
  ];

  const moreItems = [
    { id: 'prescription_match' as ActiveNavTab, label: t('nav_prescription_match', 'Prescription Match'), icon: GitCompare },
    { id: 'health_thread' as ActiveNavTab, label: t('nav_health_thread', 'Health Thread'), icon: Activity },
    { id: 'questions' as ActiveNavTab, label: t('nav_questions', 'Doctor Questions'), icon: HelpCircle },
    { id: 'lab_reports' as ActiveNavTab, label: t('nav_lab_reports', 'Lab Reports'), icon: FileSpreadsheet },
    { id: 'care_circle' as ActiveNavTab, label: t('nav_care_circle', 'Care Circle'), icon: Users },
    { id: 'settings' as ActiveNavTab, label: t('nav_settings', 'Settings'), icon: Settings },
  ];

  return (
    <>
      {/* Slide-up sheet for "More" */}
      {showMoreSheet && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setShowMoreSheet(false)}
        >
          <div
            className="bg-[#FCFBF7] dark:bg-[#1C201C] border-t border-[#E3DCCF] dark:border-[#363D34] rounded-t-2xl p-5 shadow-2xl flex flex-col gap-3 max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#D8D0C2] dark:bg-[#363D34] rounded-full mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8] px-1">
              More Health Workspaces
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMoreSheet(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-medium transition cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] text-[#2F322E] dark:text-[#F3EFE8]'
                        : 'bg-[#FFFFFF] dark:bg-[#282C27] border-[#E3DCCF] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8]'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFBF7]/95 dark:bg-[#1C201C]/95 backdrop-blur-md border-t border-[#E3DCCF] dark:border-[#363D34] px-2 py-1.5 flex items-center justify-around">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative -top-3 w-12 h-12 rounded-full bg-[#5A7359] dark:bg-[#879B87] text-white flex flex-col items-center justify-center shadow-md active:scale-95 transition cursor-pointer"
                aria-label="Scan medicine"
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-semibold mt-0.5 leading-none">Scan</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg relative transition cursor-pointer ${
                isActive
                  ? 'text-[#5A7359] dark:text-[#95A895]'
                  : 'text-[#92958F] dark:text-[#889083]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-1">{tab.label}</span>
              {tab.badge && (
                <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-[#B7924F] text-white text-[9px] flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* More tab button */}
        <button
          onClick={() => setShowMoreSheet(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition cursor-pointer ${
            showMoreSheet
              ? 'text-[#5A7359] dark:text-[#95A895]'
              : 'text-[#92958F] dark:text-[#889083]'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-1">More</span>
        </button>
      </nav>
    </>
  );
};

import React from 'react';
import {
  Clock,
  Check,
  ChevronRight,
  ShieldCheck,
  FileText,
  Activity,
  ArrowRight,
  Utensils,
  Sparkles,
} from 'lucide-react';
import {
  UserProfile,
  ScannedMedicine,
  Prescription,
  SafetyFinding,
  HealthEvent,
} from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';
import { SafetyRadarCard } from './SafetyRadarCard';
import { ClarityCard } from './ClarityCard';
import { BeforeYouGoCard } from './BeforeYouGoCard';
import { computeSafetyRadarLevel } from '../modules/safety-engine';
import { generateTodayClarity, generateBeforeYouGoChecklist } from '../modules/care';

interface HomeViewProps {
  user: UserProfile | null;
  medicines: ScannedMedicine[];
  prescription: Prescription | null;
  findings: SafetyFinding[];
  healthEvents: HealthEvent[];
  doctorQuestions: any[];
  onToggleTaken: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenAppointmentBrief: () => void;
  onSelectMedicine?: (med: ScannedMedicine) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  medicines,
  prescription,
  findings,
  healthEvents,
  doctorQuestions,
  onToggleTaken,
  onNavigateToTab,
  onOpenAppointmentBrief,
  onSelectMedicine,
}) => {
  const { t } = useI18n();

  // Find next upcoming medicine
  const untakenMedicines = medicines.filter((m) => !m.takenToday && m.status !== 'completed');
  const nextMedicine = untakenMedicines[0] || medicines[0];

  // Stats for "Your day"
  const totalCount = medicines.length;
  const upcomingCount = untakenMedicines.length;
  const needsReviewCount = medicines.filter((m) => m.needsReview || m.status === 'needs_review').length;

  // Radar level
  const radarLevel = computeSafetyRadarLevel(findings);

  // Clarity Card info
  const clarity = generateTodayClarity(medicines, findings, prescription);

  // Before You Go checklist
  const beforeYouGoItems = generateBeforeYouGoChecklist(medicines, prescription, doctorQuestions);

  // Recent Health event
  const recentEvent = healthEvents[0];

  // Dynamic greeting based on time of day
  const hour = new Date().getHours();
  const greetingKey =
    hour < 12
      ? 'greeting_morning'
      : hour < 17
      ? 'greeting_afternoon'
      : 'greeting_evening';

  return (
    <div className="flex flex-col gap-7 max-w-4xl mx-auto pb-16">
      {/* 1. Header: Calm Greeting */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium leading-tight">
          {t(greetingKey, 'Good morning')}, {user?.name?.split(' ')[0] || 'Friend'}.
        </h1>
        <p className="text-sm md:text-base text-[#6D716B] dark:text-[#BDC2B8] mt-1 font-light">
          {t('home_headline', "Here's what matters today.")}
        </p>
      </div>

      {/* 2. Minimal "Your day" Summary Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => onNavigateToTab('medicines')}
          className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87] transition cursor-pointer"
        >
          <span className="text-2xl font-bold text-[#2F322E] dark:text-[#F3EFE8] block leading-none">
            {totalCount}
          </span>
          <span className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-1.5 block">
            {t('medicines_count_label', 'medicines scheduled')}
          </span>
        </div>

        <div
          onClick={() => onNavigateToTab('my_day')}
          className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87] transition cursor-pointer"
        >
          <span className="text-2xl font-bold text-[#5A7359] dark:text-[#95A895] block leading-none">
            {upcomingCount}
          </span>
          <span className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-1.5 block">
            {t('upcoming_count_label', 'upcoming doses')}
          </span>
        </div>

        <div
          onClick={() => onNavigateToTab('prescription_match')}
          className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87] transition cursor-pointer"
        >
          <span
            className={`text-2xl font-bold block leading-none ${
              needsReviewCount > 0 ? 'text-[#CBA457]' : 'text-[#5A7359] dark:text-[#95A895]'
            }`}
          >
            {needsReviewCount}
          </span>
          <span className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-1.5 block">
            {t('needs_review_count_label', 'needs review')}
          </span>
        </div>
      </section>

      {/* 3. Next Dose Section */}
      {nextMedicine && (
        <section className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895]">
              {t('next_section_title', 'Next')}
            </span>
            <span className="text-xs font-medium text-[#6D716B] dark:text-[#BDC2B8]">
              {nextMedicine.timing || 'Scheduled'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div
              className="flex items-start gap-3.5 cursor-pointer flex-1"
              onClick={() => onSelectMedicine && onSelectMedicine(nextMedicine)}
            >
              <div className="w-10 h-10 rounded-xl bg-[#F5F2EA] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] text-[#5A7359] dark:text-[#95A895] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[#2F322E] dark:text-[#F3EFE8] hover:underline">
                    {nextMedicine.medicineName}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#2F342E] text-[#2F322E] dark:text-[#F3EFE8] font-medium">
                    {nextMedicine.strength}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-1">
                  <Utensils className="w-3.5 h-3.5 text-[#879B87]" />
                  <span>{nextMedicine.foodInstruction || 'With water'}</span>
                </div>
                {(nextMedicine.generalUse || nextMedicine.simpleExplanation) && (
                  <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-2 line-clamp-1 italic">
                    {nextMedicine.generalUse || nextMedicine.simpleExplanation}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onToggleTaken(nextMedicine.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer self-start sm:self-auto shadow-2xs ${
                nextMedicine.takenToday
                  ? 'bg-[#DCE5D9] dark:bg-[#2B372A] text-[#5A7359] dark:text-[#95A895]'
                  : 'bg-[#5A7359] hover:bg-[#485D47] dark:bg-[#879B87] text-white'
              }`}
            >
              {nextMedicine.takenToday
                ? t('taken_badge', 'Taken ✓')
                : t('btn_mark_taken', 'Mark as taken')}
            </button>
          </div>
        </section>
      )}

      {/* 4. Today's Clarity Signature Card */}
      <ClarityCard
        point1={clarity.point1}
        point2={clarity.point2}
        point3={clarity.point3}
        point1Hi={clarity.point1Hi}
        point2Hi={clarity.point2Hi}
        point3Hi={clarity.point3Hi}
        onExploreMore={() => onNavigateToTab('my_day')}
      />

      {/* 5. Safety Radar Card */}
      <SafetyRadarCard level={radarLevel} findings={findings} />

      {/* 6. Continue: Recent Prescription & Care Activity */}
      {prescription && (
        <section className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6D716B] dark:text-[#BDC2B8]">
              {t('continue_section_title', 'Continue')}
            </span>
            <button
              onClick={() => onNavigateToTab('prescription_match')}
              className="text-xs text-[#5A7359] dark:text-[#95A895] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>View match</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#5A7359] dark:text-[#95A895]" />
              <div>
                <h4 className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                  Prescription by Dr. {prescription.doctorName}
                </h4>
                <p className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
                  {prescription.items.length} prescribed medications · Date: {prescription.prescriptionDate}
                </p>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895]">
              Linked
            </span>
          </div>
        </section>
      )}

      {/* 7. Before You Go Checklist */}
      <BeforeYouGoCard
        items={beforeYouGoItems}
        onOpenAppointmentBrief={onOpenAppointmentBrief}
      />

      {/* 8. Recent Health Thread Snippet */}
      {recentEvent && (
        <section className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-5 md:p-6 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6D716B] dark:text-[#BDC2B8]">
              {t('nav_health_thread', 'Health Thread')}
            </span>
            <button
              onClick={() => onNavigateToTab('health_thread')}
              className="text-xs text-[#5A7359] dark:text-[#95A895] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>Full thread</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34]">
            <Activity className="w-4 h-4 text-[#5A7359] dark:text-[#95A895] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                  {recentEvent.title}
                </h4>
                <span className="text-[10px] text-[#6D716B] dark:text-[#BDC2B8]">{recentEvent.date}</span>
              </div>
              <p className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
                {recentEvent.description}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

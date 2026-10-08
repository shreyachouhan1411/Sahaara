import React from 'react';
import { Check, Clock, Utensils, AlertCircle } from 'lucide-react';
import { DailyTimeline } from '../modules/care';
import { useI18n } from '../modules/i18n/I18nContext';

interface MyDayTimelineProps {
  timeline: DailyTimeline;
  onToggleTaken: (medicineId: string) => void;
}

export const MyDayTimeline: React.FC<MyDayTimelineProps> = ({
  timeline,
  onToggleTaken,
}) => {
  const { t } = useI18n();

  const slots = [
    {
      id: 'morning',
      label: t('slot_morning', 'Morning (08:00)'),
      items: timeline.morning,
      time: '08:00',
    },
    {
      id: 'afternoon',
      label: t('slot_afternoon', 'Afternoon (13:00)'),
      items: timeline.afternoon,
      time: '13:00',
    },
    {
      id: 'evening',
      label: t('slot_evening', 'Evening (19:30)'),
      items: timeline.evening,
      time: '19:30',
    },
    {
      id: 'night',
      label: t('slot_night', 'Night (22:00)'),
      items: timeline.night,
      time: '22:00',
    },
  ];

  // Total dose stats
  const allItems = [
    ...timeline.morning,
    ...timeline.afternoon,
    ...timeline.evening,
    ...timeline.night,
  ];
  const totalCount = allItems.length;
  const takenCount = allItems.filter((i) => i.taken).length;
  const progressPct = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-1">
            Daily Medication Map
          </span>
          <h2 className="text-xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
            {t('my_day_title', 'My Day')}
          </h2>
          <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
            {t('my_day_subtitle', 'Your personalized, food-aware daily medication schedule.')}
          </p>
        </div>

        {/* Progress Adherence Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
              {takenCount} of {totalCount} doses taken
            </div>
            <div className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
              {progressPct}% today's adherence
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-[#879B87] dark:border-[#95A895] flex items-center justify-center font-bold text-xs text-[#5A7359] dark:text-[#95A895]">
            {progressPct}%
          </div>
        </div>
      </div>

      {/* Timeline slots */}
      <div className="relative flex flex-col gap-8 before:absolute before:top-3 before:bottom-3 before:left-[17px] before:w-0.5 before:bg-[#E3DCCF] dark:before:bg-[#363D34]">
        {slots.map((slot) => (
          <div key={slot.id} className="relative flex items-start gap-4">
            {/* Slot icon marker */}
            <div className="w-9 h-9 rounded-full bg-[#FCFBF7] dark:bg-[#222621] border-2 border-[#879B87] dark:border-[#95A895] text-[#5A7359] dark:text-[#95A895] flex items-center justify-center z-10 shrink-0 font-medium text-xs shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>

            <div className="flex-1 flex flex-col gap-2 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                  {slot.label}
                </h3>
              </div>

              {slot.items.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] text-xs text-[#92958F] dark:text-[#889083] italic">
                  No medications scheduled for this time slot.
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {slot.items.map((item, idx) => (
                    <div
                      key={`${item.medicineId}-${idx}`}
                      className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        item.taken
                          ? 'bg-[#FCFBF7] dark:bg-[#222621] border-[#E3DCCF] dark:border-[#363D34] opacity-80'
                          : 'bg-[#FFFFFF] dark:bg-[#282C27] border-[#D8D0C2] dark:border-[#363D34] shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => onToggleTaken(item.medicineId)}
                          className={`w-6 h-6 rounded-md flex items-center justify-center transition cursor-pointer shrink-0 mt-0.5 ${
                            item.taken
                              ? 'bg-[#5A7359] dark:bg-[#879B87] text-white'
                              : 'border-2 border-[#D8D0C2] dark:border-[#363D34] hover:border-[#879B87]'
                          }`}
                          aria-label="Toggle taken status"
                        >
                          {item.taken && <Check className="w-4 h-4" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-semibold ${
                                item.taken
                                  ? 'line-through text-[#92958F] dark:text-[#889083]'
                                  : 'text-[#2F322E] dark:text-[#F3EFE8]'
                              }`}
                            >
                              {item.medicineName}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#2F342E] text-[#2F322E] dark:text-[#F3EFE8] font-medium">
                              {item.dosage}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-1">
                            <span className="flex items-center gap-1">
                              <Utensils className="w-3.5 h-3.5 text-[#879B87]" />
                              {item.foodInstruction}
                            </span>
                            {item.taken && item.takenAt && (
                              <span className="text-[#5A7359] dark:text-[#95A895] font-medium">
                                Taken at {item.takenAt}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right button state */}
                      <button
                        onClick={() => onToggleTaken(item.medicineId)}
                        className={`self-end sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          item.taken
                            ? 'bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895]'
                            : 'bg-[#5A7359] hover:bg-[#485D47] text-white shadow-2xs'
                        }`}
                      >
                        {item.taken ? t('taken_badge', 'Taken ✓') : t('btn_mark_taken', 'Mark as taken')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

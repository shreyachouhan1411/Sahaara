import React, { useState } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Utensils,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ScannedMedicine } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';

interface MedicineCabinetViewProps {
  medicines: ScannedMedicine[];
  onOpenScanner: () => void;
  onSelectMedicine?: (med: ScannedMedicine) => void;
}

export const MedicineCabinetView: React.FC<MedicineCabinetViewProps> = ({
  medicines,
  onOpenScanner,
  onSelectMedicine,
}) => {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'needs_review' | 'expiring_soon'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.medicineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.activeIngredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (med.category && med.category.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'current') return med.status === 'current';
    if (activeTab === 'needs_review') return med.status === 'needs_review' || med.needsReview;
    if (activeTab === 'expiring_soon') return med.status === 'expiring_soon';
    return true;
  });

  const needsReviewCount = medicines.filter((m) => m.needsReview || m.status === 'needs_review').length;
  const expiringCount = medicines.filter((m) => m.status === 'expiring_soon').length;

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-1">
            Active Pharmacopeia
          </span>
          <h2 className="text-xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
            {t('cabinet_title', 'My Medicines')}
          </h2>
          <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
            Active medications, verification records, and patient-friendly explanations.
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="px-4 py-2 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white text-xs font-medium flex items-center gap-2 transition cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Scan New Medicine</span>
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#DCE5D9] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8]'
                : 'text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621]'
            }`}
          >
            All ({medicines.length})
          </button>
          <button
            onClick={() => setActiveTab('current')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'current'
                ? 'bg-[#DCE5D9] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8]'
                : 'text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621]'
            }`}
          >
            {t('tab_current', 'Current')}
          </button>
          <button
            onClick={() => setActiveTab('needs_review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'needs_review'
                ? 'bg-[#B7924F] text-white'
                : 'text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621]'
            }`}
          >
            {t('tab_needs_review', 'Needs Review')}{' '}
            {needsReviewCount > 0 && `(${needsReviewCount})`}
          </button>
          <button
            onClick={() => setActiveTab('expiring_soon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'expiring_soon'
                ? 'bg-[#B2614B] text-white'
                : 'text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621]'
            }`}
          >
            {t('tab_expiring_soon', 'Expiring Soon')}{' '}
            {expiringCount > 0 && `(${expiringCount})`}
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 text-[#92958F] dark:text-[#889083] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicine, salt, or category..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-xs text-[#2F322E] dark:text-[#F3EFE8] focus:outline-none focus:ring-1 focus:ring-[#879B87]"
          />
        </div>
      </div>

      {/* Medicines Grid */}
      {filteredMedicines.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#6D716B] dark:text-[#889083]">
          No medicines match your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMedicines.map((med) => {
            const isExpiring = med.status === 'expiring_soon';
            const isReview = med.needsReview || med.status === 'needs_review';
            const explanationText =
              language === 'hi' && med.generalUseHi
                ? med.generalUseHi
                : med.generalUse ||
                  (language === 'hi' && med.simpleExplanationHi
                    ? med.simpleExplanationHi
                    : med.simpleExplanation);

            return (
              <div
                key={med.id}
                className="p-5 rounded-2xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87] transition flex flex-col justify-between gap-4 shadow-xs"
              >
                <div>
                  {/* Top: Category & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    {med.category ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895]">
                        {med.category}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EEEAE1] dark:bg-[#282C27] text-[#6D716B] dark:text-[#BDC2B8]">
                        MEDICINE
                      </span>
                    )}

                    {isReview ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#B7924F]/20 text-[#635A51] dark:text-[#CBA457] flex items-center gap-1 shrink-0">
                        <AlertTriangle className="w-3 h-3" />
                        Needs Review
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Name & Form */}
                  <h3 className="text-base font-semibold text-[#2F322E] dark:text-[#F3EFE8] leading-snug">
                    {med.medicineName}
                  </h3>
                  <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
                    {med.strength} · {med.dosageForm}
                  </p>

                  {/* Patient-Friendly Explanation of What it is Generally Used For */}
                  {explanationText && (
                    <div className="mt-3 p-3 rounded-xl bg-[#F5F2EA] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-1">
                        {language === 'hi' ? 'यह दवा किस लिए है' : 'Commonly used for'}
                      </span>
                      <p className="text-xs text-[#2F322E] dark:text-[#F3EFE8] leading-relaxed">
                        {explanationText}
                      </p>
                    </div>
                  )}

                  {/* Timing & Expiry */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#6D716B] dark:text-[#BDC2B8] mt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#879B87]" />
                      {med.timing || 'Daily'} ({med.foodInstruction || 'With water'})
                    </span>
                    {med.expiryDate && (
                      <span className={isExpiring ? 'text-[#B2614B] font-bold' : ''}>
                        Exp: {med.expiryDate} {isExpiring && '(28 days left)'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer link to Detail Modal */}
                <div className="pt-3 border-t border-[#E3DCCF] dark:border-[#363D34] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#92958F] dark:text-[#889083]">
                    {t('last_verified_prefix', 'Last verified')} {med.scannedAt}
                  </span>
                  <button
                    onClick={() => onSelectMedicine && onSelectMedicine(med)}
                    className="font-medium text-[#5A7359] dark:text-[#95A895] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View medicine details</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

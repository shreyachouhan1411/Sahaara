import React, { useState } from 'react';
import { CheckCircle2, HelpCircle, FileText, ChevronRight, X, AlertCircle } from 'lucide-react';
import { Prescription, ScannedMedicine } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';

interface PrescriptionMatchCardProps {
  prescription: Prescription | null;
  medicines: ScannedMedicine[];
  onOpenScanner?: () => void;
}

export const PrescriptionMatchCard: React.FC<PrescriptionMatchCardProps> = ({
  prescription,
  medicines,
  onOpenScanner,
}) => {
  const { t } = useI18n();
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  if (!prescription || !prescription.items || prescription.items.length === 0) {
    return (
      <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3">
        <FileText className="w-8 h-8 text-[#A8B7A5]" />
        <div>
          <h3 className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
            No Prescription Linked Yet
          </h3>
          <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] max-w-sm mt-1">
            Scan your doctor’s prescription slip to enable automated safety matching against your medicine cabinet.
          </p>
        </div>
        {onOpenScanner && (
          <button
            onClick={onOpenScanner}
            className="px-4 py-2 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white text-xs font-semibold cursor-pointer shadow-xs mt-1 transition-colors"
          >
            Scan Prescription Slip
          </button>
        )}
      </div>
    );
  }

  // Count matches
  const matchedItems = prescription.items.filter((i) => i.reconciliationStatus === 'matched');
  const needsReviewItems = prescription.items.filter((i) => i.reconciliationStatus === 'needs_review');

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 shadow-xs flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895]">
              {t('prescription_match_title', 'Prescription Reconciliation')}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] font-medium">
              Dr. {prescription.doctorName}
            </span>
          </div>
          <h3 className="text-base font-serif font-medium text-[#2F322E] dark:text-[#F3EFE8]">
            YOUR PRESCRIPTION
          </h3>
        </div>

        {/* Counter Summary */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895]">
            ✓ {matchedItems.length} matched
          </span>
          {needsReviewItems.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#B7924F]/20 text-[#635A51] dark:text-[#CBA457]">
              ? {needsReviewItems.length} needs review
            </span>
          )}
        </div>
      </div>

      {/* Prescription items list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prescription.items.map((item) => {
          const isMatched = item.reconciliationStatus === 'matched';
          const matchedMed = medicines.find((m) => m.id === item.matchedMedicineId);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem({ item, matchedMed })}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                isMatched
                  ? 'bg-[#FCFBF7] dark:bg-[#222621] border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87]'
                  : 'bg-[#FCFBF7] dark:bg-[#222621] border-[#D8D0C2] dark:border-[#363D34] hover:border-[#B7924F]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {isMatched ? (
                  <CheckCircle2 className="w-4 h-4 text-[#5A7359] dark:text-[#95A895] shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-[#CBA457] shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8] leading-snug">
                    {item.medicineName}
                  </h4>
                  <div className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
                    {item.dosage} · {item.frequency}
                  </div>
                  {isMatched && matchedMed && (
                    <div className="text-[10px] text-[#5A7359] dark:text-[#95A895] font-medium mt-1">
                      Matched to: {matchedMed.medicineName}
                    </div>
                  )}
                  {!isMatched && (
                    <div className="text-[10px] text-[#CBA457] font-medium mt-1">
                      Pending cabinet verification
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#889083] shrink-0 mt-1" />
            </div>
          );
        })}
      </div>

      {/* Detail Drawer Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E3DCCF] dark:border-[#363D34]">
              <div className="flex items-center gap-2">
                {selectedItem.item.reconciliationStatus === 'matched' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#CBA457]" />
                )}
                <h3 className="font-semibold text-sm text-[#2F322E] dark:text-[#F3EFE8]">
                  {selectedItem.item.medicineName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-6 h-6 rounded-full hover:bg-[#F5F2EA] dark:hover:bg-[#222621] flex items-center justify-center cursor-pointer text-[#6D716B] dark:text-[#BDC2B8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34]">
                <span className="text-[10px] text-[#6D716B] dark:text-[#BDC2B8] uppercase font-bold block mb-1">
                  Prescribed Directions by Doctor
                </span>
                <p className="text-[#2F322E] dark:text-[#F3EFE8] font-medium">
                  {selectedItem.item.dosage} — {selectedItem.item.frequency} ({selectedItem.item.timing})
                </p>
                {selectedItem.item.instructions && (
                  <p className="text-[#6D716B] dark:text-[#BDC2B8] text-[11px] mt-1">
                    Special notes: {selectedItem.item.instructions}
                  </p>
                )}
              </div>

              {selectedItem.matchedMed ? (
                <div className="p-3 rounded-lg bg-[#DCE5D9]/40 dark:bg-[#242D23] border border-[#A8B7A5]/40">
                  <span className="text-[10px] text-[#5A7359] dark:text-[#95A895] uppercase font-bold block mb-1">
                    Physical Package in Cabinet
                  </span>
                  <p className="text-[#2F322E] dark:text-[#F3EFE8] font-medium">
                    {selectedItem.matchedMed.medicineName} ({selectedItem.matchedMed.dosageForm})
                  </p>
                  <p className="text-[#6D716B] dark:text-[#BDC2B8] text-[11px] mt-0.5">
                    Expiry: {selectedItem.matchedMed.expiryDate || 'N/A'} · Verified:{' '}
                    {selectedItem.matchedMed.scannedAt}
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#B7924F]/10 dark:bg-[#2E281C] border border-[#B7924F]/30">
                  <span className="text-[10px] text-[#CBA457] uppercase font-bold block mb-1">
                    Cabinet Status: Not Verified
                  </span>
                  <p className="text-[#2F322E] dark:text-[#F3EFE8]">
                    This medication has not yet been identified in your active medicine box. Please scan the bottle or verify whether this course has concluded.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="mt-2 w-full py-2 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white font-medium cursor-pointer transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

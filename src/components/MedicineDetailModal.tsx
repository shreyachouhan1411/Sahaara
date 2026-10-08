import React from 'react';
import {
  X,
  ShieldCheck,
  AlertCircle,
  Clock,
  Utensils,
  CheckCircle2,
  HelpCircle,
  FileText,
  Tag,
  Info,
  Calendar,
} from 'lucide-react';
import { ScannedMedicine } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';

interface MedicineDetailModalProps {
  medicine: ScannedMedicine | null;
  onClose: () => void;
}

export const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({
  medicine,
  onClose,
}) => {
  const { t, language } = useI18n();

  if (!medicine) return null;

  const simpleExplanationText =
    language === 'hi' && medicine.simpleExplanationHi
      ? medicine.simpleExplanationHi
      : medicine.simpleExplanation;

  const generalUseText =
    language === 'hi' && medicine.generalUseHi
      ? medicine.generalUseHi
      : medicine.generalUse;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FCFBF7] dark:bg-[#1C201C] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto my-auto text-[#2F322E] dark:text-[#F3EFE8] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
          <div>
            {medicine.category && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] mb-1.5">
                {medicine.category}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-serif font-medium leading-tight">
              {medicine.medicineName}
            </h2>
            <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
              {medicine.strength} · {medicine.dosageForm}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#EEEAE1] dark:hover:bg-[#282C27] text-[#6D716B] dark:text-[#BDC2B8] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. What it is generally used for (Patient-friendly explanation) */}
        {generalUseText && (
          <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-1">
              {language === 'hi' ? 'यह दवा आमतौर पर किस लिए है' : 'What it is generally used for'}
            </span>
            <p className="text-xs md:text-sm text-[#2F322E] dark:text-[#F3EFE8] leading-relaxed">
              {generalUseText}
            </p>
            <span className="text-[10px] text-[#92958F] dark:text-[#889083] mt-2 block italic">
              *General pharmacological information. Consult your physician regarding your personal care plan.
            </span>
          </div>
        )}

        {/* 2. In Simple Words */}
        {simpleExplanationText && (
          <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6D716B] dark:text-[#BDC2B8] block mb-1">
              {language === 'hi' ? 'सरल शब्दों में' : 'In Simple Words'}
            </span>
            <p className="text-xs md:text-sm text-[#2F322E] dark:text-[#F3EFE8] leading-relaxed">
              {simpleExplanationText}
            </p>
          </div>
        )}

        {/* 3. Prescription Instructions vs Packaging */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-1">
              From Prescription Slip
            </span>
            <p className="font-medium text-[#2F322E] dark:text-[#F3EFE8]">
              {medicine.prescriptionInstruction || 'Not specified on current prescription'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D716B] dark:text-[#BDC2B8] block mb-1">
              Timing & Food
            </span>
            <p className="font-medium text-[#2F322E] dark:text-[#F3EFE8]">
              {medicine.timing || 'Daily'} · {medicine.foodInstruction || 'With water'}
            </p>
          </div>
        </div>

        {/* 4. What Sahaara Could Verify vs What We Couldn't Verify */}
        <div className="p-4 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] flex flex-col gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-2">
              What Sahaara Could Verify
            </span>
            {medicine.whatWeCouldVerify && medicine.whatWeCouldVerify.length > 0 ? (
              <ul className="space-y-1 text-xs">
                {medicine.whatWeCouldVerify.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[#2F322E] dark:text-[#F3EFE8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8]">
                Basic package labels detected.
              </p>
            )}
          </div>

          {medicine.whatWeCouldntVerify && medicine.whatWeCouldntVerify.length > 0 && (
            <div className="pt-2 border-t border-[#E3DCCF] dark:border-[#363D34]">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#CBA457] block mb-1.5">
                What We Couldn't Verify
              </span>
              <ul className="space-y-1 text-xs text-[#6D716B] dark:text-[#BDC2B8]">
                {medicine.whatWeCouldntVerify.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#CBA457] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 5. Clinical Safety Advisory */}
        {medicine.clinicalAdvisory && (
          <div className="p-3.5 rounded-xl bg-[#DCE5D9]/40 dark:bg-[#242D23] border border-[#A8B7A5]/40 text-xs">
            <span className="font-semibold text-[#5A7359] dark:text-[#95A895] block mb-1">
              Safety Reminder
            </span>
            <p className="text-[#6D716B] dark:text-[#BDC2B8] leading-relaxed">
              {medicine.clinicalAdvisory}
            </p>
          </div>
        )}

        {/* Footer with Source & Verification timestamp */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E3DCCF] dark:border-[#363D34] text-[11px] text-[#92958F] dark:text-[#889083]">
          <span>Source: {medicine.source || 'Medicine packaging & OCR'}</span>
          <span>Verified: {medicine.scannedAt}</span>
        </div>
      </div>
    </div>
  );
};

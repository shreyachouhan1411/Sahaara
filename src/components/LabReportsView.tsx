import React from 'react';
import { Activity, Plus, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react';
import { LabReport } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';

interface LabReportsViewProps {
  reports: LabReport[];
  onOpenScanner: () => void;
}

export const LabReportsView: React.FC<LabReportsViewProps> = ({
  reports,
  onOpenScanner,
}) => {
  const { t } = useI18n();

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-1">
            Diagnostic Health Record
          </span>
          <h2 className="text-xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
            {t('nav_lab_reports', 'Lab Reports')}
          </h2>
          <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
            Biomarker parameters, renal tolerance, and clinical metabolic indicators.
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="px-4 py-2 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Scan New Lab Report</span>
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#6D716B] dark:text-[#889083]">
          No lab reports scanned yet. Click "Scan New Lab Report" to upload a blood test PDF or photo.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E3DCCF] dark:border-[#363D34]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                      {report.reportName}
                    </h3>
                    <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
                      {report.labName} · {report.reportDate}
                    </span>
                  </div>
                </div>

                <span className="text-xs px-2.5 py-1 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] font-medium self-start sm:self-auto">
                  {report.patientName}
                </span>
              </div>

              {report.summary && (
                <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] leading-relaxed bg-[#FFFFFF] dark:bg-[#282C27] p-3 rounded-xl border border-[#E3DCCF] dark:border-[#363D34]">
                  Clinical Summary: {report.summary}
                </p>
              )}

              {/* Biomarkers Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {report.parameters.map((param, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-[#2F322E] dark:text-[#F3EFE8] leading-snug">
                        {param.parameterName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          param.status === 'normal'
                            ? 'bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895]'
                            : 'bg-[#B7924F]/20 text-[#635A51] dark:text-[#CBA457]'
                        }`}
                      >
                        {param.status}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-[#2F322E] dark:text-[#F3EFE8]">
                        {param.value}
                      </span>
                      <span className="text-xs text-[#6D716B] dark:text-[#BDC2B8]">
                        {param.unit}
                      </span>
                      <span className="text-[10px] text-[#92958F] dark:text-[#889083] ml-auto">
                        Ref: {param.referenceRange}
                      </span>
                    </div>

                    {param.simpleExplanation && (
                      <p className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] leading-tight pt-1.5 border-t border-dashed border-[#E3DCCF] dark:border-[#363D34]">
                        {param.simpleExplanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

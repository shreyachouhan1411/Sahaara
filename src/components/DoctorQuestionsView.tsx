import React, { useState } from 'react';
import {
  HelpCircle,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { DoctorQuestion } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';

interface DoctorQuestionsViewProps {
  questions: DoctorQuestion[];
  onAddQuestion: (q: DoctorQuestion) => void;
  onDeleteQuestion: (id: string) => void;
  onOpenAppointmentBrief: () => void;
}

export const DoctorQuestionsView: React.FC<DoctorQuestionsViewProps> = ({
  questions,
  onAddQuestion,
  onDeleteQuestion,
  onOpenAppointmentBrief,
}) => {
  const { t, language } = useI18n();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategory, setNewCategory] = useState<'Safety' | 'Timing' | 'Duration' | 'Reconciliation'>('Safety');

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: DoctorQuestion = {
      id: `custom-q-${Date.now()}`,
      category: newCategory,
      question: newQuestionText.trim(),
      context: 'Patient formulated question for upcoming clinical visit.',
      isCustom: true,
      saved: true,
    };

    onAddQuestion(newQ);
    setNewQuestionText('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-1">
            Physician Empowerment
          </span>
          <h2 className="text-xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
            {t('doctor_questions_title', 'Doctor Questions')}
          </h2>
          <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
            {t(
              'doctor_questions_subtitle',
              'Personalized questions automatically synthesized from your actual medicines and safety findings.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('btn_add_custom_question', 'Add Question')}</span>
          </button>
          <button
            onClick={onOpenAppointmentBrief}
            className="px-3.5 py-2 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] text-xs font-medium text-[#2F322E] dark:text-[#F3EFE8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
            <span>Print All</span>
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="flex flex-col gap-3">
        {questions.map((q) => {
          const isCopied = copiedId === q.id;
          const questionText = language === 'hi' && q.questionHi ? q.questionHi : q.question;
          const contextText = language === 'hi' && q.contextHi ? q.contextHi : q.context;

          return (
            <div
              key={q.id}
              className="p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87] transition flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="w-7 h-7 rounded-lg bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] flex items-center justify-center shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#5A7359] dark:text-[#95A895] px-2 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#242D23]">
                      {q.category}
                    </span>
                    {q.isCustom && (
                      <span className="text-[10px] text-[#6D716B] dark:text-[#BDC2B8]">
                        Added by you
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-[#2F322E] dark:text-[#F3EFE8] leading-snug">
                    {questionText}
                  </h3>
                  <p className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] mt-1 leading-relaxed">
                    Context: {contextText}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                <button
                  onClick={() => copyToClipboard(q.id, questionText)}
                  className="px-2.5 py-1.5 rounded-md border border-[#D8D0C2] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#282C27] text-[11px] font-medium flex items-center gap-1 cursor-pointer transition"
                  title="Copy question text"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : t('btn_copy_question', 'Copy')}</span>
                </button>
                <button
                  onClick={() => onDeleteQuestion(q.id)}
                  className="p-1.5 rounded-md text-[#92958F] dark:text-[#889083] hover:text-[#B2614B] hover:bg-[#F5F2EA] dark:hover:bg-[#282C27] transition cursor-pointer"
                  title="Remove question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Question Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-sm text-[#2F322E] dark:text-[#F3EFE8]">
              Add Question for Your Physician
            </h3>

            <form onSubmit={handleCreateCustom} className="flex flex-col gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#2F322E] dark:text-[#F3EFE8] mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8]"
                >
                  <option value="Safety">Safety & Side Effects</option>
                  <option value="Timing">Dosage Timing</option>
                  <option value="Duration">Course Duration & Refills</option>
                  <option value="Reconciliation">Prescription Reconciliation</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2F322E] dark:text-[#F3EFE8] mb-1">
                  Question
                </label>
                <textarea
                  required
                  rows={3}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. Can I take this with milk instead of water?"
                  className="w-full px-3 py-2 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] focus:ring-1 focus:ring-[#879B87]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white font-medium cursor-pointer transition-colors"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

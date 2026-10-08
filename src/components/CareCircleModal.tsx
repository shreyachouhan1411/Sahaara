import React, { useState } from 'react';
import { Users, X, Check, ShieldCheck, Share2, Plus, Copy } from 'lucide-react';
import { CareCircleMember } from '../modules/types';
import { useI18n } from '../modules/i18n/I18nContext';

interface CareCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: CareCircleMember[];
  onUpdateMember: (members: CareCircleMember[]) => void;
}

export const CareCircleModal: React.FC<CareCircleModalProps> = ({
  isOpen,
  onClose,
  members,
  onUpdateMember,
}) => {
  const { t } = useI18n();
  const [copiedLink, setCopiedLink] = useState(false);
  const [memberList, setMemberList] = useState<CareCircleMember[]>(members);
  const [newMemberName, setNewMemberName] = useState('');
  const [newRelation, setNewRelation] = useState('');

  if (!isOpen) return null;

  const togglePermission = (memberId: string, perm: keyof CareCircleMember['permissions']) => {
    const updated = memberList.map((m) => {
      if (m.id === memberId) {
        return {
          ...m,
          permissions: {
            ...m.permissions,
            [perm]: !m.permissions[perm],
          },
        };
      }
      return m;
    });
    setMemberList(updated);
    onUpdateMember(updated);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newM: CareCircleMember = {
      id: `care-${Date.now()}`,
      name: newMemberName.trim(),
      relation: newRelation.trim() || 'Caregiver',
      permissions: {
        schedule: true,
        medicines: true,
        reports: false,
        questions: true,
      },
      lastAccessed: 'Just invited',
    };

    const updated = [...memberList, newM];
    setMemberList(updated);
    onUpdateMember(updated);
    setNewMemberName('');
    setNewRelation('');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText('https://sahaara.health/care-circle/invite?token=shreya-care-8921');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl max-w-xl w-full p-6 md:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto my-auto text-[#2F322E] dark:text-[#F3EFE8]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895]">
                Family & Caregiver Access
              </span>
            </div>
            <h2 className="text-xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
              {t('care_circle_title', 'Care Circle')}
            </h2>
            <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
              {t(
                'care_circle_subtitle',
                'Share peace of mind with family caregivers. You control exactly what is shared.'
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F5F2EA] dark:hover:bg-[#282C27] text-[#6D716B] dark:text-[#BDC2B8] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Members List with granular permissions */}
        <div className="flex flex-col gap-4">
          {memberList.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex flex-col gap-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-[#2F322E] dark:text-[#F3EFE8]">
                    {m.name}
                  </span>
                  <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] ml-2">
                    ({m.relation})
                  </span>
                </div>
                {m.lastAccessed && (
                  <span className="text-[10px] text-[#92958F] dark:text-[#889083]">
                    {m.lastAccessed}
                  </span>
                )}
              </div>

              {/* Granular Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-dashed border-[#E3DCCF] dark:border-[#363D34]">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-[#2F322E] dark:text-[#F3EFE8]">
                  <input
                    type="checkbox"
                    checked={m.permissions.schedule}
                    onChange={() => togglePermission(m.id, 'schedule')}
                    className="accent-[#5A7359] rounded-xs"
                  />
                  <span>{t('share_option_schedule', 'Medication schedule & reminders')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-[#2F322E] dark:text-[#F3EFE8]">
                  <input
                    type="checkbox"
                    checked={m.permissions.medicines}
                    onChange={() => togglePermission(m.id, 'medicines')}
                    className="accent-[#5A7359] rounded-xs"
                  />
                  <span>{t('share_option_medicines', 'Current active medicines')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-[#2F322E] dark:text-[#F3EFE8]">
                  <input
                    type="checkbox"
                    checked={m.permissions.reports}
                    onChange={() => togglePermission(m.id, 'reports')}
                    className="accent-[#5A7359] rounded-xs"
                  />
                  <span>{t('share_option_reports', 'Lab test reports')}</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-[#2F322E] dark:text-[#F3EFE8]">
                  <input
                    type="checkbox"
                    checked={m.permissions.questions}
                    onChange={() => togglePermission(m.id, 'questions')}
                    className="accent-[#5A7359] rounded-xs"
                  />
                  <span>{t('share_option_questions', 'Appointment questions')}</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        {/* Add Caregiver Form */}
        <form
          onSubmit={handleAddMember}
          className="p-4 rounded-xl bg-[#F5F2EA] dark:bg-[#222621] border border-[#D8D0C2] dark:border-[#363D34] flex flex-col gap-3 text-xs"
        >
          <span className="font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
            Add Family Caregiver
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              required
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Caregiver Name (e.g. Mom, Amit)"
              className="flex-1 px-3 py-2 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-white dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8]"
            />
            <input
              type="text"
              value={newRelation}
              onChange={(e) => setNewRelation(e.target.value)}
              placeholder="Relation (e.g. Spouse)"
              className="w-full sm:w-32 px-3 py-2 rounded-lg border border-[#E3DCCF] dark:border-[#363D34] bg-white dark:bg-[#282C27] text-[#2F322E] dark:text-[#F3EFE8]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white font-medium cursor-pointer shrink-0 transition-colors"
            >
              Add
            </button>
          </div>
        </form>

        {/* Invite link with PIN */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] text-xs">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#5A7359] dark:text-[#95A895]" />
            <span className="text-[#2F322E] dark:text-[#F3EFE8] font-medium">
              Caregiver Access Link (Secure PIN 4092)
            </span>
          </div>
          <button
            onClick={copyShareLink}
            className="px-3 py-1.5 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] text-[11px] font-semibold text-[#6D716B] dark:text-[#BDC2B8] hover:bg-white dark:hover:bg-[#282C27] flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

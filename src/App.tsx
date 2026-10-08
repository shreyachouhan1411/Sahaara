import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from './modules/theme/ThemeContext';
import { I18nProvider, useI18n } from './modules/i18n/I18nContext';
import { Sidebar, ActiveNavTab } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { TopHeader } from './components/TopHeader';
import { LoginOnboarding } from './components/LoginOnboarding';
import { HomeView } from './components/HomeView';
import { ScannerView } from './components/ScannerView';
import { MyDayTimeline } from './components/MyDayTimeline';
import { MedicineCabinetView } from './components/MedicineCabinetView';
import { PrescriptionMatchCard } from './components/PrescriptionMatchCard';
import { HealthThreadView } from './components/HealthThreadView';
import { DoctorQuestionsView } from './components/DoctorQuestionsView';
import { LabReportsView } from './components/LabReportsView';
import { SettingsView } from './components/SettingsView';
import { AppointmentBriefModal } from './components/AppointmentBriefModal';
import { CareCircleModal } from './components/CareCircleModal';
import { MedicineDetailModal } from './components/MedicineDetailModal';

import {
  UserProfile,
  ScannedMedicine,
  Prescription,
  SafetyFinding,
  LabReport,
  HealthEvent,
  DoctorQuestion,
  CareCircleMember,
} from './modules/types';

import {
  demoUser,
  demoPrescription,
  demoMedicines,
  demoSafetyFindings,
  demoLabReport,
  demoHealthEvents,
  demoDoctorQuestions,
  demoCareCircleMembers,
} from './modules/demo/demoData';

import {
  evaluateInteractions,
  reconcilePrescriptionWithMedicines,
} from './modules/safety-engine';

import { buildMedicationTimeline } from './modules/care';

const USER_STORAGE_KEY = 'sahaara_active_user';
const MEDS_STORAGE_KEY = 'sahaara_user_meds';
const RX_STORAGE_KEY = 'sahaara_user_rx';
const DEMO_MODE_STORAGE_KEY = 'sahaara_demo_active';

function MainApplication() {
  const { t } = useI18n();

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Demo mode flag
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('home');

  // Modals
  const [isAppointmentBriefOpen, setIsAppointmentBriefOpen] = useState(false);
  const [isCareCircleModalOpen, setIsCareCircleModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<ScannedMedicine | null>(null);

  // Active datasets (user or demo)
  const [medicines, setMedicines] = useState<ScannedMedicine[]>(() => {
    if (isDemoMode) return demoMedicines;
    try {
      const stored = localStorage.getItem(MEDS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [prescription, setPrescription] = useState<Prescription | null>(() => {
    if (isDemoMode) return demoPrescription;
    try {
      const stored = localStorage.getItem(RX_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    if (isDemoMode) return [demoLabReport];
    return [];
  });

  const [healthEvents, setHealthEvents] = useState<HealthEvent[]>(() => {
    if (isDemoMode) return demoHealthEvents;
    return [];
  });

  const [doctorQuestions, setDoctorQuestions] = useState<DoctorQuestion[]>(() => {
    if (isDemoMode) return demoDoctorQuestions;
    return [];
  });

  const [careCircleMembers, setCareCircleMembers] = useState<CareCircleMember[]>(() => {
    if (isDemoMode) return demoCareCircleMembers;
    return [];
  });

  // Switch into Demo Mode
  const handleStartDemo = () => {
    setIsDemoMode(true);
    setUser(demoUser);
    setMedicines(demoMedicines);
    setPrescription(demoPrescription);
    setLabReports([demoLabReport]);
    setHealthEvents(demoHealthEvents);
    setDoctorQuestions(demoDoctorQuestions);
    setCareCircleMembers(demoCareCircleMembers);
    setActiveTab('home');
    try {
      localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
    } catch {}
  };

  // Exit Demo Mode and return to real user space
  const handleExitDemo = () => {
    setIsDemoMode(false);
    try {
      localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      setUser(savedUser ? JSON.parse(savedUser) : null);
      const savedMeds = localStorage.getItem(MEDS_STORAGE_KEY);
      setMedicines(savedMeds ? JSON.parse(savedMeds) : []);
      const savedRx = localStorage.getItem(RX_STORAGE_KEY);
      setPrescription(savedRx ? JSON.parse(savedRx) : null);
      setLabReports([]);
      setHealthEvents([]);
      setDoctorQuestions([]);
      setCareCircleMembers([]);
    } catch {}
    setActiveTab('home');
  };

  // Save regular user profile
  const handleUserComplete = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
  };

  // Sign out
  const handleSignOut = () => {
    setUser(null);
    setIsDemoMode(false);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
      localStorage.removeItem(MEDS_STORAGE_KEY);
      localStorage.removeItem(RX_STORAGE_KEY);
    } catch {}
    setActiveTab('home');
  };

  const handleResetData = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  // Synchronize user medicines into localStorage if not in demo mode
  useEffect(() => {
    if (!isDemoMode && user) {
      try {
        localStorage.setItem(MEDS_STORAGE_KEY, JSON.stringify(medicines));
      } catch {}
    }
  }, [medicines, isDemoMode, user]);

  // Synchronize prescription
  useEffect(() => {
    if (!isDemoMode && user && prescription) {
      try {
        localStorage.setItem(RX_STORAGE_KEY, JSON.stringify(prescription));
      } catch {}
    }
  }, [prescription, isDemoMode, user]);

  // Compute safety findings and interactions dynamically
  const safetyFindings = useMemo<SafetyFinding[]>(() => {
    if (isDemoMode) return demoSafetyFindings;
    return evaluateInteractions(medicines);
  }, [medicines, isDemoMode]);

  // Reconcile prescription with cabinet medicines
  useMemo(() => {
    if (prescription) {
      reconcilePrescriptionWithMedicines(prescription, medicines);
    }
  }, [prescription, medicines]);

  // Build daily timeline
  const medicationTimeline = useMemo(() => {
    return buildMedicationTimeline(medicines);
  }, [medicines]);

  // Handle Mark as Taken toggle
  const handleToggleTaken = (medId: string) => {
    const updated = medicines.map((m) => {
      if (m.id === medId) {
        const nextTaken = !m.takenToday;
        return {
          ...m,
          takenToday: nextTaken,
          takenAt: nextTaken
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : undefined,
        };
      }
      return m;
    });
    setMedicines(updated);

    // Also add to health events
    const med = medicines.find((m) => m.id === medId);
    if (med && !med.takenToday) {
      const newEvt: HealthEvent = {
        id: `evt-taken-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Dose taken: ${med.medicineName}`,
        titleHi: `खुराक ली गई: ${med.medicineName}`,
        description: `${med.strength} recorded as taken with food directions.`,
        descriptionHi: `${med.strength} की खुराक ली गई।`,
        category: 'dose_taken',
        iconType: 'Check',
      };
      setHealthEvents((prev) => [newEvt, ...prev]);
    }
  };

  // Add newly scanned medicine
  const handleMedicineAdded = (newMed: ScannedMedicine) => {
    setMedicines((prev) => [newMed, ...prev]);
    setActiveTab('medicines');

    // Add health thread event
    const newEvt: HealthEvent = {
      id: `evt-scan-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Medicine Added: ${newMed.medicineName}`,
      titleHi: `दवा जोड़ी गई: ${newMed.medicineName}`,
      description: `Identified active molecule: ${newMed.genericName}. Confidence: ${newMed.confidence}.`,
      descriptionHi: `सक्रिय तत्व: ${newMed.genericName}.`,
      category: 'scan',
      iconType: 'Camera',
    };
    setHealthEvents((prev) => [newEvt, ...prev]);
  };

  // Add newly scanned prescription
  const handlePrescriptionAdded = (newRx: Prescription) => {
    setPrescription(newRx);
    setActiveTab('prescription_match');

    const newEvt: HealthEvent = {
      id: `evt-rx-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Prescription Registered: Dr. ${newRx.doctorName}`,
      titleHi: `डॉक्टर का पर्चा दर्ज: Dr. ${newRx.doctorName}`,
      description: `${newRx.items.length} prescribed items added for safety reconciliation.`,
      descriptionHi: `${newRx.items.length} दवाएं मिलान के लिए दर्ज।`,
      category: 'prescription',
      iconType: 'FileText',
    };
    setHealthEvents((prev) => [newEvt, ...prev]);
  };

  // Add lab report
  const handleReportAdded = (newReport: LabReport) => {
    setLabReports((prev) => [newReport, ...prev]);
    setActiveTab('lab_reports');

    const newEvt: HealthEvent = {
      id: `evt-rep-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: `Lab Report Processed: ${newReport.reportName}`,
      titleHi: `लैब रिपोर्ट दर्ज: ${newReport.reportName}`,
      description: `${newReport.parameters.length} biomarker indicators tracked.`,
      descriptionHi: `${newReport.parameters.length} जांच मापदंड दर्ज।`,
      category: 'lab_report',
      iconType: 'Activity',
    };
    setHealthEvents((prev) => [newEvt, ...prev]);
  };

  // Doctor Question manager
  const handleAddQuestion = (q: DoctorQuestion) => {
    setDoctorQuestions((prev) => [q, ...prev]);
  };

  const handleDeleteQuestion = (id: string) => {
    setDoctorQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // If no user and not demo mode -> Show Welcome Onboarding
  if (!user && !isDemoMode) {
    return (
      <LoginOnboarding
        onComplete={handleUserComplete}
        onStartDemo={handleStartDemo}
      />
    );
  }

  const needsReviewCount = medicines.filter((m) => m.needsReview || m.status === 'needs_review').length;

  return (
    <div className="min-h-screen bg-[#F5F2EA] dark:bg-[#151815] text-[#2F322E] dark:text-[#F3EFE8] flex flex-col md:flex-row transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAppointmentBrief={() => setIsAppointmentBriefOpen(true)}
        isDemoMode={isDemoMode}
        onStartDemo={handleStartDemo}
        needsReviewCount={needsReviewCount}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          user={user}
          isDemoMode={isDemoMode}
          onExitDemo={handleExitDemo}
          onStartDemo={handleStartDemo}
          title={
            activeTab === 'home'
              ? undefined
              : activeTab === 'my_day'
              ? t('my_day_title', 'My Day')
              : activeTab === 'medicines'
              ? t('cabinet_title', 'My Medicines')
              : activeTab === 'scan'
              ? t('nav_scan', 'Scan')
              : activeTab === 'prescription_match'
              ? t('prescription_match_title', 'Prescription Match')
              : activeTab === 'health_thread'
              ? t('health_thread_title', 'Health Thread')
              : activeTab === 'questions'
              ? t('doctor_questions_title', 'Doctor Questions')
              : activeTab === 'lab_reports'
              ? t('nav_lab_reports', 'Lab Reports')
              : activeTab === 'settings'
              ? t('settings_title', 'Settings')
              : undefined
          }
        />

        {/* Workspace Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && (
            <HomeView
              user={user}
              medicines={medicines}
              prescription={prescription}
              findings={safetyFindings}
              healthEvents={healthEvents}
              doctorQuestions={doctorQuestions}
              onToggleTaken={handleToggleTaken}
              onNavigateToTab={(tab: string) => setActiveTab(tab as ActiveNavTab)}
              onOpenAppointmentBrief={() => setIsAppointmentBriefOpen(true)}
              onSelectMedicine={(med) => setSelectedMedicine(med)}
            />
          )}

          {activeTab === 'my_day' && (
            <MyDayTimeline
              timeline={medicationTimeline}
              onToggleTaken={handleToggleTaken}
            />
          )}

          {activeTab === 'medicines' && (
            <MedicineCabinetView
              medicines={medicines}
              onOpenScanner={() => setActiveTab('scan')}
              onSelectMedicine={(med) => setSelectedMedicine(med)}
            />
          )}

          {activeTab === 'scan' && (
            <ScannerView
              onMedicineAdded={handleMedicineAdded}
              onPrescriptionAdded={handlePrescriptionAdded}
              onReportAdded={handleReportAdded}
              onStartDemo={handleStartDemo}
            />
          )}

          {activeTab === 'prescription_match' && (
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              <PrescriptionMatchCard
                prescription={prescription}
                medicines={medicines}
                onOpenScanner={() => setActiveTab('scan')}
              />
            </div>
          )}

          {activeTab === 'health_thread' && (
            <div className="max-w-3xl mx-auto">
              <HealthThreadView events={healthEvents} />
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="max-w-3xl mx-auto">
              <DoctorQuestionsView
                questions={doctorQuestions}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onOpenAppointmentBrief={() => setIsAppointmentBriefOpen(true)}
              />
            </div>
          )}

          {activeTab === 'lab_reports' && (
            <div className="max-w-4xl mx-auto">
              <LabReportsView
                reports={labReports}
                onOpenScanner={() => setActiveTab('scan')}
              />
            </div>
          )}

          {activeTab === 'care_circle' && (
            <div className="max-w-xl mx-auto py-8">
              <div className="p-6 bg-white dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl text-center flex flex-col items-center gap-3">
                <h3 className="text-base font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                  Care Circle Family Sharing
                </h3>
                <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] max-w-sm">
                  Grant granular permission to family members to follow daily medication schedules or view appointment questions.
                </p>
                <button
                  onClick={() => setIsCareCircleModalOpen(true)}
                  className="px-4 py-2 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white text-xs font-medium cursor-pointer shadow-xs transition-colors"
                >
                  Manage Care Circle
                </button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsView
              user={user}
              onSignOut={handleSignOut}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        needsReviewCount={needsReviewCount}
      />

      {/* Appointment Brief Printable Modal */}
      <AppointmentBriefModal
        isOpen={isAppointmentBriefOpen}
        onClose={() => setIsAppointmentBriefOpen(false)}
        user={user}
        medicines={medicines}
        prescription={prescription}
        findings={safetyFindings}
        reports={labReports}
        questions={doctorQuestions}
      />

      {/* Care Circle Granular Modal */}
      <CareCircleModal
        isOpen={isCareCircleModalOpen}
        onClose={() => setIsCareCircleModalOpen(false)}
        members={careCircleMembers}
        onUpdateMember={setCareCircleMembers}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <MainApplication />
      </I18nProvider>
    </ThemeProvider>
  );
}

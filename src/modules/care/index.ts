import {
  ScannedMedicine,
  Prescription,
  SafetyFinding,
  LabReport,
  DoctorQuestion,
} from '../types';

export interface TimelineSlotItem {
  medicineId: string;
  medicineName: string;
  dosage: string;
  form: string;
  foodInstruction: string;
  timingLabel: string;
  taken: boolean;
  takenAt?: string;
  needsReview: boolean;
}

export interface DailyTimeline {
  morning: TimelineSlotItem[];
  afternoon: TimelineSlotItem[];
  evening: TimelineSlotItem[];
  night: TimelineSlotItem[];
  asNeeded: TimelineSlotItem[];
}

/**
 * Organizes active medications into time of day slots
 */
export function buildMedicationTimeline(medicines: ScannedMedicine[]): DailyTimeline {
  const timeline: DailyTimeline = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
    asNeeded: [],
  };

  medicines.forEach((med) => {
    const timingLower = (med.timing || '').toLowerCase();
    const freqLower = (med.frequency || '').toLowerCase();
    const instLower = (med.visibleInstructions || '').toLowerCase();

    const item: TimelineSlotItem = {
      medicineId: med.id,
      medicineName: med.medicineName,
      dosage: med.strength,
      form: med.dosageForm,
      foodInstruction: med.foodInstruction || 'With water',
      timingLabel: med.timing || 'Scheduled',
      taken: Boolean(med.takenToday),
      takenAt: med.takenAt,
      needsReview: med.needsReview || med.confidence === 'low',
    };

    // Assign to slots
    if (timingLower.includes('night') || timingLower.includes('bedtime') || instLower.includes('bedtime')) {
      timeline.night.push(item);
    } else if (timingLower.includes('evening') || freqLower.includes('twice') || instLower.includes('dinner')) {
      // If twice daily, appears in both morning and evening
      if (freqLower.includes('twice') || freqLower.includes('1-0-1') || instLower.includes('twice daily')) {
        timeline.morning.push({ ...item, timingLabel: 'Morning' });
        timeline.evening.push({ ...item, timingLabel: 'Evening' });
      } else {
        timeline.evening.push(item);
      }
    } else if (timingLower.includes('afternoon') || instLower.includes('lunch')) {
      timeline.afternoon.push(item);
    } else if (timingLower.includes('morning') || freqLower.includes('once daily') || instLower.includes('breakfast')) {
      timeline.morning.push(item);
    } else if (freqLower.includes('prn') || freqLower.includes('as needed') || timingLower.includes('as needed')) {
      timeline.asNeeded.push(item);
    } else {
      // Default to morning if not specified
      timeline.morning.push(item);
    }
  });

  return timeline;
}

/**
 * Synthesizes "Today's Clarity" (3 facts worth knowing today) from actual data
 */
export function generateTodayClarity(
  medicines: ScannedMedicine[],
  findings: SafetyFinding[],
  prescription: Prescription | null
): { point1: string; point2: string; point3: string; point1Hi: string; point2Hi: string; point3Hi: string } {
  // Point 1: Next scheduled action / dose
  const untaken = medicines.filter((m) => !m.takenToday && m.status !== 'completed');
  let point1 = 'All scheduled morning doses are completed.';
  let point1Hi = 'सुबह की सभी निर्धारित खुराकें पूरी हो चुकी हैं।';
  if (untaken.length > 0) {
    const nextMed = untaken[0];
    point1 = `Your next dose is ${nextMed.medicineName} (${nextMed.timing || 'scheduled dose'}).`;
    point1Hi = `आपकी अगली खुराक ${nextMed.medicineName} (${nextMed.timing || 'निर्धारित समय'}) पर है।`;
  }

  // Point 2: Safety finding or interaction highlight
  let point2 = 'No conflicting drug interactions detected between your current medications.';
  let point2Hi = 'आपकी वर्तमान दवाओं के बीच कोई परस्पर टकराव नहीं पाया गया।';
  const majorFinding = findings.find((f) => f.ruleType === 'interaction' || f.ruleType === 'duplicate_ingredient');
  if (majorFinding) {
    point2 = majorFinding.description;
    point2Hi = majorFinding.descriptionHi || majorFinding.description;
  } else {
    const expiryFinding = findings.find((f) => f.ruleType === 'expiry');
    if (expiryFinding) {
      point2 = expiryFinding.description;
      point2Hi = expiryFinding.descriptionHi || expiryFinding.description;
    }
  }

  // Point 3: Prescription reconciliation status
  let point3 = 'Your active medicine cabinet matches your doctor’s prescribed care plan.';
  let point3Hi = 'आपकी सक्रिय दवाएं डॉक्टर के पर्चे की योजना से पूरी तरह मेल खाती हैं।';
  if (prescription && prescription.items) {
    const pendingRx = prescription.items.filter((i) => i.reconciliationStatus === 'needs_review');
    if (pendingRx.length > 0) {
      point3 = `Prescription note: ${pendingRx[0].medicineName} was prescribed by ${prescription.doctorName} but is not yet in your active cabinet.`;
      point3Hi = `पर्चे का नोट: ${pendingRx[0].medicineName} डॉक्टर द्वारा लिखी गई थी लेकिन अभी कैबिनेट में सक्रिय नहीं है।`;
    }
  }

  return { point1, point2, point3, point1Hi, point2Hi, point3Hi };
}

/**
 * Pre-appointment / Travel "Before You Go" checklist generator
 */
export function generateBeforeYouGoChecklist(
  medicines: ScannedMedicine[],
  prescription: Prescription | null,
  questions: DoctorQuestion[]
): Array<{ id: string; label: string; labelHi: string; status: 'ready' | 'attention'; note: string; noteHi: string }> {
  const checklist = [];

  // Check 1: Medicines verified
  const unverified = medicines.filter((m) => m.confidence === 'low' || m.needsReview);
  if (unverified.length === 0) {
    checklist.push({
      id: 'check-meds',
      label: 'Medicines verified',
      labelHi: 'दवाएं सत्यापित',
      status: 'ready' as const,
      note: 'All active medicines have high optical label confidence.',
      noteHi: 'सभी सक्रिय दवाओं के लेबल स्पष्ट और पुष्ट हैं।',
    });
  } else {
    checklist.push({
      id: 'check-meds',
      label: `${unverified.length} medicine(s) need label review`,
      labelHi: `${unverified.length} दवा के लेबल की समीक्षा आवश्यक`,
      status: 'attention' as const,
      note: `${unverified.map((m) => m.medicineName).join(', ')} require optical confirmation.`,
      noteHi: 'इन दवाओं के लेबल दोबारा जांचें।',
    });
  }

  // Check 2: Prescription saved
  if (prescription) {
    checklist.push({
      id: 'check-rx',
      label: 'Prescription digitized & linked',
      labelHi: 'पर्चा डिजिटल रूप से सुरक्षित',
      status: 'ready' as const,
      note: `Dr. ${prescription.doctorName} prescription dated ${prescription.prescriptionDate}.`,
      noteHi: `डॉ. ${prescription.doctorName} का पर्चा उपलब्ध है।`,
    });
  } else {
    checklist.push({
      id: 'check-rx',
      label: 'No prescription attached',
      labelHi: 'कोई पर्चा संलग्न नहीं',
      status: 'attention' as const,
      note: 'Scan your paper prescription slip to unlock reconciliation.',
      noteHi: 'मिलान के लिए अपना कागजी पर्चा स्कैन करें।',
    });
  }

  // Check 3: Questions prepared
  if (questions.length > 0) {
    checklist.push({
      id: 'check-questions',
      label: `${questions.length} doctor questions prepared`,
      labelHi: `${questions.length} डॉक्टर प्रश्न तैयार`,
      status: 'ready' as const,
      note: 'Key questions compiled from interactions and lab findings.',
      noteHi: 'दवाओं और लैब रिपोर्ट के आधार पर प्रश्न तैयार हैं।',
    });
  } else {
    checklist.push({
      id: 'check-questions',
      label: 'Review questions for physician',
      labelHi: 'चिकित्सक के लिए प्रश्न तैयार करें',
      status: 'attention' as const,
      note: 'Prepare questions about dosage timing and refills.',
      noteHi: 'खुराक और रिफिल के संबंध में सवाल तैयार करें।',
    });
  }

  // Check 4: Expiry watch
  const expiring = medicines.filter((m) => m.status === 'expiring_soon');
  if (expiring.length > 0) {
    checklist.push({
      id: 'check-expiry',
      label: 'Refill needed soon',
      labelHi: 'शीघ्र रिफिल की आवश्यकता',
      status: 'attention' as const,
      note: `${expiring.map((m) => m.medicineName).join(', ')} expires within 30 days.`,
      noteHi: 'यह दवा अगले 30 दिनों में समाप्त हो रही है।',
    });
  } else {
    checklist.push({
      id: 'check-expiry',
      label: 'Expiry dates in good standing',
      labelHi: 'दवाओं की वैधता सुरक्षित',
      status: 'ready' as const,
      note: 'No immediate expiration risks detected.',
      noteHi: 'कोई भी दवा समाप्ति के करीब नहीं है।',
    });
  }

  return checklist;
}

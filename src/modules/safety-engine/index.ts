import {
  ScannedMedicine,
  Prescription,
  SafetyFinding,
  SafetyLevel,
} from '../types';

interface InteractionRule {
  drugAKeywords: string[];
  drugBKeywords: string[];
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  severity: 'mild' | 'moderate' | 'high';
  recommendation: string;
  recommendationHi: string;
}

const KNOWN_INTERACTION_RULES: InteractionRule[] = [
  {
    drugAKeywords: ['lisinopril', 'enalapril', 'ramipril', 'losartan', 'valsartan', 'telmisartan'],
    drugBKeywords: ['ibuprofen', 'naproxen', 'diclofenac', 'indomethacin', 'advil', 'motrin', 'aleve'],
    title: 'Drug Interaction: Blood Pressure Medicine + NSAID',
    titleHi: 'दवाओं का टकराव: बीपी की दवा + दर्दनिवारक (NSAID)',
    description: 'Concurrent use of NSAIDs with ACE inhibitors or ARBs may diminish the blood pressure lowering effect and increase renal stress.',
    descriptionHi: 'बीपी की दवा के साथ दर्द निवारक (NSAID) का उपयोग बीपी नियंत्रण को कम कर सकता है और गुर्दे पर दबाव डाल सकता है।',
    severity: 'moderate',
    recommendation: 'Consult your doctor or pharmacist about whether Paracetamol (Acetaminophen) can be used as a safer alternative for pain relief.',
    recommendationHi: 'अपने डॉक्टर से पूछें कि क्या दर्द निवारण के लिए पैरासिटामोल एक सुरक्षित विकल्प हो सकता है।',
  },
  {
    drugAKeywords: ['aspirin', 'clopidogrel', 'warfarin', 'apixaban', 'rivaroxaban', 'eliquis'],
    drugBKeywords: ['ibuprofen', 'naproxen', 'diclofenac'],
    title: 'Interaction: Blood Thinner / Antiplatelet + NSAID',
    titleHi: 'टकराव: रक्त पतला करने वाली दवा + दर्दनिवारक',
    description: 'Combining blood thinners or aspirin with NSAIDs substantially increases the risk of gastrointestinal bleeding.',
    descriptionHi: 'रक्त पतला करने वाली दवाओं के साथ दर्दनिवारक लेने से पेट में रक्तस्राव का जोखिम बढ़ सकता है।',
    severity: 'high',
    recommendation: 'Do not combine without express instructions from your physician.',
    recommendationHi: 'चिकित्सक की स्पष्ट सलाह के बिना इन्हें साथ में न लें।',
  },
  {
    drugAKeywords: ['metformin'],
    drugBKeywords: ['alcohol', 'contrast dye'],
    title: 'Precaution: Metformin & Iodine Contrast / Alcohol',
    titleHi: 'सावधानी: मेटफॉर्मिन और आयोडीन कंट्रास्ट',
    description: 'Excessive alcohol or upcoming radiologic contrast scans require temporary pause of Metformin to prevent lactic acidosis.',
    descriptionHi: 'किसी रेडियोलॉजी स्कैन से पहले मेटफॉर्मिन की खुराक के बारे में डॉक्टर को अवश्य सूचित करें।',
    severity: 'moderate',
    recommendation: 'Inform the radiology clinic before any contrast CT/MRI scan.',
    recommendationHi: 'किसी भी सीटी/एमआरआई कंट्रास्ट से पहले डॉक्टर या लैब को सूचित करें।',
  },
  {
    drugAKeywords: ['levothyroxine', 'thyronorm', 'synthroid'],
    drugBKeywords: ['calcium', 'iron', 'antacid', 'omeprazole', 'pantoprazole'],
    title: 'Timing Conflict: Thyroid Medication Absorption',
    titleHi: 'समय का अंतर: थायरॉइड दवा का अवशोषण',
    description: 'Calcium, iron supplements, and antacids can severely hinder thyroid hormone absorption if taken simultaneously.',
    descriptionHi: 'कैल्शियम, आयरन और एंटासिड थायरॉइड दवा के अवशोषण में बाधा डालते हैं।',
    severity: 'moderate',
    recommendation: 'Take thyroid medicine on an empty stomach at least 4 hours apart from calcium or antacids.',
    recommendationHi: 'थायरॉइड की दवा खाली पेट लें और कैल्शियम या एंटासिड से कम से कम 4 घंटे का अंतर रखें।',
  },
];

/**
 * Checks for known drug-drug interactions between medicines in the cabinet
 */
export function evaluateInteractions(medicines: ScannedMedicine[]): SafetyFinding[] {
  const findings: SafetyFinding[] = [];
  const textStrings = medicines.map((m) =>
    `${m.medicineName} ${m.genericName} ${m.activeIngredients.join(' ')}`.toLowerCase()
  );

  for (const rule of KNOWN_INTERACTION_RULES) {
    let matchAIdx = -1;
    let matchBIdx = -1;

    for (let i = 0; i < textStrings.length; i++) {
      const text = textStrings[i];
      if (matchAIdx === -1 && rule.drugAKeywords.some((kw) => text.includes(kw))) {
        matchAIdx = i;
      } else if (matchBIdx === -1 && rule.drugBKeywords.some((kw) => text.includes(kw))) {
        matchBIdx = i;
      }
    }

    if (matchAIdx !== -1 && matchBIdx !== -1 && matchAIdx !== matchBIdx) {
      findings.push({
        id: `finding-interaction-${rule.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        level: 'review',
        title: rule.title,
        titleHi: rule.titleHi,
        description: rule.description,
        descriptionHi: rule.descriptionHi,
        involvedMedicines: [medicines[matchAIdx].medicineName, medicines[matchBIdx].medicineName],
        actionRecommendation: rule.recommendation,
        actionRecommendationHi: rule.recommendationHi,
        severity: rule.severity,
        ruleType: 'interaction',
      });
    }
  }

  // Duplicate active ingredients check
  const ingredientMap: Record<string, string[]> = {};
  medicines.forEach((med) => {
    med.activeIngredients.forEach((ing) => {
      const normalized = ing.toLowerCase().trim();
      if (!ingredientMap[normalized]) ingredientMap[normalized] = [];
      ingredientMap[normalized].push(med.medicineName);
    });
  });

  for (const [ingredient, medNames] of Object.entries(ingredientMap)) {
    if (medNames.length > 1 && ingredient.length > 2) {
      findings.push({
        id: `finding-dup-${ingredient}`,
        level: 'review',
        title: `Duplicate Ingredient: ${ingredient}`,
        titleHi: `समान सक्रिय तत्व: ${ingredient}`,
        description: `Multiple medications in your cabinet contain ${ingredient}. This may increase the risk of accidental double-dosing.`,
        descriptionHi: `आपकी एक से अधिक दवाओं में ${ingredient} मौजूद है। इससे अधिक खुराक का जोखिम हो सकता है।`,
        involvedMedicines: medNames,
        actionRecommendation: 'Verify with your pharmacist to ensure these are not duplicates of the same medication.',
        actionRecommendationHi: 'फार्मासिस्ट से पुष्टि करें कि ये एक ही दवा की दोहरी खुराक तो नहीं हैं।',
        severity: 'high',
        ruleType: 'duplicate_ingredient',
      });
    }
  }

  // Expiry check
  medicines.forEach((med) => {
    if (med.expiryDate) {
      const expiryStatus = checkExpiryDate(med.expiryDate);
      if (expiryStatus === 'expired') {
        findings.push({
          id: `finding-exp-${med.id}`,
          level: 'review',
          title: `Expired Medication: ${med.medicineName}`,
          titleHi: `समाप्त दवा: ${med.medicineName}`,
          description: `This medicine reached its manufacturer expiration date (${med.expiryDate}). Expired medicines may lose efficacy.`,
          descriptionHi: `इस दवा की समाप्ति तिथि (${med.expiryDate}) निकल चुकी है।`,
          involvedMedicines: [med.medicineName],
          actionRecommendation: 'Do not use expired medication. Safely dispose and request a new package.',
          actionRecommendationHi: 'समाप्त दवा का उपयोग न करें। सुरक्षित रूप से नष्ट करें और नया पैक लें।',
          severity: 'high',
          ruleType: 'expiry',
        });
      } else if (expiryStatus === 'expiring_soon') {
        findings.push({
          id: `finding-exp-soon-${med.id}`,
          level: 'review',
          title: `Expiring Soon: ${med.medicineName}`,
          titleHi: `जल्द समाप्त होने वाली: ${med.medicineName}`,
          description: `This medicine package expires soon (${med.expiryDate}).`,
          descriptionHi: `यह दवा शीघ्र समाप्त होने वाली है (${med.expiryDate})।`,
          involvedMedicines: [med.medicineName],
          actionRecommendation: 'Plan for a refill if this is an ongoing maintenance medication.',
          actionRecommendationHi: 'यदि यह नियमित दवा है तो नए रिफिल की योजना बनाएं।',
          severity: 'mild',
          ruleType: 'expiry',
        });
      }
    }

    if (med.confidence === 'low' || med.needsReview) {
      findings.push({
        id: `finding-unverified-${med.id}`,
        level: 'unverified',
        title: `Label Verification Needed: ${med.medicineName || 'Unlabeled Medicine'}`,
        titleHi: `लेबल सत्यापन आवश्यक: ${med.medicineName || 'अपुष्ट दवा'}`,
        description: 'Key details on this package could not be read with high optical certainty.',
        descriptionHi: 'इस पैकेज के मुख्य विवरण पूरी स्पष्टता के साथ नहीं पढ़े जा सके।',
        involvedMedicines: [med.medicineName || 'Scanned Package'],
        actionRecommendation: 'Retake photo under bright direct lighting or verify the exact label with your pharmacist.',
        actionRecommendationHi: 'अच्छी रोशनी में दोबारा फोटो लें या फार्मासिस्ट से लेबल की पुष्टि कराएं।',
        severity: 'mild',
        ruleType: 'unverified_label',
      });
    }
  });

  return findings;
}

/**
 * Helper to check expiry string format (e.g., "11/2026", "2026-11", "EXP: 10/26")
 */
export function checkExpiryDate(expiryStr: string): 'valid' | 'expiring_soon' | 'expired' {
  if (!expiryStr) return 'valid';
  const clean = expiryStr.replace(/[^0-9/.-]/g, '');
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Pattern MM/YYYY or MM/YY
  const matchSlash = clean.match(/(\d{1,2})[\/\.-](\d{2,4})/);
  if (matchSlash) {
    const month = parseInt(matchSlash[1], 10);
    let year = parseInt(matchSlash[2], 10);
    if (year < 100) year += 2000;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'expired';
    }
    // Expiring within 60 days
    if (year === currentYear && month <= currentMonth + 2) {
      return 'expiring_soon';
    }
    return 'valid';
  }

  // Pattern YYYY-MM
  const matchIso = clean.match(/(\d{4})[\/\.-](\d{1,2})/);
  if (matchIso) {
    const year = parseInt(matchIso[1], 10);
    const month = parseInt(matchIso[2], 10);
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return 'expired';
    }
    if (year === currentYear && month <= currentMonth + 2) {
      return 'expiring_soon';
    }
    return 'valid';
  }

  return 'valid';
}

/**
 * Reconciles prescription items against scanned medicines in cabinet
 */
export function reconcilePrescriptionWithMedicines(
  prescription: Prescription | null,
  medicines: ScannedMedicine[]
): {
  matchedCount: number;
  needsReviewCount: number;
  totalPrescribed: number;
  unprescribedInCabinet: ScannedMedicine[];
} {
  if (!prescription || !prescription.items || prescription.items.length === 0) {
    return {
      matchedCount: 0,
      needsReviewCount: 0,
      totalPrescribed: 0,
      unprescribedInCabinet: medicines,
    };
  }

  let matched = 0;
  let needsReview = 0;
  const matchedMedIds = new Set<string>();

  prescription.items.forEach((item) => {
    // find matching medicine in cabinet by generic name or brand name substring
    const match = medicines.find((m) => {
      const mText = `${m.medicineName} ${m.genericName}`.toLowerCase();
      const pText = `${item.medicineName} ${item.genericName}`.toLowerCase();
      const words = item.genericName.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      return (
        mText.includes(item.genericName.toLowerCase()) ||
        pText.includes(m.genericName.toLowerCase()) ||
        words.some((w) => mText.includes(w))
      );
    });

    if (match) {
      item.matchedMedicineId = match.id;
      item.reconciliationStatus = 'matched';
      matchedMedIds.add(match.id);
      matched++;
    } else {
      item.matchedMedicineId = undefined;
      item.reconciliationStatus = 'needs_review';
      needsReview++;
    }
  });

  const unprescribedInCabinet = medicines.filter((m) => !matchedMedIds.has(m.id));

  return {
    matchedCount: matched,
    needsReviewCount: needsReview,
    totalPrescribed: prescription.items.length,
    unprescribedInCabinet,
  };
}

/**
 * Evaluates the overall Safety Radar level
 */
export function computeSafetyRadarLevel(findings: SafetyFinding[]): SafetyLevel {
  if (findings.some((f) => f.level === 'unverified')) {
    return 'unverified';
  }
  if (findings.some((f) => f.level === 'review')) {
    return 'review';
  }
  return 'clear';
}

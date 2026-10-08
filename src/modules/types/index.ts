export type VerificationConfidence = 'high' | 'medium' | 'low';

export type SafetyLevel = 'clear' | 'review' | 'unverified';

export interface ScannedMedicine {
  id: string;
  medicineName: string;
  genericName: string;
  activeIngredients: string[];
  category?: string;
  simpleExplanation?: string;
  simpleExplanationHi?: string;
  generalUse?: string;
  generalUseHi?: string;
  strength: string;
  dosageForm: string;
  manufacturer?: string;
  expiryDate?: string;
  batchNumber?: string;
  visibleInstructions?: string;
  prescriptionInstruction?: string;
  frequency?: string;
  timing?: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | 'As needed' | string;
  foodInstruction?: string;
  storageInstruction?: string;
  confidence: VerificationConfidence;
  evidence?: string[];
  whatWeCouldVerify?: string[];
  whatWeCouldntVerify?: string[];
  uncertainFields?: string[];
  source?: 'medicine_label' | 'prescription' | 'general_info' | 'user_entered' | string;
  needsReview: boolean;
  clinicalAdvisory?: string;
  scannedAt: string;
  imageThumbnail?: string;
  takenToday?: boolean;
  takenAt?: string;
  prescriptionId?: string;
  status: 'current' | 'needs_review' | 'completed' | 'expiring_soon';
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  genericName: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  instructions: string;
  confidence: VerificationConfidence;
  matchedMedicineId?: string;
  reconciliationStatus: 'matched' | 'needs_review' | 'missing' | 'unprescribed';
}

export interface Prescription {
  id: string;
  doctorName: string;
  clinicOrHospital: string;
  patientName: string;
  prescriptionDate: string;
  items: PrescriptionItem[];
  overallNotes?: string;
  confidence: VerificationConfidence;
  imageUrl?: string;
}

export interface SafetyFinding {
  id: string;
  level: SafetyLevel;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  involvedMedicines: string[];
  actionRecommendation: string;
  actionRecommendationHi?: string;
  severity: 'mild' | 'moderate' | 'high';
  ruleType: 'interaction' | 'duplicate_ingredient' | 'food_conflict' | 'expiry' | 'unverified_label';
}

export interface LabParameter {
  parameterName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'elevated' | 'low' | 'unspecified';
  simpleExplanation: string;
}

export interface LabReport {
  id: string;
  reportName: string;
  labName: string;
  reportDate: string;
  patientName: string;
  parameters: LabParameter[];
  summary?: string;
}

export interface HealthEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  category: 'prescription' | 'scan' | 'safety' | 'lab_report' | 'appointment' | 'dose_taken';
  iconType: string;
}

export interface DoctorQuestion {
  id: string;
  category: 'Safety' | 'Timing' | 'Duration' | 'Side Effects' | 'Reconciliation';
  question: string;
  questionHi?: string;
  context: string;
  contextHi?: string;
  saved?: boolean;
  isCustom?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  age: number | string;
  signedInAt: string;
  allergies?: string[];
  conditions?: string[];
}

export interface CareCircleMember {
  id: string;
  name: string;
  relation: string;
  permissions: {
    schedule: boolean;
    medicines: boolean;
    reports: boolean;
    questions: boolean;
  };
  lastAccessed?: string;
}

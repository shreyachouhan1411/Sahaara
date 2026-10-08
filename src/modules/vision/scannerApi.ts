import { ScannedMedicine, Prescription, LabReport, DoctorQuestion } from '../types';

export interface ScanApiResult {
  success: boolean;
  data?: any;
  error?: string;
  code?: string;
  reasons?: string[];
}

/**
 * Prepares and compresses file/blob into base64 and standard image/jpeg mimeType
 */
export async function fileToBase64(file: File): Promise<{ data: string; mimeType: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 1600;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
          const cleanBase64 = compressedDataUrl.replace(/^data:[^;]+;base64,/, '');
          resolve({ data: cleanBase64, mimeType: 'image/jpeg' });
          return;
        }
        // Fallback
        const clean = dataUrl.replace(/^data:[^;]+;base64,/, '');
        resolve({ data: clean, mimeType: 'image/jpeg' });
      };
      img.onerror = () => {
        const clean = dataUrl.replace(/^data:[^;]+;base64,/, '');
        resolve({ data: clean, mimeType: 'image/jpeg' });
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      resolve({ data: '', mimeType: 'image/jpeg' });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Calls server endpoint to scan medicine packaging / pill bottle
 */
export async function callScanMedicineApi(
  images: Array<{ data: string; mimeType: string }>
): Promise<ScanApiResult> {
  try {
    const response = await fetch('/api/scan-medicine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Server error occurred during medicine scan.',
        code: data.code || 'SCAN_ERROR',
        reasons: data.reasons || [
          'Image may be blurry or dimly lit',
          'Medicine name or active ingredient is not clearly visible',
          'AI service experienced a temporary network issue',
        ],
      };
    }

    return {
      success: true,
      data: data.parsed,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network connection failed during upload.',
      code: 'NETWORK_ERROR',
      reasons: [
        'Network connection interrupted during upload',
        'Backend server may be restarting or unreachable',
        'Image file size exceeded transfer limits',
      ],
    };
  }
}

/**
 * Calls server endpoint to scan doctor prescription
 */
export async function callScanPrescriptionApi(
  image: { data: string; mimeType: string }
): Promise<ScanApiResult> {
  try {
    const response = await fetch('/api/scan-prescription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: image.data,
        mimeType: image.mimeType,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Prescription analysis failed.',
        code: data.code || 'PRESCRIPTION_ERROR',
        reasons: data.reasons || [
          'Document may be tilted or low contrast',
          'Doctor handwriting might be illegible in current lighting',
        ],
      };
    }

    return {
      success: true,
      data: data.parsed,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Prescription scan network failed.',
      code: 'NETWORK_ERROR',
    };
  }
}

/**
 * Calls server endpoint to scan lab test report
 */
export async function callScanReportApi(
  image: { data: string; mimeType: string }
): Promise<ScanApiResult> {
  try {
    const response = await fetch('/api/scan-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: image.data,
        mimeType: image.mimeType,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Report analysis failed.',
      };
    }

    return {
      success: true,
      data: data.parsed,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Report scan network failed.',
    };
  }
}

/**
 * Calls server to synthesize personalized doctor questions
 */
export async function callGenerateQuestionsApi(
  medications: ScannedMedicine[],
  findings: any[],
  prescription: Prescription | null
): Promise<{ success: boolean; questions?: DoctorQuestion[]; error?: string }> {
  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        medications,
        findings,
        prescription,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return { success: false, error: data.error || 'Question generation failed.' };
    }

    return { success: true, questions: data.questions };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error' };
  }
}

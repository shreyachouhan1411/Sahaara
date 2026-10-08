import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing high-resolution camera and upload payloads
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Initialize GoogleGenAI SDK safely with User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// System health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

/**
 * 1. SCAN MEDICINE ENDPOINT
 * Analyzes pill bottles, medicine blister packs, cartons, and labels using Gemini 3.8 Flash.
 */
app.post('/api/scan-medicine', async (req, res) => {
  try {
    const { image, images, mimeType = 'image/jpeg' } = req.body;

    const imageList: Array<{ data: string; mimeType: string }> = [];
    if (Array.isArray(images) && images.length > 0) {
      images.forEach((img) => {
        let cleanBase64 = typeof img === 'string' ? img.replace(/^data:[^;]+;base64,/, '') : (img.data || '').replace(/^data:[^;]+;base64,/, '');
        cleanBase64 = cleanBase64.replace(/[\r\n\s]+/g, '');
        let mType = (typeof img === 'object' && img.mimeType ? img.mimeType : mimeType).toLowerCase();
        if (mType === 'image/jpg') mType = 'image/jpeg';
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mType)) {
          mType = 'image/jpeg';
        }
        if (cleanBase64) imageList.push({ data: cleanBase64, mimeType: mType });
      });
    } else if (image) {
      let cleanBase64 = image.replace(/^data:[^;]+;base64,/, '').replace(/[\r\n\s]+/g, '');
      let mType = (mimeType || 'image/jpeg').toLowerCase();
      if (mType === 'image/jpg') mType = 'image/jpeg';
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(mType)) {
        mType = 'image/jpeg';
      }
      if (cleanBase64) imageList.push({ data: cleanBase64, mimeType: mType });
    }

    if (imageList.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No image data provided for medicine scan.',
        code: 'NO_IMAGE',
      });
    }

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured in environment.',
        code: 'API_KEY_MISSING',
        reasons: [
          'GEMINI_API_KEY environment variable is missing on server',
          'AI Studio Secrets configuration required',
        ],
      });
    }

    const promptText = `You are Sahaara's rigorous clinical medicine verification specialist.
Analyze the provided medicine package, pill bottle, strip, or prescription label image.

CRITICAL RULES:
1. Extract ONLY what is genuinely visible and verifiable in the image.
2. NEVER invent or hallucinate drug names, active ingredients, dosage, or expiry dates.
3. If the medicine name is blurry, obscured, or missing, state clearly that it could not be verified. Set confidence to "low".
4. DISTINGUISH general medicine information from personal advice:
   - For "generalUse", write general purpose starting with "This medicine is generally used for..." (NEVER write "You are taking this for...").
   - For "simpleExplanation", explain what kind of medicine it is in simple words without medical jargon.
   - For "category", select one accurate label: "ANTIBIOTIC", "PAIN RELIEVER", "ANTIDIABETIC", "BLOOD PRESSURE MEDICINE", "CHOLESTEROL MEDICINE", "ANTIHISTAMINE", "ANTACID", "VITAMIN / SUPPLEMENT", or "OTHER". If uncertain, state "UNSPECIFIED".
   - List whatWeCouldVerify: array of items actually verified from this photo (e.g. ["Medicine name", "Dosage strength", "Form"]).
   - List whatWeCouldntVerify: array of items that were unclear or missing (e.g. ["Expiry date", "Frequency"]).

Return your answer strictly in the requested JSON structure.`;

    const parts: Array<any> = imageList.map((img) => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.data,
      },
    }));
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicineName: { type: Type.STRING },
            genericName: { type: Type.STRING },
            category: { type: Type.STRING },
            simpleExplanation: { type: Type.STRING },
            simpleExplanationHi: { type: Type.STRING },
            generalUse: { type: Type.STRING },
            generalUseHi: { type: Type.STRING },
            activeIngredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            strength: { type: Type.STRING },
            dosageForm: { type: Type.STRING },
            manufacturer: { type: Type.STRING },
            expiryDate: { type: Type.STRING },
            batchNumber: { type: Type.STRING },
            visibleInstructions: { type: Type.STRING },
            frequency: { type: Type.STRING },
            timing: { type: Type.STRING },
            foodInstruction: { type: Type.STRING },
            storageInstruction: { type: Type.STRING },
            confidence: { type: Type.STRING },
            evidence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            whatWeCouldVerify: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            whatWeCouldntVerify: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            uncertainFields: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            needsReview: { type: Type.BOOLEAN },
            clinicalAdvisory: { type: Type.STRING },
          },
          required: [
            'confidence',
            'needsReview',
          ],
        },
      },
    });

    let text = response.text?.trim() || '{}';
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsedData = JSON.parse(text);

    return res.json({
      success: true,
      parsed: parsedData,
      analyzedImagesCount: imageList.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during medicine scan:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'We could not analyze this image.',
      code: 'GEMINI_SCAN_ERROR',
      reasons: [
        'Image may be blurry or poorly lit',
        'Medicine label might be partially hidden or angled away',
        'AI service experienced a temporary network issue',
      ],
    });
  }
});

/**
 * 2. SCAN PRESCRIPTION ENDPOINT
 * Parses doctor prescriptions, handwritten/printed doctor notes, Rx lists, and dates.
 */
app.post('/api/scan-prescription', async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg' } = req.body;
    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No prescription image provided.',
        code: 'NO_IMAGE',
      });
    }

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured in environment.',
        code: 'API_KEY_MISSING',
      });
    }

    const cleanBase64 = image.replace(/^data:[^;]+;base64,/, '');

    const promptText = `You are Sahaara's prescription reconciliation specialist.
Examine this medical prescription document or doctor's order slip.

Extract:
1. doctorName: Physician's name or clinic header (e.g., "Dr. Aris Thorne, MD").
2. clinicOrHospital: Clinic, hospital or health center name.
3. patientName: Patient name if written on prescription.
4. prescriptionDate: Date written on prescription.
5. items: List of prescribed medicines with:
   - medicineName: Brand or generic name written
   - genericName: Identified generic active molecule
   - dosage: E.g., "500 mg", "10 mg"
   - frequency: E.g., "Twice daily", "1-0-1", "OD morning", "PRN"
   - timing: "Morning", "Afternoon", "Evening", "Night"
   - duration: E.g., "30 days", "7 days", "Ongoing"
   - instructions: Specific notes (e.g., "After food", "Before meals")
   - confidence: "high", "medium", or "low" (especially if doctor handwriting is ambiguous)
6. overallNotes: Special clinical precautions, dietary instructions, or follow-up notes mentioned by the doctor.
7. confidence: "high", "medium", or "low"

Do NOT invent medicines that are not written on the prescription slip. If handwriting is illegible, flag the item with low confidence and note "Illegible handwriting - verification required".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            doctorName: { type: Type.STRING },
            clinicOrHospital: { type: Type.STRING },
            patientName: { type: Type.STRING },
            prescriptionDate: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  medicineName: { type: Type.STRING },
                  genericName: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  confidence: { type: Type.STRING },
                },
                required: ['medicineName', 'dosage', 'frequency', 'confidence'],
              },
            },
            overallNotes: { type: Type.STRING },
            confidence: { type: Type.STRING },
          },
          required: ['doctorName', 'items', 'confidence'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      success: true,
      parsed,
    });
  } catch (error: any) {
    console.error('Error scanning prescription:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Prescription analysis failed.',
      code: 'PRESCRIPTION_SCAN_ERROR',
      reasons: [
        'Document may be tilted or low contrast',
        'Doctor handwriting might be illegible in current lighting',
        'Service error',
      ],
    });
  }
});

/**
 * 3. SCAN LAB REPORT ENDPOINT
 * Extracts biomarker parameters, values, units, reference intervals from lab tests.
 */
app.post('/api/scan-report', async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg' } = req.body;
    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No lab report image provided.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured in environment.',
      });
    }

    const cleanBase64 = image.replace(/^data:[^;]+;base64,/, '');

    const promptText = `You are Sahaara's diagnostic lab report parser.
Extract the diagnostic test parameters, observed values, standard units, reference ranges, and flagged abnormalities.

RULES:
1. Extract ONLY values that are clearly printed in the document.
2. Do NOT invent reference ranges if not printed on the document.
3. For each parameter, provide:
   - parameterName: E.g., "Hemoglobin A1c (HbA1c)", "Serum Creatinine", "eGFR", "Total Cholesterol"
   - value: E.g., "6.8", "0.95"
   - unit: E.g., "%", "mg/dL", "mL/min/1.73m2"
   - referenceRange: Printed interval, e.g., "< 5.7%", "0.7 - 1.3 mg/dL"
   - status: "normal" | "borderline" | "elevated" | "low" | "unspecified"
   - simpleExplanation: Clear, calm 1-sentence explanation of what this test represents (no alarmism).
4. Extract reportDate, labName, and patientName.
Return valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: promptText },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportName: { type: Type.STRING },
            labName: { type: Type.STRING },
            reportDate: { type: Type.STRING },
            patientName: { type: Type.STRING },
            parameters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  parameterName: { type: Type.STRING },
                  value: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  referenceRange: { type: Type.STRING },
                  status: { type: Type.STRING },
                  simpleExplanation: { type: Type.STRING },
                },
                required: ['parameterName', 'value', 'unit', 'status'],
              },
            },
            summary: { type: Type.STRING },
          },
          required: ['reportName', 'parameters'],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({
      success: true,
      parsed,
    });
  } catch (error: any) {
    console.error('Error scanning report:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Report parsing failed.',
    });
  }
});

/**
 * 4. GENERATE DOCTOR QUESTIONS ENDPOINT
 * Generates insightful, patient-friendly questions to ask the doctor based on current medicines and findings.
 */
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { medications, findings, prescription } = req.body;

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Gemini API key is not configured in environment.',
      });
    }

    const promptText = `You are Sahaara's patient empowerment assistant.
Given the patient's current medications:
${JSON.stringify(medications || [], null, 2)}

Safety findings:
${JSON.stringify(findings || [], null, 2)}

Prescription context:
${JSON.stringify(prescription || {}, null, 2)}

Generate 4-6 concise, practical, respectful questions that the patient can bring to their next doctor or pharmacist appointment.
Questions should focus on:
- Taking combinations safely
- Timing with meals or other drugs
- How to handle missed doses
- Reconciling any unverified or expiring medicines
- Target symptoms or lab check timelines

Return a JSON array of objects with fields:
- id: unique string
- category: "Safety" | "Timing" | "Duration" | "Side Effects" | "Reconciliation"
- question: Clear, friendly question text
- context: Brief 1-sentence reason why this question is recommended for the patient.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              question: { type: Type.STRING },
              context: { type: Type.STRING },
            },
            required: ['id', 'category', 'question', 'context'],
          },
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    return res.json({
      success: true,
      questions: parsed,
    });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate questions.',
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Sahaara Server] Running on http://0.0.0.0:${PORT} (Gemini API: ${ai ? 'ENABLED' : 'API KEY MISSING'})`);
  });
}

startServer().catch((err) => {
  console.error('[Sahaara Server] Startup error:', err);
});

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Plus,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  X,
  FileText,
  Clock,
  ArrowRight,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { useI18n } from '../modules/i18n/I18nContext';
import {
  callScanMedicineApi,
  callScanPrescriptionApi,
  callScanReportApi,
  fileToBase64,
} from '../modules/vision/scannerApi';
import { ScannedMedicine, Prescription, LabReport } from '../modules/types';

interface ScannerViewProps {
  onMedicineAdded: (medicine: ScannedMedicine) => void;
  onPrescriptionAdded: (prescription: Prescription) => void;
  onReportAdded: (report: LabReport) => void;
  onStartDemo: () => void;
}

type ScanTab = 'medicine' | 'prescription' | 'report';

export const ScannerView: React.FC<ScannerViewProps> = ({
  onMedicineAdded,
  onPrescriptionAdded,
  onReportAdded,
  onStartDemo,
}) => {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<ScanTab>('medicine');

  // Multi-image list for upload
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ url: string; base64: string; mimeType: string; name: string }>
  >([]);

  // Camera stream state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Loading & stage state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');

  // Structured Result state
  const [scannedResult, setScannedResult] = useState<any | null>(null);

  // Failure & Error state
  const [scanError, setScanError] = useState<{
    error: string;
    code?: string;
    reasons?: string[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup camera stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Start live webcam or mobile camera
  const startCamera = async () => {
    setScanError(null);
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Capture frame from active camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.90);
    const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '');

    setUploadedImages((prev) => [
      ...prev,
      {
        url: dataUrl,
        base64,
        mimeType: 'image/jpeg',
        name: `Camera-Capture-${Date.now()}.jpg`,
      },
    ]);

    stopCamera();
    setScanError(null);
  };

  // Handle file uploads
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setScanError(null);

    const newImages: Array<{ url: string; base64: string; mimeType: string; name: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { data, mimeType } = await fileToBase64(file);
        newImages.push({
          url: URL.createObjectURL(file),
          base64: data,
          mimeType,
          name: file.name,
        });
      } catch (err) {
        console.error('File conversion failed:', err);
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Reset/retake
  const handleRetake = () => {
    setUploadedImages([]);
    setScannedResult(null);
    setScanError(null);
    stopCamera();
  };

  const removeSingleImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    if (uploadedImages.length <= 1) {
      setScannedResult(null);
    }
  };

  // Real Gemini Multimodal Analysis
  const handleAnalyze = async () => {
    if (uploadedImages.length === 0) return;

    setIsAnalyzing(true);
    setScanError(null);
    setScannedResult(null);

    setAnalysisStage(t('analyzing_step_1', 'Reading image optics...'));
    await new Promise((r) => setTimeout(r, 500));

    setAnalysisStage(t('analyzing_step_2', 'Identifying active pharmaceutical ingredients...'));

    try {
      if (activeTab === 'medicine') {
        const payload = uploadedImages.map((img) => ({
          data: img.base64,
          mimeType: img.mimeType,
        }));

        const result = await callScanMedicineApi(payload);

        if (!result.success || !result.data) {
          setIsAnalyzing(false);
          setScanError({
            error: result.error || "We couldn't analyze this image.",
            code: result.code,
            reasons: result.reasons,
          });
          return;
        }

        setAnalysisStage(t('analyzing_step_3', 'Checking prescription match & contraindications...'));
        await new Promise((r) => setTimeout(r, 400));

        setAnalysisStage(t('analyzing_step_4', 'Preparing your structured safety result...'));
        await new Promise((r) => setTimeout(r, 300));

        setScannedResult(result.data);
      } else if (activeTab === 'prescription') {
        const first = uploadedImages[0];
        const result = await callScanPrescriptionApi({
          data: first.base64,
          mimeType: first.mimeType,
        });

        if (!result.success || !result.data) {
          setIsAnalyzing(false);
          setScanError({
            error: result.error || "We couldn't analyze this prescription.",
            code: result.code,
            reasons: result.reasons,
          });
          return;
        }

        setScannedResult(result.data);
      } else if (activeTab === 'report') {
        const first = uploadedImages[0];
        const result = await callScanReportApi({
          data: first.base64,
          mimeType: first.mimeType,
        });

        if (!result.success || !result.data) {
          setIsAnalyzing(false);
          setScanError({
            error: result.error || "We couldn't analyze this lab report.",
            code: result.code,
          });
          return;
        }

        setScannedResult(result.data);
      }
    } catch (err: any) {
      setScanError({
        error: err.message || 'An unexpected error occurred during scan.',
        reasons: [
          'Image may be blurry or dimly lit',
          'Medicine name is not visible',
          'AI service is unavailable',
          'Network connection failed',
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add validated result into cabinet
  const handleAddToCabinet = () => {
    if (!scannedResult) return;

    if (activeTab === 'medicine') {
      const newMed: ScannedMedicine = {
        id: `med-scanned-${Date.now()}`,
        medicineName: scannedResult.medicineName || 'Scanned Medicine',
        genericName: scannedResult.genericName || scannedResult.medicineName || 'Unspecified Salt',
        category: scannedResult.category || 'MEDICINE',
        simpleExplanation: scannedResult.simpleExplanation,
        generalUse: scannedResult.generalUse,
        activeIngredients: scannedResult.activeIngredients || [],
        strength: scannedResult.strength || 'Standard dose',
        dosageForm: scannedResult.dosageForm || 'Oral Tablet',
        manufacturer: scannedResult.manufacturer,
        expiryDate: scannedResult.expiryDate,
        batchNumber: scannedResult.batchNumber,
        visibleInstructions: scannedResult.visibleInstructions,
        frequency: scannedResult.frequency || 'As directed',
        timing: scannedResult.timing || 'Morning',
        foodInstruction: scannedResult.foodInstruction || 'With water',
        storageInstruction: scannedResult.storageInstruction,
        confidence: scannedResult.confidence || 'medium',
        evidence: scannedResult.evidence || [],
        whatWeCouldVerify: scannedResult.whatWeCouldVerify || ['Medicine package detected'],
        whatWeCouldntVerify: scannedResult.whatWeCouldntVerify || [],
        source: 'From medicine label',
        uncertainFields: scannedResult.uncertainFields || [],
        needsReview: Boolean(scannedResult.needsReview),
        clinicalAdvisory: scannedResult.clinicalAdvisory,
        scannedAt: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        imageThumbnail: uploadedImages[0]?.url,
        takenToday: false,
        status: scannedResult.needsReview ? 'needs_review' : 'current',
      };
      onMedicineAdded(newMed);
      handleRetake();
    } else if (activeTab === 'prescription') {
      const newRx: Prescription = {
        id: `rx-${Date.now()}`,
        doctorName: scannedResult.doctorName || 'Attending Physician',
        clinicOrHospital: scannedResult.clinicOrHospital || 'Clinic',
        patientName: scannedResult.patientName || 'Patient',
        prescriptionDate: scannedResult.prescriptionDate || new Date().toISOString().slice(0, 10),
        confidence: scannedResult.confidence || 'medium',
        overallNotes: scannedResult.overallNotes,
        imageUrl: uploadedImages[0]?.url,
        items: (scannedResult.items || []).map((it: any, i: number) => ({
          id: `rx-item-${Date.now()}-${i}`,
          medicineName: it.medicineName,
          genericName: it.genericName || it.medicineName,
          dosage: it.dosage || '',
          frequency: it.frequency || '',
          timing: it.timing || 'Morning',
          duration: it.duration || 'As directed',
          instructions: it.instructions || '',
          confidence: it.confidence || 'medium',
          reconciliationStatus: 'needs_review',
        })),
      };
      onPrescriptionAdded(newRx);
      handleRetake();
    } else if (activeTab === 'report') {
      const newReport: LabReport = {
        id: `lab-${Date.now()}`,
        reportName: scannedResult.reportName || 'Diagnostic Lab Report',
        labName: scannedResult.labName || 'Diagnostic Laboratory',
        reportDate: scannedResult.reportDate || new Date().toISOString().slice(0, 10),
        patientName: scannedResult.patientName || 'Patient',
        summary: scannedResult.summary,
        parameters: scannedResult.parameters || [],
      };
      onReportAdded(newReport);
      handleRetake();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
      {/* 1. Header & Mode Selection (Section 27) */}
      <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] text-[11px] font-semibold mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Multimodal Vision Verification</span>
            </div>
            <h2 className="text-xl md:text-2xl font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
              What would you like to check?
            </h2>
            <p className="text-xs md:text-sm text-[#6D716B] dark:text-[#BDC2B8] mt-1 max-w-xl">
              Scan pill bottles, medicine cartons, or doctor prescriptions for automated safety and schedule verification.
            </p>
          </div>

          <button
            onClick={onStartDemo}
            className="self-start md:self-auto text-xs font-semibold px-3 py-2 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] bg-[#F5F2EA] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] hover:bg-[#DCE5D9] dark:hover:bg-[#2F342E] transition cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
            <span>{t('explore_demo', 'Explore Demo')}</span>
          </button>
        </div>

        {/* Scan Type Choice Cards (Section 27) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#E3DCCF] dark:border-[#363D34]">
          <button
            onClick={() => {
              setActiveTab('medicine');
              handleRetake();
            }}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
              activeTab === 'medicine'
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] shadow-xs'
                : 'bg-[#FCFBF7] dark:bg-[#222621] border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87]'
            }`}
          >
            <span className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
              Medicine
            </span>
            <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
              Scan a bottle, box or strip label
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('prescription');
              handleRetake();
            }}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
              activeTab === 'prescription'
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] shadow-xs'
                : 'bg-[#FCFBF7] dark:bg-[#222621] border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87]'
            }`}
          >
            <span className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
              Prescription
            </span>
            <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
              Scan a doctor's prescription order
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('report');
              handleRetake();
            }}
            className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
              activeTab === 'report'
                ? 'bg-[#DCE5D9] dark:bg-[#242D23] border-[#879B87] dark:border-[#95A895] shadow-xs'
                : 'bg-[#FCFBF7] dark:bg-[#222621] border-[#E3DCCF] dark:border-[#363D34] hover:border-[#879B87]'
            }`}
          >
            <span className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
              Lab Report
            </span>
            <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8]">
              Scan diagnostic blood test report
            </span>
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        multiple
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Camera Live Viewfinder */}
      {isCameraActive && (
        <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-4 shadow-sm flex flex-col items-center gap-4">
          <div className="relative w-full max-w-lg aspect-4/3 rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-8 border-2 border-dashed border-white/60 rounded-xl pointer-events-none flex items-center justify-center">
              <span className="text-[11px] text-white/90 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-xs">
                Align label inside frame
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={capturePhoto}
              className="px-5 py-2.5 rounded-full bg-[#5A7359] hover:bg-[#4C624B] text-white font-semibold text-xs flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo</span>
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2.5 rounded-full border border-[#D8D0C2] dark:border-[#363D34] text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621] font-medium text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      {uploadedImages.length === 0 && !isCameraActive && (
        <div className="bg-[#FFFFFF] dark:bg-[#282C27] border-2 border-dashed border-[#D8D0C2] dark:border-[#363D34] rounded-2xl p-8 md:p-12 text-center flex flex-col items-center justify-center gap-4 transition hover:border-[#879B87]">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F2EA] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] flex items-center justify-center text-[#5A7359] dark:text-[#95A895]">
            <Upload className="w-7 h-7" />
          </div>

          <div className="max-w-md">
            <h3 className="text-base font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
              {t('dropzone_label', 'Drag & drop image here or browse')}
            </h3>
            <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-1">
              Supports JPG, JPEG, PNG · Multiple angles supported
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <button
              onClick={startCamera}
              className="px-4 py-2.5 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white text-xs font-medium flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Camera className="w-4 h-4" />
              <span>{t('btn_take_photo', 'Use Camera')}</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] hover:bg-[#F5F2EA] dark:hover:bg-[#282C27] text-xs font-medium flex items-center gap-2 transition cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{t('btn_upload_file', 'Upload Photo')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Area: ALWAYS displays the actual uploaded image */}
      {uploadedImages.length > 0 && !isCameraActive && !scannedResult && !isAnalyzing && !scanError && (
        <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                Captured Image Preview ({uploadedImages.length})
              </h3>
              <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8]">
                Confirm that the medicine label or text is in focus before analyzing.
              </p>
            </div>
            <button
              onClick={handleRetake}
              className="text-xs font-medium text-[#5A7359] dark:text-[#95A895] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('btn_retake', 'Retake')}</span>
            </button>
          </div>

          {/* Grid of actual uploaded photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((img, idx) => (
              <div
                key={idx}
                className="relative rounded-xl border border-[#E3DCCF] dark:border-[#363D34] overflow-hidden bg-[#F5F2EA] dark:bg-[#151815] group aspect-4/3 flex items-center justify-center"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-contain p-1"
                />
                <button
                  onClick={() => removeSingleImage(idx)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-1 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-xs truncate max-w-[85%]">
                  {img.name}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E3DCCF] dark:border-[#363D34]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-2 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] text-xs font-medium text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621] flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload another angle</span>
              </button>
              <button
                onClick={startCamera}
                className="px-3.5 py-2 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] text-xs font-medium text-[#6D716B] dark:text-[#BDC2B8] hover:bg-[#F5F2EA] dark:hover:bg-[#222621] flex items-center gap-1.5 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Camera angle</span>
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              className="px-5 py-2.5 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer shadow-xs ml-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze image</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading Stages */}
      {isAnalyzing && (
        <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-[#5A7359] dark:text-[#95A895] animate-spin" />
          </div>
          <div className="max-w-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] mb-1">
              Optical Verification
            </div>
            <h3 className="text-base font-medium text-[#2F322E] dark:text-[#F3EFE8] animate-pulse">
              {analysisStage}
            </h3>
            <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-1">
              Sahaara is reading the image labels and active pharmacological ingredients.
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {scanError && (
        <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#B2614B]/40 rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B2614B]/15 text-[#B2614B] flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-medium text-[#2F322E] dark:text-[#F3EFE8]">
                {t('scan_error_title', "We couldn't analyze this image.")}
              </h3>
              <p className="text-xs text-[#6D716B] dark:text-[#BDC2B8] mt-0.5">
                {scanError.error}
              </p>
            </div>
          </div>

          <div className="bg-[#F5F2EA] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34] rounded-xl p-4">
            <h4 className="text-xs font-semibold text-[#2F322E] dark:text-[#F3EFE8] mb-2">
              {t('scan_error_reasons_title', 'Possible reasons:')}
            </h4>
            <ul className="text-xs text-[#6D716B] dark:text-[#BDC2B8] space-y-1.5 list-disc list-inside">
              <li>{t('reason_blurry', 'The image may be blurry or out of focus')}</li>
              <li>{t('reason_name_not_visible', 'Medicine brand or active ingredient name is not clearly visible')}</li>
              <li>{t('reason_service_unavailable', 'AI multimodal service is currently unavailable or busy')}</li>
              <li>{t('reason_api_key', 'API key is not configured or rate limit was reached')}</li>
              <li>{t('reason_network', 'Network connection interrupted during upload')}</li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleAnalyze}
              className="px-4 py-2 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('btn_try_again', 'Try again')}</span>
            </button>
            <button
              onClick={() => {
                setScanError(null);
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] bg-[#FCFBF7] dark:bg-[#222621] text-[#2F322E] dark:text-[#F3EFE8] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload another image</span>
            </button>
            <button
              onClick={onStartDemo}
              className="px-4 py-2 rounded-lg border border-[#D8D0C2] dark:border-[#363D34] bg-[#DCE5D9] dark:bg-[#242D23] text-[#2F322E] dark:text-[#F3EFE8] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#5A7359] dark:text-[#95A895]" />
              <span>{t('btn_use_demo_mode', 'Use Demo Mode')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Structured Result Display */}
      {scannedResult && (
        <div className="bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] rounded-2xl p-6 md:p-8 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E3DCCF] dark:border-[#363D34]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#5A7359] dark:text-[#95A895] block">
                  Optical Verification Complete
                </span>
                <h3 className="text-lg font-serif text-[#2F322E] dark:text-[#F3EFE8] font-medium">
                  {scannedResult.medicineName || 'Medicine Identified'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {scannedResult.category && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#DCE5D9] dark:bg-[#242D23] text-[#5A7359] dark:text-[#95A895]">
                  {scannedResult.category}
                </span>
              )}
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  scannedResult.confidence === 'high'
                    ? 'bg-[#DCE5D9] text-[#5A7359] dark:bg-[#242D23] dark:text-[#95A895]'
                    : 'bg-[#B7924F]/20 text-[#635A51] dark:text-[#CBA457]'
                }`}
              >
                Confidence: {scannedResult.confidence || 'Medium'}
              </span>
            </div>
          </div>

          {/* "What it is generally used for" patient-friendly section */}
          {scannedResult.generalUse && (
            <div className="p-4 rounded-xl bg-[#F5F2EA] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A7359] dark:text-[#95A895] block mb-1">
                {language === 'hi' ? 'यह दवा किस लिए है' : 'What it is generally used for'}
              </span>
              <p className="text-xs md:text-sm text-[#2F322E] dark:text-[#F3EFE8] leading-relaxed">
                {language === 'hi' && scannedResult.generalUseHi
                  ? scannedResult.generalUseHi
                  : scannedResult.generalUse}
              </p>
            </div>
          )}

          {/* "In Simple Words" section */}
          {scannedResult.simpleExplanation && (
            <div className="p-4 rounded-xl bg-[#F5F2EA] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D716B] dark:text-[#BDC2B8] block mb-1">
                {language === 'hi' ? 'सरल शब्दों में' : 'In Simple Words'}
              </span>
              <p className="text-xs md:text-sm text-[#2F322E] dark:text-[#F3EFE8] leading-relaxed">
                {language === 'hi' && scannedResult.simpleExplanationHi
                  ? scannedResult.simpleExplanationHi
                  : scannedResult.simpleExplanation}
              </p>
            </div>
          )}

          {/* Details breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34]">
              <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] block mb-1">
                Active Generic / Molecule
              </span>
              <span className="text-sm font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                {scannedResult.genericName ||
                  (scannedResult.activeIngredients || []).join(', ') ||
                  'Active molecule unverified'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34]">
              <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] block mb-1">
                Dosage Strength & Form
              </span>
              <span className="font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                {scannedResult.strength || 'Standard'} · {scannedResult.dosageForm || 'Form'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34]">
              <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] block mb-1">
                Timing & Food Instructions
              </span>
              <span className="font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                {scannedResult.timing || 'Daily'} · {scannedResult.foodInstruction || 'With water'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FCFBF7] dark:bg-[#222621] border border-[#E3DCCF] dark:border-[#363D34]">
              <span className="text-[11px] text-[#6D716B] dark:text-[#BDC2B8] block mb-1">
                Expiry Date & Batch
              </span>
              <span className="font-semibold text-[#2F322E] dark:text-[#F3EFE8]">
                {scannedResult.expiryDate || 'Not visible on this angle'}{' '}
                {scannedResult.batchNumber ? `(Batch: ${scannedResult.batchNumber})` : ''}
              </span>
            </div>
          </div>

          {/* Verification items */}
          {scannedResult.whatWeCouldVerify && scannedResult.whatWeCouldVerify.length > 0 && (
            <div className="p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#282C27] border border-[#E3DCCF] dark:border-[#363D34] text-xs">
              <span className="font-semibold text-[#5A7359] dark:text-[#95A895] block mb-1.5">
                What Sahaara could verify from label:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {scannedResult.whatWeCouldVerify.map((item: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-[#DCE5D9] dark:bg-[#242D23] text-[#2F322E] dark:text-[#F3EFE8]"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E3DCCF] dark:border-[#363D34]">
            <button
              onClick={handleRetake}
              className="text-xs font-medium text-[#6D716B] dark:text-[#BDC2B8] hover:text-[#2F322E] dark:hover:text-[#F3EFE8] transition cursor-pointer"
            >
              Discard & Retake
            </button>
            <button
              onClick={handleAddToCabinet}
              className="px-5 py-2.5 rounded-lg bg-[#5A7359] hover:bg-[#485D47] text-white font-medium text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <span>{t('btn_add_to_cabinet', 'Add to Medicine Cabinet')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

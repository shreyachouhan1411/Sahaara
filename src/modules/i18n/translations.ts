export type SupportedLanguage = 'en' | 'hi';

export interface TranslationsDict {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: TranslationsDict = {
  // Brand & Tagline
  app_name: {
    en: 'SAHAARA',
    hi: 'सहारा (SAHAARA)',
  },
  app_tagline: {
    en: 'Scan. Check. Understand. Follow.',
    hi: 'स्कैन करें. जांचें. समझें. पालन करें.',
  },
  app_subtagline: {
    en: 'A clearer way to manage the medicines and health information that matter to you.',
    hi: 'अपनी दवाओं और स्वास्थ्य की महत्वपूर्ण जानकारी को सरलता से समझने का विश्वसनीय माध्यम।',
  },

  // Navigation
  nav_home: {
    en: 'Home',
    hi: 'होम (मुख्य)',
  },
  nav_my_day: {
    en: 'My Day',
    hi: 'मेरा दिन (शेड्यूल)',
  },
  nav_medicines: {
    en: 'Medicines',
    hi: 'मेरी दवाइयां (कैबिनेट)',
  },
  nav_scan: {
    en: 'Scan',
    hi: 'स्कैन करें',
  },
  nav_prescription_match: {
    en: 'Prescription Match',
    hi: 'पर्चे का मिलान',
  },
  nav_health_thread: {
    en: 'Health Thread',
    hi: 'हेल्थ टाइमलाइन',
  },
  nav_questions: {
    en: 'Doctor Questions',
    hi: 'डॉक्टर से सवाल',
  },
  nav_lab_reports: {
    en: 'Lab Reports',
    hi: 'जांच रिपोर्ट (लैब)',
  },
  nav_care_circle: {
    en: 'Care Circle',
    hi: 'केयर सर्कल (परिवार)',
  },
  nav_settings: {
    en: 'Settings',
    hi: 'सेटिंग्स',
  },
  nav_appointment_brief: {
    en: 'Appointment Brief',
    hi: 'डॉक्टर विजिट सारांश',
  },

  // Top Bar & Controls
  theme_toggle_tooltip: {
    en: 'Toggle light / dark theme',
    hi: 'लाइट / डार्क मोड बदलें',
  },
  comfort_mode: {
    en: 'Comfort Mode',
    hi: 'सहज मोड (बड़ा फॉन्ट)',
  },
  demo_mode_badge: {
    en: 'DEMO DATA',
    hi: 'डेमो डेटा',
  },
  demo_mode_notice: {
    en: 'Viewing sample patient journey. Data is fictional.',
    hi: 'सैंपल मरीज़ रिकॉर्ड देख रहे हैं। डेटा काल्पनिक है।',
  },
  exit_demo: {
    en: 'Exit Demo',
    hi: 'डेमो से बाहर आएं',
  },
  explore_demo: {
    en: 'Explore Demo',
    hi: 'डेमो देखें',
  },

  // Onboarding / Login
  login_title: {
    en: 'Welcome to Sahaara',
    hi: 'सहारा में आपका स्वागत है',
  },
  login_subtitle: {
    en: 'A calmer way to understand your medicines and stay on top of your day.',
    hi: 'अपनी दवाओं को बिना किसी तनाव के समझने और सही समय पर लेने का शांत साधन।',
  },
  field_name: {
    en: 'Full Name',
    hi: 'पूरा नाम',
  },
  field_name_placeholder: {
    en: 'e.g. Shreya Chouhan',
    hi: 'उदा. श्रेया चौहान',
  },
  field_email: {
    en: 'Email Address',
    hi: 'ईमेल पता',
  },
  field_email_placeholder: {
    en: 'e.g. name@example.com',
    hi: 'उदा. shreya@example.com',
  },
  field_age: {
    en: 'Age',
    hi: 'आयु (उम्र)',
  },
  field_age_placeholder: {
    en: 'e.g. 42',
    hi: 'उदा. 42',
  },
  btn_continue: {
    en: 'Continue',
    hi: 'आगे बढ़ें',
  },
  btn_explore_demo_hint: {
    en: 'Exploring for evaluation? Try the complete judge demo journey.',
    hi: 'मूल्यांकन के लिए देख रहे हैं? संपूर्ण डेमो यात्रा का अनुभव करें।',
  },
  btn_start_demo: {
    en: 'Start Demo Journey',
    hi: 'डेमो यात्रा शुरू करें',
  },

  // Home View
  greeting_morning: {
    en: 'Good morning',
    hi: 'शुभ प्रभात',
  },
  greeting_afternoon: {
    en: 'Good afternoon',
    hi: 'नमस्ते',
  },
  greeting_evening: {
    en: 'Good evening',
    hi: 'शुभ संध्या',
  },
  home_headline: {
    en: "Here's what matters today.",
    hi: 'आज के लिए जो सबसे जरूरी है, वह यहाँ है।',
  },
  next_section_title: {
    en: 'Next',
    hi: 'अगली खुराक (Next)',
  },
  btn_mark_taken: {
    en: 'Mark as taken',
    hi: 'ली गई (Mark taken)',
  },
  taken_badge: {
    en: 'Taken',
    hi: 'ले ली गई ✓',
  },
  upcoming_badge: {
    en: 'Upcoming',
    hi: 'आगामी खुराक',
  },
  today_summary_title: {
    en: 'Today',
    hi: 'आज का सारांश',
  },
  medicines_count_label: {
    en: 'medicines scheduled',
    hi: 'दवाएं निर्धारित',
  },
  upcoming_count_label: {
    en: 'upcoming doses',
    hi: 'आने वाली खुराक',
  },
  needs_review_count_label: {
    en: 'needs review',
    hi: 'समीक्षा आवश्यक',
  },
  continue_section_title: {
    en: 'Continue',
    hi: 'हालिया गतिविधि',
  },
  prescription_reviewed_yesterday: {
    en: 'Prescription reviewed by Dr. Thorne · 4 medicines organized',
    hi: 'डॉ. थोर्न का पर्चा व्यवस्थित · 4 दवाएं शामिल',
  },

  // Clarity Card
  clarity_card_title: {
    en: "Today's Clarity",
    hi: 'आज की महत्वपूर्ण बातें (Clarity)',
  },
  clarity_card_subtitle: {
    en: '3 things worth knowing today',
    hi: '3 बातें जो आज जानना आपके लिए जरूरी हैं',
  },

  // Safety Radar
  safety_radar_title: {
    en: 'Safety Radar',
    hi: 'सुरक्षा रडार (Safety Radar)',
  },
  safety_radar_clear: {
    en: 'Clear',
    hi: 'सुरक्षित (Clear)',
  },
  safety_radar_clear_desc: {
    en: 'Everything available appears consistent and no adverse interactions detected.',
    hi: 'उपलब्ध सभी दवाओं का तालमेल सामान्य है और कोई गंभीर विरोधाभास नहीं दिखा।',
  },
  safety_radar_review: {
    en: 'Review Recommended',
    hi: 'जांच आवश्यक (Review)',
  },
  safety_radar_review_desc: {
    en: 'Something deserves a closer look with your doctor or pharmacist.',
    hi: 'कुछ बिंदुओं पर डॉक्टर या फार्मासिस्ट से परामर्श लेना उचित रहेगा।',
  },
  safety_radar_unverified: {
    en: 'Unverified',
    hi: 'अपुष्ट (Unverified)',
  },
  safety_radar_unverified_desc: {
    en: 'The available image information was not sufficient to verify all parameters.',
    hi: 'उपलब्ध लेबल या तस्वीर पूरी तरह स्पष्ट न होने के कारण विवरण अपुष्ट है।',
  },
  safety_disclaimer: {
    en: 'Sahaara is an informational companion. It does not replace clinical medical advice. Always confirm with your physician.',
    hi: 'सहारा केवल सूचनात्मक और संगठनात्मक सुविधा है। यह चिकित्सकीय परामर्श का विकल्प नहीं है। हमेशा अपने चिकित्सक से पुष्टि करें।',
  },

  // Scanner View
  scanner_title: {
    en: 'Medicine & Prescription Scanner',
    hi: 'दवा और पर्चा स्कैनर',
  },
  scanner_desc: {
    en: 'Take a photo or upload clear images of pill bottles, medicine cartons, or doctor prescriptions.',
    hi: 'दवा की शीशी, रैपर, बॉक्स या डॉक्टर के पर्चे की स्पष्ट फोटो लें या अपलोड करें।',
  },
  tab_scan_medicine: {
    en: 'Scan Medicine Bottle / Strip',
    hi: 'दवा की बोतल या पत्ता स्कैन करें',
  },
  tab_scan_prescription: {
    en: 'Scan Doctor Prescription',
    hi: 'डॉक्टर का पर्चा (Rx) स्कैन करें',
  },
  tab_scan_report: {
    en: 'Scan Lab Blood Report',
    hi: 'रक्त जांच / लैब रिपोर्ट स्कैन करें',
  },
  btn_take_photo: {
    en: 'Use Camera',
    hi: 'कैमरा खोलें',
  },
  btn_upload_file: {
    en: 'Upload Photo',
    hi: 'फोटो अपलोड करें',
  },
  dropzone_label: {
    en: 'Drag & drop image here or browse',
    hi: 'यहाँ फोटो ड्रैग करें या फाइल चुनें',
  },
  dropzone_formats: {
    en: 'Supports JPG, JPEG, PNG · Multiple angles supported',
    hi: 'JPG, JPEG, PNG समर्थित · कई कोणों की तस्वीरें जोड़ सकते हैं',
  },
  btn_retake: {
    en: 'Retake',
    hi: 'दोबारा लें (Retake)',
  },
  btn_upload_another: {
    en: 'Upload another angle',
    hi: 'दूसरा कोण जोड़ें',
  },
  btn_analyze: {
    en: 'Analyze with Gemini Vision',
    hi: 'विश्लेषण करें (Analyze)',
  },
  analyzing_step_1: {
    en: 'Reading image optics...',
    hi: 'तस्वीर का विवरण पढ़ा जा रहा है...',
  },
  analyzing_step_2: {
    en: 'Identifying active pharmaceutical ingredients...',
    hi: 'दवा के सक्रिय तत्व पहचाने जा रहे हैं...',
  },
  analyzing_step_3: {
    en: 'Checking prescription match & contraindications...',
    hi: 'पर्चे से मिलान और सुरक्षा जांच की जा रही है...',
  },
  analyzing_step_4: {
    en: 'Preparing your structured safety result...',
    hi: 'सुरक्षा परिणाम तैयार किया जा रहा है...',
  },
  scan_error_title: {
    en: "We couldn't analyze this image.",
    hi: 'हम इस तस्वीर का विश्लेषण नहीं कर सके।',
  },
  scan_error_reasons_title: {
    en: 'Possible reasons:',
    hi: 'संभावित कारण:',
  },
  reason_blurry: {
    en: 'The image may be blurry or out of focus',
    hi: 'तस्वीर धुंधली या फोकस से बाहर हो सकती है',
  },
  reason_name_not_visible: {
    en: 'Medicine brand or active ingredient name is not clearly visible',
    hi: 'दवा का नाम या सॉल्ट साफ दिखाई नहीं दे रहा',
  },
  reason_service_unavailable: {
    en: 'AI multimodal service is currently unavailable or busy',
    hi: 'एआई सेवा अस्थायी रूप से व्यस्त या अनुपलब्ध है',
  },
  reason_api_key: {
    en: 'API key is not configured or rate limit was reached',
    hi: 'एपीआई की अनुपलब्ध या सीमित है',
  },
  reason_network: {
    en: 'Network connection interrupted during upload',
    hi: 'अपलोड के दौरान नेटवर्क कनेक्शन में रुकावट आई',
  },
  btn_try_again: {
    en: 'Try again',
    hi: 'पुनः प्रयास करें',
  },
  btn_use_demo_mode: {
    en: 'Use Demo Mode',
    hi: 'डेमो मोड का उपयोग करें',
  },

  // Structured Result View
  found_medicine_title: {
    en: 'Medicine Identified',
    hi: 'दवा की पहचान हुई',
  },
  field_generic_name: {
    en: 'Active Generic / Salt',
    hi: 'जेनेरिक नाम / सक्रिय सॉल्ट',
  },
  field_strength: {
    en: 'Dosage Strength',
    hi: 'खुराक की शक्ति (Strength)',
  },
  field_dosage_form: {
    en: 'Form',
    hi: 'दवा का रूप (Form)',
  },
  field_manufacturer: {
    en: 'Manufacturer',
    hi: 'निर्माता कंपनी',
  },
  field_expiry_date: {
    en: 'Expiry Date',
    hi: 'समाप्ति तिथि (Expiry)',
  },
  field_visible_instructions: {
    en: 'Packaging Instructions',
    hi: 'पैकेट पर लिखे निर्देश',
  },
  field_evidence: {
    en: 'Visual OCR Evidence',
    hi: 'तस्वीर में पढ़े गए शब्द',
  },
  field_confidence: {
    en: 'Confidence Level',
    hi: 'पुष्टि स्तर (Confidence)',
  },
  btn_add_to_cabinet: {
    en: 'Add to Medicine Cabinet',
    hi: 'मेरी दवाओं में जोड़ें',
  },
  btn_discard: {
    en: 'Discard',
    hi: 'रद्द करें',
  },

  // Prescription Match
  prescription_match_title: {
    en: 'Prescription Reconciliation',
    hi: 'पर्चे का मिलान (Reconciliation)',
  },
  prescription_match_subtitle: {
    en: 'Comparing your doctor’s written prescription with actual medicines in your cabinet.',
    hi: 'डॉक्टर द्वारा लिखे गए पर्चे और आपकी दवाओं के बीच सीधा मिलान।',
  },
  matched_count_text: {
    en: '3 matched',
    hi: '3 दवाएं मेल खाती हैं',
  },
  needs_review_count_text: {
    en: '1 needs review',
    hi: '1 की जांच आवश्यक है',
  },
  status_matched: {
    en: 'Matched with Rx',
    hi: 'पर्चे से मेल खाती है ✓',
  },
  status_needs_review: {
    en: 'Needs Review',
    hi: 'समीक्षा आवश्यक ⚠',
  },
  status_unprescribed: {
    en: 'Cabinet only (Not in Rx)',
    hi: 'पर्चे में उल्लेखित नहीं (कैबिनेट)',
  },

  // My Day Timeline
  my_day_title: {
    en: 'My Day',
    hi: 'दवा का समय (My Day)',
  },
  my_day_subtitle: {
    en: 'Your personalized, food-aware daily medication schedule.',
    hi: 'भोजन और समय के अनुसार आपका दैनिक दवा शेड्यूल।',
  },
  slot_morning: {
    en: 'Morning (08:00)',
    hi: 'सुबह (08:00)',
  },
  slot_afternoon: {
    en: 'Afternoon (13:00)',
    hi: 'दोपहर (13:00)',
  },
  slot_evening: {
    en: 'Evening (19:30)',
    hi: 'शाम (19:30)',
  },
  slot_night: {
    en: 'Night (22:00)',
    hi: 'रात (22:00)',
  },

  // Medicine Cabinet
  cabinet_title: {
    en: 'My Medicines',
    hi: 'मेरी दवाइयां (Medicine Cabinet)',
  },
  cabinet_subtitle: {
    en: 'Active medications, verification records, and expiry watch.',
    hi: 'सक्रिय दवाएं, सत्यापन इतिहास और समाप्ति निगरानी।',
  },
  tab_current: {
    en: 'Current',
    hi: 'सक्रिय (Current)',
  },
  tab_needs_review: {
    en: 'Needs Review',
    hi: 'जांच योग्य (Review)',
  },
  tab_completed: {
    en: 'Completed',
    hi: 'पूर्ण हुई (Completed)',
  },
  tab_expiring_soon: {
    en: 'Expiring Soon',
    hi: 'जल्द समाप्त होने वाली (Expiring)',
  },
  medicine_memory_label: {
    en: 'Medicine Memory',
    hi: 'दवा इतिहास (Memory)',
  },
  last_verified_prefix: {
    en: 'Last verified',
    hi: 'अंतिम सत्यापन',
  },

  // Health Thread
  health_thread_title: {
    en: 'Health Thread',
    hi: 'हेल्थ थ्रेड (स्वास्थ्य इतिहास)',
  },
  health_thread_subtitle: {
    en: 'A chronological thread connecting your prescriptions, scans, safety reviews, and lab tests.',
    hi: 'पर्चे, दवा स्कैन, सुरक्षा समीक्षा और लैब टेस्ट की समयबद्ध कड़ी।',
  },

  // Verify Before You Go
  verify_before_title: {
    en: 'Before You Go',
    hi: 'डॉक्टर विजिट से पहले चेकलिस्ट',
  },
  verify_before_subtitle: {
    en: 'Pre-appointment & travel safety checklist to prevent surprises.',
    hi: 'अपॉइंटमेंट या यात्रा से पूर्व दवाओं की तैयारी।',
  },

  // Doctor Questions
  doctor_questions_title: {
    en: 'Doctor Questions',
    hi: 'डॉक्टर से पूछने योग्य सवाल',
  },
  doctor_questions_subtitle: {
    en: 'Personalized questions automatically synthesized from your actual medicines and safety findings.',
    hi: 'आपकी दवाओं और निष्कर्षों के आधार पर तैयार किए गए विचारणीय प्रश्न।',
  },
  btn_copy_question: {
    en: 'Copy Question',
    hi: 'कॉपी करें',
  },
  btn_add_custom_question: {
    en: 'Add Question',
    hi: 'सवाल जोड़ें',
  },

  // Appointment Brief
  appointment_brief_title: {
    en: 'Appointment Brief',
    hi: 'अपॉइंटमेंट सारांश (Appointment Brief)',
  },
  appointment_brief_subtitle: {
    en: 'Print-ready clinical summary of current medicines, lab findings, and questions for your doctor.',
    hi: 'डॉक्टर को दिखाने के लिए प्रिंट-योग्य स्पष्ट सारांश।',
  },
  btn_print_export: {
    en: 'Print / Save PDF',
    hi: 'प्रिंट करें / पीडीएफ सेव करें',
  },

  // Care Circle
  care_circle_title: {
    en: 'Care Circle',
    hi: 'केयर सर्कल (Care Circle)',
  },
  care_circle_subtitle: {
    en: 'Share peace of mind with family caregivers. You control exactly what is shared.',
    hi: 'परिवार के साथ दवा की जानकारी साझा करें। क्या साझा करना है, यह पूरी तरह आपके हाथ में है।',
  },
  share_option_schedule: {
    en: 'Daily medication schedule & reminders',
    hi: 'दैनिक दवा का शेड्यूल और रिमाइंडर',
  },
  share_option_medicines: {
    en: 'Current active medicine list & strengths',
    hi: 'सक्रिय दवाओं की सूची और मात्रा',
  },
  share_option_reports: {
    en: 'Medical & blood lab test reports',
    hi: 'लैब और ब्लड टेस्ट रिपोर्ट्स',
  },
  share_option_questions: {
    en: 'Doctor appointment questions',
    hi: 'डॉक्टर से जुड़े सवाल',
  },

  // Settings
  settings_title: {
    en: 'Settings',
    hi: 'सेटिंग्स',
  },
  settings_profile_section: {
    en: 'Patient Profile',
    hi: 'मरीज़ प्रोफाइल',
  },
  settings_preferences: {
    en: 'Preferences',
    hi: 'प्राथमिकताएं',
  },
  settings_language: {
    en: 'Language',
    hi: 'भाषा (Language)',
  },
  settings_theme: {
    en: 'Appearance & Theme',
    hi: 'थीम (Appearance)',
  },
  settings_sign_out: {
    en: 'Sign out',
    hi: 'लॉग आउट (Sign out)',
  },
  settings_clear_data: {
    en: 'Reset Local Data',
    hi: 'स्थानीय डेटा रीसेट करें',
  },
  medical_disclaimer_notice: {
    en: 'Medical Notice: Sahaara is designed for prescription safety verification and patient empowerment. Never stop or modify medication dosages without speaking directly with your licensed physician or pharmacist.',
    hi: 'चिकित्सकीय सूचना: सहारा पर्चा सत्यापन और सुरक्षित उपयोग के लिए बनाया गया है। अपने डॉक्टर या फार्मासिस्ट से परामर्श किए बिना कभी भी दवा बंद न करें या खुराक न बदलें।',
  },
};

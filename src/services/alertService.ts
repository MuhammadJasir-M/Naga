
import { Alert } from '@/types/alert';
import { indianStates } from '@/data/indianStates';
import EnhancedAlertService from './enhancedAlertService';

// Mock API service that simulates fetching from government sources
class AlertService {
  private static instance: AlertService;
  private alerts: Alert[] = [];
  private subscribers: Array<{ email?: string; phone?: string; preferences: any }> = [];
  private usedAlertIds: Set<string> = new Set();
  private enhancedService: EnhancedAlertService;

  private constructor() {
    this.enhancedService = EnhancedAlertService.getInstance();
  }

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  // Generate completely unique alerts from Indian government sources (Priority: Indian sources first)
  async fetchLatestAlerts(): Promise<Alert[]> {
    const batchId = Date.now();
    
    // Expanded Indian government alert templates (90% of alerts now)
    const indianAlertTemplates = [
      {
        title: 'भूकंप चेतावनी - {location} में {mag} तीव्रता',
        description: 'राष्ट्रीय भूकंप विज्ञान केंद्र: {location} में {mag} तीव्रता का भूकंप। {time} पर झटके महसूस किए गए। {safety} {aftershock}',
        severity: 'critical',
        type: 'earthquake',
        locations: [
          { name: 'Delhi NCR, India', lat: 28.7041, lng: 77.1025 },
          { name: 'Mumbai, Maharashtra', lat: 19.0760, lng: 72.8777 },
          { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946 },
          { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
          { name: 'Kolkata, West Bengal', lat: 22.5726, lng: 88.3639 },
          { name: 'Hyderabad, Telangana', lat: 17.3850, lng: 78.4867 },
          { name: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567 },
          { name: 'Ahmedabad, Gujarat', lat: 23.0225, lng: 72.5714 }
        ],
        source: 'राष्ट्रीय भूकंप विज्ञान केंद्र (NCS), भारत',
        languages: {
          'en': { 
            title: 'Magnitude {mag} Earthquake - {location}', 
            description: 'National Center for Seismology: {mag} magnitude earthquake in {location}. Tremors felt at {time}. {safety} {aftershock}' 
          },
          'es': { 
            title: 'Terremoto de magnitud {mag} - {location}', 
            description: 'Centro Nacional de Sismología: Terremoto de magnitud {mag} en {location}. Temblores sentidos a las {time}. {safety} {aftershock}' 
          },
          'fr': { 
            title: 'Séisme de magnitude {mag} - {location}', 
            description: 'Centre National de Sismologie: Séisme de magnitude {mag} à {location}. Tremblements ressentis à {time}. {safety} {aftershock}' 
          },
          'de': { 
            title: 'Erdbeben der Stärke {mag} - {location}', 
            description: 'Nationales Seismologiezentrum: Erdbeben der Stärke {mag} in {location}. Erschütterungen um {time} gespürt. {safety} {aftershock}' 
          },
          'zh': { 
            title: '{mag}级地震 - {location}', 
            description: '国家地震科学中心：{location}发生{mag}级地震。{time}感受到震动。{safety} {aftershock}' 
          },
          'ja': { 
            title: 'マグニチュード{mag}地震 - {location}', 
            description: '国立地震科学センター：{location}でマグニチュード{mag}の地震。{time}に震動を感じました。{safety} {aftershock}' 
          },
          'ar': { 
            title: 'زلزال بقوة {mag} درجة - {location}', 
            description: 'المركز الوطني لعلوم الزلازل: زلزال بقوة {mag} درجة في {location}. تم الشعور بالهزات في {time}. {safety} {aftershock}' 
          },
          'pt': { 
            title: 'Terremoto de magnitude {mag} - {location}', 
            description: 'Centro Nacional de Sismologia: Terremoto de magnitude {mag} em {location}. Tremores sentidos às {time}. {safety} {aftershock}' 
          },
          'ru': { 
            title: 'Землетрясение магнитудой {mag} - {location}', 
            description: 'Национальный центр сейсмологии: Землетрясение магнитудой {mag} в {location}. Толчки ощущались в {time}. {safety} {aftershock}' 
          },
          'hi': { 
            title: 'भूकंप चेतावनी - {location} में {mag} तीव्रता', 
            description: 'राष्ट्रीय भूकंप विज्ञान केंद्र: {location} में {mag} तीव्रता का भूकंप। {time} पर झटके महसूस किए गए। {safety} {aftershock}' 
          },
          'ta': { 
            title: '{location}ல் {mag} அளவு நிலநடுக்கம்', 
            description: 'தேசிய நிலநடுக்க அறிவியல் மையம்: {location}ல் {mag} அளவு நிலநடுக்கம். {time} மணிக்கு அதிர்வுகள் உணரப்பட்டன. {safety} {aftershock}' 
          },
          'te': { 
            title: '{location}లో {mag} తీవ్రత భూకంపం', 
            description: 'జాతీయ భూకంప శాస్త్ర కేంద్రం: {location}లో {mag} తీవ్రత భూకంపం. {time} గంటలకు కంపనలు అనుభవించారు. {safety} {aftershock}' 
          },
          'bn': { 
            title: '{location}ে {mag} মাত্রার ভূমিকম্প', 
            description: 'জাতীয় ভূমিকম্প বিজ্ঞান কেন্দ্র: {location}ে {mag} মাত্রার ভূমিকম্প। {time} সময়ে কম্পন অনুভূত হয়েছে। {safety} {aftershock}' 
          },
          'mr': { 
            title: '{location}मध्ये {mag} तीव्रतेचा भूकंप', 
            description: 'राष्ट्रीय भूकंप विज्ञान केंद्र: {location}मध्ये {mag} तीव्रतेचा भूकंप. {time} वाजता धक्के जाणवले. {safety} {aftershock}' 
          },
          'gu': { 
            title: '{location}માં {mag} તીવ્રતાનો ભૂકંપ', 
            description: 'રાષ્ટ્રીય ભૂકંપ વિજ્ઞાન કેન્દ્ર: {location}માં {mag} તીવ્રતાનો ભૂકંપ. {time} વાગ્યે ધક્કા અનુભવાયા. {safety} {aftershock}' 
          },
          'or': { 
            title: '{location}ରେ {mag} ପ୍ରବଳତାର ଭୂମିକମ୍ପ', 
            description: 'ଜାତୀୟ ଭୂମିକମ୍ପ ବିଜ୍ଞାନ କେନ୍ଦ୍ର: {location}ରେ {mag} ପ୍ରବଳତାର ଭୂମିକମ୍ପ। {time}ରେ କମ୍ପନ ଅନୁଭବ କରାଯାଇଛି। {safety} {aftershock}' 
          }
        }
      },
      {
        title: 'चक्रवात चेतावनी - {location}',
        description: 'भारत मौसम विज्ञान विभाग: {location} में {intensity} चक्रवात। {windspeed} की हवाएं। {duration} तक जारी रह सकता है। {precaution}',
        severity: 'critical',
        type: 'storm',
        locations: [
          { name: 'Mumbai Coastal, Maharashtra', lat: 19.0760, lng: 72.8777 },
          { name: 'Chennai Metro, Tamil Nadu', lat: 13.0827, lng: 80.2707 },
          { name: 'Kolkata Metro, West Bengal', lat: 22.5726, lng: 88.3639 },
          { name: 'Bhubaneswar, Odisha', lat: 20.2961, lng: 85.8245 },
          { name: 'Visakhapatnam, Andhra Pradesh', lat: 17.6868, lng: 83.2185 }
        ],
        source: 'भारत मौसम विज्ञान विभाग (IMD)',
        languages: {
          'en': { 
            title: 'Cyclone Alert - {location}', 
            description: 'India Meteorological Department: {intensity} cyclone in {location}. Winds of {windspeed}. May continue for {duration}. {precaution}' 
          },
          'es': { 
            title: 'Alerta de Ciclón - {location}', 
            description: 'Departamento Meteorológico de India: Ciclón {intensity} en {location}. Vientos de {windspeed}. Puede continuar por {duration}. {precaution}' 
          },
          'fr': { 
            title: 'Alerte Cyclone - {location}', 
            description: 'Département Météorologique Indien: Cyclone {intensity} à {location}. Vents de {windspeed}. Peut continuer pendant {duration}. {precaution}' 
          },
          'de': { 
            title: 'Zyklon-Warnung - {location}', 
            description: 'Indisches Meteorologisches Amt: {intensity} Zyklon in {location}. Winde von {windspeed}. Kann {duration} andauern. {precaution}' 
          },
          'zh': { 
            title: '旋风警报 - {location}', 
            description: '印度气象部门：{location}{intensity}旋风。风速{windspeed}。可能持续{duration}。{precaution}' 
          },
          'ja': { 
            title: 'サイクロン警報 - {location}', 
            description: 'インド気象庁：{location}で{intensity}サイクロン。風速{windspeed}。{duration}続く可能性があります。{precaution}' 
          },
          'ar': { 
            title: 'تحذير إعصار - {location}', 
            description: 'إدارة الأرصاد الجوية الهندية: إعصار {intensity} في {location}. رياح بسرعة {windspeed}. قد يستمر لمدة {duration}. {precaution}' 
          },
          'pt': { 
            title: 'Alerta de Ciclone - {location}', 
            description: 'Departamento Meteorológico da Índia: Ciclone {intensity} em {location}. Ventos de {windspeed}. Pode continuar por {duration}. {precaution}' 
          },
          'ru': { 
            title: 'Предупреждение о циклоне - {location}', 
            description: 'Индийский метеорологический департамент: {intensity} циклон в {location}. Ветер {windspeed}. Может продолжаться {duration}. {precaution}' 
          },
          'hi': { 
            title: 'चक्रवात चेतावनी - {location}', 
            description: 'भारत मौसम विज्ञान विभाग: {location} में {intensity} चक्रवात। {windspeed} की हवाएं। {duration} तक जारी रह सकता है। {precaution}' 
          },
          'ta': { 
            title: 'புயல் எச்சரிக்கை - {location}', 
            description: 'இந்திய வானிலை ஆய்வு மையம்: {location}ல் {intensity} புயல். {windspeed} காற்று. {duration} வரை தொடரலாம். {precaution}' 
          },
          'te': { 
            title: 'తుఫాను హెచ్చరిక - {location}', 
            description: 'భారత వాతావరణ శాఖ: {location}లో {intensity} తుఫాను. {windspeed} గాలులు. {duration} వరకు కొనసాగవచ్చు. {precaution}' 
          },
          'bn': { 
            title: 'ঘূর্ণিঝড় সতর্কতা - {location}', 
            description: 'ভারত আবহাওয়া অধিদপ্তর: {location}এ {intensity} ঘূর্ণিঝড়। {windspeed} বাতাস। {duration} পর্যন্ত চলতে পারে। {precaution}' 
          },
          'mr': { 
            title: 'चक्रीवादळ इशारा - {location}', 
            description: 'भारतीय हवामान खाते: {location}मध्ये {intensity} चक्रीवादळ. {windspeed}चे वारे. {duration}पर्यंत सुरू राहू शकते. {precaution}' 
          },
          'gu': { 
            title: 'વાવાઝોડાની ચેતવણી - {location}', 
            description: 'ભારતીય હવામાન વિભાગ: {location}માં {intensity} વાવાઝોડું. {windspeed}ના પવન. {duration} સુધી ચાલુ રહી શકે. {precaution}' 
          },
          'or': { 
            title: 'ଘୂର୍ଣ୍ଣିଝଡ଼ ସତର୍କତା - {location}', 
            description: 'ଭାରତୀୟ ପାଣିପାଗ ବିଭାଗ: {location}ରେ {intensity} ଘୂର୍ଣ୍ଣିଝଡ଼। {windspeed} ପବନ। {duration} ପର୍ଯ୍ୟନ୍ତ ଚାଲିପାରେ। {precaution}' 
          }
        }
      },
      {
        title: 'बाढ़ की चेतावनी - {location}',
        description: 'केंद्रीय जल आयोग: {location} में {severity} बाढ़ का खतरा। नदी का जल स्तर {level}। {evacuation} {safety}',
        severity: 'warning',
        type: 'flood',
        locations: [
          { name: 'Yamuna River, Delhi', lat: 28.7041, lng: 77.1025 },
          { name: 'Godavari Basin, Maharashtra', lat: 19.7515, lng: 75.7139 },
          { name: 'Ganga Plains, West Bengal', lat: 23.6102, lng: 87.0853 },
          { name: 'Kaveri River, Tamil Nadu', lat: 11.1271, lng: 78.6569 },
          { name: 'Brahmaputra, Assam', lat: 26.2006, lng: 92.9376 }
        ],
        source: 'केंद्रीय जल आयोग (CWC), भारत',
        languages: {
          'en': { 
            title: 'Flood Warning - {location}', 
            description: 'Central Water Commission: {severity} flood risk in {location}. River water level {level}. {evacuation} {safety}' 
          },
          'hi': { 
            title: 'बाढ़ की चेतावनी - {location}', 
            description: 'केंद्रीय जल आयोग: {location} में {severity} बाढ़ का खतरा। नदी का जल स्तर {level}। {evacuation} {safety}' 
          },
          'ta': { 
            title: 'வெள்ளம் எச்சரிக்கை - {location}', 
            description: 'மத்திய நீர் ஆணையம்: {location}ல் {severity} வெள்ள ஆபத்து. நதி நீர் மட்டம் {level}. {evacuation} {safety}' 
          },
          'te': { 
            title: 'వరద హెచ్చరిక - {location}', 
            description: 'కేంద్ర నీటి కమిషన్: {location}లో {severity} వరద ప్రమాదం. నది నీటి మట్టం {level}. {evacuation} {safety}' 
          },
          'bn': { 
            title: 'বন্যার সতর্কতা - {location}', 
            description: 'কেন্দ্রীয় জল কমিশন: {location}এ {severity} বন্যার ঝুঁকি। নদীর জলস্তর {level}। {evacuation} {safety}' 
          },
          'mr': { 
            title: 'पुराचा इशारा - {location}', 
            description: 'केंद्रीय जल आयोग: {location}मध्ये {severity} पुराचा धोका. नदीची पाणी पातळी {level}. {evacuation} {safety}' 
          },
          'gu': { 
            title: 'પૂરની ચેતવણી - {location}', 
            description: 'કેન્દ્રીય જળ કમિશન: {location}માં {severity} પૂરનું જોખમ. નદીનું પાણીનું સ્તર {level}. {evacuation} {safety}' 
          },
          'or': { 
            title: 'ବନ୍ୟା ସତର୍କତା - {location}', 
            description: 'କେନ୍ଦ୍ରୀୟ ଜଳ ଆୟୋଗ: {location}ରେ {severity} ବନ୍ୟା ବିପଦ। ନଦୀର ଜଳ ସ୍ତର {level}। {evacuation} {safety}' 
          }
        }
      },
      {
        title: 'अग्नि चेतावनी - {location}',
        description: 'राष्ट्रीय आपदा प्रबंधन प्राधिकरण: {location} में {intensity} आग। {spread} {evacuation} तत्काल सुरक्षित स्थान पर जाएं।',
        severity: 'critical',
        type: 'fire',
        locations: [
          { name: 'Nainital, Uttarakhand', lat: 29.3919, lng: 79.4542 },
          { name: 'Shimla, Himachal Pradesh', lat: 31.1048, lng: 77.1734 },
          { name: 'Ooty, Tamil Nadu', lat: 11.4064, lng: 76.6932 },
          { name: 'Kodaikanal, Tamil Nadu', lat: 10.2381, lng: 77.4892 },
          { name: 'Mussoorie, Uttarakhand', lat: 30.4598, lng: 78.0664 }
        ],
        source: 'राष्ट्रीय आपदा प्रबंधन प्राधिकरण (NDMA)',
        languages: {
          'en': { 
            title: 'Fire Warning - {location}', 
            description: 'National Disaster Management Authority: {intensity} fire in {location}. {spread} {evacuation} Move to safe location immediately.' 
          },
          'es': { 
            title: 'Alerta de Incendio - {location}', 
            description: 'Autoridad Nacional de Gestión de Desastres: Incendio {intensity} en {location}. {spread} {evacuation} Muévase a un lugar seguro inmediatamente.' 
          },
          'fr': { 
            title: 'Alerte Incendie - {location}', 
            description: 'Autorité Nationale de Gestion des Catastrophes: Incendie {intensity} à {location}. {spread} {evacuation} Déplacez-vous vers un lieu sûr immédiatement.' 
          },
          'de': { 
            title: 'Feuerwarnung - {location}', 
            description: 'Nationale Katastrophenschutzbehörde: {intensity} Feuer in {location}. {spread} {evacuation} Sofort zu einem sicheren Ort bewegen.' 
          },
          'zh': { 
            title: '火灾警报 - {location}', 
            description: '国家灾害管理局：{location}{intensity}火灾。{spread} {evacuation} 立即移动到安全地点。' 
          },
          'ja': { 
            title: '火災警報 - {location}', 
            description: '国家災害管理庁：{location}で{intensity}火災。{spread} {evacuation} 直ちに安全な場所に移動してください。' 
          },
          'ar': { 
            title: 'تحذير حريق - {location}', 
            description: 'هيئة إدارة الكوارث الوطنية: حريق {intensity} في {location}. {spread} {evacuation} انتقل إلى مكان آمن فوراً.' 
          },
          'pt': { 
            title: 'Alerta de Incêndio - {location}', 
            description: 'Autoridade Nacional de Gestão de Desastres: Incêndio {intensity} em {location}. {spread} {evacuation} Mova-se para local seguro imediatamente.' 
          },
          'ru': { 
            title: 'Предупреждение о пожаре - {location}', 
            description: 'Национальное управление по чрезвычайным ситуациям: {intensity} пожар в {location}. {spread} {evacuation} Немедленно переместитесь в безопасное место.' 
          },
          'hi': { 
            title: 'अग्नि चेतावनी - {location}', 
            description: 'राष्ट्रीय आपदा प्रबंधन प्राधिकरण: {location} में {intensity} आग। {spread} {evacuation} तत्काल सुरक्षित स्थान पर जाएं।' 
          },
          'ta': { 
            title: 'தீ எச்சரிக்கை - {location}', 
            description: 'தேசிய பேரிடர் மேலாண்மை ஆணையம்: {location}ல் {intensity} தீ. {spread} {evacuation} உடனடியாக பாதுகாப்பான இடத்திற்கு செல்லுங்கள்.' 
          },
          'te': { 
            title: 'అగ్ని హెచ్చరిక - {location}', 
            description: 'జాతీయ విపత్తు నిర్వహణ అథారిటీ: {location}లో {intensity} మంటలు. {spread} {evacuation} వెంటనే సురక్షిత స్థలానికి వెళ్లండి.' 
          },
          'bn': { 
            title: 'অগ্নিকাণ্ডের সতর্কতা - {location}', 
            description: 'জাতীয় দুর্যোগ ব্যবস্থাপনা কর্তৃপক্ষ: {location}এ {intensity} অগ্নিকাণ্ড। {spread} {evacuation} অবিলম্বে নিরাপদ স্থানে চলে যান।' 
          },
          'mr': { 
            title: 'आग इशारा - {location}', 
            description: 'राष्ट्रीय आपदा व्यवस्थापन प्राधिकरण: {location}मध्ये {intensity} आग. {spread} {evacuation} तातडीने सुरक्षित ठिकाणी जा.' 
          },
          'gu': { 
            title: 'આગની ચેતવણી - {location}', 
            description: 'રાષ્ટ્રીય આપત્તિ વ્યવસ્થાપન પ્રાધિકરણ: {location}માં {intensity} આગ. {spread} {evacuation} તાત્કાલિક સુરક્ષિત સ્થળે જાઓ.' 
          },
          'or': { 
            title: 'ଅଗ୍ନିକାଣ୍ଡ ସତର୍କତା - {location}', 
            description: 'ଜାତୀୟ ବିପର୍ଯ୍ୟୟ ପରିଚାଳନା ପ୍ରାଧିକରଣ: {location}ରେ {intensity} ଅଗ୍ନିକାଣ୍ଡ। {spread} {evacuation} ତୁରନ୍ତ ନିରାପଦ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ।' 
          }
        }
      },
      {
        title: 'हीट वेव चेतावनी - {location}',
        description: 'भारत मौसम विज्ञान विभाग: {location} में {temperature}°C तक गर्मी। {duration} तक जारी रह सकती है। {precaution} पानी पिएं और छांव में रहें।',
        severity: 'warning',
        type: 'other',
        locations: [
          { name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
          { name: 'Haryana', lat: 29.0588, lng: 76.0856 },
          { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
          { name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569 },
          { name: 'Gujarat', lat: 23.0225, lng: 72.5714 }
        ],
        source: 'भारत मौसम विज्ञान विभाग (IMD)',
        languages: {
          'en': { 
            title: 'Heatwave Warning - {location}', 
            description: 'India Meteorological Department: Heat up to {temperature}°C in {location}. May continue for {duration}. {precaution} Drink water and stay in shade.' 
          },
          'hi': { 
            title: 'हीट वेव चेतावनी - {location}', 
            description: 'भारत मौसम विज्ञान विभाग: {location} में {temperature}°C तक गर्मी। {duration} तक जारी रह सकती है। {precaution} पानी पिएं और छांव में रहें।' 
          },
          'ta': { 
            title: 'வெப்ப அலை எச்சரிக்கை - {location}', 
            description: 'இந்திய வானிலை ஆய்வு மையம்: {location}ல் {temperature}°C வரை வெப்பம். {duration} வரை தொடரலாம். {precaution} தண்ணீர் குடித்து நிழலில் இருங்கள்.' 
          },
          'te': { 
            title: 'వేడిమి అల హెచ్చరిక - {location}', 
            description: 'భారత వాతావరణ శాఖ: {location}లో {temperature}°C వరకు వేడిమి. {duration} వరకు కొనసాగవచ్చు. {precaution} నీరు తాగి నీడలో ఉండండి.' 
          },
          'bn': { 
            title: 'তাপপ্রবাহ সতর্কতা - {location}', 
            description: 'ভারত আবহাওয়া অধিদপ্তর: {location}এ {temperature}°C পর্যন্ত গরম। {duration} পর্যন্ত চলতে পারে। {precaution} পানি পান করুন এবং ছায়ায় থাকুন।' 
          },
          'mr': { 
            title: 'उष्णता लहर इशारा - {location}', 
            description: 'भारतीय हवामान खाते: {location}मध्ये {temperature}°C पर्यंत उष्णता. {duration}पर्यंत सुरू राहू शकते. {precaution} पाणी प्या आणि सावलीत रहा.' 
          },
          'gu': { 
            title: 'ગરમીની લહેરની ચેતવણી - {location}', 
            description: 'ભારતીય હવામાન વિભાગ: {location}માં {temperature}°C સુધી ગરમી. {duration} સુધી ચાલુ રહી શકે. {precaution} પાણી પીઓ અને છાયામાં રહો.' 
          },
          'or': { 
            title: 'ଗରମ ଲହରୀ ସତର୍କତା - {location}', 
            description: 'ଭାରତୀୟ ପାଣିପାଗ ବିଭାଗ: {location}ରେ {temperature}°C ପର୍ଯ୍ୟନ୍ତ ଗରମ। {duration} ପର୍ଯ୍ୟନ୍ତ ଚାଲିପାରେ। {precaution} ପାଣି ପିଅନ୍ତୁ ଏବଂ ଛାଇରେ ରୁହନ୍ତୁ।' 
          }
        }
      }
    ];

    // International alerts (10% only)
    const internationalAlertTemplates = [
      {
        title: 'International Emergency - {location}',
        description: 'Global Alert Network: {emergency} reported in {location}. {impact} International coordination in progress.',
        severity: 'warning',
        type: 'other',
        locations: [
          { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
          { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
          { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
          { name: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 }
        ],
        source: 'International Emergency Network',
        languages: {
          'en': { 
            title: 'International Emergency - {location}', 
            description: 'Global Alert Network: {emergency} reported in {location}. {impact} International coordination in progress.' 
          },
          'hi': { 
            title: 'अंतर्राष्ट्रीय आपातकाल - {location}', 
            description: 'वैश्विक अलर्ट नेटवर्क: {location} में {emergency} की रिपोर्ट। {impact} अंतर्राष्ट्रीय समन्वय प्रगति में।' 
          }
        }
      }
    ];

    // Generate exactly 15 unique alerts (80% Indian sources, 20% international)
    const numAlerts = 15; // Fixed 15 alerts total
    const currentTime = new Date();
    const mockNewAlerts: Alert[] = [];
    
    // Generate 12 Indian alerts first, then 3 international
    
    // Dynamic content variations
    const magnitudes = ['4.2', '5.1', '6.3', '4.8', '5.7', '6.0', '4.5', '5.3'];
    const times = ['सुबह', 'दोपहर', 'शाम', 'रात'];
    const safetyMsgs = ['घर के अंदर रहें', 'मजबूत टेबल के नीचे छुपें', 'खुले स्थान में जाएं'];
    const aftershocks = ['अगले 24 घंटों में झटके संभावित', 'बाद के झटकों की निगरानी जारी', 'अतिरिक्त सावधानी बरतें'];
    
    const intensities = ['गंभीर', 'अति गंभीर', 'विनाशकारी'];
    const windspeeds = ['120 km/h', '150 km/h', '180 km/h'];
    const durations = ['24 घंटे', '48 घंटे', '72 घंटे'];
    const precautions = ['घर के अंदर रहें', 'यात्रा न करें', 'आपातकालीन सामान तैयार रखें'];
    
    const severityLevels = ['गंभीर', 'अति गंभीर', 'खतरनाक'];
    const riverLevels = ['खतरे के निशान से ऊपर', 'बाढ़ के स्तर पर', 'चेतावनी स्तर पर'];
    const evacuations = ['तत्काल निकासी आवश्यक', 'सुरक्षित स्थान पर जाएं', 'उच्च स्थान पर पहुंचें'];
    const safetyTips = ['बहते पानी में न जाएं', 'इलेक्ट्रिक उपकरणों से बचें', 'आपातकालीन नंबर तैयार रखें'];
    
    const fireIntensities = ['तेजी से फैलती', 'व्यापक', 'नियंत्रण से बाहर'];
    const spreads = ['हवा की दिशा में फैल रही', '5 km/h की गति से बढ़ रही', 'कई एकड़ में फैली'];
    const fireEvacuations = ['तत्काल निकासी', 'सुरक्षित मार्ग से निकलें', 'धुआं देखते ही भागें'];
    
    const temperatures = ['45', '47', '49', '51', '43'];
    const heatDurations = ['3 दिन', '5 दिन', '1 सप्ताह'];
    const heatPrecautions = ['बाहर न निकलें', 'ORS पिएं', '11-4 बजे घर में रहें'];

    for (let i = 0; i < numAlerts; i++) {
      // First 12 alerts are Indian (80%), last 3 are international (20%)
      const useIndianAlert = i < 12;
      const template = useIndianAlert 
        ? indianAlertTemplates[Math.floor(Math.random() * indianAlertTemplates.length)]
        : internationalAlertTemplates[0];
      const location = template.locations[Math.floor(Math.random() * template.locations.length)];
      
      let processedAlert: any = JSON.parse(JSON.stringify(template));
      
      // Generate unique content based on alert type
      if (template.type === 'earthquake') {
        const magnitude = magnitudes[Math.floor(Math.random() * magnitudes.length)];
        const time = times[Math.floor(Math.random() * times.length)];
        const safety = safetyMsgs[Math.floor(Math.random() * safetyMsgs.length)];
        const aftershock = aftershocks[Math.floor(Math.random() * aftershocks.length)];
        
        // Process all languages
        Object.keys(template.languages).forEach(lang => {
          const langTemplate = template.languages[lang];
          processedAlert.languages[lang] = {
            title: langTemplate.title.replace('{mag}', magnitude).replace('{location}', location.name),
            description: langTemplate.description
              .replace('{mag}', magnitude).replace('{location}', location.name)
              .replace('{time}', time).replace('{safety}', safety).replace('{aftershock}', aftershock)
          };
        });
        
        processedAlert.magnitude = parseFloat(magnitude);
      } else if (template.type === 'storm') {
        const intensity = intensities[Math.floor(Math.random() * intensities.length)];
        const windspeed = windspeeds[Math.floor(Math.random() * windspeeds.length)];
        const duration = durations[Math.floor(Math.random() * durations.length)];
        const precaution = precautions[Math.floor(Math.random() * precautions.length)];
        
        Object.keys(template.languages).forEach(lang => {
          const langTemplate = template.languages[lang];
          processedAlert.languages[lang] = {
            title: langTemplate.title.replace('{location}', location.name),
            description: langTemplate.description
              .replace('{intensity}', intensity).replace('{location}', location.name)
              .replace('{windspeed}', windspeed).replace('{duration}', duration).replace('{precaution}', precaution)
          };
        });
      } else if (template.type === 'flood') {
        const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
        const level = riverLevels[Math.floor(Math.random() * riverLevels.length)];
        const evacuation = evacuations[Math.floor(Math.random() * evacuations.length)];
        const safety = safetyTips[Math.floor(Math.random() * safetyTips.length)];
        
        Object.keys(template.languages).forEach(lang => {
          const langTemplate = template.languages[lang];
          processedAlert.languages[lang] = {
            title: langTemplate.title.replace('{location}', location.name),
            description: langTemplate.description
              .replace('{severity}', severity).replace('{location}', location.name)
              .replace('{level}', level).replace('{evacuation}', evacuation).replace('{safety}', safety)
          };
        });
      } else if (template.type === 'fire') {
        const intensity = fireIntensities[Math.floor(Math.random() * fireIntensities.length)];
        const spread = spreads[Math.floor(Math.random() * spreads.length)];
        const evacuation = fireEvacuations[Math.floor(Math.random() * fireEvacuations.length)];
        
        Object.keys(template.languages).forEach(lang => {
          const langTemplate = template.languages[lang];
          processedAlert.languages[lang] = {
            title: langTemplate.title.replace('{location}', location.name),
            description: langTemplate.description
              .replace('{intensity}', intensity).replace('{location}', location.name)
              .replace('{spread}', spread).replace('{evacuation}', evacuation)
          };
        });
      } else if (template.type === 'other') {
        const temperature = temperatures[Math.floor(Math.random() * temperatures.length)];
        const duration = heatDurations[Math.floor(Math.random() * heatDurations.length)];
        const precaution = heatPrecautions[Math.floor(Math.random() * heatPrecautions.length)];
        
        Object.keys(template.languages).forEach(lang => {
          const langTemplate = template.languages[lang];
          processedAlert.languages[lang] = {
            title: langTemplate.title.replace('{location}', location.name),
            description: langTemplate.description
              .replace('{temperature}', temperature).replace('{location}', location.name)
              .replace('{duration}', duration).replace('{precaution}', precaution)
          };
        });
      }

      const alertId = `${batchId}-${i}-${Math.random().toString(36).substr(2, 8)}`;
      
      // Always use English as default content, ensure all languages have translations
      const englishContent = processedAlert.languages['en'] || {
        title: template.title,
        description: template.description
      };
      
      mockNewAlerts.push({
        id: alertId,
        title: englishContent.title,
        description: englishContent.description,
        severity: processedAlert.severity,
        type: processedAlert.type,
        location: location.name,
        coordinates: { lat: location.lat, lng: location.lng },
        timestamp: new Date(currentTime.getTime() - (i * 300000 + Math.random() * 120000)), // Varied timestamps
        source: processedAlert.source,
        magnitude: processedAlert.magnitude,
        languages: processedAlert.languages,
        isActive: true
      });
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    this.alerts = [...mockNewAlerts];
    return this.alerts;
  }

  // Send notifications to subscribers via Supabase Edge Functions with location filtering
  async sendNotifications(alerts: Alert[]) {
    if (this.subscribers.length === 0) {
      console.log('📭 No subscribers to notify');
      return;
    }

    console.log(`📬 Sending notifications to ${this.subscribers.length} subscribers for ${alerts.length} alerts`);

    // Send personalized notifications for each subscriber with their filtered alerts
    const notificationPromises = this.subscribers.map(async subscriber => {
      const filteredAlerts = this.filterAlertsForSubscriber(alerts, subscriber);
      
      if (filteredAlerts.length === 0) {
        console.log(`📭 No relevant alerts for subscriber ${subscriber.email || subscriber.phone}`);
        return;
      }

      const recipients = [{
        email: subscriber.email,
        phone: subscriber.phone,
        language: subscriber.preferences?.language || 'en'
      }];

      try {
        // Send each alert separately for better processing
        for (const alert of filteredAlerts) {
          const response = await fetch('https://ndxfqiwryuzjhwujqpca.supabase.co/functions/v1/send-emergency-alert', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5keGZxaXdyeXV6amh3dWpxcGNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjAwNzIsImV4cCI6MjA3MjM5NjA3Mn0.KzIy8E7L1vClDmd01uT8vp2c9KUwOm3Ukam-x45HCEw`
            },
            body: JSON.stringify({
              alerts: [alert], // Send one alert at a time
              recipients
            })
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Alert sent to ${subscriber.email || subscriber.phone}: ${result.sent} sent, ${result.failed} failed`);
            if (result.errors?.length) {
              console.warn('Delivery errors:', result.errors);
            }
          } else {
            const error = await response.text();
            console.error(`❌ Failed to send alert to ${subscriber.email || subscriber.phone}:`, error);
          }
        }
      } catch (error) {
        console.error(`❌ Network error sending alerts to ${subscriber.email || subscriber.phone}:`, error);
      }
    });

    await Promise.all(notificationPromises);
  }

  // Subscribe a user to alerts with enhanced filtering
  subscribe(email?: string, phone?: string, preferences?: any): void {
    // Filter existing subscriber if updating
    this.subscribers = this.subscribers.filter(sub => 
      !(sub.email === email && sub.phone === phone)
    );
    
    this.subscribers.push({
      email,
      phone,
      preferences: {
        ...preferences,
        state: preferences?.state,
        region: preferences?.region,
        severityLevels: preferences?.severityLevels || ['critical', 'warning'],
        alertTypes: preferences?.alertTypes || ['earthquake', 'flood', 'fire', 'storm']
      }
    });
    console.log(`📧 Subscriber added: ${email || phone}. Total subscribers: ${this.subscribers.length}`);
  }

  // Filter alerts based on subscriber location and preferences
  private filterAlertsForSubscriber(alerts: Alert[], subscriber: any): Alert[] {
    return alerts.filter(alert => {
      // Filter by state if specified
      if (subscriber.preferences?.state && alert.location) {
        const state = indianStates.find((s: any) => s.code === subscriber.preferences.state);
        if (state) {
          const alertLocation = alert.location.toLowerCase();
          const stateName = state.name.toLowerCase();
          if (!alertLocation.includes(stateName)) {
            return false;
          }
        }
      }

      // Filter by region if specified (and no specific state)
      if (subscriber.preferences?.region && !subscriber.preferences?.state && alert.location) {
        const regionStates = indianStates.filter((s: any) => s.region === subscriber.preferences.region);
        const alertLocation = alert.location.toLowerCase();
        const matchesRegion = regionStates.some((state: any) => 
          alertLocation.includes(state.name.toLowerCase())
        );
        if (!matchesRegion) {
          return false;
        }
      }

      // Filter by severity preferences
      if (subscriber.preferences?.severityLevels?.length > 0) {
        if (!subscriber.preferences.severityLevels.includes(alert.severity)) {
          return false;
        }
      }

      // Filter by alert type preferences
      if (subscriber.preferences?.alertTypes?.length > 0) {
        if (!subscriber.preferences.alertTypes.includes(alert.type)) {
          return false;
        }
      }

      return true;
    });
  }

  // Get current alerts
  getCurrentAlerts(): Alert[] {
    return this.alerts;
  }

  // Auto-refresh alerts every 5 minutes with immediate first fetch
  startAutoRefresh(onUpdate: (alerts: Alert[]) => void) {
    // Immediately fetch alerts on start
    this.fetchLatestAlerts().then(alerts => {
      console.log(`🔄 Initial fetch: ${alerts.length} alerts loaded`);
      onUpdate(alerts);
      
      // Send notifications for initial alerts if there are subscribers
      if (this.subscribers.length > 0 && alerts.length > 0) {
        this.sendNotifications(alerts);
      }
    }).catch(error => {
      console.error('Initial fetch failed:', error);
    });

    // Set up interval for subsequent fetches every 5 minutes
    const interval = setInterval(async () => {
      try {
        console.log('🔄 Fetching fresh alerts...');
        const newAlerts = await this.fetchLatestAlerts();
        
        // Send notifications for new alerts
        if (newAlerts.length > 0 && this.subscribers.length > 0) {
          console.log(`📨 Sending notifications for ${newAlerts.length} new alerts`);
          // Use enhanced service for location-based distribution
          for (const alert of newAlerts) {
            await this.enhancedService.processAndDistributeAlert(alert);
          }
        }
        
        onUpdate(newAlerts);
      } catch (error) {
        console.error('❌ Auto-refresh failed:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return interval;
  }

  stopAutoRefresh(interval: NodeJS.Timeout) {
    clearInterval(interval);
  }
}

export default AlertService;

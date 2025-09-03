import { Alert } from '@/types/alert';
import { supportedLanguages } from '@/data/languages';
import LocationService from './locationService';

interface ProcessedAlert extends Alert {
  zones: {
    immediate: string[];
    nearby: string[];
    regional: string[];
  };
}

class NLPAlertProcessor {
  private static instance: NLPAlertProcessor;
  private locationService: LocationService;

  private constructor() {
    this.locationService = LocationService.getInstance();
  }

  static getInstance(): NLPAlertProcessor {
    if (!NLPAlertProcessor.instance) {
      NLPAlertProcessor.instance = new NLPAlertProcessor();
    }
    return NLPAlertProcessor.instance;
  }

  // Process raw government data into structured alerts
  async processGovernmentData(rawData: any): Promise<ProcessedAlert[]> {
    const alerts: ProcessedAlert[] = [];

    // Simulate processing different government data sources
    const processedAlerts = await this.parseMultipleDataSources(rawData);
    
    for (const alert of processedAlerts) {
      // Extract location coordinates
      const coordinates = this.extractCoordinates(alert);
      
      if (coordinates) {
        // Determine alert zones
        const zones = this.locationService.getAlertZones(coordinates);
        
        // Generate multilingual content
        const multilingualAlert = await this.generateMultilingualContent(alert);
        
        // Create processed alert with zones
        const processedAlert: ProcessedAlert = {
          ...multilingualAlert,
          coordinates,
          zones: {
            immediate: zones.immediate.map(z => z.city),
            nearby: zones.nearby.map(z => z.city),
            regional: zones.regional.map(z => z.city)
          }
        };
        
        alerts.push(processedAlert);
      }
    }

    return alerts;
  }

  // Parse multiple government data sources
  private async parseMultipleDataSources(rawData: any): Promise<Alert[]> {
    const alerts: Alert[] = [];
    
    // Simulate parsing different data formats
    if (rawData.usgs) {
      alerts.push(...this.parseUSGSData(rawData.usgs));
    }
    
    if (rawData.imd) {
      alerts.push(...this.parseIMDData(rawData.imd));
    }
    
    if (rawData.ndma) {
      alerts.push(...this.parseNDMAData(rawData.ndma));
    }
    
    if (rawData.ncs) {
      alerts.push(...this.parseNCSData(rawData.ncs));
    }

    return alerts;
  }

  // Parse USGS earthquake data
  private parseUSGSData(usgsData: any): Alert[] {
    const alerts: Alert[] = [];
    
    if (usgsData.features) {
      usgsData.features.forEach((feature: any) => {
        const props = feature.properties;
        const coords = feature.geometry.coordinates;
        
        alerts.push({
          id: `usgs-${props.id}`,
          title: `Magnitude ${props.mag} Earthquake`,
          description: `${props.title}. ${props.alert ? 'Alert level: ' + props.alert : ''}`,
          severity: this.determineSeverityFromMagnitude(props.mag),
          type: 'earthquake',
          location: props.place || 'Unknown location',
          coordinates: { lat: coords[1], lng: coords[0] },
          timestamp: new Date(props.time),
          source: 'USGS Earthquake Hazards Program',
          magnitude: props.mag,
          languages: {},
          isActive: true
        });
      });
    }
    
    return alerts;
  }

  // Parse India Meteorological Department data
  private parseIMDData(imdData: any): Alert[] {
    const alerts: Alert[] = [];
    
    if (imdData.warnings) {
      imdData.warnings.forEach((warning: any) => {
        alerts.push({
          id: `imd-${warning.id || Date.now()}`,
          title: warning.title || 'Weather Warning',
          description: warning.description || warning.text,
          severity: this.mapIMDSeverity(warning.severity),
          type: this.mapIMDType(warning.type),
          location: warning.location || warning.area,
          coordinates: warning.coordinates || this.locationService.getCityCoordinates(warning.location),
          timestamp: new Date(warning.issued || Date.now()),
          source: 'India Meteorological Department (IMD)',
          languages: {},
          isActive: true
        });
      });
    }
    
    return alerts;
  }

  // Parse National Disaster Management Authority data
  private parseNDMAData(ndmaData: any): Alert[] {
    const alerts: Alert[] = [];
    
    if (ndmaData.alerts) {
      ndmaData.alerts.forEach((alert: any) => {
        alerts.push({
          id: `ndma-${alert.id || Date.now()}`,
          title: alert.headline || 'Emergency Alert',
          description: alert.description || alert.instruction,
          severity: this.mapNDMASeverity(alert.severity),
          type: this.mapNDMAType(alert.event),
          location: alert.areaDesc || alert.location,
          coordinates: alert.coordinates || this.locationService.getCityCoordinates(alert.areaDesc),
          timestamp: new Date(alert.sent || Date.now()),
          source: 'National Disaster Management Authority (NDMA)',
          languages: {},
          isActive: true
        });
      });
    }
    
    return alerts;
  }

  // Parse National Center for Seismology data
  private parseNCSData(ncsData: any): Alert[] {
    const alerts: Alert[] = [];
    
    if (ncsData.earthquakes) {
      ncsData.earthquakes.forEach((eq: any) => {
        alerts.push({
          id: `ncs-${eq.id || Date.now()}`,
          title: `भूकंप चेतावनी - ${eq.location}`,
          description: `राष्ट्रीय भूकंप विज्ञान केंद्र: ${eq.magnitude} तीव्रता का भूकंप ${eq.location} में। ${eq.depth}km गहराई पर।`,
          severity: this.determineSeverityFromMagnitude(eq.magnitude),
          type: 'earthquake',
          location: eq.location,
          coordinates: { lat: eq.latitude, lng: eq.longitude },
          timestamp: new Date(eq.time),
          source: 'राष्ट्रीय भूकंप विज्ञान केंद्र (NCS)',
          magnitude: eq.magnitude,
          languages: {},
          isActive: true
        });
      });
    }
    
    return alerts;
  }

  // Extract coordinates from alert data
  private extractCoordinates(alert: Alert): { lat: number; lng: number } | null {
    if (alert.coordinates) {
      return alert.coordinates;
    }
    
    // Try to parse coordinates from location text
    return this.locationService.parseLocationFromAlert(alert.location);
  }

  // Generate multilingual content for alerts
  private async generateMultilingualContent(alert: Alert): Promise<Alert> {
    const languages: Record<string, { title: string; description: string }> = {};
    
    // Generate translations for all supported languages
    for (const language of supportedLanguages) {
      if (language.code === 'en') {
        languages[language.code] = {
          title: alert.title,
          description: alert.description
        };
        continue;
      }
      
      // Simulate advanced NLP translation
      const translated = await this.translateAlert(alert, language.code);
      languages[language.code] = translated;
    }
    
    return {
      ...alert,
      languages
    };
  }

  // Advanced NLP translation with context preservation
  private async translateAlert(alert: Alert, targetLanguage: string): Promise<{ title: string; description: string }> {
    // This is a sophisticated translation mapping for emergency terminology
    const emergencyTranslations: Record<string, Record<string, string>> = {
      'hi': {
        'earthquake': 'भूकंप',
        'flood': 'बाढ़',
        'fire': 'आग',
        'storm': 'तूफान',
        'critical': 'गंभीर',
        'warning': 'चेतावनी',
        'info': 'जानकारी',
        'magnitude': 'तीव्रता',
        'immediately': 'तुरंत',
        'evacuate': 'निकासी',
        'take shelter': 'आश्रय लें',
        'avoid': 'बचें',
        'emergency': 'आपातकाल'
      },
      'ta': {
        'earthquake': 'நிலநடுக்கம்',
        'flood': 'வெள்ளம்',
        'fire': 'தீ',
        'storm': 'புயல்',
        'critical': 'முக்கியமான',
        'warning': 'எச்சரிக்கை',
        'info': 'தகவல்',
        'magnitude': 'அளவு',
        'immediately': 'உடனடியாக',
        'evacuate': 'வெளியேறு',
        'take shelter': 'அடைக்கலம் எடு',
        'avoid': 'தவிர்',
        'emergency': 'அவசரநிலை'
      },
      'te': {
        'earthquake': 'భూకంపం',
        'flood': 'వరద',
        'fire': 'మంట',
        'storm': 'తుఫాను',
        'critical': 'క్లిష్టమైన',
        'warning': 'హెచ్చరిక',
        'info': 'సమాచారం',
        'magnitude': 'తీవ్రత',
        'immediately': 'వెంటనే',
        'evacuate': 'ఖాళీ చేయండి',
        'take shelter': 'ఆశ్రయం తీసుకోండి',
        'avoid': 'దూరంగా ఉండండి',
        'emergency': 'అత్యవసర పరిస్థితి'
      },
      'bn': {
        'earthquake': 'ভূমিকম্প',
        'flood': 'বন্যা',
        'fire': 'আগুন',
        'storm': 'ঝড়',
        'critical': 'গুরুতর',
        'warning': 'সতর্কতা',
        'info': 'তথ্য',
        'magnitude': 'মাত্রা',
        'immediately': 'অবিলম্বে',
        'evacuate': 'সরে যান',
        'take shelter': 'আশ্রয় নিন',
        'avoid': 'এড়িয়ে চলুন',
        'emergency': 'জরুরি অবস্থা'
      },
      'mr': {
        'earthquake': 'भूकंप',
        'flood': 'पूर',
        'fire': 'आग',
        'storm': 'वादळ',
        'critical': 'गंभीर',
        'warning': 'चेतावणी',
        'info': 'माहिती',
        'magnitude': 'तीव्रता',
        'immediately': 'तातडीने',
        'evacuate': 'बाहेर पडा',
        'take shelter': 'आश्रय घ्या',
        'avoid': 'टाळा',
        'emergency': 'आणीबाणी'
      },
      'gu': {
        'earthquake': 'ભૂકંપ',
        'flood': 'પૂર',
        'fire': 'આગ',
        'storm': 'વાવાઝોડું',
        'critical': 'ગંભીર',
        'warning': 'ચેતવણી',
        'info': 'માહિતી',
        'magnitude': 'તીવ્રતા',
        'immediately': 'તાત્કાલિક',
        'evacuate': 'ખાલી કરો',
        'take shelter': 'આશ્રય લો',
        'avoid': 'ટાળો',
        'emergency': 'કટોકટી'
      },
      'or': {
        'earthquake': 'ଭୂମିକମ୍ପ',
        'flood': 'ବନ୍ୟା',
        'fire': 'ଅଗ୍ନିକାଣ୍ଡ',
        'storm': 'ଝଡ଼',
        'critical': 'ଗୁରୁତର',
        'warning': 'ସତର୍କତା',
        'info': 'ସୂଚନା',
        'magnitude': 'ପ୍ରବଳତା',
        'immediately': 'ତୁରନ୍ତ',
        'evacuate': 'ସ୍ଥାନାନ୍ତର',
        'take shelter': 'ଆଶ୍ରୟ ନିଅନ୍ତୁ',
        'avoid': 'ଏଡ଼ାନ୍ତୁ',
        'emergency': 'ଜରୁରୀକାଳୀନ'
      }
    };

    // Get translation dictionary for target language
    const translations = emergencyTranslations[targetLanguage] || {};
    
    // Translate title and description with context preservation
    let translatedTitle = alert.title;
    let translatedDescription = alert.description;
    
    // Apply translations while preserving emergency context
    Object.entries(translations).forEach(([english, translated]) => {
      const regex = new RegExp(english, 'gi');
      translatedTitle = translatedTitle.replace(regex, translated);
      translatedDescription = translatedDescription.replace(regex, translated);
    });

    // Add language-specific emergency instructions
    const emergencyInstructions = this.getEmergencyInstructions(alert.type, targetLanguage);
    if (emergencyInstructions) {
      translatedDescription += ` ${emergencyInstructions}`;
    }

    return {
      title: translatedTitle,
      description: translatedDescription
    };
  }

  // Get emergency instructions in specific language
  private getEmergencyInstructions(alertType: string, language: string): string {
    const instructions: Record<string, Record<string, string>> = {
      'earthquake': {
        'hi': 'तुरंत मेज के नीचे छुपें। हिलना बंद होने तक रुकें।',
        'ta': 'உடனடியாக மேசையின் கீழ் ஒளிந்து கொள்ளுங்கள். அசைவு நிற்கும் வரை காத்திருங்கள்।',
        'te': 'వెంటనే టేబుల్ కింద దాక్కోండి. వణుకు ఆగే వరకు వేచి ఉండండి।',
        'bn': 'অবিলম্বে টেবিলের নিচে লুকিয়ে পড়ুন। কাঁপুনি বন্ধ না হওয়া পর্যন্ত অপেক্ষা করুন।',
        'mr': 'तातडीने टेबलाखाली लपा. हालचाल थांबेपर्यंत थांबा.',
        'gu': 'તાત્કાલિક ટેબલ નીચે છુપાઈ જાઓ. હલનચલન બંધ થાય ત્યાં સુધી રાહ જુઓ।',
        'or': 'ତୁରନ୍ତ ଟେବୁଲ ତଳେ ଲୁଚି ରୁହନ୍ତୁ। ହଲଚଲ ବନ୍ଦ ନହେବା ପର୍ଯ୍ୟନ୍ତ ଅପେକ୍ଷା କରନ୍ତୁ।'
      },
      'flood': {
        'hi': 'ऊंची जगह पर जाएं। बहते पानी में न जाएं।',
        'ta': 'உயரமான இடத்திற்கு செல்லுங்கள். ஓடும் நீரில் செல்ல வேண்டாம்।',
        'te': 'ఎత్తైన ప్రాంతానికి వెళ్లండి. ప్రవహించే నీటిలో వెళ్లవద్దు।',
        'bn': 'উঁচু জায়গায় যান। প্রবাহমান পানিতে যাবেন না।',
        'mr': 'उंच जागी जा. वाहत्या पाण्यात जाऊ नका.',
        'gu': 'ઊંચી જગ્યાએ જાઓ. વહેતા પાણીમાં ન જાઓ।',
        'or': 'ଉଚ୍ଚ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ। ପ୍ରବାହିତ ପାଣିରେ ଯାଆନ୍ତୁ ନାହିଁ।'
      },
      'fire': {
        'hi': 'तुरंत इलाका छोड़ें। धुआं देखते ही भागें।',
        'ta': 'உடனடியாக பகுதியை விட்டு வெளியேறுங்கள். புகை தெரிந்தால் ஓடுங்கள்।',
        'te': 'వెంటనే ప్రాంతాన్ని వదిలి వెళ్లండి. పొగ కనిపించిన వెంటనే పరుగెత్తండి।',
        'bn': 'অবিলম্বে এলাকা ছেড়ে চলে যান। ধোঁয়া দেখলেই দৌড়ান।',
        'mr': 'तातडीने परिसर सोडा. धूर दिसताच पळा.',
        'gu': 'તાત્કાલિક વિસ્તાર છોડી દો. ધુમાડો દેખાતાં જ ભાગો।',
        'or': 'ତୁରନ୍ତ ଅଞ୍ଚଳ ଛାଡ଼ନ୍ତୁ। ଧୂଆଁ ଦେଖିବା ମାତ୍ରେ ଦୌଡ଼ନ୍ତୁ।'
      },
      'storm': {
        'hi': 'घर के अंदर रहें। खिड़कियों से दूर रहें।',
        'ta': 'வீட்டிற்குள் இருங்கள். ஜன்னல்களிலிருந்து விலகி இருங்கள்।',
        'te': 'ఇంట్లోనే ఉండండి. కిటికీల నుండి దూరంగా ఉండండి।',
        'bn': 'ঘরের ভিতরে থাকুন। জানালা থেকে দূরে থাকুন।',
        'mr': 'घरात राहा. खिडक्यांपासून दूर राहा.',
        'gu': 'ઘરની અંદર રહો. બારીઓથી દૂર રહો।',
        'or': 'ଘର ଭିତରେ ରୁହନ୍ତୁ। ଝରକା ଠାରୁ ଦୂରରେ ରୁହନ୍ତୁ।'
      }
    };

    const typeInstructions = emergencyInstructions[alert.type];
    const instruction = typeInstructions ? typeInstructions[language] || '' : '';

    // For demonstration, we'll use a simplified translation approach
    // In production, you'd use a proper translation API
    return {
      title: this.simpleTranslate(alert.title, targetLanguage),
      description: this.simpleTranslate(alert.description, targetLanguage) + (instruction ? ` ${instruction}` : '')
    };
  }

  // Simplified translation for demonstration
  private simpleTranslate(text: string, targetLanguage: string): string {
    // This would be replaced with actual translation API calls
    const basicTranslations: Record<string, Record<string, string>> = {
      'hi': {
        'Emergency Alert': 'आपातकालीन चेतावनी',
        'Warning': 'चेतावनी',
        'Critical': 'गंभीर',
        'Earthquake': 'भूकंप',
        'Flood': 'बाढ़',
        'Fire': 'आग',
        'Storm': 'तूफान'
      },
      'ta': {
        'Emergency Alert': 'அவசர எச்சரிக்கை',
        'Warning': 'எச்சரிக்கை',
        'Critical': 'முக்கியமான',
        'Earthquake': 'நிலநடுக்கம்',
        'Flood': 'வெள்ளம்',
        'Fire': 'தீ',
        'Storm': 'புயல்'
      },
      'te': {
        'Emergency Alert': 'అత్యవసర హెచ్చరిక',
        'Warning': 'హెచ్చరిక',
        'Critical': 'క్లిష్టమైన',
        'Earthquake': 'భూకంపం',
        'Flood': 'వరద',
        'Fire': 'మంట',
        'Storm': 'తుఫాను'
      }
    };

    let translatedText = text;
    const translations = basicTranslations[targetLanguage] || {};
    
    Object.entries(translations).forEach(([english, translated]) => {
      const regex = new RegExp(english, 'gi');
      translatedText = translatedText.replace(regex, translated);
    });

    return translatedText;
  }

  // Determine severity based on earthquake magnitude
  private determineSeverityFromMagnitude(magnitude: number): 'critical' | 'warning' | 'info' {
    if (magnitude >= 6.0) return 'critical';
    if (magnitude >= 4.5) return 'warning';
    return 'info';
  }

  // Map IMD severity levels
  private mapIMDSeverity(severity: string): 'critical' | 'warning' | 'info' {
    const severityMap: Record<string, 'critical' | 'warning' | 'info'> = {
      'red': 'critical',
      'orange': 'warning',
      'yellow': 'info',
      'severe': 'critical',
      'moderate': 'warning',
      'light': 'info'
    };
    
    return severityMap[severity?.toLowerCase()] || 'info';
  }

  // Map IMD alert types
  private mapIMDType(type: string): string {
    const typeMap: Record<string, string> = {
      'cyclone': 'storm',
      'heavy_rain': 'flood',
      'thunderstorm': 'storm',
      'heatwave': 'other',
      'cold_wave': 'other'
    };
    
    return typeMap[type?.toLowerCase()] || 'other';
  }

  // Map NDMA severity levels
  private mapNDMASeverity(severity: string): 'critical' | 'warning' | 'info' {
    const severityMap: Record<string, 'critical' | 'warning' | 'info'> = {
      'extreme': 'critical',
      'severe': 'critical',
      'moderate': 'warning',
      'minor': 'info',
      'unknown': 'info'
    };
    
    return severityMap[severity?.toLowerCase()] || 'warning';
  }

  // Map NDMA event types
  private mapNDMAType(event: string): string {
    const eventMap: Record<string, string> = {
      'earthquake': 'earthquake',
      'flood': 'flood',
      'fire': 'fire',
      'cyclone': 'storm',
      'tsunami': 'other',
      'landslide': 'other'
    };
    
    return eventMap[event?.toLowerCase()] || 'other';
  }
}

export default NLPAlertProcessor;
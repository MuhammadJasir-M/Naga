import { Alert } from '@/types/alert';

export const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Magnitude 6.2 Earthquake near Los Angeles',
    description: 'A magnitude 6.2 earthquake occurred 15 miles northeast of Los Angeles. Aftershocks are expected. Take cover and stay away from damaged structures.',
    severity: 'critical',
    type: 'earthquake',
    location: 'Los Angeles County, CA',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    source: 'USGS Earthquake Hazards Program',
    magnitude: 6.2,
    languages: {
      'hi': {
        title: 'लॉस एंजिल्स के पास 6.2 तीव्रता का भूकंप',
        description: 'लॉस एंजिल्स के उत्तर-पूर्व में 15 मील की दूरी पर 6.2 तीव्रता का भूकंप आया है। बाद के झटकों की संभावना है। सुरक्षित स्थान पर जाएं और क्षतिग्रस्त संरचनाओं से दूर रहें।'
      },
      'mr': {
        title: 'लॉस अँजेलेसजवळ 6.2 तीव्रतेचा भूकंप',
        description: 'लॉस अँजेलेसच्या उत्तर-पूर्वेस 15 मैल अंतरावर 6.2 तीव्रतेचा भूकंप झाला आहे. पुढील धक्क्यांची शक्यता आहे. आश्रय घ्या आणि खराब झालेल्या इमारतींपासून दूर राहा.'
      },
      'or': {
        title: 'ଲସ ଏଞ୍ଜେଲ୍ସ ନିକଟରେ ୬.୨ ପ୍ରବଳତାର ଭୂମିକମ୍ପ',
        description: 'ଲସ ଏଞ୍ଜେଲ୍ସର ଉତ୍ତର-ପୂର୍ବରେ ୧୫ ମାଇଲ ଦୂରତାରେ ୬.ୂ ପ୍ରବଳତାର ଭୂମିକମ୍ପ ଘଟିଛି। ପରବର୍ତ୍ତୀ କମ୍ପନର ସମ୍ଭାବନା ରହିଛି। ସୁରକ୍ଷିତ ସ୍ଥାନକୁ ଯାଆନ୍ତୁ ଏବଂ କ୍ଷତିଗ୍ରସ୍ତ ସଂରଚନାଠାରୁ ଦୂରରେ ରୁହନ୍ତୁ।'
      }
    },
    isActive: true
  },
  {
    id: '2',
    title: 'Flash Flood Warning - Houston Metro Area',
    description: 'Excessive rainfall has caused flash flooding in the Houston metropolitan area. Avoid driving through flooded roads. Turn around, don\'t drown.',
    severity: 'warning',
    type: 'flood',
    location: 'Houston, TX',
    coordinates: { lat: 29.7604, lng: -95.3698 },
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    source: 'National Weather Service',
    languages: {
      'hi': {
        title: 'तत्काल बाढ़ चेतावनी - ह्यूस्टन मेट्रो क्षेत्र',
        description: 'अत्यधिक बारिश के कारण ह्यूस्टन महानगरीय क्षेत्र में तत्काल बाढ़ आ गई है। बाढ़ग्रस्त सड़कों पर गाड़ी न चलाएं। मुड़ जाएं, डूबें नहीं।'
      },
      'gu': {
        title: 'ત્વરિત પૂરની ચેતવણી - હ્યુસ્ટન મેટ્રો વિસ્તાર',
        description: 'અતિશય વરસાદને કારણે હ્યુસ્ટન મહાનગર વિસ્તારમાં તાત્કાલિક પૂર આવ્યા છે. પૂરગ્રસ્ત રસ્તાઓ પર વાહન ચલાવવાનું ટાળો. પાછા ફરો, ડૂબશો નહીં.'
      }
    },
    isActive: true
  },
  {
    id: '3',
    title: 'Wildfire Evacuation Order - Riverside County',
    description: 'A rapidly spreading wildfire has prompted mandatory evacuations for zones A and B in Riverside County. Evacuate immediately via Highway 74.',
    severity: 'critical',
    type: 'fire',
    location: 'Riverside County, CA',
    coordinates: { lat: 33.7175, lng: -116.2023 },
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    source: 'CAL FIRE',
    languages: {
      'hi': {
        title: 'जंगली आग निकासी आदेश - रिवरसाइड काउंटी',
        description: 'तेजी से फैलती जंगली आग के कारण रिवरसाइड काउंटी में जोन ए और बी के लिए अनिवार्य निकासी का आदेश दिया गया है। हाईवे 74 के माध्यम से तुरंत निकलें।'
      },
      'te': {
        title: 'అడవి మంటల తరలింపు ఆదేశం - రివర్‌సైడ్ కౌంటీ',
        description: 'వేగంగా వ్యాప్తి చెందుతున్న అడవి మంటల కారణంగా రివర్‌సైడ్ కౌంటీలోని A మరియు B జోన్‌లకు తప్పనిసరి తరలింపు ఆదేశాలు జారీ చేయబడ్డాయి. హైవే 74 ద్వారా వెంటనే తరలించండి.'
      }
    },
    isActive: true
  },
  {
    id: '4',
    title: 'Severe Thunderstorm Watch - Miami-Dade County',
    description: 'Severe thunderstorms with damaging winds and large hail are possible. Stay indoors and avoid windows. Monitor local weather updates.',
    severity: 'warning',
    type: 'storm',
    location: 'Miami-Dade County, FL',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    source: 'National Weather Service Miami',
    languages: {
      'ta': {
        title: 'கடுமையான இடிமின்னல் கண்காணிப்பு - மியாமி-டேட் கவுண்டி',
        description: 'சேதகரமான காற்று மற்றும் பெரிய ஆலங்கட்டியுடன் கடுமையான இடிமின்னல் ஏற்படலாம். உள்ளே இருங்கள் மற்றும் ஜன்னல்களைத் தவிர்க்கவும். உள்ளூர் வானிலை புதுப்பிப்புகளைக் கண்காணிக்கவும்.'
      },
      'bn': {
        title: 'প্রবল বজ্রঝড় নজরদারি - মিয়ামি-ডেড কাউন্টি',
        description: 'ক্ষতিকর বাতাস এবং বড় শিলাবৃষ্টি সহ প্রবল বজ্রঝড়ের সম্ভাবনা রয়েছে। ঘরের ভিতরে থাকুন এবং জানালা এড়িয়ে চলুন। স্থানীয় আবহাওয়া আপডেট পর্যবেক্ষণ করুন।'
      }
    },
    isActive: true
  }
];

export const governmentSources = [
  {
    name: 'National Center for Seismology (NCS), India',
    url: 'https://seismo.gov.in/',
    description: 'Real-time earthquake monitoring and seismic alerts for India',
    types: ['earthquake']
  },
  {
    name: 'India Meteorological Department (IMD)',
    url: 'https://mausam.imd.gov.in/',
    description: 'Weather warnings, cyclone alerts, and severe weather monitoring',
    types: ['flood', 'storm', 'other']
  },
  {
    name: 'National Disaster Management Authority (NDMA)',
    url: 'https://ndma.gov.in/',
    description: 'National disaster management, emergency response and public alerts',
    types: ['earthquake', 'flood', 'fire', 'storm', 'other']
  },
  {
    name: 'USGS Earthquake Hazards Program',
    url: 'https://earthquake.usgs.gov/',
    description: 'Global earthquake monitoring and alerts',
    types: ['earthquake']
  },
  {
    name: 'National Weather Service (US)',
    url: 'https://www.weather.gov/',
    description: 'Weather warnings and severe weather alerts for US',
    types: ['flood', 'storm', 'other']
  },
  {
    name: 'Emergency Management (Global)',
    url: 'https://www.undrr.org/',
    description: 'International emergency management and disaster response',
    types: ['earthquake', 'flood', 'fire', 'storm', 'other']
  },
  {
    name: 'Central Water Commission (CWC), India',
    url: 'https://cwc.gov.in/',
    description: 'Flood monitoring and water level alerts for Indian rivers',
    types: ['flood']
  }
];
import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi";

export const translations = {
  en: {
    // Sidebar
    "nav.home": "Home",
    "nav.map": "Live Map",
    "nav.family": "Family Tracker",
    "nav.emergency": "Emergency",
    "nav.lostFound": "Lost & Found",
    "nav.parking": "Smart Parking",
    "nav.security": "Security Connect",
    "nav.navigation": "Navigation",
    "nav.quickActions": "Quick Actions",
    "nav.routeSangam": "Route to Sangam",
    "nav.parkingStatus": "Parking Status",

    // Lost & Found
    "lf.reportMissing": "Report Missing Person",
    "lf.reportFound": "Report Found Person",
    "lf.searchReports": "Search Reports",
    "lf.uploadPhoto": "Upload Photo",
    "lf.contactHelp": "Contact Help Center",

    // Smart Parking
    "parking.available": "Available Parking Lots",
    "parking.occupancy": "Occupancy Status",
    "parking.distance": "Distance from Destination",
    "parking.navigateTo": "Navigate to Parking",
    "parking.overflow": "Overflow Parking Suggestions",

    // Family Tracker
    "family.createGroup": "Create Group",
    "family.joinGroup": "Join Group",
    "family.shareInvite": "Share Invite Code",
    "family.liveLocations": "Live Member Locations",
    "family.lastSeen": "Last Seen Location",
    "family.meetingPoint": "Meeting Point Setup",
    "family.activeMembers": "Active Group Members",
    "family.enterCode": "Enter Invite Code",
    "family.setMeeting": "Set Meeting Point",

    "family.leaveGroup": "Leave Group",
    "family.disbandGroup": "Disband Group",
    "family.updateLocation": "Update Location",
    "family.yourName": "Your Name",
    "family.groupCode": "Group Code",
    "family.enterLocation": "Enter your current location",
    "family.sosActive": "SOS ACTIVE!",

    // Emergency
    "emergency.title": "Emergency Assistance",
    "emergency.sos": "SOS Button",
    "emergency.callServices": "Emergency Numbers",
    "emergency.nearestMedical": "Nearest Medical Camp",
    "emergency.nearestPolice": "Nearest Police Booth",
    "emergency.lostFound": "Lost & Found Center",
    "emergency.shareLocation": "Share Live Location",

    // Header
    "header.systemOnline": "System Online - High Concurrency Mode",
    "header.sosOneTap": "ONE-TAP SOS",
    "header.sosDispatched": "SOS DISPATCHED",
    "header.sosSentTitle": "Emergency Alert Sent",
    "header.sosSentDesc":
      "Your location coordinates have been transmitted to the nearest Medical and Security outposts. Keep your app open.",
    "header.sosResponseEnRoute": "Response team en route (Est. 3 mins)",

    // Map
    "map.liveSectorMap": "Live Sector Map",
    "map.status": "Status:",
    "map.flowingSteadily": "Flowing steadily",
    "map.density": "Density:",
    "map.moderate": "Moderate",
    "map.crowdHeatmap": "Crowd Heatmap",
    "map.on": "ON",
    "map.off": "OFF",
    "map.destination": "Destination",
    "map.selectDestination": "Select your primary destination",
    "map.chooseDestination": "-- Choose a destination --",
    "map.cancelRoute": "Cancel Route",
    "map.findRoute": "Find Shortest Route",
    "map.calculatingRoute": "Calculating Route...",
    "map.distanceConfig": "Distance Config",
    "map.dynamic": "Dynamic",
    "map.pathQuality": "Path Quality",
    "map.safestAvailable": "Safest available",
    "map.regionalAlerts": "Regional Alerts",
    "map.startNav": "Start Navigation",
    "map.offlineMode": "Offline Mode",

    // Home Screen
    "home.crowdStatus": "Crowd Status",
    "home.recommendedRoute": "Recommended Route",
    "home.emergencyAlerts": "Emergency Alerts",
    "home.upcomingEvents": "Upcoming Events & Shahi Snan",
    "home.shahiSnan1": "Makar Sankranti - 14 Jan 2026",
    "home.shahiSnan2": "Mauni Amavasya - 29 Jan 2026",
    "home.shahiSnan3": "Basant Panchami - 03 Feb 2026",
    "home.navSangam": "Navigate to Sangam",
    "home.navMedical": "Nearest Medical Camp",
    "home.navParking": "Find Parking",

    // Mock Alerts
    "alert.crowdSurge": "Crowd Surge near Bridge 4",
    "alert.crowdSurgeDesc":
      "Please use alternate route via Sector 5. Volunteers are guiding the flow.",
    "alert.hydration": "Hydration Station Refilled",
    "alert.hydrationDesc":
      "Station B is fully stocked with water and electrolytes.",
    "alert.parking": "Parking Lot C Full",
    "alert.parkingDesc":
      "Directing vehicles to overflow lot D. Check parking map.",
    "alert.justNow": "Just now",
    "alert.minsAgo": "12 mins ago",
    "alert.hourAgo": "1 hr ago",

    // Security
    "security.activePersonnel": "Active Personnel",
    "security.realTimeUpdates": "Real-time status updates from ground team",
    "security.ping": "Ping",
    "security.commandCenter": "Command Center & Logs",
    "security.roleBasedAccess": "Role-based access view (Admin Level)",
    "security.e2eEncrypted": "End-to-End Encrypted",
    "security.broadcast": "Automated Broadcast",
    "security.broadcastPlaceholder":
      "Type emergency alert to all connected staff...",
    "security.broadcastButton": "Broadcast (Priority)",
    "security.incidentLogs": "Immutable Incident Logs",
    "security.timestamp": "Timestamp (UTC)",
    "security.eventType": "Event Type",
    "security.details": "Details",
    "security.security": "Security",

    // Pins
    "pin.medical": "Sector 4 Medical Camp",
    "pin.hydration": "Free Water Station B",
    "pin.police": "Security Outpost 9",
    "pin.landmark": "Sangam Main Point",
    "pin.clinic": "Emergency Clinic",
    "pin.toilet": "Public Toilets (Sector 5)",
    "pin.parking": "Parking Lot D",
    "pin.hydration2": "Hydration Station A",
    "pin.police2": "Security Kiosk 3",
    "pin.railway": "Prayagraj Junction",
    "pin.bus": "Civil Lines Bus Stand",
    "pin.ghat": "Saraswati Ghat",
    "pin.food": "Annakshetra (Food Zone)",
    "pin.lostFound": "Lost & Found Center",
  },
  hi: {
    // Sidebar
    "nav.home": "होम",
    "nav.map": "लाइव मैप",
    "nav.family": "फैमिली ट्रैकर",
    "nav.emergency": "आपातकाल (Emergency)",
    "nav.lostFound": "खोज एवं प्राप्ति",
    "nav.parking": "स्मार्ट पार्किंग",
    "nav.security": "सुरक्षा संपर्क",
    "nav.navigation": "नेविगेशन",
    "nav.quickActions": "त्वरित कार्रवाई",
    "nav.routeSangam": "संगम का मार्ग",
    "nav.parkingStatus": "पार्किंग स्थिति",

    // Lost & Found
    "lf.reportMissing": "लापता व्यक्ति की रिपोर्ट करें",
    "lf.reportFound": "मिले हुए व्यक्ति की रिपोर्ट करें",
    "lf.searchReports": "रिपोर्ट खोजें",
    "lf.uploadPhoto": "तस्वीर अपलोड करें",
    "lf.contactHelp": "सहायता केंद्र से संपर्क करें",

    // Smart Parking
    "parking.available": "उपलब्ध पार्किंग स्थल",
    "parking.occupancy": "कब्ज़े की स्थिति",
    "parking.distance": "गंतव्य से दूरी",
    "parking.navigateTo": "पार्किंग के लिए नेविगेट करें",
    "parking.overflow": "अतिरिक्त पार्किंग के सुझाव",

    // Family Tracker
    "family.createGroup": "ग्रुप बनाएं",
    "family.joinGroup": "ग्रुप में शामिल हों",
    "family.shareInvite": "इनवाइट कोड साझा करें",
    "family.liveLocations": "सदस्यों की लाइव लोकेशन",
    "family.lastSeen": "अंतिम देखा गया स्थान",
    "family.meetingPoint": "मीटिंग पॉइंट सेट अप",
    "family.activeMembers": "सक्रिय ग्रुप सदस्य",
    "family.enterCode": "इनवाइट कोड दर्ज करें",
    "family.setMeeting": "मीटिंग पॉइंट सेट करें",

    "family.leaveGroup": "ग्रुप छोड़ें",
    "family.disbandGroup": "ग्रुप भंगे",
    "family.updateLocation": "लोकेशन अपडेट करें",
    "family.yourName": "आपका नाम",
    "family.groupCode": "ग्रुप कोड",
    "family.enterLocation": "अपना वर्तमान स्थान दर्ज करें",
    "family.sosActive": "SOS सक्रिय!",

    // Emergency
    "emergency.title": "आपातकालीन सहायता",
    "emergency.sos": "SOS बटन",
    "emergency.callServices": "आपातकालीन नंबर",
    "emergency.nearestMedical": "निकटतम मेडिकल कैंप",
    "emergency.nearestPolice": "निकटतम पुलिस बूथ",
    "emergency.lostFound": "खोया-पाया केंद्र",
    "emergency.shareLocation": "लाइव लोकेशन साझा करें",

    // Header
    "header.systemOnline": "सिस्टम ऑनलाइन - उच्च संवादिता",
    "header.sosOneTap": "आपातकालीन मदद (SOS)",
    "header.sosDispatched": "SOS भेजा गया",
    "header.sosSentTitle": "आपातकालीन अलर्ट भेजा गया",
    "header.sosSentDesc":
      "आपके स्थान के निर्देशांक निकटतम चिकित्सा और सुरक्षा चौकियों को भेज दिए गए हैं। अपना ऐप खुला रखें।",
    "header.sosResponseEnRoute": "प्रतिक्रिया दल रास्ते में है (लगभग 3 मिनट)",

    // Map
    "map.liveSectorMap": "लाइव सेक्टर मैप",
    "map.status": "स्थिति:",
    "map.flowingSteadily": "सामान्य प्रवाह",
    "map.density": "घनत्व:",
    "map.moderate": "मध्यम",
    "map.crowdHeatmap": "भीड़ हीटमैप",
    "map.on": "चालू",
    "map.off": "बंद",
    "map.destination": "गंतव्य",
    "map.selectDestination": "अपना मुख्य गंतव्य चुनें",
    "map.chooseDestination": "-- एक गंतव्य चुनें --",
    "map.cancelRoute": "मार्ग रद्द करें",
    "map.findRoute": "सबसे छोटा मार्ग खोजें",
    "map.calculatingRoute": "मार्ग की गणना कर रहा है...",
    "map.distanceConfig": "दूरी कॉन्फ़िगरेशन",
    "map.dynamic": "परिवर्तनशील",
    "map.pathQuality": "मार्ग की गुणवत्ता",
    "map.safestAvailable": "सबसे सुरक्षित उपलब्ध",
    "map.regionalAlerts": "क्षेत्रीय अलर्ट",
    "map.startNav": "नेविगेशन प्रारंभ करें",
    "map.offlineMode": "ऑफ़लाइन मोड",

    // Home Screen
    "home.crowdStatus": "भीड़ की स्थिति",
    "home.recommendedRoute": "सुझाया गया मार्ग",
    "home.emergencyAlerts": "आपातकालीन अलर्ट",
    "home.upcomingEvents": "आगामी कार्यक्रम और शाही स्नान",
    "home.shahiSnan1": "मकर संक्रांति - 14 जन. 2026",
    "home.shahiSnan2": "मौनी अमावस्या - 29 जन. 2026",
    "home.shahiSnan3": "बसंत पंचमी - 03 फर. 2026",
    "home.navSangam": "संगम पर जाएं",
    "home.navMedical": "निकटतम मेडिकल कैंप",
    "home.navParking": "पार्किंग खोजें",

    // Mock Alerts
    "alert.crowdSurge": "ब्रिज 4 के पास भीड़",
    "alert.crowdSurgeDesc":
      "कृपया सेक्टर 5 के वैकल्पिक मार्ग का उपयोग करें। स्वयंसेवक मार्गदर्शन कर रहे हैं।",
    "alert.hydration": "जल स्टेशन भरा गया",
    "alert.hydrationDesc":
      "स्टेशन बी में पानी और इलेक्ट्रोलाइट्स पूरी तरह से उपलब्ध हैं।",
    "alert.parking": "पार्किंग लॉट सी भरा हुआ",
    "alert.parkingDesc":
      "वाहनों को पार्किंग लॉट डी की ओर भेजा जा रहा है। पार्किंग मैप देखें।",
    "alert.justNow": "अभी-अभी",
    "alert.minsAgo": "12 मिनट पहले",
    "alert.hourAgo": "1 घंटे पहले",

    // Security
    "security.activePersonnel": "सक्रिय कर्मचारी",
    "security.realTimeUpdates": "ग्राउंड टीम से रीयल-टाइम स्थिति अपडेट",
    "security.ping": "पिंग",
    "security.commandCenter": "कमान केंद्र और लॉग",
    "security.roleBasedAccess": "भूमिका-आधारित पहुंच (व्यवस्थापक स्तर)",
    "security.e2eEncrypted": "एंड-टू-एंड एन्क्रिप्टेड",
    "security.broadcast": "स्वचालित प्रसारण",
    "security.broadcastPlaceholder":
      "सभी जुड़े हुए कर्मचारियों को आपातकालीन अलर्ट टाइप करें...",
    "security.broadcastButton": "प्रसारित करें",
    "security.incidentLogs": "अपरिवर्तनीय घटना लॉग",
    "security.timestamp": "समय (UTC)",
    "security.eventType": "घटना प्रकार",
    "security.details": "विवरण",
    "security.security": "सुरक्षा",

    // Pins
    "pin.medical": "सेक्टर 4 मेडिकल कैंप",
    "pin.hydration": "मुफ्त जल स्टेशन बी",
    "pin.police": "सुरक्षा चौकी 9",
    "pin.landmark": "संगम मुख्य बिंदु",
    "pin.clinic": "आपातकालीन क्लिनिक",
    "pin.toilet": "सार्वजनिक शौचालय (सेक्टर 5)",
    "pin.parking": "पार्किंग लॉट डी",
    "pin.hydration2": "जल स्टेशन ए",
    "pin.police2": "सुरक्षा कियोस्क 3",
    "pin.railway": "प्रयागराज जंक्शन",
    "pin.bus": "सिविल लाइंस बस स्टैंड",
    "pin.ghat": "सरस्वती घाट",
    "pin.food": "अन्नक्षेत्र (भोजन क्षेत्र)",
    "pin.lostFound": "खोया-पाया केंद्र",
  },
};

interface LanguageContextType {
  language: Language | null;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language | null>(null);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    if (!language)
      return (
        translations["en"][key as keyof (typeof translations)["en"]] || key
      );
    return (
      translations[language]?.[key as keyof (typeof translations)["en"]] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

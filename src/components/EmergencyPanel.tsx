import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n";
import {
  AlertOctagon,
  Phone,
  MapPin,
  Shield,
  Search,
  Navigation,
  HeartPulse,
  CheckCircle2,
} from "lucide-react";
import { useFamilyGroup } from "../hooks/useFamilyGroup";
import { useSOS } from "../contexts/SOSContext";

interface EmergencyPanelProps {
  onNavigateMap: (id?: string) => void;
}

import { alertsCollection } from "../services/db";
import { addDoc, serverTimestamp } from "firebase/firestore";

export default function EmergencyPanel({ onNavigateMap }: EmergencyPanelProps) {
  const { t } = useLanguage();
  const { group, setSOS: updateFamilySOS } = useFamilyGroup();
  const { sosActive, triggerSOS } = useSOS();
  const [locationShared, setLocationShared] = useState(false);

  const handleSos = async () => {
    if (sosActive) return;

    // Trigger global alert
    await triggerSOS(group?.code);

    // If part of family group, also mark user as SOS locally to family members
    if (group) {
      updateFamilySOS(true);
      setTimeout(() => updateFamilySOS(false), 15000); // clear family level alert
    }
  };

  const handleShareLocation = () => {
    setLocationShared(true);
    setTimeout(() => setLocationShared(false), 3000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
      <div
        className={`px-6 py-3 shrink-0 text-white relative overflow-hidden transition-colors duration-500 ${sosActive ? "bg-red-700" : "bg-destructive-600"}`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] bg-repeat"></div>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-1">
          <h1 className="text-lg font-display font-bold flex items-center gap-2">
            <AlertOctagon
              className={`w-5 h-5 ${sosActive ? "animate-pulse" : ""}`}
            />
            {t("emergency.title")}
          </h1>
          <p className="text-red-100 text-xs md:text-sm">
            Quick access to critical services and assistance.
          </p>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 max-w-4xl mx-auto w-full z-20 pb-20 md:pb-6">
        {/* Main SOS & Call Actions */}
        <div className="flex flex-col md:flex-row gap-2.5 sm:gap-4">
          <motion.button
            onClick={handleSos}
            disabled={sosActive}
            whileHover={{ scale: sosActive ? 1 : 1.02 }}
            whileTap={{ scale: sosActive ? 1 : 0.98 }}
            className={`flex-1 rounded-2xl shadow-sm border p-4 sm:p-5 flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all duration-300 ${sosActive ? "bg-red-50 border-red-500 cursor-default" : "bg-white border-destructive-200 hover:border-destructive-400"} group`}
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-colors shadow-inner ${sosActive ? "bg-red-600 text-white animate-pulse" : "bg-destructive-100 text-destructive-600 group-hover:bg-destructive-600 group-hover:text-white"}`}
            >
              {sosActive ? (
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <AlertOctagon className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>
            <div className="text-center">
              <h2
                className={`text-base sm:text-lg font-bold ${sosActive ? "text-red-700" : "text-destructive-700"}`}
              >
                {sosActive ? "SOS Alert Sent" : t("emergency.sos")}
              </h2>
              <p
                className={`text-[9.5px] sm:text-[10px] mt-0.5 ${sosActive ? "text-red-600 font-medium" : "text-slate-500"}`}
              >
                {sosActive ? "Help is on the way." : "Alert security & medical"}
              </p>
            </div>
          </motion.button>

          <div className="flex-1 bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-4 sm:p-5 flex flex-col justify-center">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-2 sm:mb-3">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              {t("emergency.callServices")}
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:112"
                className="flex flex-col p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                  Police
                </span>
                <span className="font-mono font-bold text-lg text-white">
                  112
                </span>
              </a>
              <a
                href="tel:108"
                className="flex flex-col p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                  Ambulance
                </span>
                <span className="font-mono font-bold text-lg text-amber-400">
                  108
                </span>
              </a>
              <a
                href="tel:101"
                className="flex flex-col p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                  Fire
                </span>
                <span className="font-mono font-bold text-lg text-white">
                  101
                </span>
              </a>
              <a
                href="tel:1090"
                className="flex flex-col p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              >
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-0.5">
                  Women
                </span>
                <span className="font-mono font-bold text-lg text-white">
                  1090
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Nearby Lifelines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 sm:mt-2">
          {/* Medical */}
          <div
            onClick={() => onNavigateMap("6")}
            className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 hover:border-blue-300 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-sm">
                {t("emergency.nearestMedical")}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500">
                Sector 4 Medical Camp (0.8 km)
              </p>
            </div>
            <Navigation className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
          </div>

          {/* Police */}
          <div
            onClick={() => onNavigateMap("8")}
            className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 hover:border-slate-400 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-sm">
                {t("emergency.nearestPolice")}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500">
                Outpost 9, Sector 3 (1.2 km)
              </p>
            </div>
            <Navigation className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
          </div>

          {/* Lost & Found */}
          <div
            onClick={() => onNavigateMap("10")}
            className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 hover:border-purple-300 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-sm">
                {t("emergency.lostFound")}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500">
                Central Hub, Sector 1 (2.5 km)
              </p>
            </div>
            <Navigation className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
          </div>

          {/* Share Location */}
          <div
            onClick={handleShareLocation}
            className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-3 hover:border-green-300 transition-colors cursor-pointer group"
          >
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              {locationShared ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-sm">
                {locationShared
                  ? "Location Sent!"
                  : t("emergency.shareLocation")}
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500">
                {locationShared
                  ? "Shared with emergency contacts"
                  : "Send SMS with coordinates"}
              </p>
            </div>
            {!locationShared && (
              <div className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full hidden sm:block">
                ACTION
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

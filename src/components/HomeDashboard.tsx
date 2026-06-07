import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n";
import { useRealtimeData } from "../contexts/DataContext";
import {
  Users,
  Route,
  AlertTriangle,
  Calendar,
  Navigation,
  MapPin,
  Radio,
} from "lucide-react";

interface HomeDashboardProps {
  onNavigateMap: (targetId?: string) => void;
}

export default function HomeDashboard({ onNavigateMap }: HomeDashboardProps) {
  const { t } = useLanguage();
  const { crowdLevel, latestBroadcast } = useRealtimeData();

  return (
    <div className="h-full flex flex-col gap-4 md:gap-6 overflow-y-auto pr-2 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Status Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-200/60 p-4 min-[400px]:p-5 lg:p-6 flex flex-col gap-3 md:gap-4 lg:col-span-2 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-primary-100/50 rounded-full blur-3xl -mr-10 -mt-10 sm:-mr-20 sm:-mt-20 pointer-events-none"></div>

          <div className="flex items-center gap-2 text-slate-800 font-bold text-base sm:text-lg border-b border-slate-100/80 pb-2.5 sm:pb-3 relative z-10">
            <div className="bg-primary-100 p-1.5 sm:p-2 rounded-xl text-primary-600">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Current Location: Sector 4
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-1 relative z-10">
            <div className="flex flex-col gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight line-clamp-1">
                Crowd Around You
              </span>
              <span
                className={`font-bold flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm ${crowdLevel === "High" || crowdLevel === "Critical" ? "text-red-600" : crowdLevel === "Moderate" ? "text-amber-600" : "text-green-600"}`}
              >
                <div
                  className={`p-1 rounded-md ${crowdLevel === "High" || crowdLevel === "Critical" ? "bg-red-100" : crowdLevel === "Moderate" ? "bg-amber-100" : "bg-green-100"}`}
                >
                  <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                {crowdLevel}
              </span>
            </div>
            <div className="flex flex-col gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight line-clamp-1">
                Nearest Medical
              </span>
              <span className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                0.8 km
              </span>
            </div>
            <div
              className="flex flex-col justify-center gap-1 sm:gap-1.5 col-span-2 md:col-span-2 bg-gradient-to-br from-green-50 to-primary-50/50 p-2 sm:p-3.5 rounded-xl border border-primary-100/60 shadow-sm relative overflow-hidden group cursor-pointer"
              onClick={() => onNavigateMap("1")}
            >
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-primary-100/50 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Navigation className="w-4 h-4 text-primary-600 -ml-1" />
              </div>
              <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">
                Recommended Action
              </span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <div className="p-1 bg-white rounded-md shadow-sm text-green-600">
                  <Route className="w-3.5 h-3.5" />
                </div>
                Use Route B to Sangam
              </span>
            </div>
          </div>
        </motion.div>

        {/* Emergency Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-destructive-50 to-white/50 rounded-2xl shadow-sm border border-destructive-200/60 p-4 sm:p-5 lg:p-6 flex flex-col gap-3 md:gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

          <div className="flex items-center gap-2 text-destructive-700 font-bold text-base sm:text-lg relative z-10">
            <div className="bg-destructive-100 p-1.5 sm:p-2 rounded-xl text-destructive-600">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {t("home.emergencyAlerts")}
          </div>

          <div className="flex flex-col gap-2.5 mt-1 relative z-10 hidden sm:flex">
            {latestBroadcast && latestBroadcast.isActive ? (
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-destructive-100 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive-500"></div>
                <div className="text-[9px] sm:text-[10px] text-destructive-600 font-bold mb-1 uppercase tracking-widest flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive-500"></span>
                  </span>
                  Latest Update from {latestBroadcast.sender}
                </div>
                <div className="font-bold text-slate-800 text-xs sm:text-sm">
                  Official Broadcast
                </div>
                <div className="text-slate-500 text-[10px] sm:text-xs mt-1 leading-relaxed font-medium line-clamp-2">
                  {latestBroadcast.message}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-3 sm:p-4 border border-green-100 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                <div className="text-[9px] sm:text-[10px] text-green-600 font-bold mb-1 uppercase tracking-widest flex items-center gap-1">
                  Status
                </div>
                <div className="font-bold text-slate-800 text-xs sm:text-sm">
                  All Clear
                </div>
                <div className="text-slate-500 text-[10px] sm:text-xs mt-1 leading-relaxed font-medium">
                  No active emergency broadcasts at this time.
                </div>
              </div>
            )}
          </div>
          
          <div className="sm:hidden mt-1 relative z-10">
              <div className={`rounded-xl p-3 border shadow-sm relative overflow-hidden ${latestBroadcast?.isActive ? "bg-white border-destructive-100" : "bg-white border-green-100"}`}>
                 <div className={`absolute left-0 top-0 bottom-0 w-1 ${latestBroadcast?.isActive ? "bg-destructive-500" : "bg-green-500"}`}></div>
                 <div className="font-bold text-slate-800 text-sm whitespace-nowrap overflow-hidden text-ellipsis w-full">
                    {latestBroadcast?.isActive ? "Official Broadcast" : "All Clear"}
                 </div>
                 <div className="text-slate-500 text-xs mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis w-full">
                   {latestBroadcast?.isActive ? latestBroadcast.message : "No active emergency broadcasts at this time."}
                 </div>
              </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Quick Navigation Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col relative overflow-hidden"
        >
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary-50 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-5 flex items-center gap-2 relative z-10">
            <div className="bg-primary-100 p-1 sm:p-1.5 rounded-lg text-primary-600">
              <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            Quick Navigation
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-3 relative z-10">
            <button
              onClick={() => onNavigateMap("1")}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-3 sm:p-3.5 border border-slate-100 bg-slate-50 rounded-xl hover:bg-primary-50 hover:border-primary-100 hover:scale-[1.02] transition-all shadow-sm group"
            >
              <div className="bg-primary-100 text-primary-600 p-1.5 sm:p-2 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <div className="font-bold text-slate-800 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {t("home.navSangam")}
                </div>
              </div>
            </button>
            <button
              onClick={() => onNavigateMap("6")}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-3 sm:p-3.5 border border-slate-100 bg-slate-50 rounded-xl hover:bg-rose-50 hover:border-rose-100 hover:scale-[1.02] transition-all shadow-sm group"
            >
              <div className="bg-rose-100 text-rose-600 p-1.5 sm:p-2 rounded-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-sm">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <div className="font-bold text-slate-800 text-xs sm:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {t("home.navMedical")}
                </div>
              </div>
            </button>
            <button
              onClick={() => onNavigateMap("5")}
              className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-3 sm:p-3.5 border border-slate-100 bg-slate-50 rounded-xl hover:bg-amber-50 hover:border-amber-100 hover:scale-[1.02] transition-all shadow-sm group col-span-2"
            >
              <div className="bg-amber-100 text-amber-600 p-1.5 sm:p-2 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="w-full">
                <div className="font-bold text-slate-800 text-xs sm:text-sm">
                  {t("home.navParking")}
                </div>
                <div className="hidden sm:block text-[10px] text-slate-500 font-medium">
                   Find empty slots
                </div>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Upcoming Events / Shahi Snan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 sm:p-5 lg:p-6 flex flex-col relative overflow-hidden"
        >
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3 sm:mb-5 flex items-center gap-2 relative z-10">
            <div className="bg-indigo-100 p-1 sm:p-1.5 rounded-lg text-indigo-600">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            {t("home.upcomingEvents")}
          </h2>
          <div className="space-y-3 sm:space-y-4 relative z-10">
            <div className="flex gap-3 sm:gap-4 items-start pb-3 sm:pb-4 border-b border-slate-100 group">
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[50px] sm:min-w-[70px] shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">
                  Jan
                </div>
                <div className="text-lg sm:text-xl leading-none mt-1">14</div>
              </div>
              <div className="flex-1 mt-0.5 sm:mt-1">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  {t("home.shahiSnan1").split(" - ")[0]}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-medium leading-snug line-clamp-2">
                  Major crowd expected. Special routes apply.
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 items-start pb-3 sm:pb-4 border-b border-slate-100 group">
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[50px] sm:min-w-[70px] shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">
                  Jan
                </div>
                <div className="text-lg sm:text-xl leading-none mt-1">29</div>
              </div>
              <div className="flex-1 mt-0.5 sm:mt-1">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  {t("home.shahiSnan2").split(" - ")[0]}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-medium leading-snug line-clamp-2">
                  Main bathing day. Max security deploy.
                </p>
              </div>
            </div>
            <div className="flex gap-3 sm:gap-4 items-start group">
              <div className="bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-center min-w-[50px] sm:min-w-[70px] shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">
                  Feb
                </div>
                <div className="text-lg sm:text-xl leading-none mt-1">03</div>
              </div>
              <div className="flex-1 mt-0.5 sm:mt-1">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                  {t("home.shahiSnan3").split(" - ")[0]}
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 font-medium leading-snug line-clamp-2">
                  Final major gathering phase.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

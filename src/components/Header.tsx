import React, { useState } from "react";
import { Languages, AlertTriangle, LifeBuoy, Menu } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n";
import { useSOS } from "../contexts/SOSContext";
import { useFamilyGroup } from "../hooks/useFamilyGroup";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { sosActive, triggerSOS, clearSOS } = useSOS();
  const { group } = useFamilyGroup();
  const { language, setLanguage, t } = useLanguage();

  const handleSOSClick = () => {
    if (sosActive) {
      clearSOS();
    } else {
      triggerSOS(group?.code);
    }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-6 shrink-0 relative z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100/80 rounded-lg transition-colors md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-600 hidden sm:inline-block tracking-wide">
            {t("header.systemOnline")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 cursor-pointer">
        <button
          onClick={() => setLanguage(language === "en" ? "hi" : "en")}
          className="relative px-3 py-1.5 bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-full transition-colors flex items-center gap-2 shadow-sm"
        >
          <Languages className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {language}
          </span>
        </button>

        <button
          onClick={handleSOSClick}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm
            ${
              sosActive
                ? "bg-gradient-to-r from-red-600 to-destructive-600 text-white shadow-destructive-500/40 shadow-lg scale-105 border border-transparent"
                : "bg-white text-destructive-600 hover:bg-destructive-50 hover:shadow-md border border-destructive-200"
            }
          `}
        >
          <LifeBuoy className={`w-4 h-4 ${sosActive ? "animate-pulse" : ""}`} />
          {sosActive ? t("header.sosDispatched") : t("header.sosOneTap")}
        </button>
      </div>

      {/* SOS Modal Overlay */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 right-6 w-80 bg-white rounded-xl shadow-2xl border border-destructive-100 p-5 z-50 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-destructive-500 to-orange-500"></div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-destructive-50 text-destructive-600 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">
                  {t("header.sosSentTitle")}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {t("header.sosSentDesc")}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-primary-600">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  {t("header.sosResponseEnRoute")}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n";
import { Languages } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  if (language !== null) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex justify-center mb-6 text-primary-600">
          <Languages className="w-16 h-16" />
        </div>
        <h2 className="text-2xl font-display font-bold text-center text-slate-800 mb-2">
          Select Language
        </h2>
        <h3 className="text-xl font-display font-medium text-center text-slate-600 mb-8">
          भाषा चुनें
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setLanguage("hi")}
            className="w-full flex items-center justify-center p-4 rounded-xl border-2 border-slate-200 hover:border-primary-500 hover:bg-primary-50 text-slate-800 font-semibold text-lg transition-all"
          >
            हिंदी
          </button>
          <button
            onClick={() => setLanguage("en")}
            className="w-full flex items-center justify-center p-4 rounded-xl border-2 border-slate-200 hover:border-primary-500 hover:bg-primary-50 text-slate-800 font-semibold text-lg transition-all"
          >
            English
          </button>
        </div>
      </motion.div>
    </div>
  );
}

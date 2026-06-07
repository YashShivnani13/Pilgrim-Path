import React from "react";
import {
  Map as MapIcon,
  Users,
  AlertTriangle,
  Navigation,
  Car,
  Home as HomeIcon,
  Search,
  X,
  LogOut,
  Info,
} from "lucide-react";
import { ViewState } from "../types";
import { useLanguage } from "../i18n";
import { motion, AnimatePresence } from "motion/react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  onNavigateMap?: (id?: string) => void;
  isMobileOverlay?: boolean;
  onLogout?: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  currentView,
  onViewChange,
  onNavigateMap,
  isMobileOverlay = false,
  onLogout,
}: SidebarProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: "home", icon: HomeIcon, label: t("nav.home") },
    { id: "map", icon: MapIcon, label: t("nav.map") },
    { id: "family", icon: Users, label: t("nav.family") },
    { id: "emergency", icon: AlertTriangle, label: t("nav.emergency") },
    { id: "lost-found", icon: Search, label: t("nav.lostFound") },
    { id: "parking", icon: Car, label: t("nav.parking") },
    { id: "about", icon: Info, label: "About" },
  ];

  const sidebarContent = (
    <>
      <div className="p-6 flex items-center justify-between mt-1">
        <h1 className="font-display text-xl font-bold tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm border border-slate-100">
            <img src="/pp.png" alt="PilgrimPath Logo" className="w-full h-full object-contain" />
          </div>
          <span className="bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent">
            PilgrimPath
          </span>
        </h1>
        {isMobileOverlay && (
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-3 mt-4">
          {t("nav.navigation")}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold relative overflow-hidden group
                ${
                  isActive
                    ? "text-primary-700 bg-primary-50 shadow-sm border border-primary-100/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-md"
                />
              )}
              <Icon
                className={`w-5 h-5 ${isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="group flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-2xl cursor-default hover:border-slate-300 hover:shadow-sm transition-all relative">
          <div className="w-10 h-10 shrink-0 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh" alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 truncate">
              Demo User
            </h3>
            {/* removed location */}
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </>
  );

  if (!isMobileOverlay) {
    return (
      <aside className="w-72 bg-white text-slate-800 flex flex-col h-full border-r border-slate-200 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] relative">
        {sidebarContent}
      </aside>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[990]"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-white flex flex-col h-full border-r border-slate-200 z-[1000] shadow-2xl"
          >
            {sidebarContent}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

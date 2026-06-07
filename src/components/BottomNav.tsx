import React from "react";
import {
  Home as HomeIcon,
  Map as MapIcon,
  Users,
  AlertTriangle,
  Search,
  Car,
} from "lucide-react";
import { ViewState } from "../types";
import { useLanguage } from "../i18n";

interface BottomNavProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export default function BottomNav({
  currentView,
  onViewChange,
}: BottomNavProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: "home", icon: HomeIcon, label: t("nav.home") },
    { id: "map", icon: MapIcon, label: t("nav.map") },
    { id: "family", icon: Users, label: t("nav.family") },
    { id: "lost-found", icon: Search, label: t("nav.lostFound") },
    { id: "parking", icon: Car, label: t("nav.parking") },
    {
      id: "emergency",
      icon: AlertTriangle,
      label: t("nav.emergency"),
      alert: true,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`flex flex-col items-center justify-center w-full py-1 gap-1 transition-colors relative
                ${
                  isActive
                    ? item.alert
                      ? "text-destructive-600"
                      : "text-primary-600"
                    : "text-slate-500 hover:text-slate-900"
                }
              `}
            >
              <div
                className={`p-1 rounded-full ${isActive ? (item.alert ? "bg-destructive-50" : "bg-primary-50") : ""}`}
              >
                <Icon
                  className={`w-6 h-6 ${item.alert && !isActive ? "text-destructive-500" : ""}`}
                />
              </div>
              <span className="hidden leading-none truncate max-w-[64px] text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import MapDashboard from "./components/MapDashboard";
import HomeDashboard from "./components/HomeDashboard";
import FamilyTrackPanel from "./components/FamilyTrackPanel";
import EmergencyPanel from "./components/EmergencyPanel";
import LostFoundPanel from "./components/LostFoundPanel";
import SmartParkingPanel from "./components/SmartParkingPanel";
import AboutPanel from "./components/AboutPanel";
import LanguageSelector from "./components/LanguageSelector";
import LoginScreen from "./components/LoginScreen";
import AdminDashboard from "./components/AdminDashboard";
import { LanguageProvider } from "./i18n";
import { ViewState } from "./types";
import { SOSProvider } from "./contexts/SOSContext";
import { DataProvider } from "./contexts/DataContext";

function AppContent({ onLogout }: { onLogout: () => void }) {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [navigationTarget, setNavigationTarget] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigateMap = (targetId?: string) => {
    if (targetId) {
      setNavigationTarget(targetId);
    }
    setCurrentView("map");
  };

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return <HomeDashboard onNavigateMap={handleNavigateMap} />;
      case "map":
        return (
          <MapDashboard
            initialTarget={navigationTarget}
            onClearTarget={() => setNavigationTarget(null)}
          />
        );
      case "family":
        return <FamilyTrackPanel onNavigateMap={handleNavigateMap} />;
      case "emergency":
        return <EmergencyPanel onNavigateMap={handleNavigateMap} />;
      case "lost-found":
        return <LostFoundPanel />;
      case "parking":
        return <SmartParkingPanel onNavigateMap={handleNavigateMap} />;
      case "about":
        return <AboutPanel />;
      default:
        return <MapDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <LanguageSelector />

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:block">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          currentView={currentView}
          onViewChange={setCurrentView}
          onNavigateMap={handleNavigateMap}
          isMobileOverlay={false}
          onLogout={onLogout}
        />
      </div>

      {/* Mobile Sidebar overlay when opened via header menu */}
      <div className="md:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setIsSidebarOpen(false);
          }}
          onNavigateMap={handleNavigateMap}
          isMobileOverlay={true}
          onLogout={onLogout}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Header onToggleSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 lg:p-6 overflow-hidden relative">
          {renderContent()}
        </main>

        <footer className="hidden md:block bg-white border-t border-slate-200 py-3 px-6 text-center shrink-0">
          <p className="text-xs font-bold text-slate-600 tracking-wide">
            PilgrimPath &bull; Smart Mobility & Safety Platform for Mahakumbh Pilgrims
          </p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">
            Built by Yash Shivnani
          </p>
        </footer>
      </div>

      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<"user" | "admin" | null>(null);

  if (!role) {
    return <LoginScreen onLogin={setRole} />;
  }

  return (
    <DataProvider>
      <SOSProvider>
        <LanguageProvider>
          {role === "admin" ? (
            <AdminDashboard onLogout={() => setRole(null)} />
          ) : (
            <AppContent onLogout={() => setRole(null)} />
          )}
        </LanguageProvider>
      </SOSProvider>
    </DataProvider>
  );
}

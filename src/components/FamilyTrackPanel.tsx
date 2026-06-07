import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n";
import {
  Users,
  UserPlus,
  Share2,
  MapPin,
  Clock,
  Target,
  Plus,
  CheckCircle2,
  ShieldAlert,
  LogOut,
  Trash2,
} from "lucide-react";
import { useFamilyGroup } from "../hooks/useFamilyGroup";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface FamilyTrackPanelProps {
  onNavigateMap: (id?: string) => void;
}

// Helper to assign mock coordinates based on id/location string
const getMockCoords = (id: string, isSOS: boolean): [number, number] => {
  const baseLat = 25.432;
  const baseLng = 81.876;
  const offset = id === "me" ? 0.001 : (id.charCodeAt(0) % 10) * 0.0005;
  return [baseLat + offset, baseLng - offset];
};

function MapEffect({ coords }: { coords: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

export default function FamilyTrackPanel({
  onNavigateMap,
}: FamilyTrackPanelProps) {
  const { t } = useLanguage();
  const {
    group,
    createGroup,
    joinGroup,
    leaveGroup,
    disbandGroup,
    updateLocation,
  } = useFamilyGroup();

  const [nameInput, setNameInput] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const handleCreateGroup = () => {
    if (!nameInput) {
      alert("Please enter your name");
      return;
    }
    createGroup(nameInput);
    setNameInput("");
  };

  const handleJoinGroup = () => {
    if (!nameInput || !codeInput) {
      alert("Please enter your name and group code");
      return;
    }
    joinGroup(codeInput, nameInput);
    setNameInput("");
    setCodeInput("");
  };

  const handleShareInvite = () => {
    const codeToShare = group?.code || "KUMB24";
    if (navigator.share) {
      navigator
        .share({
          title: "Join my Family Group",
          text: `Use code ${codeToShare} to track our locations in Mahakumbh.`,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(codeToShare);
      alert(`Invite code ${codeToShare} copied to clipboard!`);
    }
  };

  const handleUpdateLocation = () => {
    const loc = prompt(t("family.enterLocation"));
    if (loc) {
      updateLocation(loc);
    }
  };

  const me = group?.members.find((m) => m.id === "me");
  const isAdmin = me?.role === "admin";

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto w-full">
      <div className="bg-white px-4 py-4 md:px-6 md:py-6 border-b border-slate-200 shrink-0">
        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800 flex items-center gap-2 md:gap-3">
          <Users className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
          {t("nav.family")}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2">
          Keep track of your family and friends in real-time.
        </p>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto w-full">
        {!group ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-slate-800 mb-1 md:mb-2">
                {t("family.createGroup")}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mb-4">
                Start a new group and share the code with family.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={t("family.yourName")}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2.5 md:p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
                <button
                  onClick={handleCreateGroup}
                  className="w-full py-2.5 md:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  {t("family.createGroup")}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <h2 className="text-base md:text-lg font-bold text-slate-800 mb-1 md:mb-2">
                {t("family.joinGroup")}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mb-4">
                Join an existing group using a 6-character code.
              </p>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={t("family.yourName")}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2.5 md:p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder={t("family.groupCode")}
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  className="w-full p-2.5 md:p-3 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:ring-2 focus:ring-green-500 focus:outline-none"
                  maxLength={6}
                />
                <button
                  onClick={handleJoinGroup}
                  className="w-full py-2.5 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  {t("family.joinGroup")}
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Group Header & Meeting Point */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="bg-indigo-600 text-white rounded-2xl p-4 md:p-6 shadow-md flex flex-col justify-between gap-3 md:gap-4">
                <div>
                  <p className="text-indigo-200 text-xs md:text-sm font-medium">
                    Active Group Code
                  </p>
                  <div className="text-2xl md:text-3xl font-mono font-bold tracking-widest mt-0.5 md:mt-1">
                    {group.code}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareInvite}
                    className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-400 px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-bold transition-colors w-full"
                  >
                    <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    {t("family.shareInvite")}
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-2xl p-4 md:p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    <p className="text-emerald-700 text-[10px] md:text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 md:gap-2">
                      <Target className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      Designated Meeting Point
                    </p>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-emerald-950">Sangam Nose, near Gate A</h3>
                  <p className="text-xs md:text-sm font-medium text-emerald-700 mt-0.5 md:mt-1">Established at 10:30 AM</p>
                </div>
                {isAdmin ? (
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-bold transition-colors w-full mt-3 md:mt-4 text-xs md:text-sm shadow-sm">
                    Update Meeting Point
                  </button>
                ) : (
                  <button className="bg-white/60 hover:bg-white text-emerald-800 border border-emerald-300 px-3 py-2 md:px-4 md:py-2.5 rounded-xl font-bold transition-all w-full mt-3 md:mt-4 text-xs md:text-sm">
                    Navigate to Point
                  </button>
                )}
              </div>
            </div>

            {/* Live Map Snapshot */}
            <div className="bg-white border border-slate-200 rounded-2xl p-1.5 md:p-2 h-48 md:h-64 shadow-sm overflow-hidden relative z-0">
              <MapContainer
                center={[25.432, 81.876]}
                zoom={14}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0.75rem",
                }}
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://openstreetmap.org/copyright">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {group.members.map((member) => {
                  const coords = getMockCoords(member.id, member.isSOS);
                  const isSOS = member.isSOS;
                  return (
                    <Marker
                      key={member.id}
                      position={coords}
                      icon={
                        new L.DivIcon({
                          html: `
                          <div class="relative w-8 h-8 ${isSOS ? "bg-red-600" : "bg-primary-600"} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold">
                            ${member.name.substring(0, 1).toUpperCase()}
                            ${isSOS ? '<div class="absolute -inset-2 rounded-full border-2 border-red-500/50 animate-ping"></div>' : ""}
                          </div>
                        `,
                          className: "custom-member-icon",
                          iconSize: [32, 32],
                          iconAnchor: [16, 16],
                        })
                      }
                    >
                      <Popup className="font-bold border-0 shadow-lg">
                        {member.name} {isSOS ? "(SOS)" : ""}
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Member Locations List */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-500" />
                  {t("family.activeMembers")}
                </h2>
              </div>

              <div className="space-y-4">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${member.isSOS ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100"}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${member.isSOS ? "bg-red-600 text-white animate-pulse" : "bg-primary-100 text-primary-700"}`}
                        >
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        {member.isSOS ? (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-600 border-2 border-white rounded-full"></span>
                        ) : (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${member.isSOS ? "text-red-700" : "text-slate-800"}`}>
                          {member.name} {member.id === "me" && "(You)"} {member.role === "admin" && "👑"}
                        </h3>
                        <div className={`flex flex-col gap-1 text-xs mt-1 ${member.isSOS ? "text-red-600" : "text-slate-500"}`}>
                          <span className="flex items-center gap-1 font-medium">
                            {member.isSOS ? (
                              <><ShieldAlert className="w-3.5 h-3.5" /> {t("family.sosActive")}</>
                            ) : (
                              <><MapPin className="w-3.5 h-3.5 text-primary-600" /> {member.location || "Sector 4 VIP Ghat"}</>
                            )}
                          </span>
                          {!member.isSOS && member.id !== "me" && (
                             <span className="flex items-center gap-3 font-medium text-slate-400">
                               <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {Math.floor(Math.random() * 5 + 1)} km away</span>
                               <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated 2m ago</span>
                             </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {member.id === "me" && !member.isSOS && (
                      <button
                        onClick={handleUpdateLocation}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 bg-primary-50 rounded-lg"
                      >
                        {t("family.updateLocation")}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-4 mt-2">
              <button
                onClick={leaveGroup}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 bg-white border border-slate-200 px-4 py-2 rounded-xl font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t("family.leaveGroup")}
              </button>
              {isAdmin && (
                <button
                  onClick={disbandGroup}
                  className="flex items-center gap-2 text-destructive-600 hover:text-white hover:bg-destructive-600 bg-white border border-destructive-200 px-4 py-2 rounded-xl font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  {t("family.disbandGroup")}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

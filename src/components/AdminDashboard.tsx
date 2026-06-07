import React, { useState, useEffect } from "react";
import {
  onSnapshot,
  query,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import {
  alertsCollection,
  lostFoundReportsCollection,
  parkingCollection,
  crowdZonesCollection,
  broadcastsCollection,
} from "../services/db";
import { db } from "../firebase";
import {
  AlertTriangle,
  Users,
  Car,
  Radio,
  Search,
  CheckCircle,
  LogOut,
  Info,
  Trash2,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import AboutPanel from "./AboutPanel";

type AdminTab = "sos" | "missing" | "parking" | "crowd" | "broadcast" | "about";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("sos");
  const [alerts, setAlerts] = useState<any[]>([]);
  const [missing, setMissing] = useState<any[]>([]);
  const [parking, setParking] = useState<any[]>([]);
  const [crowd, setCrowd] = useState<any[]>([]);
  const [broadcastMsg, setBroadcastMsg] = useState("");

  const [newCrowdName, setNewCrowdName] = useState("");
  const [newParkingName, setNewParkingName] = useState("");
  const [newParkingTotal, setNewParkingTotal] = useState(500);

  useEffect(() => {
    const qAlerts = query(alertsCollection, orderBy("timestamp", "desc"));
    const unsubAlerts = onSnapshot(qAlerts, (snap) =>
      setAlerts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    const qMissing = query(
      lostFoundReportsCollection,
      orderBy("createdAt", "desc"),
    );
    const unsubMissing = onSnapshot(qMissing, (snap) =>
      setMissing(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    const unsubParking = onSnapshot(parkingCollection, (snap) =>
      setParking(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
    const unsubCrowd = onSnapshot(crowdZonesCollection, (snap) =>
      setCrowd(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    return () => {
      unsubAlerts();
      unsubMissing();
      unsubParking();
      unsubCrowd();
    };
  }, []);

  const handleResolveAlert = async (id: string) => {
    await updateDoc(doc(db, "alerts", id), { status: "resolved" });
  };

  const handleResolveMissing = async (id: string) => {
    await updateDoc(doc(db, "lost_found_reports", id), { status: "resolved" });
  };

  const handleUpdateParking = async (
    id: string,
    status: string,
    occupied: number,
    total: number,
  ) => {
    let newStatus = status;
    if (occupied >= total && status === "Open") newStatus = "Full";
    else if (occupied < total && status === "Full") newStatus = "Open";

    await updateDoc(doc(db, "parking", id), {
      status: newStatus,
      occupiedSpots: Number(occupied),
      totalSpots: Number(total),
    });
  };

  const handleUpdateCrowd = async (id: string, density: string) => {
    await updateDoc(doc(db, "crowd_zones", id), {
      density,
      updatedAt: Date.now(),
    });
  };

  const handleDeleteCrowd = async (id: string) => {
    if (confirm("Are you sure you want to delete this zone?")) {
      await deleteDoc(doc(db, "crowd_zones", id));
    }
  };

  const handleDeleteParking = async (id: string) => {
    if (confirm("Are you sure you want to delete this parking lot?")) {
      await deleteDoc(doc(db, "parking", id));
    }
  };

  const handleAddCrowdZone = async () => {
    if (!newCrowdName.trim()) return;
    await addDoc(crowdZonesCollection, {
      name: newCrowdName.trim(),
      lat: 25.43 + (Math.random() * 0.02 - 0.01),
      lng: 81.87 + (Math.random() * 0.02 - 0.01),
      density: "low",
      updatedAt: Date.now(),
    });
    setNewCrowdName("");
  };

  const handleAddParking = async () => {
    if (!newParkingName.trim()) return;
    await addDoc(parkingCollection, {
      name: newParkingName.trim(),
      type: "general",
      lat: 25.44 + (Math.random() * 0.02 - 0.01),
      lng: 81.86 + (Math.random() * 0.02 - 0.01),
      totalSpots: Number(newParkingTotal),
      occupiedSpots: 0,
      status: "Open",
    });
    setNewParkingName("");
    setNewParkingTotal(500);
  };

  const handleBroadcast = async () => {
    if (!broadcastMsg.trim()) return;
    try {
      await addDoc(broadcastsCollection, {
        message: broadcastMsg,
        sender: "Command Center",
        timestamp: Date.now(),
        isActive: true,
      });
      setBroadcastMsg("");
      alert("Broadcast sent to all digital boards and apps!");
    } catch (err) {
      console.error(err);
      alert("Failed to send broadcast");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-3 text-white">
          <div className="bg-primary-600 p-2 rounded-lg">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold">Command Center</h1>
            <p className="text-xs text-slate-400 font-medium">
              Administration Dashboard
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-slate-400 hover:text-white flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] relative overflow-y-auto">
          <TabButton
            active={activeTab === "sos"}
            onClick={() => setActiveTab("sos")}
            icon={<AlertTriangle />}
            label="SOS Alerts"
            info={alerts.filter((a) => a.status === "active").length.toString()}
            color="red"
          />
          <TabButton
            active={activeTab === "missing"}
            onClick={() => setActiveTab("missing")}
            icon={<Search />}
            label="Missing Persons"
            info={missing
              .filter((m) => m.status === "active" && m.type === "missing")
              .length.toString()}
            color="amber"
          />
          <TabButton
            active={activeTab === "crowd"}
            onClick={() => setActiveTab("crowd")}
            icon={<Users />}
            label="Crowd Density"
          />
          <TabButton
            active={activeTab === "parking"}
            onClick={() => setActiveTab("parking")}
            icon={<Car />}
            label="Parking Zones"
          />
          <TabButton
            active={activeTab === "broadcast"}
            onClick={() => setActiveTab("broadcast")}
            icon={<Radio />}
            label="Broadcast"
          />
          <div className="my-2 border-t border-slate-100"></div>
          <TabButton
            active={activeTab === "about"}
            onClick={() => setActiveTab("about")}
            icon={<Info />}
            label="About"
          />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20"></div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={activeTab}
            className="max-w-5xl mx-auto relative z-10"
          >
            {activeTab === "sos" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Active SOS Alerts</h2>
                <div className="grid gap-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-5 rounded-2xl border flex items-center justify-between ${alert.status === "active" ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${alert.status === "active" ? "bg-red-200 text-red-800" : "bg-slate-200 text-slate-600"}`}
                          >
                            {alert.status}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-bold text-lg text-slate-800">
                          {alert.userName}{" "}
                          <span className="font-medium text-sm text-slate-600 ml-2">
                            Location: {alert.location || "Unknown"}
                          </span>
                        </p>
                      </div>
                      {alert.status === "active" && (
                        <button
                          onClick={() => handleResolveAlert(alert.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors flex flex-shrink-0 items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Resolve
                        </button>
                      )}
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <p className="text-slate-500">No alerts found.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "missing" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Lost & Found Reports</h2>
                <div className="grid gap-4">
                  {missing.map((m) => (
                    <div
                      key={m.id}
                      className={`p-5 rounded-2xl border flex items-center justify-between ${m.status === "active" ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50 border-slate-100"}`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${m.type === "missing" ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}
                          >
                            {m.type}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${m.status === "active" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                          >
                            {m.status}
                          </span>
                        </div>
                        <p className="font-bold text-lg text-slate-800">
                          {m.name}{" "}
                          <span className="font-medium text-sm text-slate-600 ml-2">
                            ({m.category}) - Last seen: {m.lastKnownLocation}
                          </span>
                        </p>
                        {m.description && (
                          <p className="text-sm text-slate-500 mt-1">
                            {m.description}
                          </p>
                        )}
                      </div>
                      {m.status === "active" && (
                        <button
                          onClick={() => handleResolveMissing(m.id)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-sm shadow-sm transition-colors flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Mark Found
                        </button>
                      )}
                    </div>
                  ))}
                  {missing.length === 0 && (
                    <p className="text-slate-500">No missing person reports.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "crowd" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">
                    Crowd Density Management
                  </h2>
                  <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <input
                      type="text"
                      placeholder="New zone name..."
                      value={newCrowdName}
                      onChange={(e) => setNewCrowdName(e.target.value)}
                      className="px-4 py-2 outline-none text-sm w-48"
                    />
                    <button
                      onClick={handleAddCrowdZone}
                      disabled={!newCrowdName.trim()}
                      className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crowd.map((c) => {
                    const getDensityColors = (level: string) => {
                      switch (level) {
                        case "low": return "bg-green-100 text-green-800 border-green-200";
                        case "moderate": return "bg-amber-100 text-amber-800 border-amber-200";
                        case "high": return "bg-orange-100 text-orange-800 border-orange-200";
                        case "critical": return "bg-red-100 text-red-800 border-red-200";
                        default: return "bg-slate-100 text-slate-800 border-slate-200";
                      }
                    };
                    const isActiveLevel = (level: string) => c.density === level;
                    
                    return (
                      <div
                        key={c.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-lg leading-tight">{c.name}</h3>
                          <button
                            onClick={() => handleDeleteCrowd(c.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-auto grid grid-cols-2 gap-2">
                          {["low", "moderate", "high", "critical"].map(
                            (level) => (
                              <button
                                key={level}
                                onClick={() => handleUpdateCrowd(c.id, level)}
                                className={`w-full p-2.5 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${isActiveLevel(level) ? getDensityColors(level) + " shadow-sm border-2 ring-2 ring-white" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"}`}
                              >
                                {level}
                              </button>
                            ),
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {crowd.length === 0 && (
                    <p className="text-slate-500 col-span-full text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                      No crowd zones configured.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "parking" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">
                    Parking Occupancy Controls
                  </h2>
                  <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <input
                      type="text"
                      placeholder="Lot name..."
                      value={newParkingName}
                      onChange={(e) => setNewParkingName(e.target.value)}
                      className="px-3 py-2 outline-none text-sm w-40 border-r border-slate-200"
                    />
                    <input
                      type="number"
                      placeholder="Total spots"
                      value={newParkingTotal || ""}
                      onChange={(e) => setNewParkingTotal(Number(e.target.value))}
                      className="px-3 py-2 outline-none text-sm w-32"
                    />
                    <button
                      onClick={handleAddParking}
                      disabled={!newParkingName.trim() || !newParkingTotal}
                      className="bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white px-4 py-2 text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Lot
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {parking.map((p) => {
                    const pct = Math.round((p.occupiedSpots / p.totalSpots) * 100) || 0;
                    return (
                      <div
                        key={p.id}
                        className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg leading-tight">{p.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold uppercase text-slate-600">
                                {p.type}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${p.status === "Open" ? "bg-green-100 text-green-700" : p.status === "Full" ? "bg-red-100 text-red-700" : "bg-slate-200 text-slate-700"}`}>
                                {p.status}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteParking(p.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-4 mt-auto">
                          <div>
                            <div className="flex justify-between items-end mb-1">
                              <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                                Occupied Spots
                              </label>
                              <span className={`text-sm font-bold ${pct >= 100 ? 'text-red-600' : 'text-slate-700'}`}>
                                {p.occupiedSpots} / {p.totalSpots} ({pct}%)
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={p.totalSpots}
                              value={p.occupiedSpots}
                              onChange={(e) =>
                                handleUpdateParking(
                                  p.id,
                                  p.status,
                                  parseInt(e.target.value),
                                  p.totalSpots,
                                )
                              }
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2 block">
                              Manual Override Status
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {["Open", "Full", "Closed"].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateParking(p.id, status, p.occupiedSpots, p.totalSpots)}
                                  className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${p.status === status ? "bg-slate-800 text-white" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"}`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {parking.length === 0 && (
                    <p className="text-slate-500 col-span-full text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                      No parking lots configured.
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "broadcast" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Emergency Broadcasts</h2>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-2xl">
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Message to App Users & Digital Boards
                  </label>
                  <textarea
                    value={broadcastMsg}
                    onChange={(e) => setBroadcastMsg(e.target.value)}
                    rows={4}
                    className="w-full p-4 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-primary-500 focus:outline-none mb-4"
                    placeholder="e.g., Heavy crowd expected at Ghat 3. Please use alternative routes."
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleBroadcast}
                      disabled={!broadcastMsg.trim()}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
                    >
                      <Radio className="w-5 h-5" /> Send Broadcast Alert
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "about" && <AboutPanel className="bg-transparent" />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  info,
  color = "primary",
}: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all font-bold text-sm group ${active ? `bg-${color}-50 text-${color}-700 border-${color}-200 border` : "text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200 border"}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`${active ? `text-${color}-600` : "text-slate-400 group-hover:text-slate-500"}`}
        >
          {icon}
        </div>
        {label}
      </div>
      {info && info !== "0" && (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${active ? `bg-${color}-600 text-white` : "bg-slate-200 text-slate-700"}`}
        >
          {info}
        </span>
      )}
    </button>
  );
}

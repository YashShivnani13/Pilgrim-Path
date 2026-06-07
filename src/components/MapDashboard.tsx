import React, { useState, useEffect } from "react";
import {
  Layers,
  Route,
  ArrowRight,
  Droplets,
  HeartPulse,
  Tent,
  Shield,
  Users,
  Car,
  MapPin as MapPinIcon,
  AlertTriangle,
  Maximize,
  Minimize,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin as TypeMapPin } from "../types";
import { useLanguage } from "../i18n";
import { useRealtimeData } from "../contexts/DataContext";

const MOCK_PINS_DATA: Array<Omit<TypeMapPin, "title"> & { langKey: string }> = [
  { id: "1", type: "landmark", langKey: "pin.landmark", lat: 25.4285, lng: 81.8795 }, // Sangam Nose / Triveni
  { id: "2", type: "landmark", langKey: "pin.ghat", lat: 25.4315, lng: 81.878 }, // Saraswati Ghat
  { id: "11", type: "gate", langKey: "Entrance Gate A", lat: 25.438, lng: 81.868 }, // Arail Ghat Entrance
  { id: "12", type: "gate", langKey: "Entrance Gate B", lat: 25.440, lng: 81.860 }, // Sector 3 Entrance
  { id: "3", type: "station", langKey: "pin.railway", lat: 25.442, lng: 81.825 }, // Prayagraj Junction
  { id: "4", type: "station", langKey: "pin.bus", lat: 25.448, lng: 81.835 }, // Civil Lines Bus Stand
  { id: "5", type: "parking", langKey: "pin.parking", lat: 25.437, lng: 81.87 }, // Sector 4 VIP Parking
  { id: "13", type: "parking", langKey: "Public Parking B", lat: 25.441, lng: 81.865 }, // General Parking
  { id: "6", type: "medical", langKey: "pin.medical", lat: 25.4345, lng: 81.8765 }, // Central Medical Camp
  { id: "14", type: "medical", langKey: "First Aid Clinic (Sect 2)", lat: 25.429, lng: 81.882 }, // Additional Medical
  { id: "7", type: "toilet", langKey: "pin.toilet", lat: 25.43, lng: 81.875 }, // Public Toilets
  { id: "8", type: "police", langKey: "pin.police", lat: 25.4295, lng: 81.8735 }, // Sector Police Checkpoint
  { id: "9", type: "food", langKey: "pin.food", lat: 25.433, lng: 81.871 }, // Langar & Food Zone
  { id: "10", type: "police", langKey: "pin.lostFound", lat: 25.435, lng: 81.875 }, // Main Lost & Found Hub
];

// Helper to create Leaflet DivIcon from HTML string
const createCustomIcon = (type: TypeMapPin["type"], active: boolean) => {
  let bgColor = "bg-slate-500";
  let iconHtml = "";
  let shadowColor = "";

  switch (type) {
    case "gate":
      bgColor = "bg-emerald-600";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h2V14h8v8h2a2 2 0 0 0 2-2v-8"/><path d="M12 22v-8"/></svg>`;
      break;
    case "medical":
      bgColor = "bg-destructive-500";
      shadowColor = "rgba(239, 68, 68, 0.4)";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/></svg>`;
      break;
    case "hydration":
      bgColor = "bg-blue-500";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`;
      break;
    case "police":
      bgColor = "bg-amber-400";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-800"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6.5 2a1 1 0 0 1 1 1z"/></svg>`;
      break;
    case "toilet":
      bgColor = "bg-teal-500";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M8 20.5v-3.8A2.7 2.7 0 0 1 10.7 14h2.6a2.7 2.7 0 0 1 2.7 2.7v3.8"/><path d="M12 14v4"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M8 10h8v4H8z"/></svg>`;
      break;
    case "landmark":
      bgColor = "bg-yellow-400";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-900"><path d="M19 14.86c-1-1.12-2.19-2-3.13-2.61-.31-.2-.67-.32-1.04-.36L9 11l-2 1v4l2 1 5.86 1.13c.36.05.74-.05 1.04-.26.96-.68 2.11-1.63 3.1-2.91v0c.1-.14.1-.34 0-.48z"/><path d="m14 17-6-3V7.5C8 6.1 8.9 5 10 5v0c1.1 0 2 1.1 2 2.5v4Z"/></svg>`;
      break;
    case "station":
      bgColor = "bg-indigo-500";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M4 11h16"/><path d="M12 4v7"/></svg>`;
      break;
    case "parking":
      bgColor = "bg-slate-700";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="12" cy="12" r="10"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>`;
      break;
    case "food":
      bgColor = "bg-orange-500";
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 2v20"/><path d="M17 2a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M7 2v20"/><path d="M4 2v10"/><path d="M10 2v10"/></svg>`;
      break;
    default:
      iconHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><circle cx="12" cy="12" r="10"/></svg>`;
  }

  const pingAnimation =
    type === "landmark" || type === "police"
      ? '<div class="absolute inset-0 rounded-full animate-ping opacity-50 border-2 inherit"></div>'
      : "";

  const scaleClass = active ? "scale-125" : "scale-100";

  const html = `
    <div class="relative w-8 h-8 rounded-full shadow-lg border-2 border-white flex items-center justify-center z-20 ${bgColor} ${scaleClass} transition-transform">
      ${iconHtml}
      ${pingAnimation}
    </div>
  `;

  return new L.DivIcon({
    html,
    className: "custom-leaflet-icon", // removes default leaflet styles
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

function MapEffects({ routePoints }: { routePoints: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (routePoints && routePoints.length > 0) {
      try {
        map.fitBounds(L.latLngBounds(routePoints), {
          padding: [50, 50],
          animate: true,
        });
      } catch (e) {}
    }
  }, [routePoints, map]);
  return null;
}

export default function MapDashboard({
  initialTarget,
  onClearTarget,
}: {
  initialTarget?: string | null;
  onClearTarget?: () => void;
} = {}) {
  const { t } = useLanguage();
  const { crowdLevel: overallCrowd } = useRealtimeData();

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const [showHeatmap, setShowHeatmap] = useState(() => {
    return localStorage.getItem("pilgrim_showHeatmap") === "true";
  });
  const [routeActive, setRouteActive] = useState(() => {
    return localStorage.getItem("pilgrim_routeActive") === "true";
  });
  const [activePin, setActivePin] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);

  const mapContainerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mapContainerRef.current) {
        mapContainerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const [selectedDestination, setSelectedDestination] =
    useState<TypeMapPin | null>(() => {
      const cached = localStorage.getItem("pilgrim_selectedDestination");
      return cached ? JSON.parse(cached) : null;
    });
  const [routePoints, setRoutePoints] = useState<[number, number][]>(() => {
    const cached = localStorage.getItem("pilgrim_routePoints");
    return cached ? JSON.parse(cached) : [];
  });

  useEffect(() => {
    localStorage.setItem("pilgrim_showHeatmap", String(showHeatmap));
    localStorage.setItem("pilgrim_routeActive", String(routeActive));
    localStorage.setItem(
      "pilgrim_selectedDestination",
      JSON.stringify(selectedDestination),
    );
    localStorage.setItem("pilgrim_routePoints", JSON.stringify(routePoints));
  }, [showHeatmap, routeActive, selectedDestination, routePoints]);

  // Derive MOCK_PINS dynamically with translations
  const MOCK_PINS = MOCK_PINS_DATA.map((pin) => ({
    ...pin,
    title: t(pin.langKey),
  }));

  useEffect(() => {
    if (initialTarget) {
      const p = MOCK_PINS_DATA.find((pin) => pin.id === initialTarget);
      if (p) {
        setSelectedDestination({ ...p, title: t(p.langKey) });
        setRouteActive(true);
      }
      if (onClearTarget) onClearTarget();
    }
  }, [initialTarget, t, onClearTarget]);

  // Center of the map around Sangam
  const centerPosition: [number, number] = [25.432, 81.876];

  const [userPosition, setUserPosition] = useState<[number, number]>([
    25.4335, 81.874,
  ]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.warn(
            "Geolocation warning (using default location): ",
            error.message,
          );
        },
        { enableHighAccuracy: true },
      );
    }
  }, []);

  useEffect(() => {
    if (routeActive && selectedDestination && userPosition) {
      if (!isOnline) {
        // Stop routing state if offline to avoid waiting, just use cached route points
        setIsRouting(false);
        return;
      }
      setIsRouting(true);
      // Fetch foot routing from OSRM
      fetch(
        `https://router.project-osrm.org/route/v1/foot/${userPosition[1]},${userPosition[0]};${selectedDestination.lng},${selectedDestination.lat}?overview=full&geometries=geojson`,
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates;
            // OSRM returns array of [lng, lat], convert to [lat, lng] for Leaflet
            const latLngs = coords.map((c: [number, number]) => [c[1], c[0]]);
            setRoutePoints(latLngs);
          }
        })
        .catch((err) => console.error("Error fetching route", err))
        .finally(() => setIsRouting(false));
    } else {
      setRoutePoints([]);
    }
  }, [routeActive, selectedDestination, userPosition, isOnline]);

  const getPinIcon = (type: TypeMapPin["type"]) => {
    switch (type) {
      case "medical":
        return <HeartPulse className="w-4 h-4 text-white" />;
      case "hydration":
        return <Droplets className="w-4 h-4 text-white" />;
      case "police":
        return <Shield className="w-4 h-4 text-slate-800" />;
      case "landmark":
        return <Tent className="w-4 h-4 text-yellow-900" />;
      default:
        return <Route className="w-4 h-4 text-white" />;
    }
  };

  const getPinColor = (type: TypeMapPin["type"]) => {
    switch (type) {
      case "medical":
        return "bg-destructive-500 border-white";
      case "hydration":
        return "bg-blue-500 border-white";
      case "police":
        return "bg-amber-400 border-white";
      case "landmark":
        return "bg-yellow-400 border-yellow-200";
      default:
        return "bg-slate-500 border-white";
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-4 relative overflow-y-auto lg:overflow-visible">
      {/* Main Map View */}
      <div 
        ref={mapContainerRef}
        className="flex-1 min-h-[400px] lg:h-full bg-slate-100 rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative flex flex-col z-0"
      >
        {/* Map Header Controls */}
        <div className="absolute top-3 left-3 right-3 z-[1000] flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto max-w-[200px] sm:max-w-sm">
            <div className="bg-white/90 backdrop-blur-md p-2 sm:px-4 sm:py-3 rounded-xl shadow-lg border border-slate-200 flex flex-col gap-1.5 sm:gap-2">
              <h2 className="font-semibold text-slate-800 text-xs sm:text-base flex items-center gap-1.5 sm:gap-2">
                <Route className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                <span className="hidden sm:inline">{t("map.liveSectorMap")}</span>
                <span className="sm:hidden">Live Map</span>
                {!isOnline && (
                  <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[8px] sm:text-[10px] rounded-full uppercase tracking-wider font-bold">
                    Offline
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs text-slate-500 font-medium capitalize">
                <span className="truncate">
                  <span className="hidden sm:inline">{t("map.status")}</span>{" "}
                  <span
                    className={`${overallCrowd.toLowerCase() === "high" || overallCrowd.toLowerCase() === "critical" ? "text-red-600" : "text-primary-600"} font-bold`}
                  >
                    {overallCrowd.toLowerCase() === "high" ||
                    overallCrowd.toLowerCase() === "critical"
                      ? "Congested"
                      : "Flowing"}
                  </span>
                </span>
                <span>•</span>
                <span>
                  <span
                    className={`${overallCrowd.toLowerCase() === "high" || overallCrowd.toLowerCase() === "critical" ? "text-red-500" : overallCrowd.toLowerCase() === "moderate" ? "text-amber-500" : "text-green-500"} font-bold uppercase tracking-wider`}
                  >
                    {overallCrowd}
                  </span>
                </span>
              </div>
            </div>

            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-slate-900/90 backdrop-blur-md p-2 sm:px-3 sm:py-2.5 rounded-xl shadow-lg border border-slate-700 hidden sm:block"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[10.5px] text-slate-200 font-medium leading-tight">
                  <span className="font-bold text-white">Disclaimer:</span> Map layout and routes shown may vary from actual Kumbh layout. Free map data is used for this project demonstration.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center justify-center p-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-lg transition-all border
                ${
                  showHeatmap
                    ? "bg-slate-900 text-white border-slate-800"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }
              `}
              title="Toggle Crowd Heatmap"
            >
              <Layers className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline ml-2">{t("map.crowdHeatmap")} {showHeatmap ? t("map.on") : t("map.off")}</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 flex items-center justify-center p-2 sm:px-3 sm:py-2.5 rounded-xl transition-all shadow-lg border"
              title={isFullscreen ? "Exit Fullscreen" : "Enlarge Map View"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Real Leaflet Map */}
        <div className="flex-1 relative bg-slate-100 overflow-hidden z-0">
          <MapContainer
            center={centerPosition}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className={showHeatmap ? "opacity-50" : "opacity-100"}
            />

            {/* Map Automations */}
            <MapEffects routePoints={routeActive ? routePoints : []} />

            {/* Heatmap Simulation (using CircleMarker so it stays visible on zoom out) */}
            {showHeatmap && (
              <>
                {/* Hotspot 1: Bridge 4 Area */}
                <CircleMarker
                  center={[25.4285, 81.8795]}
                  pathOptions={{
                    fillColor: "#ef4444",
                    color: "transparent",
                    fillOpacity: 0.15,
                  }}
                  radius={80}
                />
                <CircleMarker
                  center={[25.4285, 81.8795]}
                  pathOptions={{
                    fillColor: "#ef4444",
                    color: "transparent",
                    fillOpacity: 0.25,
                  }}
                  radius={50}
                />
                <CircleMarker
                  center={[25.4285, 81.8795]}
                  pathOptions={{
                    fillColor: "#ef4444",
                    color: "transparent",
                    fillOpacity: 0.4,
                  }}
                  radius={20}
                />

                {/* Hotspot 2: Main Gathering */}
                <CircleMarker
                  center={[25.432, 81.876]}
                  pathOptions={{
                    fillColor: "#f97316",
                    color: "transparent",
                    fillOpacity: 0.15,
                  }}
                  radius={70}
                />
                <CircleMarker
                  center={[25.432, 81.876]}
                  pathOptions={{
                    fillColor: "#f97316",
                    color: "transparent",
                    fillOpacity: 0.25,
                  }}
                  radius={40}
                />
                <CircleMarker
                  center={[25.432, 81.876]}
                  pathOptions={{
                    fillColor: "#ea580c",
                    color: "transparent",
                    fillOpacity: 0.4,
                  }}
                  radius={16}
                />

                {/* Hotspot 3: Parking Area */}
                <CircleMarker
                  center={[25.436, 81.871]}
                  pathOptions={{
                    fillColor: "#eab308",
                    color: "transparent",
                    fillOpacity: 0.15,
                  }}
                  radius={60}
                />
                <CircleMarker
                  center={[25.436, 81.871]}
                  pathOptions={{
                    fillColor: "#eab308",
                    color: "transparent",
                    fillOpacity: 0.25,
                  }}
                  radius={30}
                />
              </>
            )}

            {/* Route Simulation */}
            {routeActive && routePoints.length > 0 && (
              <>
                {/* Active Green Route */}
                <Polyline
                  positions={routePoints}
                  pathOptions={{
                    color: "#14532d",
                    weight: 8,
                    opacity: 0.4,
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
                <Polyline
                  positions={routePoints}
                  pathOptions={{
                    color: "#16a34a",
                    weight: 5,
                    opacity: 1,
                    lineCap: "round",
                    lineJoin: "round",
                    dashArray: "1, 10",
                  }}
                />

                {/* Simulated Red Congested Route */}
                <Polyline
                  positions={[
                    [25.4335, 81.874],
                    [25.433, 81.876],
                    [25.431, 81.877],
                    [25.429, 81.879],
                  ]}
                  pathOptions={{
                    color: "#dc2626",
                    weight: 4,
                    opacity: 0.8,
                    lineCap: "round",
                    lineJoin: "round",
                    dashArray: "5, 5",
                  }}
                />
              </>
            )}

            {/* User Location */}
            <Marker
              position={userPosition}
              icon={
                new L.DivIcon({
                  html: `
                  <div class="relative w-4 h-4 bg-primary-500 rounded-full border-2 border-white shadow-lg">
                    <div class="absolute -inset-4 rounded-full border-2 border-primary-500/30 animate-ping"></div>
                  </div>
                `,
                  className: "custom-user-icon",
                  iconSize: [16, 16],
                  iconAnchor: [8, 8],
                })
              }
            >
              <Popup>You are here</Popup>
            </Marker>

            {/* Map Pins */}
            {MOCK_PINS.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={createCustomIcon(pin.type, activePin === pin.id)}
                eventHandlers={{
                  click: () => {
                    setActivePin(pin.id);
                    setSelectedDestination(pin);
                    setRouteActive(false); // Do not start routing immediately
                  },
                  mouseover: () => setActivePin(pin.id),
                  mouseout: () => setActivePin(null),
                }}
              >
                <Popup className="custom-popup border-0 shadow-xl rounded-xl">
                  <div className="font-semibold text-slate-800 text-sm">
                    {pin.title}
                  </div>
                  <div className="text-xs text-slate-500 capitalize">
                    {pin.type} Station
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Smart Navigation Panel */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-3 lg:gap-4">
        <div className="flex-none lg:flex-1 bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-slate-200 lg:overflow-y-auto flex flex-col">
          <h3 className="font-display font-bold text-base lg:text-lg text-slate-800 mb-1 lg:mb-1">
            Smart Navigation
          </h3>
          <p className="text-xs lg:text-sm text-slate-500 mb-3 lg:mb-4">
            {t("map.selectDestination")}
          </p>

          <div className="space-y-3 lg:space-y-4">
            <select
              className="w-full p-2.5 lg:p-3 rounded-xl border border-slate-200 text-xs lg:text-sm font-medium focus:ring-2 focus:ring-primary-500 focus:outline-none"
              onChange={(e) => {
                const pin = MOCK_PINS.find((p) => p.id === e.target.value);
                setSelectedDestination(pin || null);
                setRouteActive(false);
              }}
              value={selectedDestination?.id || ""}
            >
              <option value="">{t("map.chooseDestination")}</option>
              {MOCK_PINS.map((pin) => (
                <option key={pin.id} value={pin.id}>
                  {pin.title}
                </option>
              ))}
            </select>

            {selectedDestination && (
              <button
                onClick={() => setRouteActive(!routeActive)}
                disabled={isRouting || (!isOnline && !routeActive)}
                className={`w-full flex items-center justify-center p-2.5 lg:p-3 rounded-xl border transition-all font-bold text-xs lg:text-sm
                  ${
                    routeActive
                      ? "bg-destructive-50 border-destructive-200 text-destructive-600 shadow-sm hover:bg-destructive-100"
                      : "bg-primary-600 border-primary-600 text-white hover:bg-primary-700 shadow-md"
                  }
                  ${isRouting || (!isOnline && !routeActive) ? "opacity-70 cursor-not-allowed" : ""}
                `}
              >
                {isRouting
                  ? t("map.calculatingRoute")
                  : routeActive
                    ? t("map.cancelRoute")
                    : !isOnline
                      ? t("map.offlineMode")
                      : t("map.findRoute")}
              </button>
            )}

            {routeActive && selectedDestination && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 lg:space-y-4 pt-1 lg:pt-2"
              >
                <div className="bg-primary-50 rounded-xl p-3 lg:p-4 border border-primary-100">
                  <h4 className="text-xs lg:text-sm font-bold text-primary-900 mb-2 lg:mb-3">
                    Best Route (Active)
                  </h4>
                  <div className="flex justify-between items-center text-[10px] lg:text-xs mb-1.5 lg:mb-2 text-primary-800">
                    <span>Walking Time:</span>
                    <span className="font-bold">~14 mins</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] lg:text-xs mb-2 lg:mb-3 text-primary-800">
                    <span>Distance:</span>
                    <span className="font-bold">1.2 km</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] lg:text-xs text-primary-800">
                    <span>Crowd Level:</span>
                    <span
                      className="bg-amber-100 text-amber-700 px-1.5 py-0.5 lg:px-2 lg:py-0.5 rounded-md lg:rounded-full font-bold shadow-sm uppercase tracking-wider"
                      style={{ fontSize: "9px" }}
                    >
                      Moderate
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 lg:p-4 border border-slate-200 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                  <h4 className="text-xs lg:text-sm font-semibold text-slate-700 mb-2 lg:mb-3">
                    Alternative Route
                  </h4>
                  <div className="flex justify-between items-center text-[10px] lg:text-xs mb-1.5 lg:mb-2 text-slate-600">
                    <span>Walking Time:</span>
                    <span className="font-bold">~18 mins</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] lg:text-xs text-slate-600">
                    <span>Crowd Level:</span>
                    <span
                      className="bg-green-100 text-green-700 px-1.5 py-0.5 lg:px-2 lg:py-0.5 rounded-md lg:rounded-full font-bold shadow-sm uppercase tracking-wider"
                      style={{ fontSize: "9px" }}
                    >
                      Low
                    </span>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-xl p-3 lg:p-4 border border-indigo-100 mt-1 lg:mt-2">
                  <div className="flex gap-2 items-start text-[10px] lg:text-xs text-indigo-900">
                    <Layers className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 text-indigo-600" />
                    <p className="leading-relaxed font-bold">
                      Path cleared. Avoided Bridge 3 congestion.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { motion } from "motion/react";
import { useLanguage } from "../i18n";
import { Car, Navigation, Shield, ArrowRightCircle } from "lucide-react";
import { useRealtimeData } from "../contexts/DataContext";

interface SmartParkingPanelProps {
  onNavigateMap: (id?: string) => void;
}

export default function SmartParkingPanel({
  onNavigateMap,
}: SmartParkingPanelProps) {
  const { t } = useLanguage();
  const { parkingLots } = useRealtimeData();

  const recommendedLot =
    parkingLots.find((p) => p.status === "Open") || parkingLots[0];

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto w-full">
      <div className="bg-white px-4 py-4 md:px-6 md:py-6 border-b border-slate-200 shrink-0">
        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800 flex items-center gap-2 md:gap-3">
          <Car className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
          {t("nav.parking")}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2">
          Monitor real-time occupancy and navigate to nearest parking.
        </p>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto w-full">
        {/* Main Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 flex flex-col justify-center">
            <h3 className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1 md:mb-2">
              {t("parking.available")}
            </h3>
            <div className="flex items-end gap-2 md:gap-3 mb-1.5 md:mb-2">
              <span className="text-3xl md:text-4xl font-bold text-slate-800">
                {recommendedLot ? recommendedLot.name : "Lot D"}
              </span>
              <span
                className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold mb-1 ${recommendedLot?.status === "Open" ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"}`}
              >
                {recommendedLot ? recommendedLot.status : "Open"}
              </span>
            </div>
            <p className="text-slate-600 text-[10px] md:text-sm">
              Best option for your current location.
            </p>
            <div className="mt-3 md:mt-4 flex items-center gap-1.5 md:gap-2 text-[11px] md:text-sm font-medium text-slate-700">
              <Navigation className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-500" />{" "}
              {t("parking.distance")}: Est. 2.4 km from you
            </div>
          </div>

          <div className="bg-indigo-600 text-white rounded-2xl shadow-sm p-4 md:p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2 text-sm md:text-base">
                <ArrowRightCircle className="w-4 h-4 md:w-5 md:h-5" />{" "}
                {t("parking.navigateTo")}
              </h3>
              <p className="text-indigo-100 text-xs md:text-sm mb-3 md:mb-4">
                Launch guided smart routing to{" "}
                {recommendedLot ? recommendedLot.name : "the nearest lot"} via
                the fastest path.
              </p>
            </div>
            <button
              onClick={() => onNavigateMap("5")}
              className="w-full py-2 md:py-3 bg-white hover:bg-slate-50 text-indigo-900 font-bold rounded-xl transition-colors text-sm md:text-base"
            >
              Start Route
            </button>
          </div>
        </div>

        {/* Occupancy Status */}
        <h2 className="text-base md:text-lg font-bold text-slate-800 mt-1 md:mt-2">
          {t("parking.occupancy")}
        </h2>
        <div className="space-y-3 md:space-y-4">
          {parkingLots.map((lot) => {
            const pct = Math.round((lot.occupiedSpots / lot.totalSpots) * 100);
            const isFull = lot.status === "Full" || pct >= 100;
            const barColor = isFull
              ? "bg-red-500"
              : pct > 80
                ? "bg-amber-500"
                : "bg-green-500";
            const badgeBg = isFull
              ? "bg-red-50 text-red-600"
              : pct > 80
                ? "bg-amber-50 text-amber-600"
                : "bg-green-50 text-green-600";

            return (
              <div
                key={lot.id}
                className="bg-white p-3.5 md:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                    <h4 className="font-semibold text-slate-800 text-sm md:text-base">{lot.name}</h4>
                    <span className="text-[9px] md:text-xs bg-slate-100 text-slate-600 px-1.5 md:px-2 py-0.5 rounded-md font-medium uppercase">
                      {lot.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <div
                      className={`text-[9px] md:text-xs font-bold inline-block px-1.5 md:px-2 py-0.5 md:py-1 rounded ${badgeBg}`}
                    >
                      {isFull ? "Full" : `${pct}% Full`}
                    </div>
                    {!isFull && (
                      <div className="text-[10px] md:text-xs text-slate-500 font-medium">
                        Spots: {lot.totalSpots - lot.occupiedSpots} avail
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-16 md:w-24 bg-slate-100 rounded-full h-2 md:h-2.5 overflow-hidden">
                  <div
                    className={`${barColor} h-2 md:h-2.5 rounded-full`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}

          {parkingLots.length === 0 && (
            <p className="text-slate-500 text-xs md:text-sm">
              Waiting for live parking data...
            </p>
          )}

          {recommendedLot && (
            <motion.div
              whileHover={{ scale: 1.01 }}
              onClick={() => onNavigateMap("5")}
              className="bg-primary-50 p-4 md:p-5 rounded-xl border border-primary-200 shadow-sm md:shadow-md flex justify-between cursor-pointer group mt-2"
            >
              <div className="flex-1">
                <div className="flex flex-col items-start gap-1 mb-1.5 md:mb-2">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <h4 className="font-bold text-primary-900 text-sm md:text-base">
                      {recommendedLot.name}
                    </h4>
                    <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-wider bg-primary-600 text-white px-1.5 md:px-2 py-0.5 rounded-full shadow-sm">
                      Recommended
                    </span>
                  </div>
                  <div className="text-[11px] md:text-sm font-semibold text-primary-700">
                    Best match right now
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                  <span className="text-[10px] md:text-xs font-bold text-green-700 bg-green-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded">
                    Open (
                    {Math.round(
                      (recommendedLot.occupiedSpots /
                        recommendedLot.totalSpots) *
                        100,
                    )}
                    % Full)
                  </span>
                  <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs font-bold text-slate-700 bg-white px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-sm border border-slate-100">
                    <Navigation className="w-3 h-3 text-primary-600" /> Navigate
                  </div>
                </div>
                <div className="text-[10px] md:text-xs font-bold text-primary-600 mt-1 flex items-center gap-1 group-hover:underline">
                  Start Route <ArrowRightCircle className="w-3 h-3" />
                </div>
              </div>
              <div className="w-16 md:w-24 flex items-center justify-end">
                <div className="w-full bg-white/50 rounded-full h-2 md:h-2.5 overflow-hidden shadow-inner">
                  <div
                    className="bg-green-500 h-2 md:h-2.5 rounded-full"
                    style={{
                      width: `${Math.round((recommendedLot.occupiedSpots / recommendedLot.totalSpots) * 100)}%`,
                    }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Overflow Suggestions */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-6 mt-2 md:mt-4 flex gap-3 md:gap-4 items-start">
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-amber-600 shrink-0 mt-0.5 md:mt-1" />
          <div>
            <h3 className="font-bold text-amber-900 mb-0.5 md:mb-1 text-sm md:text-base">
              {t("parking.overflow")}
            </h3>
            <p className="text-[11px] md:text-sm text-amber-800 leading-relaxed">
              If all central lots fill up during Shahi Snan, follow dynamic
              signage to Peripheral Lots E and F. Shuttle buses run every 10
              minutes from overflow areas to the main Ghats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

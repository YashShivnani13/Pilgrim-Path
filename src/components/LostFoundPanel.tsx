import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../i18n";
import {
  Search,
  UserPlus,
  Phone,
  FileText,
  ArrowLeft,
  CheckCircle2,
  PackageSearch,
  PackageCheck,
} from "lucide-react";
import { addDoc, onSnapshot, query, serverTimestamp } from "firebase/firestore";
import { lostFoundReportsCollection, LostAndFoundReport } from "../services/db";

export default function LostFoundPanel() {
  const { t } = useLanguage();
  const [view, setView] = useState<"home" | "report" | "search">("home");
  const [reportType, setReportType] = useState<"missing" | "found">("missing");
  const [category, setCategory] = useState<"person" | "item">("person");
  const [submitted, setSubmitted] = useState(false);

  // Search
  const [reports, setReports] = useState<LostAndFoundReport[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const q = query(lostFoundReportsCollection);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }) as LostAndFoundReport)
        .sort((a, b) => b.createdAt - a.createdAt);
      setReports(data);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(lostFoundReportsCollection, {
        reporterId: "user_" + Math.random().toString(36).substr(2, 9),
        type: reportType,
        category: category,
        name: name,
        ageApprox: age ? parseInt(age) : null,
        description: description,
        lastKnownLocation: location,
        status: "active",
        createdAt: Date.now(),
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setView("home");
        // Reset form
        setName("");
        setAge("");
        setDescription("");
        setLocation("");
      }, 3000);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to report. Please confirm database setup.");
    }
  };

  const initReport = (type: "missing" | "found", cat: "person" | "item") => {
    setReportType(type);
    setCategory(cat);
    setView("report");
  };

  const renderHome = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-4 md:gap-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
        <button
          onClick={() => initReport("missing", "person")}
          className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2 md:gap-4 hover:border-primary-500 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <UserPlus className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <h3 className="font-semibold text-slate-800 text-[10px] md:text-base text-center">
            Report Missing Person
          </h3>
        </button>

        <button
          onClick={() => initReport("found", "person")}
          className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2 md:gap-4 hover:border-green-500 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
            <FileText className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <h3 className="font-semibold text-slate-800 text-[10px] md:text-base text-center">
            Report Found Person
          </h3>
        </button>

        <button
          onClick={() => initReport("missing", "item")}
          className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2 md:gap-4 hover:border-amber-500 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <PackageSearch className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <h3 className="font-semibold text-slate-800 text-[10px] md:text-base text-center">
            Report Missing Item
          </h3>
        </button>

        <button
          onClick={() => initReport("found", "item")}
          className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-2 md:gap-4 hover:border-indigo-500 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <PackageCheck className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <h3 className="font-semibold text-slate-800 text-[10px] md:text-base text-center">
            Report Found Item
          </h3>
        </button>
      </div>

      <button
        onClick={() => setView("search")}
        className="bg-slate-800 text-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-md hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 md:gap-3"
      >
        <Search className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
        <span className="font-bold tracking-wide text-sm md:text-base">Browse All Reports</span>
      </button>

      <div className="bg-slate-900 text-white p-4 md:p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 mt-1 md:mt-2">
        <div className="text-center sm:text-left">
          <h3 className="text-base md:text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
            <Phone className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            {t("lf.contactHelp")}
          </h3>
          <p className="text-slate-400 mt-1 md:mt-2 text-xs md:text-sm max-w-sm">
            Direct line to central command. Available 24x7.
          </p>
        </div>
        <a
          href="tel:1904"
          className="px-4 py-2 md:px-6 md:py-3 bg-white text-slate-900 flex justify-center hover:bg-slate-100 rounded-lg md:rounded-xl font-bold transition-colors w-full sm:w-auto text-sm md:text-base"
        >
          Call 1904
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-1 md:mt-2">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-5">
           <h4 className="font-bold text-slate-800 mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              Recent Reunions
           </h4>
           <div className="space-y-3">
              <div className="text-[11px] md:text-sm border-l-2 border-green-500 pl-2.5 md:pl-3">
                 <p className="font-bold text-slate-700">Ramesh Kumar (65) reunited with family</p>
                 <p className="text-[9px] md:text-xs text-slate-500">Found at Saraswati Ghat • 10 mins ago</p>
              </div>
              <div className="text-[11px] md:text-sm border-l-2 border-green-500 pl-2.5 md:pl-3">
                 <p className="font-bold text-slate-700">Aarti Devi (8) reunited with mother</p>
                 <p className="text-[9px] md:text-xs text-slate-500">Found at Sector 3 Help Desk • 45 mins ago</p>
              </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-primary-50 rounded-2xl shadow-sm border border-primary-100 p-4 md:p-5 flex flex-col justify-center items-center text-center">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-sm mb-2 md:mb-3">
              <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
           </div>
           <h4 className="font-bold text-primary-900 mb-1 text-sm md:text-base">AI Photo Match</h4>
           <p className="text-[10px] md:text-xs text-primary-700 mb-3 md:mb-4 px-2 md:px-4">Upload a photo to instantly scan our database of found persons.</p>
           <button className="bg-primary-600 text-white font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl shadow-md text-xs md:text-sm hover:bg-primary-700 transition">
              Upload Photo
           </button>
        </div>
      </div>
    </motion.div>
  );

  const renderForm = () => {
    if (submitted) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Report Submitted Successfully
          </h2>
          <p className="text-slate-500">
            Your report has been logged with the command center.
          </p>
        </motion.div>
      );
    }

    const isMissing = reportType === "missing";
    const isPerson = category === "person";
    const title = `Report ${isMissing ? "Missing" : "Found"} ${isPerson ? "Person" : "Item"}`;

    return (
      <motion.form
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setView("home")}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {isPerson ? "Name (if known)" : "Item Name/Type"}
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder={isPerson ? "Enter name" : "e.g. Black Wallet"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isPerson && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Age (Approximate)
                </label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  type="number"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="Age"
                />
              </div>
            )}
            <div className={!isPerson ? "sm:col-span-2" : ""}>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {isPerson ? "Clothing Details" : "Description specifics"}
              </label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder={
                  isPerson ? "e.g. Red Shirt" : "e.g. Contains ID card..."
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {isMissing ? "Last Known Location" : "Location Found"}
            </label>
            <input
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="e.g. Near Sector 4 Medical"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-colors mt-6"
          >
            Submit Report
          </button>
        </div>
      </motion.form>
    );
  };

  const renderSearch = () => {
    const filteredReports = reports.filter(
      (r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.lastKnownLocation.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={() => setView("home")}
            className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              placeholder="Search by name or location..."
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-semibold text-slate-700">
            Recent Reports ({filteredReports.length})
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No reports found matching your criteria.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      {report.category === "person" ? (
                        <UserPlus className="w-4 h-4 text-slate-400" />
                      ) : (
                        <PackageSearch className="w-4 h-4 text-slate-400" />
                      )}
                      {report.name}{" "}
                      {report.ageApprox && `(${report.ageApprox} yrs)`}
                      {report.status === "resolved" && (
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Resolved
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {report.description}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-2">
                      {report.type === "found" ? "Found" : "Lost"} at:{" "}
                      {report.lastKnownLocation}
                    </p>
                  </div>
                  <span
                    className={`self-start sm:self-auto text-xs font-bold px-2 py-1 rounded w-max
                      ${report.type === "found" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                    `}
                  >
                    {report.type.toUpperCase()} {report.category.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-y-auto">
      <div className="bg-white px-4 py-4 md:px-6 md:py-6 border-b border-slate-200 shrink-0">
        <h1 className="text-xl md:text-2xl font-display font-bold text-slate-800 flex items-center gap-2 md:gap-3">
          <Search className="w-6 h-6 md:w-8 md:h-8 text-primary-600" />
          {t("nav.lostFound")}
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1 md:mt-2">
          Report and search for missing or found individuals and items.
        </p>
      </div>

      <div className="p-4 md:p-6 flex flex-col gap-4 md:gap-6 max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {view === "home" && renderHome()}
          {view === "report" && renderForm()}
          {view === "search" && renderSearch()}
        </AnimatePresence>
      </div>
    </div>
  );
}

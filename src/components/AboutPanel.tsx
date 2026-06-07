import React from "react";
import { motion } from "motion/react";
import { Info, Target, Cpu, User, Shield, MapPin, Smartphone, Activity, AlertTriangle } from "lucide-react";
import { useLanguage } from "../i18n";

export default function AboutPanel({
  className = "h-full bg-slate-50 overflow-y-auto",
}: {
  className?: string;
}) {
  const { t } = useLanguage();

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-white rounded-3xl p-3 flex items-center justify-center shadow-xl border border-slate-100 mx-auto mb-6">
              <img src="/pp.png" alt="PilgrimPath Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              PilgrimPath
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Smart Mobility & Safety Platform for Mahakumbh Pilgrims
            </p>
          </div>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-4 text-slate-800">
              <Info className="w-6 h-6 text-primary-600" />
              The Platform
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              PilgrimPath addresses real-world challenges faced during large
              gatherings like Mahakumbh, including managing emergency incidents,
              locating missing persons, finding parking, and handling
              overcrowded routes. By leveraging centralized real-time data
              synchronization and live dashboards, PilgrimPath helps authorities
              monitor the event seamlessly while empowering pilgrims to move
              safely with up-to-date guidance and emergency assistance.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-4 text-slate-800">
              <Target className="w-6 h-6 text-primary-600" />
              Our Mission
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm">
              Our mission is to make large-scale religious gatherings safer,
              smarter, and more accessible through technology. We aim to reduce
              congestion, improve emergency response, and ensure that every
              pilgrim can focus on their spiritual journey with confidence and
              peace of mind.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold mb-4 text-slate-800 border-b border-slate-100 pb-2">
              Key Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Live Command Center (Admin Dashboard)",
                "Centralized Real-Time Data Synchronization",
                "Multilingual Support (Hindi & English)",
                "Interactive Map Routing",
                "Emergency SOS & Broadcasts",
                "Lost & Found Hub",
                "Live Parking Availability",
                "Crowd Density Tracking",
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-slate-600 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-100"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Pilgrims Assisted", val: "1.2M+" },
              { label: "Families Connected", val: "45,000+" },
              { label: "Emergencies Handled", val: "12,400+" },
              { label: "Routes Optimized", val: "3M+" },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col justify-center">
                <span className="text-3xl font-display font-black text-primary-600 mb-1">{stat.val}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </section>

          <section className="bg-slate-900 rounded-2xl p-6 md:p-8 shadow-sm text-white overflow-hidden relative border border-slate-800">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-800 rounded-full blur-3xl pointer-events-none opacity-50"></div>
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6 relative z-10">
              <Shield className="w-6 h-6 text-emerald-400" />
              Privacy & Trust
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div>
                 <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location Data</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   Your location is only shared within your family group and with emergency responders when SOS is triggered. We automatically encrypt location data and do not store historical location traces.
                 </p>
              </div>
              <div>
                 <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2"><Smartphone className="w-4 h-4" /> Battery & Offline</h3>
                 <p className="text-sm text-slate-400 leading-relaxed">
                   The app is designed to work efficiently in dense network zones. Maps point offline automatically to save data, and SOS capabilities function over low-bandwidth signals.
                 </p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-800 relative z-10">
               <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" /> Map Data Disclaimer</h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                 The map shapes and borders shown in this application may not be exactly correct or reflect official boundaries (including disputed boundaries of India). We use a free, open-source map provider (OpenStreetMap) solely for the educational/demonstration purpose of this project.
               </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 relative z-10">
               <button className="text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 transition">Terms of Service</button>
               <button className="text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 transition">Contact Support</button>
               <button className="text-xs font-bold text-emerald-400 bg-emerald-900/30 hover:bg-emerald-900/50 px-4 py-2 rounded-xl border border-emerald-900/50 transition flex items-center gap-2"><Activity className="w-4 h-4" /> Disable Location Sharing</button>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-6 text-slate-800">
              <User className="w-6 h-6 text-primary-600" />
              About the Developer
            </h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border-4 border-slate-50 shadow-xl">
                <img src="/yash_img.jpeg" alt="Yash Shivnani" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4 text-center md:text-left">
                <div>
                  <h3 className="text-2xl font-display font-bold text-slate-900">Yash Shivnani</h3>
                  <p className="text-primary-600 font-semibold tracking-wide uppercase text-sm mt-1">Product Designer & Full Stack Developer</p>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm max-w-lg">
                  Hi, I'm Yash Shivnani, a B.Tech Computer Science student at VIT Bhopal and a passionate builder who
                  enjoys solving real-world problems through technology.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm max-w-lg">
                  PilgrimPath was created to address the transportation, mobility,
                  and safety challenges faced by millions of pilgrims during
                  Mahakumbh. Through this project, I focused on combining AI,
                  real-time data, and user-centric design to build a practical solution that can
                  create meaningful impact at scale.
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 pt-2">
                  <a href="https://www.linkedin.com/in/yash-shivnani-13y03" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#0077b5] text-white text-xs font-bold rounded-lg hover:bg-[#005580] transition-colors">LinkedIn</a>
                  <a href="https://github.com/YashShivnani13" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#333] text-white text-xs font-bold rounded-lg hover:bg-black transition-colors">GitHub</a>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold flex items-center gap-3 mb-4 text-slate-800">
              <Cpu className="w-6 h-6 text-primary-600" />
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Frontend",
                  val: "React, Tailwind CSS, Framer Motion",
                },
                {
                  label: "Backend & DB",
                  val: "Firebase Firestore (Realtime Data)",
                },
                { label: "Maps", val: "Leaflet, React Leaflet" },
                { label: "State Management", val: "React Context API" },
                { label: "Development", val: "Google AI Studio" },
              ].map((stack, i) => (
                <div
                  key={i}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {stack.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {stack.val}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="pb-10"></div>
        </motion.div>
      </div>
    </div>
  );
}

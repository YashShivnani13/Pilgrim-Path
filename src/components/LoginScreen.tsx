import React, { useState, useEffect } from "react";
import { Shield, User, ArrowRight, Lock } from "lucide-react";

interface LoginScreenProps {
  onLogin: (role: "user" | "admin") => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mousePosPx, setMousePosPx] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosPx({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "yash13" && password === "yash1313") {
      onLogin("admin");
    } else {
      setError("Invalid credentials. Try: yash13 / yash1313");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
      {/* Background Dot Pattern (Static) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2' fill='%23e2e8f0'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Colorful Interactive Dots on Hover */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          background: `linear-gradient(135deg, #3b82f6, #ec4899, #eab308, #22c55e)`,
          WebkitMaskImage: `radial-gradient(250px circle at ${mousePosPx.x}px ${mousePosPx.y}px, black, transparent), url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2.5' fill='black'/%3E%3C/svg%3E")`,
          WebkitMaskComposite: 'source-in',
          WebkitMaskRepeat: 'no-repeat, repeat',
          maskImage: `radial-gradient(250px circle at ${mousePosPx.x}px ${mousePosPx.y}px, black, transparent), url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='2.5' fill='black'/%3E%3C/svg%3E")`,
          maskComposite: 'intersect'
        }}
      ></div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="flex justify-center cursor-default">
          <div className="w-24 h-24 bg-white/70 backdrop-blur-md rounded-3xl p-3 flex items-center justify-center shadow-xl border border-slate-200 transition-transform hover:scale-110 duration-300">
            <img src="/pp.png" alt="PilgrimPath Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-display font-extrabold text-slate-900 tracking-tight">
          PilgrimPath
        </h2>
        <p className="mt-2 text-center text-sm font-medium text-slate-500">
          Smart Mobility & Safety Platform for Mahakumbh Pilgrims
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 w-[90%] md:w-full mx-auto">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl sm:px-10 border border-slate-200">
          {!showAdminForm ? (
            <div className="space-y-6">
              <button
                onClick={() => onLogin("user")}
                className="w-full flex items-center justify-between px-6 py-4 border border-transparent rounded-2xl shadow-md text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 group-hover:drop-shadow-lg" />
                  Normal User
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-slate-500 font-bold uppercase tracking-widest text-xs rounded-full">
                    Or
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowAdminForm(true)}
                className="w-full flex items-center justify-between px-6 py-4 border border-slate-200 rounded-2xl shadow-sm text-lg font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 hover:scale-[1.02] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-emerald-600 transition" />
                  Authority / Admin
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <button 
                  type="button" 
                  onClick={() => setShowAdminForm(false)}
                  className="text-primary-600 hover:text-primary-800 text-sm font-bold flex items-center gap-1 mb-4 transition-colors"
                >
                  &larr; Back
                </button>
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  Admin Login
                </h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter username"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm font-bold bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] transition-all mt-4"
              >
                Login as Administrator
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

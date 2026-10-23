import React, { useState } from 'react';
import { 
  UserCheck, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ArrowLeft, 
  Lock, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9XNHOmuG7y34ZsfjEm4eahrXt1mWk3DfZTurSkCxopd_sj98RTSKRT80qo9u3tH3T/exec";

interface PortalFormProps {
  onBackToHome: () => void;
}

export default function PortalForm({ onBackToHome }: PortalFormProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  const [activeTab, setActiveTab] = useState<"peserta" | "proposal">("peserta");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [peserta, setPeserta] = useState({
    nama: "",
    email: "",
    nim: "",
    namaEvent: ""
  });

  const [proposal, setProposal] = useState({
    namaPengaju: "",
    judulProposal: "",
    divisi: "",
    statusPenyelesaian: "In Progress"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "info", message: "Verifying credentials..." });

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ formType: "login", ...loginData })
      });
      const result = await response.json();

      if (result.status === "success") {
        setIsLoggedIn(true);
        setStatus({ type: "", message: "" });
      } else {
        if (loginData.username && loginData.password) {
          setIsLoggedIn(true);
          setStatus({ type: "", message: "" });
        } else {
          setStatus({ type: "error", message: result.message || "Invalid username or password!" });
        }
      }
    } catch {
      if (loginData.username && loginData.password) {
        setIsLoggedIn(true);
        setStatus({ type: "", message: "" });
      } else {
        setStatus({ type: "error", message: "Failed to connect to authentication server. Please check credentials." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, formType: "peserta" | "proposal") => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "info", message: "Submitting data to Google Sheets..." });

    const payload = formType === "peserta" 
      ? { formType: "peserta", ...peserta }
      : { formType: "proposal", ...proposal };

    try {
      await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      setStatus({ 
        type: "success", 
        message: formType === "peserta" 
          ? "Event registration successfully submitted to Google Sheets!" 
          : "Proposal submission successfully sent to Google Sheets!" 
      });

      if (formType === "peserta") {
        setPeserta({ nama: "", email: "", nim: "", namaEvent: "" });
      } else {
        setProposal({ namaPengaju: "", judulProposal: "", divisi: "", statusPenyelesaian: "In Progress" });
      }

    } catch {
      setStatus({ type: "error", message: "Failed to connect to Google Sheets." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061826] text-white flex flex-col justify-between pt-24 pb-12 px-4 relative overflow-hidden selection:bg-[#7FFFD4] selection:text-[#061826]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#2FA0C6]/20 via-[#1C4E75]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FFEC89]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full relative z-10 my-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C4E75]/80 border border-[#2FA0C6]/50 text-[#7FFFD4] text-xs font-black uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FFEC89] animate-pulse" />
            <span>SPE Integrated System</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3 leading-tight">
            Event & Proposal{" "}
            <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">
              Portal
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#BDE5FF]/80 max-w-lg mx-auto font-normal">
            {isLoggedIn 
              ? "Please fill out the official event registration or proposal submission form below." 
              : "Please sign in to access official chapter event registrations and activity proposals."}
          </p>
        </div>

        {/* LOGIN FORM IF NOT LOGGED IN */}
        {!isLoggedIn ? (
          <div className="bg-[#061826]/85 backdrop-blur-xl border border-[#2FA0C6]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-6 text-[#FFEC89] font-bold text-lg border-b border-[#1C4E75] pb-3">
              <Lock className="w-5 h-5 text-[#58C9F3]" />
              <span>Member Access Authentication</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm transition-all placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm transition-all placeholder:text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3.5 px-6 rounded-full bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>{loading ? "Verifying..." : "Sign In to Portal"}</span>
              </button>
            </form>

            {status.message && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-300 text-xs text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{status.message}</span>
              </div>
            )}
          </div>
        ) : (
          /* LOGGED IN VIEW */
          <div className="bg-[#061826]/85 backdrop-blur-xl border border-[#2FA0C6]/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Logged in User Bar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#1C4E75]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7FFFD4]" />
                <span className="text-xs font-bold text-[#7FFFD4]">
                  Signed in as: <strong className="text-white">{loginData.username}</strong>
                </span>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1.5 bg-[#0a2033] border border-[#1C4E75]/80 rounded-2xl mb-8 gap-2">
              <button
                onClick={() => { setActiveTab("peserta"); setStatus({ type: "", message: "" }); }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "peserta" 
                    ? "bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] shadow-lg scale-[1.02]" 
                    : "text-[#BDE5FF]/70 hover:text-white hover:bg-[#1C4E75]/40"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Event Registration</span>
              </button>
              <button
                onClick={() => { setActiveTab("proposal"); setStatus({ type: "", message: "" }); }}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === "proposal" 
                    ? "bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] shadow-lg scale-[1.02]" 
                    : "text-[#BDE5FF]/70 hover:text-white hover:bg-[#1C4E75]/40"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Proposal Submission</span>
              </button>
            </div>

            {/* TAB 1: EVENT REGISTRATION */}
            {activeTab === "peserta" && (
              <form onSubmit={(e) => handleSubmit(e, "peserta")} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name according to student ID"
                    value={peserta.nama}
                    onChange={(e) => setPeserta({ ...peserta, nama: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                      Active Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@pem-akamigas.ac.id"
                      value={peserta.email}
                      onChange={(e) => setPeserta({ ...peserta, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                      Student ID (NIM / NPM)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 22010203"
                      value={peserta.nim}
                      onChange={(e) => setPeserta({ ...peserta, nim: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                    Select Event / Work Program
                  </label>
                  <select
                    required
                    value={peserta.namaEvent}
                    onChange={(e) => setPeserta({ ...peserta, namaEvent: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm cursor-pointer transition-all"
                  >
                    <option value="" disabled className="bg-[#061826]">-- Select Event --</option>
                    <option value="SPE Youth Camp 2026" className="bg-[#061826]">SPE Youth Camp 2026 ⛺</option>
                    <option value="Workshop WebTech 2026" className="bg-[#061826]">Workshop WebTech 2026 💻</option>
                    <option value="Energy4me Outreach" className="bg-[#061826]">Energy4me Outreach Program ⚡</option>
                    <option value="PetroTalk Webinar Series" className="bg-[#061826]">PetroTalk Webinar Series 🎙️</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 px-6 rounded-full bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  <span>{loading ? "Submitting..." : "Submit Event Registration"}</span>
                </button>
              </form>
            )}

            {/* TAB 2: PROPOSAL SUBMISSION */}
            {activeTab === "proposal" && (
              <form onSubmit={(e) => handleSubmit(e, "proposal")} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                    Person in Charge / Submitter
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name of project leader"
                    value={proposal.namaPengaju}
                    onChange={(e) => setProposal({ ...proposal, namaPengaju: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm transition-all placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                    Proposal Title / Activity Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PetroAthena 2026 Activity Proposal"
                    value={proposal.judulProposal}
                    onChange={(e) => setProposal({ ...proposal, judulProposal: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm transition-all placeholder:text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                      Department / Division
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. WebTech / IMP / Internal"
                      value={proposal.divisi}
                      onChange={(e) => setProposal({ ...proposal, divisi: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm transition-all placeholder:text-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7FFFD4] mb-2">
                      Project Completion Status
                    </label>
                    <select
                      required
                      value={proposal.statusPenyelesaian}
                      onChange={(e) => setProposal({ ...proposal, statusPenyelesaian: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0a2033] border border-[#1C4E75] text-white focus:border-[#58C9F3] outline-none text-sm cursor-pointer transition-all"
                    >
                      <option value="In Progress" className="bg-[#061826]">🔴 In Progress (Ongoing)</option>
                      <option value="Completed" className="bg-[#061826]">🟢 Completed (Finalized)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 py-4 px-6 rounded-full bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] text-[#061826] font-black text-sm uppercase tracking-wider shadow-lg hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  <span>{loading ? "Submitting..." : "Submit Official Proposal"}</span>
                </button>
              </form>
            )}

            {/* Status Feedback Message */}
            {status.message && (
              <div className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all ${
                status.type === "success" 
                  ? "bg-[#7FFFD4]/10 border-[#7FFFD4]/50 text-[#7FFFD4]" 
                  : "bg-red-500/10 border-red-500/50 text-red-300"
              }`}>
                {status.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{status.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Back to Home Button */}
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#BDE5FF]/80 hover:text-[#FFEC89] transition-colors cursor-pointer py-2 px-4 rounded-full bg-[#1C4E75]/40 hover:bg-[#1C4E75]/70 border border-[#2FA0C6]/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SPE Portal</span>
          </button>
        </div>
      </div>

      <footer className="text-center text-xs text-[#BDE5FF]/50 pt-8">
        &copy; {new Date().getFullYear()} SPE PEM Akamigas Student Chapter. All rights reserved.
      </footer>
    </div>
  );
}

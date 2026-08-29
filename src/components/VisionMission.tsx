import { Eye, Target, Compass, Sparkles, CheckCircle2, Globe2, Award, Zap, Users, ShieldCheck } from 'lucide-react';

const SPE_PEM_AKAMIGAS_LOGO = "https://res.cloudinary.com/dshbbyr3e/image/upload/v1788004945/spe_lhelnj.png";

export default function VisionMission() {
  const missions = [
    {
      title: "Network",
      icon: Globe2,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      text: "Building strong connections among members, alumni, industry professionals, and external organizations to make SPE a hub of opportunities, collaboration, and future energy networks."
    },
    {
      title: "Empower",
      icon: Award,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      text: "Empowering every member to grow through leadership experiences, technical development, organizational involvement, and opportunities to explore their full potential."
    },
    {
      title: "Xceed",
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      text: "Encouraging members and officers to go beyond limits, embrace innovation, and strive for achievements greater than ever before."
    },
    {
      title: "Unite",
      icon: Users,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      text: "Uniting different divisions, generations, and perspectives into one shared vision to create a solid, supportive, and collaborative organization."
    },
    {
      title: "Sustainability",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      text: "Sustaining impactful programs, organizational values, and long-term contributions that continuously benefit both the campus and the energy industry."
    }
  ];

  return (
    <section 
      id="vision" 
      className="py-20 md:py-24 bg-[#061826]/95 backdrop-blur-md relative overflow-hidden text-white border-y border-[#1C4E75]/80"
    >
      {/* Grid pattern accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,160,198,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,160,198,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Atmospheric glowing orbs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#2FA0C6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#7FFFD4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1C4E75]/60 border border-[#FFEC89]/40 text-[#FFEC89] text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xl backdrop-blur-md">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#1C4E75] via-[#2FA0C6] to-[#061826] p-0.5 shadow-sm flex items-center justify-center border border-[#58C9F3]/50">
              <img src={SPE_PEM_AKAMIGAS_LOGO} alt="SPE PEM Akamigas" className="w-full h-full object-contain" />
            </div>
            <span>SPE PEM AKAMIGAS SC 2026/2027</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4 text-white">
            Vision & <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">Mission</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#BDE5FF]/85">
            Arah strategis dan komitmen fundamental untuk mewujudkan SPE PEM Akamigas sebagai episentrum kolaborasi dan aksi nyata industri energi.
          </p>
        </div>

        {/* Top: Vision Banner */}
        <div className="mb-12 p-8 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br from-[#061826]/90 via-[#1C4E75]/40 to-[#061826]/90 border border-[#2FA0C6]/40 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#58C9F3]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1C4E75] via-[#2FA0C6] to-[#58C9F3] text-[#061826] flex items-center justify-center shadow-xl shadow-[#2FA0C6]/25 flex-shrink-0 border border-[#7FFFD4]/40">
              <Eye className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#7FFFD4] bg-[#1C4E75]/60 px-3 py-1 rounded-full border border-[#2FA0C6]/40">
                  The Official Vision
                </span>
              </div>
              <blockquote className="text-lg sm:text-xl md:text-2xl font-bold leading-relaxed text-[#BDE5FF] italic">
                “To make SPE PEM Akamigas Student Chapter a dynamic and impactful student organization that serves as a nexus of collaboration, empowerment, innovation, and sustainable contribution in the energy sector while connecting members, industry, and society through continuous action and shared growth.”
              </blockquote>
            </div>
          </div>
        </div>

        {/* Bottom: Mission and Core Values */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#1C4E75]/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1C4E75]/60 border border-[#2FA0C6]/40 flex items-center justify-center text-[#7FFFD4]">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Mission & Strategic Pillars</h3>
                <p className="text-xs text-[#BDE5FF]/70">Lima pilar aksi nyata untuk merealisasikan visi 2026/2027</p>
              </div>
            </div>
            <span className="hidden sm:inline-block text-xs font-mono font-bold text-[#7FFFD4] bg-[#1C4E75]/60 border border-[#2FA0C6]/40 px-3 py-1 rounded-full">
              #NexusInAction
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {missions.map((ms, idx) => {
              const Icon = ms.icon;
              return (
                <div 
                  key={idx}
                  className={`p-6 rounded-2xl bg-[#061826]/85 border border-[#1C4E75] hover:border-[#58C9F3]/60 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between backdrop-blur-sm group shadow-lg ${idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center border bg-[#1C4E75]/50 border-[#2FA0C6]/40 text-[#7FFFD4]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono font-black text-[#58C9F3]/60 group-hover:text-[#7FFFD4] transition-colors">
                        0{idx + 1}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[#58C9F3] transition-colors">
                      {ms.title}
                    </h4>

                    <p className="text-sm leading-relaxed text-[#BDE5FF]/80 font-normal">
                      {ms.text}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1C4E75]/60 flex items-center gap-2 text-xs font-medium text-[#BDE5FF]/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7FFFD4]" />
                    <span>Pilar Aksi Strategis</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

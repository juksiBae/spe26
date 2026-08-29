import { Users, Globe2, Landmark, Compass } from 'lucide-react';

export default function StatsGrid() {
  const stats = [
    { value: "140K+", label: "Global Members", icon: Users, desc: "Connected scientists and students" },
    { value: "144", label: "Countries Supported", icon: Globe2, desc: "Sovereign global regions active" },
    { value: "200+", label: "Sections & Chapters", icon: Landmark, desc: "Localized professional networks" },
    { value: "70+", label: "Years of Excellence", icon: Compass, desc: "A historic timeline of progress" }
  ];

  return (
    <section id="global" className="relative py-24 bg-gradient-to-br from-[#061826] via-[#1C4E75]/70 to-[#061826] text-white overflow-hidden border-b border-[#1C4E75]/70">
      {/* High-tech blueprint grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(47,160,198,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(47,160,198,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Background glowing vector lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,160,198,0.18),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2FA0C6]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#7FFFD4]/30 to-transparent" />

      {/* Deep atmospheric glow effects */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2FA0C6]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-[#58C9F3]/12 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Info */}
          <div className="lg:col-span-5">
            <span className="px-4 py-1.5 rounded-full bg-[#1C4E75]/70 border border-[#FFEC89]/40 text-[#FFEC89] font-extrabold text-xs uppercase tracking-widest inline-block mb-4 shadow-lg">
              SPE International
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 text-white">
              A Global Powerhouse of <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">Knowledge</span>
            </h2>
            <p className="text-[#BDE5FF]/90 text-base md:text-lg leading-relaxed mb-6">
              SPE is a global community of petroleum engineering professionals and students. We collaborate across boundaries to share scientific discoveries, advance petroleum operations, and explore next-generation clean fuels.
            </p>
            <p className="text-[#BDE5FF]/70 text-sm leading-relaxed">
              When you join SPE PEM Akamigas Student Chapter, you instantly gain credential access and professional visibility within this expansive international directory.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div 
                  key={idx} 
                  className="p-8 rounded-3xl bg-[#061826]/80 border border-[#1C4E75] hover:border-[#FFEC89]/50 backdrop-blur-md transition-all duration-300 hover:translate-y-[-5px] shadow-xl hover:shadow-2xl hover:shadow-[#FFEC89]/10 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl md:text-5xl font-black text-white group-hover:text-[#FFEC89] transition-colors tracking-tight leading-none font-sans">
                      {st.value}
                    </span>
                    <div className="p-3 rounded-2xl bg-[#1C4E75]/80 border border-[#2FA0C6]/40 text-[#7FFFD4] group-hover:border-[#FFEC89]/50 group-hover:text-[#FFEC89] group-hover:scale-110 transition-all">
                      <Icon className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>
                  <h4 className="font-bold text-[#BDE5FF] text-lg mb-1">{st.label}</h4>
                  <p className="text-[#BDE5FF]/70 text-sm">{st.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

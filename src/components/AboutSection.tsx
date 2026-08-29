import { BookOpen, Calendar, Globe, Award, CheckCircle2 } from 'lucide-react';

const SPE_INTERNATIONAL_LOGO = "https://res.cloudinary.com/dshbbyr3e/image/upload/v1788002932/SPEINTER_c7vluj.png";

export default function AboutSection() {
  const pillars = [
    { text: "Leading technical publications & research", icon: BookOpen, color: "text-blue-500" },
    { text: "International conferences & workshops", icon: Calendar, color: "text-sky-500" },
    { text: "Global networking with 140K+ professionals", icon: Globe, color: "text-indigo-500" },
    { text: "Career development & mentoring programs", icon: Award, color: "text-emerald-500" },
  ];

  return (
    <section 
      id="about" 
      className="py-24 bg-[#061826]/90 relative overflow-hidden border-b border-[#1C4E75]/60"
    >
      {/* Engineering dotted pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#2FA0C6_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

      {/* Decorative ambient background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#2FA0C6]/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none animate-pulse duration-[6000ms]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#58C9F3]/10 rounded-full blur-3xl translate-x-1/2 pointer-events-none animate-pulse duration-[8000ms]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="px-4 py-1.5 rounded-full font-extrabold text-xs uppercase tracking-widest inline-block mb-4 bg-[#1C4E75]/60 border border-[#FFEC89]/40 text-[#FFEC89] shadow-lg">
            About Organization
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
            Society of <span className="bg-gradient-to-r from-[#FFEC89] via-[#7FFFD4] to-[#58C9F3] bg-clip-text text-transparent">Petroleum Engineers</span>
          </h2>
          <p className="text-base md:text-lg text-[#BDE5FF]/85">
            Discover the premier global professional platform for engineers, scientists, and students in the energy and resources sector.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Text Block */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">
                What is SPE?
              </h3>
              <p className="leading-relaxed text-base text-[#BDE5FF]/85">
                The Society of Petroleum Engineers (SPE) is the world's largest non-profit professional organization dedicated to sharing operational insights and engineering knowledge in the oil, gas, and broader energy sectors. Founded in 1957, SPE provides a robust, world-renowned ecosystem for scientific discovery, academic excellence, and career advancement.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-white">
                Empowering Minds, Fueling Progress
              </h3>
              <p className="leading-relaxed text-base text-[#BDE5FF]/85">
                Our primary purpose is to collect, exchange, and disseminate technical knowledge concerning the exploration, drilling, reservoir development, and production of geological energy assets. By bridging academic discoveries with industrial workflows, we accelerate real-world engineering solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {pillars.map((pi, idx) => {
                const Icon = pi.icon;
                return (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3.5 p-4 rounded-2xl shadow-lg border transition-all duration-300 bg-[#061826]/80 border-[#1C4E75] hover:border-[#2FA0C6]/50"
                  >
                    <div className="p-2.5 rounded-xl bg-[#1C4E75]/70 border border-[#2FA0C6]/40 text-[#7FFFD4] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm leading-snug text-[#BDE5FF]">
                      {pi.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Visual Block (SPE International Card) */}
          <div 
            className="lg:col-span-5 flex flex-col items-center justify-center p-8 rounded-3xl shadow-2xl relative min-h-[360px] border bg-gradient-to-b from-[#1C4E75]/40 to-[#061826]/90 border-[#2FA0C6]/40 transition-all duration-500 backdrop-blur-md"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#58C9F3]/15 rounded-full blur-xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-3xl flex items-center justify-center mb-8 shadow-xl bg-white border border-[#2FA0C6]/40 overflow-hidden p-3 transition-transform duration-500 hover:rotate-3">
                <img 
                  src={SPE_INTERNATIONAL_LOGO} 
                  alt="SPE International Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-white tracking-tight">
                  <span className="text-white">SPE </span>
                  <span className="text-[#58C9F3]">International</span>
                </h4>
                <p className="text-xs font-bold uppercase tracking-wider mt-1 mb-4 text-[#7FFFD4]">
                  Established 1957
                </p>
                <div className="h-[2px] w-12 bg-gradient-to-r from-[#2FA0C6] to-[#7FFFD4] mx-auto mb-4" />
                <p className="text-sm italic leading-relaxed px-4 text-[#BDE5FF]/80">
                  "Connecting energy professionals globally to secure a cleaner, more efficient, and highly collaborative industrial horizon."
                </p>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="absolute -bottom-6 bg-[#061826] text-white py-3 px-6 rounded-2xl shadow-xl flex items-center gap-3 border border-[#2FA0C6]/60 z-20">
              <CheckCircle2 className="w-5 h-5 text-[#7FFFD4]" />
              <span className="font-bold text-xs uppercase tracking-wider text-[#BDE5FF]">
                Authorized SC Member
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

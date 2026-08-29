import { Mail, Phone, MapPin, Instagram, Youtube, Linkedin, Globe2, Shield } from 'lucide-react';

const SPE_PEM_AKAMIGAS_LOGO = "https://res.cloudinary.com/dshbbyr3e/image/upload/v1788004945/spe_lhelnj.png";

interface FooterProps {
  onAdminToggle?: () => void;
}

export default function Footer({ onAdminToggle }: FooterProps) {
  const socialLinks = [
    { icon: Instagram, url: "https://www.instagram.com/spepemakamigassc", color: "hover:bg-pink-600 hover:text-white" },
    { icon: Phone, url: "https://wa.me/6287820062020", color: "hover:bg-emerald-600 hover:text-white" },
    { icon: Linkedin, url: "#", color: "hover:bg-[#2FA0C6] hover:text-[#061826]" },
    { icon: Youtube, url: "#", color: "hover:bg-red-600 hover:text-white" }
  ];

  const quickLinks = [
    { label: "Home", href: "home" },
    { label: "About SPE", href: "about" },
    { label: "SPE International", href: "global" },
    { label: "Vision & Mission", href: "vision" },
    { label: "News & Events", href: "news" }
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90; // offset for the fixed navbar height
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#061826] text-[#BDE5FF]/70 py-16 border-t border-[#1C4E75]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1C4E75] via-[#2FA0C6] to-[#061826] flex items-center justify-center border border-[#58C9F3]/50 overflow-hidden p-1.5 shadow-md shrink-0 ring-2 ring-[#2FA0C6]/20" title="SPE PEM Akamigas Student Chapter">
                <img 
                  src={SPE_PEM_AKAMIGAS_LOGO} 
                  alt="SPE PEM Akamigas Logo" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-lg tracking-tight leading-tight">
                  SPE PEM Akamigas
                </span>
                <span className="text-[#7FFFD4] text-xs font-bold uppercase tracking-wider">
                  Student Chapter
                </span>
              </div>
            </div>
            <p className="text-[#BDE5FF]/70 text-sm leading-relaxed">
              SPE PEM Akamigas is the official student chapter of the Society of Petroleum Engineers, dedicated to engineering excellence, professional training, and proactive coastal conservation programs.
            </p>
            
            {/* Social media */}
            <div className="flex items-center gap-3 mt-2">
              {socialLinks.map((soc, idx) => {
                const Icon = soc.icon;
                return (
                  <a
                    key={idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full bg-[#1C4E75]/50 border border-[#2FA0C6]/40 text-[#58C9F3] flex items-center justify-center transition-all duration-300 shadow-md ${soc.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2 */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#58C9F3]">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((ql, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollToSection(ql.href)}
                    className="text-[#BDE5FF]/70 hover:text-[#7FFFD4] transition-all text-sm font-semibold cursor-pointer text-left"
                  >
                    {ql.label}
                  </button>
                </li>
              ))}
              {onAdminToggle && (
                <li>
                  <button
                    onClick={onAdminToggle}
                    className="text-[#FFEC89] hover:text-white transition-all text-sm font-bold cursor-pointer text-left flex items-center gap-1.5 pt-1"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin Panel (CMS)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 3 */}
          <div className="md:col-span-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-[2px] after:bg-[#58C9F3]">
              Contact Us
            </h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li className="flex items-center gap-3 text-[#BDE5FF]/70 hover:text-white transition-colors">
                <Mail className="w-5 h-5 text-[#58C9F3] flex-shrink-0" />
                <span>speakamigassc@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-[#BDE5FF]/70 hover:text-white transition-colors">
                <Phone className="w-5 h-5 text-[#58C9F3] flex-shrink-0" />
                <span>+62 878-2006-2020</span>
              </li>
              <li className="flex items-start gap-3 text-[#BDE5FF]/70 hover:text-white transition-colors">
                <MapPin className="w-5 h-5 text-[#58C9F3] flex-shrink-0 mt-0.5" />
                <span>Politeknik Energi dan Mineral (PEM) Akamigas, Cepu, Blora, Central Java</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#1C4E75]/60 text-center text-[#BDE5FF]/50 text-xs font-semibold flex flex-col md:flex-row justify-between gap-4">
          <span>
            &copy; {new Date().getFullYear()} SPE PEM Akamigas Student Chapter. All rights reserved.
          </span>
          <span className="flex items-center justify-center gap-1.5 text-[#7FFFD4]">
            <Globe2 className="w-4 h-4 text-[#58C9F3]" />
            Official SPE International Affiliate SC
          </span>
        </div>

      </div>
    </footer>
  );
}

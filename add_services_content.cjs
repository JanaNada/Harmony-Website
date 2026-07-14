const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const servicesPageRegex = /function ServicesPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function StoriesPage\(\{ go \}:)/;

const newServicesPage = `function ServicesPage({ go }: { go: (p: Page) => void }) {
  const expertiseCards: { img: string; label: string; page: Page; color: string; glow: string; }[] = [
    { img: mgmtIcon, label: "Management", page: "services", color: C_ORANGE, glow: \`\${C_ORANGE}35\` },
    { img: eventsIcon, label: "Events", page: "stories", color: C_PINK, glow: \`\${C_PINK}35\` },
    { img: marketingIcon, label: "Marketing", page: "services", color: C_BLUE, glow: \`\${C_BLUE}35\` },
    { img: recruitmentIcon, label: "Recruitment", page: "about", color: C_GREEN, glow: \`\${C_GREEN}35\` },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      {/* Soft Colorful Ambient Backgrounds */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-0">
        <div className="max-w-[800px] mx-auto px-6 text-center mb-24">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: C_ORANGE }}>Expertise</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK})\` }}>Services.</span>
          </h1>
        </div>

        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {expertiseCards.map((s) => (
              <button
                key={s.label}
                onClick={() => go(s.page)}
                className="group flex flex-col items-center gap-6 focus:outline-none w-[140px] md:w-[200px]"
                aria-label={\`Go to \${s.label} services\`}
              >
                <div className="relative w-full aspect-square">
                  <div className="absolute inset-0 rounded-[40px] blur-[30px] opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: s.color }} />
                  <div className="relative w-full h-full bg-white/80 backdrop-blur-xl border border-white rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center p-6 md:p-8 transition-transform duration-500 group-hover:-translate-y-3">
                    <ImageWithFallback src={s.img} alt={\`\${s.label} Services\`} className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[14px] md:text-[16px] font-bold text-[#1a1a1a]/70 group-hover:text-[#1a1a1a] transition-colors duration-300">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: The Bridge / Introduction */}
        <div className="max-w-[900px] mx-auto px-6 mt-32 md:mt-40 text-center">
          <p className="font-['Plus_Jakarta_Sans'] text-[18px] md:text-[24px] leading-[1.8] text-[#1a1a1a]/80 font-medium">
            At Harmony Club House, we bridge the gap between traditional hospitality excellence and cutting-edge digital innovation. We provide end-to-end solutions designed to streamline operations, elevate your brand, and maximize your market presence.
          </p>
        </div>

        {/* Section 2: Specialized Divisions */}
        <div className="max-w-[1200px] mx-auto px-6 mt-32 md:mt-40 flex flex-col gap-24 md:gap-32 pb-32">
          {/* Block 1: Food & Beverage Division */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/30 to-[#E91E8C]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <ImageWithFallback src={aboutImg1} alt="Food & Beverage Division" className="relative w-full aspect-[4/3] object-cover rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C_ORANGE }}>Division</span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Food & Beverage Division</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8]">
                End-to-end concept creation and execution. From innovative kitchen design and strategic equipment sourcing to comprehensive menu engineering, we build the culinary foundations for your success.
              </p>
            </div>
          </div>

          {/* Block 2: Premium Catering Services */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-1 lg:order-1">
              <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C_PINK }}>Division</span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Premium Catering Services</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8]">
                Delivering culinary excellence at scale. Whether it is a corporate mega-event, a grand opening, or an exclusive gathering, our catering division ensures flawless execution, strict international hygiene standards, and memorable flavors.
              </p>
            </div>
            <div className="order-2 lg:order-2 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E91E8C]/30 to-[#3AADE0]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <ImageWithFallback src={aboutImg2} alt="Premium Catering Services" className="relative w-full aspect-[4/3] object-cover rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
          </div>
        </div>

        {/* Section 3: Bottom Call-to-Action */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          {/* Ambient Glows for Dark Footer */}
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#F5841F]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-10 tracking-tight leading-[1.1]">
              Ready to unlock your full potential?
            </h2>
            <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK})\` }}>
              Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
`;

content = content.replace(servicesPageRegex, newServicesPage + '\n\n');
fs.writeFileSync('src/app/App.tsx', content);


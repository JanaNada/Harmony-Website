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

      <div className="relative z-10 pt-24 pb-32">
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
      </div>
    </div>
  );
}
`;

content = content.replace(servicesPageRegex, newServicesPage);

fs.writeFileSync('src/app/App.tsx', content);

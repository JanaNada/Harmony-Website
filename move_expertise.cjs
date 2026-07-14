const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// 1. Remove from HomePage
const homePageExpertiseRegex = /\{\/\* ── Service Cards ────────────────────────────────────── \*\/\}\s*<div className="max-w-\[1200px\] mx-auto px-6 mb-32 md:mb-48">[\s\S]*?<\/div>\s*<\/div>/;

// Let's be more precise by using a simpler string replacement
const startStr = `{/* ── Service Cards ────────────────────────────────────── */}`;
const endStr = `        {/* ── Footer / Community ───────────────────────────────── */}`;

let startIndex = content.indexOf(startStr);
let endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + content.substring(endIndex);
}

// 2. Add to ServicesPage
const servicesPageSearch = `function ServicesPage({ go }: { go: (p: Page) => void }) {`;
const expertiseArray = `
  const expertiseCards: { img: string; label: string; page: Page; color: string; glow: string; }[] = [
    { img: mgmtIcon, label: "Management", page: "services", color: C_ORANGE, glow: \`\${C_ORANGE}35\` },
    { img: eventsIcon, label: "Events", page: "stories", color: C_PINK, glow: \`\${C_PINK}35\` },
    { img: marketingIcon, label: "Marketing", page: "services", color: C_BLUE, glow: \`\${C_BLUE}35\` },
    { img: recruitmentIcon, label: "Recruitment", page: "about", color: C_GREEN, glow: \`\${C_GREEN}35\` },
  ];
`;

const servicesInsertAfter = `          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            Four deep practice areas covering every dimension of hospitality success.
          </p>
        </div>`;

const gridBlock = `

        {/* ── Our Expertise Grid ── */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 md:mb-48">
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
        </div>`;

content = content.replace(servicesPageSearch, servicesPageSearch + expertiseArray);
content = content.replace(servicesInsertAfter, servicesInsertAfter + gridBlock);

fs.writeFileSync('src/app/App.tsx', content);

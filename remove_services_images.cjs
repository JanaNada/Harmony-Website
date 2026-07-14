const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const specializedDivisionsRegex = /\{\/\* Section 2: Specialized Divisions \*\/\}\s*<div className="max-w-\[1200px\] mx-auto px-6 mt-32 md:mt-40 flex flex-col gap-24 md:gap-32 pb-32">[\s\S]*?\{\/\* Section 3: Bottom Call-to-Action \*\/\}/;

const newSpecializedDivisions = `{/* Section 2: Specialized Divisions */}
        <div className="max-w-[1200px] mx-auto px-6 mt-32 md:mt-40 flex flex-col gap-24 md:gap-32 pb-32">
          {/* Block 1: Food & Beverage Division */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
            <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C_ORANGE }}>Division</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Food & Beverage Division</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8]">
              End-to-end concept creation and execution. From innovative kitchen design and strategic equipment sourcing to comprehensive menu engineering, we build the culinary foundations for your success.
            </p>
            <button onClick={() => go("fnb")} className="mt-8 inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(245,132,31,0.5)] group" style={{ background: C_ORANGE }}>
              Explore F&B Division <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Block 2: Premium Catering Services */}
          <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
            <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C_PINK }}>Division</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Premium Catering Services</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8]">
              Delivering culinary excellence at scale. Whether it is a corporate mega-event, a grand opening, or an exclusive gathering, our catering division ensures flawless execution, strict international hygiene standards, and memorable flavors.
            </p>
          </div>
        </div>

        {/* Section 3: Bottom Call-to-Action */}`;

content = content.replace(specializedDivisionsRegex, newSpecializedDivisions);
fs.writeFileSync('src/app/App.tsx', content);

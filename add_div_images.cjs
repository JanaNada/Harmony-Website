const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// 1. Add imports
if (!content.includes('import divFnbImg')) {
  content = content.replace(
    /import missionTopImg from "@\/imports\/image-7\.png";/,
    'import missionTopImg from "@/imports/image-7.png";\nimport divFnbImg from "@/imports/image-8.png";\nimport divCateringImg from "@/imports/image-9.png";'
  );
}

// 2. Replace the sections
const oldSectionRegex = /\{\/\* Section 2: Specialized Divisions \*\/\}\s*<div className="max-w-\[1200px\] mx-auto px-6 mt-32 md:mt-40 flex flex-col gap-24 md:gap-32 pb-32">[\s\S]*?\{\/\* Section 3: Bottom Call-to-Action \*\/\}/;

const newSection = `{/* Section 2: Specialized Divisions */}
        <div className="max-w-[1200px] mx-auto px-6 mt-32 md:mt-40 flex flex-col gap-24 md:gap-32 pb-32">
          {/* Block 1: Food & Beverage Division */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/30 to-[#E91E8C]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <ImageWithFallback src={divFnbImg} alt="Food & Beverage Division" className="relative w-full aspect-[4/3] object-cover rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C_ORANGE }}>Division</span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Food & Beverage Division</h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8]">
                End-to-end concept creation and execution. From innovative kitchen design and strategic equipment sourcing to comprehensive menu engineering, we build the culinary foundations for your success.
              </p>
              <button onClick={() => go("fnb")} className="mt-8 inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(245,132,31,0.5)] group" style={{ background: C_ORANGE }}>
                Explore F&B Division <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
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
              <ImageWithFallback src={divCateringImg} alt="Premium Catering Services" className="relative w-full aspect-[4/3] object-cover rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
          </div>
        </div>

        {/* Section 3: Bottom Call-to-Action */}`;

content = content.replace(oldSectionRegex, newSection);
fs.writeFileSync('src/app/App.tsx', content);


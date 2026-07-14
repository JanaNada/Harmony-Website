const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// Add icons for FnbPage
if (!content.includes('PenTool,')) {
  content = content.replace(
    /import \{([^}]+)\} from "lucide-react";/,
    'import { $1, PenTool, Utensils, TrendingUp, BarChart, ChefHat } from "lucide-react";'
  );
}

// Add 'fnb' to Page type
if (!content.includes('"fnb"')) {
  content = content.replace(
    /type Page = "home" \| "services" \| "stories" \| "about" \| "mission" \| "contact";/,
    'type Page = "home" | "services" | "stories" | "about" | "mission" | "fnb" | "contact";'
  );
}

// Add a button to navigate to F&B page from Services page
const fnbBlockRegex = /<h2 className="font-\['Plus_Jakarta_Sans'\] font-extrabold text-\[32px\] md:text-\[48px\] text-\[\#1a1a1a\] mb-6 leading-\[1\.1\] tracking-tight">Food & Beverage Division<\/h2>\s*<p className="font-\['Plus_Jakarta_Sans'\] text-\[16px\] md:text-\[18px\] text-\[\#1a1a1a\]\/70 leading-\[1\.8\]">\s*End-to-end concept creation and execution\.[^<]*<\/p>/;
if (content.match(fnbBlockRegex)) {
  content = content.replace(fnbBlockRegex, `$&
              <button onClick={() => go("fnb")} className="mt-8 inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white px-6 py-3 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_10px_20px_-10px_rgba(245,132,31,0.5)] group" style={{ background: C_ORANGE }}>
                Explore F&B Division <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>`);
}

const fnbPageStr = `
function FnbPage({ go }: { go: (p: Page) => void }) {
  const approaches = [
    { icon: PenTool, title: "Concept & Identity", text: "Comprehensive market research and unique brand storytelling to define your outlet's DNA.", color: C_ORANGE },
    { icon: ChefHat, title: "Menu Engineering", text: "Designing high-margin, operationally efficient, and gastronomically compelling menus.", color: C_PINK },
    { icon: ShieldCheck, title: "Operational Excellence", text: "Implementing strict SOPs for kitchen logistics, food safety, and international service standards.", color: C_BLUE },
    { icon: TrendingUp, title: "Management & Turnaround", text: "Pinpointing weak spots in performance and providing full-scale management for sustainable profitability.", color: C_GREEN }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white text-[#1a1a1a] relative">
      
      {/* Section 1: Division Header & Intro */}
      <div className="relative w-full pt-[100px] flex items-center justify-center min-h-[70vh] px-6">
        <div className="absolute inset-0 w-full h-full bg-[#111]">
          <img 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=80" 
            alt="High-end restaurant" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay" 
          />
        </div>
        <div className="relative z-10 bg-white/90 backdrop-blur-2xl max-w-[900px] w-full p-10 md:p-16 rounded-[48px] text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] border border-white/50">
          <span className="inline-block py-2 px-6 rounded-full bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm" style={{ color: C_ORANGE }}>Specialized Division</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Food & Beverage (F&B) Division
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[20px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[700px] mx-auto">
            We craft and launch innovative F&B concepts that blend creative vision with operational reality. We balance the art of hospitality with the science of profitability to maximize your ROI.
          </p>
        </div>
      </div>

      {/* Section 2: Our Approach (The 4-Step Methodology) */}
      <div className="py-24 md:py-32 bg-[#FAF7F2] px-6 relative overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-[#F5841F]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#3AADE0]/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-[#1a1a1a]/50">Methodology</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">From Concept to Profitability</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {approaches.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-10 md:p-12 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white flex flex-col md:flex-row gap-8 items-start group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: \`\${item.color}15\`, color: item.color }}>
                  <item.icon size={28} />
                </div>
                <div>
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-[13px] uppercase tracking-[0.1em] mb-3" style={{ color: item.color }}>Step 0{i + 1}</div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[22px] md:text-[24px] text-[#1a1a1a] mb-4 leading-[1.3] tracking-tight">{item.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] md:text-[16px] leading-[1.7] text-[#1a1a1a]/60 font-medium">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Why Choose HCH? */}
      <div className="py-24 md:py-32 px-6" style={{ backgroundColor: C_ORANGE }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-[48px] p-8 md:p-16 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
              
              {/* Text Side */}
              <div className="lg:col-span-7">
                <span className="inline-block py-2 px-6 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/10">Why Choose HCH?</span>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-12 leading-[1.1] tracking-tight">Your Strategic Partner</h2>
                
                {/* 3-Column Text Layout for the paragraph */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-white/90">
                  <div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.8] font-medium">
                      We act as an extension of your team. With a track record of training 2,500+ professionals and expertise spanning upscale restaurants to corporate food courts,
                    </p>
                  </div>
                  <div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.8] font-medium">
                      we provide end-to-end integration and data-driven growth. We do not rely on guesswork;
                    </p>
                  </div>
                  <div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.8] font-medium">
                      we ensure your success is measurable, sustainable, and entirely unparalleled.
                    </p>
                  </div>
                </div>
                
                <button onClick={() => go("contact")} className="mt-16 inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#1a1a1a] bg-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-xl group">
                  Discuss Your F&B Concept <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Image Side */}
              <div className="lg:col-span-5 relative group">
                <div className="absolute inset-0 bg-white/30 blur-[40px] rounded-[40px] transition-opacity duration-700 group-hover:opacity-60" />
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white/20 aspect-[4/5] bg-black/10">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" 
                    alt="Team Collaboration" 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.05]"
                  />
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
`;

const appInjectRegex = /\{page === "mission" && <MissionPage go=\{go\} \/>\}/;
if (content.match(appInjectRegex)) {
  content = content.replace(appInjectRegex, `$&
      {page === "fnb" && <FnbPage go={go} />}`);
}

const functionInjectRegex = /function ContactPage/;
if (content.match(functionInjectRegex)) {
  content = content.replace(functionInjectRegex, fnbPageStr + '\n\n$&');
}

fs.writeFileSync('src/app/App.tsx', content);

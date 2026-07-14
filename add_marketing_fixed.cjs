const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// Update icons import
content = content.replace(
  /import \{([^}]+)\} from "lucide-react";/,
  function(match, p1) {
    if (!p1.includes('Palette,')) {
      return "import { " + p1 + ", Palette, MonitorSmartphone, Target, Megaphone } from 'lucide-react';";
    }
    return match;
  }
);

// Update Page type
if (!content.includes('"marketing"')) {
  content = content.replace(
    /type Page = "home" \| "services" \| "stories" \| "about" \| "mission" \| "fnb" \| "catering" \| "recruitment" \| "contact";/,
    'type Page = "home" | "services" | "stories" | "about" | "mission" | "fnb" | "catering" | "recruitment" | "marketing" | "contact";'
  );
}

// Update the links in HomePage and ServicesPage
content = content.replace(
  /\{ img: marketingIcon, label: "Marketing", page: "services", color: C_BLUE, glow: \`\$\{C_BLUE\}35\` \}/g,
  '{ img: marketingIcon, label: "Marketing", page: "marketing", color: C_BLUE, glow: `${C_BLUE}35` }'
);

const marketingPageCode = `
function MarketingPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Palette, title: "Brand Identity", text: "Crafting unique logos, visual aesthetics, and brand narratives that resonate with your target demographic." },
    { icon: MonitorSmartphone, title: "Digital Marketing", text: "Driving customer engagement through targeted social media management, SEO, and online advertising." },
    { icon: Target, title: "Market Positioning", text: "Utilizing data-driven market research to position your brand effectively against competitors." },
    { icon: Megaphone, title: "Campaign Management", text: "Designing and executing high-impact promotional campaigns for launches, events, and seasonal offers." }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#3AADE0]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#E91E8C]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-0">
        
        {/* Section 1: Division Header & Overview */}
        <div className="px-6 mb-32">
          <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-2xl border border-white/50 mt-8">
            {/* CRITICAL: GREY PLACEHOLDER FOR IMAGE */}
            <div className="absolute inset-0 w-full h-full bg-[#E0DCD5]"></div>
            
            <div className="relative z-10 bg-white/90 backdrop-blur-2xl max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <span className="inline-block py-2 px-6 rounded-full bg-white text-[#1a1a1a] text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-black/5 shadow-sm" style={{ color: C_BLUE }}>Division</span>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Marketing & Branding Solutions
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[800px] mx-auto">
                We develop powerful visual identities and execute strategic marketing campaigns tailored specifically for the hospitality and F&B sectors. We power new and existing projects with bold ideas and creative execution to maximize your market presence.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Our Core Capabilities (The 4 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32 px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">End-to-End Marketing Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pillars.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 text-center flex flex-col items-center">
                {/* Minimalist icon placeholder (grey box with icon inside) */}
                <div className="w-16 h-16 rounded-2xl bg-[#EBE7E0] border border-black/5 mb-6 flex items-center justify-center text-[#1a1a1a]/40">
                  <item.icon size={24} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/60 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: The HCH Advantage */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 flex flex-col gap-20 md:gap-32">
          <div className="text-center">
             <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-[#1a1a1a]/50">Advantage</span>
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">Why Partner With Us?</h2>
          </div>
          
          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1 w-full aspect-[4/3] bg-[#E0DCD5] rounded-[40px] shadow-xl border border-black/5"></div>
            <div className="order-1 lg:order-2">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Industry Expertise</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">We don't just know marketing; we know hospitality. Our campaigns are built on a deep understanding of F&B consumer behavior.</p>
            </div>
          </div>
          
          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-1 lg:order-1">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Creative Execution</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">From menu design to digital storytelling, we ensure every touchpoint reflects your brand's unique artistic vision.</p>
            </div>
            <div className="order-2 lg:order-2 w-full aspect-[4/3] bg-[#E0DCD5] rounded-[40px] shadow-xl border border-black/5"></div>
          </div>
          
          {/* Block 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-2 lg:order-1 w-full aspect-[4/3] bg-[#E0DCD5] rounded-[40px] shadow-xl border border-black/5"></div>
            <div className="order-1 lg:order-2">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Measurable ROI</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">We track, analyze, and optimize every campaign to ensure your marketing budget translates directly into increased footfall and revenue.</p>
            </div>
          </div>
        </div>

        {/* Section 4: Call to Action (Footer) */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#3AADE0]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-10 tracking-tight leading-[1.1]">
              Ready to Build a Powerful Brand?
            </h2>
            <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(58,173,224,0.5)] group" style={{ background: C_BLUE }}>
              Contact Our Marketing Team <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
`;

// Inject the component before ContactPage
const contactRegex = /function ContactPage/;
if (content.match(contactRegex) && !content.includes('function MarketingPage')) {
  content = content.replace(contactRegex, marketingPageCode + '\n\n$&');
}

// Inject the routing logic in App
const routingRegex = /\{page === "recruitment" && <RecruitmentPage go=\{go\} \/>\}/;
if (content.match(routingRegex) && !content.includes('<MarketingPage')) {
  content = content.replace(routingRegex, `$&
      {page === "marketing" && <MarketingPage go={go} />}`);
}

fs.writeFileSync('src/app/App.tsx', content);

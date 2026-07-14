const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const fnbRegex = /function FnbPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function ContactPage\(\) \{)/;

const newFnbPage = `function FnbPage({ go }: { go: (p: Page) => void }) {
  const approaches = [
    { icon: PenTool, title: "Concept & Identity", text: "Comprehensive market research and unique brand storytelling to define your outlet's DNA.", color: C_ORANGE },
    { icon: ChefHat, title: "Menu Engineering", text: "Designing high-margin, operationally efficient, and gastronomically compelling menus.", color: C_PINK },
    { icon: ShieldCheck, title: "Operational Excellence", text: "Implementing strict SOPs for kitchen logistics, food safety, and international service standards.", color: C_BLUE },
    { icon: TrendingUp, title: "Management & Turnaround", text: "Pinpointing weak spots in performance and providing full-scale management for sustainable profitability.", color: C_GREEN }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      
      {/* Seamless Ambient Gradient Background spanning the whole page */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#E91E8C]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#3AADE0]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32 px-6">
        {/* Section 1: Division Header & Intro */}
        <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-2xl border border-white/50 mb-32">
          <div className="absolute inset-0 w-full h-full bg-[#111]">
            <img 
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=80" 
              alt="High-end restaurant" 
              className="w-full h-full object-cover opacity-50 mix-blend-overlay" 
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 bg-white/10 backdrop-blur-md max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/20 mt-16 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
            <span className="inline-block py-2 px-6 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/10 shadow-sm">Specialized Division</span>
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-white">
              Food & Beverage Division
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[20px] text-white/90 leading-[1.8] font-medium max-w-[700px] mx-auto">
              We craft and launch innovative F&B concepts that blend creative vision with operational reality. We balance the art of hospitality with the science of profitability to maximize your ROI.
            </p>
          </div>
        </div>

        {/* Section 2: Our Approach (The 4-Step Methodology) */}
        <div className="max-w-[1200px] mx-auto mb-32">
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

        {/* Section 3: Why Choose HCH? */}
        <div className="max-w-[1400px] mx-auto">
          <div className="relative overflow-hidden rounded-[48px] p-8 md:p-16 border border-white/40 shadow-2xl group">
            {/* Smooth blended gradient background replacing the stark solid orange */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F5841F] via-[#E91E8C] to-[#F5841F] opacity-90 transition-transform duration-1000 group-hover:scale-105" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
              {/* Text Side */}
              <div className="lg:col-span-7">
                <span className="inline-block py-2 px-6 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/20 backdrop-blur-md shadow-sm">Why Choose HCH?</span>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-12 leading-[1.1] tracking-tight">Your Strategic Partner</h2>
                
                {/* 3-Column Text Layout for the paragraph */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 text-white/95">
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
                
                <button onClick={() => go("contact")} className="mt-16 inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#1a1a1a] bg-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-2xl group">
                  Discuss Your F&B Concept <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Image Side */}
              <div className="lg:col-span-5 relative group/img">
                <div className="absolute inset-0 bg-white/40 blur-[50px] rounded-[40px] transition-opacity duration-700 group-hover/img:opacity-80" />
                <div className="relative rounded-[40px] overflow-hidden shadow-2xl border border-white/30 aspect-[4/5] bg-black/10">
                  <img 
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" 
                    alt="Team Collaboration" 
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover/img:scale-[1.08]"
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

content = content.replace(fnbRegex, newFnbPage + '\n\n');
fs.writeFileSync('src/app/App.tsx', content);

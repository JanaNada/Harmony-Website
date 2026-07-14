const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const section3Regex = /\{\/\* Section 3: Why Partner with HCH\? \*\/\}\s*<div className="max-w-\[1200px\] mx-auto px-6 mb-32 flex flex-col gap-20 md:gap-32">[\s\S]*?(?=\{\/\* Section 4: Our Commitment \(Footer\) \*\/\})/;

const newSection3 = `{/* Section 3: Why Partner with HCH? */}
        <div className="max-w-[1400px] mx-auto mb-32 px-6">
          <div className="rounded-[48px] p-8 md:p-16 border border-white/30 shadow-2xl relative overflow-hidden group">
            {/* Blended multi-color ambient background replacing the static dark one */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E91E8C] via-[#F5841F] to-[#E91E8C] opacity-90 transition-transform duration-1000 group-hover:scale-105" />

            <div className="relative z-10">
              <div className="text-center mb-16">
                <span className="inline-block py-2 px-6 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-white/10 shadow-sm">Advantage</span>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[48px] text-white leading-[1.1] tracking-tight">The HCH Advantage</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                  { title: "Creative Concepts", text: "We develop unique concepts that reflect your brand’s personality and the event's purpose." },
                  { title: "End-to-End Logistics", text: "We manage the entire lifecycle, including venue coordination, supply chains, and on-site troubleshooting." },
                  { title: "Seamless Experience", text: "We meticulously align all departments to ensure a smooth, stress-free experience for your guests." },
                  { title: "Professionalism", text: "We apply the same elite standards of quality, safety, and operational excellence to every single detail." }
                ].map((adv, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[32px] text-white hover:-translate-y-2 transition-transform duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                    <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] text-white/40 mb-4 tracking-tighter">0{i+1}</div>
                    <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-3 leading-[1.3]">{adv.title}</h3>
                    <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-white/90 font-medium">{adv.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        `;

content = content.replace(section3Regex, newSection3);
fs.writeFileSync('src/app/App.tsx', content);

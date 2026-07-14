const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// The request: "make it in a similar style to the marketing page but with pink gradients"
// The marketing page has a zig-zag image/text section. We need to replace Section 3.

const section3Regex = /\{\/\* Section 3: Why Partner with HCH\? \*\/\}\s*<div className="max-w-\[1400px\] mx-auto mb-32 px-6">[\s\S]*?(?=\{\/\* Section 4: Our Commitment \(Footer\) \*\/)/;

const newSection3 = `{/* Section 3: Why Partner with HCH? */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 flex flex-col gap-20 md:gap-32">
          <div className="text-center">
             <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-[#1a1a1a]/50">Advantage</span>
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">The HCH Advantage</h2>
          </div>
          
          {/* Block 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center group">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E91E8C]/30 to-[#F5841F]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative w-full aspect-[4/3] rounded-[40px] shadow-xl border border-white/60 overflow-hidden bg-white/40 backdrop-blur-xl">
                <div className="absolute inset-0 w-full h-full p-6">
                  <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&q=80" alt="Creative Concepts" className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Creative Concepts</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">We develop unique concepts that reflect your brand’s personality and the event's purpose.</p>
            </div>
          </div>
          
          {/* Block 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center group">
            <div className="order-1 lg:order-1">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">End-to-End Logistics</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">We manage the entire lifecycle, including venue coordination, supply chains, and on-site troubleshooting.</p>
            </div>
            <div className="order-2 lg:order-2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/30 to-[#E91E8C]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative w-full aspect-[4/3] rounded-[40px] shadow-xl border border-white/60 overflow-hidden bg-white/40 backdrop-blur-xl">
                <div className="absolute inset-0 w-full h-full p-6">
                  <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" alt="End-to-End Logistics" className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Block 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center group">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#E91E8C]/30 to-[#3AADE0]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative w-full aspect-[4/3] rounded-[40px] shadow-xl border border-white/60 overflow-hidden bg-white/40 backdrop-blur-xl">
                <div className="absolute inset-0 w-full h-full p-6">
                  <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" alt="Seamless Experience" className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Seamless Experience</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">We meticulously align all departments to ensure a smooth, stress-free experience for your guests.</p>
            </div>
          </div>

          {/* Block 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center group">
            <div className="order-1 lg:order-1">
               <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">Professionalism</h3>
               <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">We apply the same elite standards of quality, safety, and operational excellence to every single detail.</p>
            </div>
            <div className="order-2 lg:order-2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#3AADE0]/30 to-[#E91E8C]/20 blur-[40px] rounded-[40px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
              <div className="relative w-full aspect-[4/3] rounded-[40px] shadow-xl border border-white/60 overflow-hidden bg-white/40 backdrop-blur-xl">
                <div className="absolute inset-0 w-full h-full p-6">
                  <img src="https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80" alt="Professionalism" className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        `;

content = content.replace(section3Regex, newSection3);

// Fix the footer CTA to be completely pink
const section4Regex = /{/\* Section 4: Our Commitment \(Footer\) \*\/}[\s\S]*?(?=<\/div>\n    <\/div>\n  \);\n\})/;
const newSection4 = `{/* Section 4: Our Commitment (Footer) */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-6 tracking-tight leading-[1.1]">
              Your Dedicated Event Partner
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-white/70 leading-[1.8] font-medium max-w-[600px] mx-auto mb-10">
              We aim to become your only partner for both corporate and social occasions, establishing long-term relationships built on trust, impeccable service, and the creativity required to make your event truly stand out.
            </p>
            <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(233,30,140,0.5)] group" style={{ background: C_PINK }}>
              Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
`;
content = content.replace(section4Regex, newSection4);

fs.writeFileSync('src/app/App.tsx', content);

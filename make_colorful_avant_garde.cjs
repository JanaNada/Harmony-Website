const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const aboutPageRegex = /function AboutPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function MissionPage|function ContactPage)/;

const newAboutPage = `function AboutPage({ go }: { go: (p: Page) => void }) {
  const whyPartnerReasons = [
    { title: "END-TO-END EXPERTISE", text: "We expertly navigate the complexities of business setup, managing legal structures, financial planning, and facility logistics so you can focus entirely on scaling your core business.", color: C_ORANGE },
    { title: "DATA-DRIVEN RESULTS", text: "We identify weak spots and elevate your strengths through rigorous analysis, ensuring your business is structurally built for long-term profitability.", color: C_PINK },
    { title: "GLOBAL STANDARDS, LOCAL INSIGHTS", text: "We seamlessly blend elite international hospitality benchmarks with our deep, localized knowledge of the Egyptian market to deliver highly creative and practical solutions.", color: C_BLUE }
  ];

  const coreValues = [
    { num: "01", title: "PRACTICAL WISDOM", text: "Our consultancy goes beyond theory; it is deeply anchored in the reality of navigating the global hospitality industry.", color: C_ORANGE },
    { num: "02", title: "HARMONIOUS PARTNERSHIP", text: "By fully understanding your brand's unique character, we act as a true extension of your team to create customized, perfectly aligned solutions.", color: C_PINK },
    { num: "03", title: "OPERATIONAL INTEGRITY", text: "We commit to absolute transparency, using data-driven precision to repair operations and ensure your business transitions to profitability.", color: C_BLUE },
    { num: "04", title: "HUMAN-CENTRIC GROWTH", text: "We recognize that a business relies on its people, heavily investing in high-qualification teams through expert recruitment and rigorous training.", color: C_GREEN },
    { num: "05", title: "QUALITY WITHOUT COMPROMISE", text: "We strictly adhere to the highest international safety and efficiency standards across all food, kitchen, and event logistics.", color: C_ORANGE },
    { num: "06", title: "INNOVATION & AGILITY", text: "We keep your brand relevant in a dynamic market by blending creative concept development with cutting-edge digital tools.", color: C_PINK }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white text-[#1a1a1a]">
      {/* Intro / Who We Are */}
      <section className="pt-24 border-b border-black/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-black/10 border-t">
            {/* Image Span */}
            <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-black/10 relative overflow-hidden bg-[#FAF7F2] p-8 md:p-12">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F5841F]/10 via-[#E91E8C]/5 to-transparent pointer-events-none" />
              <div className="w-full h-full flex items-center justify-center min-h-[400px] md:min-h-[600px] relative z-10">
                 <ImageWithFallback src={interactiveImg} alt="Harmony Club House" className="w-full h-full object-contain drop-shadow-xl" />
              </div>
            </div>
            {/* Text Span */}
            <div className="lg:col-span-5 p-8 md:p-16 flex flex-col justify-between bg-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#3AADE0]/5 blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.2em] mb-12 font-bold border-b border-black/10 pb-4 inline-block text-[#1a1a1a]/50">
                  <span style={{ color: C_ORANGE }}>01</span> / Who We Are
                </h3>
                <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.05] tracking-tighter mb-10 uppercase">
                  Refining<br/>Hospitality<br/><span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK})\` }}>Standards.</span>
                </h1>
                <p className="font-['Plus_Jakarta_Sans'] text-[16px] leading-[1.6] text-[#1a1a1a] font-bold mb-6 uppercase tracking-wide">
                  Established in 2012, Harmony Club House (HCH) stands as a premier platform for F&B development and hospitality consultancy.
                </p>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/70">
                  We are a dedicated team of passionate entrepreneurs and experts, bringing over 13 years of hands-on international experience across four continents. We do not just consult; we partner with you to redefine industry standards. From initial feasibility studies and innovative kitchen design to menu engineering and complete operational restructuring, we have successfully launched over 30 projects and trained more than 2,500 professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="border-b border-black/10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-black/10">
            <div className="lg:col-span-4 p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-black/10 flex flex-col bg-[#FAF7F2] relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#78BE1F]/10 blur-[80px] pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.2em] mb-12 font-bold border-b border-black/10 pb-4 inline-block self-start text-[#1a1a1a]/50">
                  <span style={{ color: C_PINK }}>02</span> / Why Partner
                </h3>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[48px] leading-[1.05] tracking-tighter uppercase mb-6">
                  Strategic<br/>Roadmap.
                </h2>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/70 mt-auto">
                  We believe every brand has a unique story, and we help you tell it through operational excellence anchored in first-hand experience. We provide the strategic roadmap necessary to turn your goals into a tangible, high-impact reality.
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 bg-white">
              {whyPartnerReasons.map((r, i) => (
                <div key={i} className={\`p-8 md:p-12 flex flex-col \${i !== 2 ? 'border-b md:border-b-0 md:border-r border-black/10' : 'border-b md:border-b-0 border-black/10'}\`}>
                  <div className="text-[40px] font-['Plus_Jakarta_Sans'] font-extrabold tracking-tighter mb-10" style={{ color: r.color }}>0{i+1}</div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[15px] leading-[1.3] mb-4 uppercase tracking-tight text-[#1a1a1a]">{r.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/70">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="border-b border-black/10 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="border-x border-black/10 p-8 md:p-12 border-b">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.2em] font-bold border-b border-black/10 pb-4 inline-block text-[#1a1a1a]/50">
              <span style={{ color: C_BLUE }}>03</span> / Core Values
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-x border-black/10">
            {coreValues.map((v, i) => (
              <div key={i} className={\`relative overflow-hidden p-8 md:p-16 border-b border-black/10 \${(i+1) % 3 !== 0 ? 'lg:border-r' : ''} \${(i+1) % 2 !== 0 ? 'md:border-r lg:border-r' : 'md:border-r-0 lg:border-r-0'} \${i===1||i===4 ? 'lg:border-r border-black/10' : ''} group\`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundColor: v.color }} />
                <div className="relative z-10">
                  <div className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold mb-8 tracking-[0.2em]" style={{ color: v.color }}>[{v.num}]</div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] md:text-[24px] mb-4 uppercase tracking-tighter leading-[1.1] text-[#1a1a1a]">{v.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/70">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Partners */}
      <section className="mb-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 border-x border-b border-black/10">
            <div className="lg:col-span-5 p-8 md:p-16 border-b lg:border-b-0 lg:border-r border-black/10 flex flex-col justify-center bg-white relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#F5841F]/5 blur-[80px] pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.2em] mb-12 font-bold border-b border-black/10 pb-4 inline-block self-start text-[#1a1a1a]/50">
                  <span style={{ color: C_GREEN }}>04</span> / Partners
                </h3>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[48px] leading-[1.05] tracking-tighter uppercase mb-8">
                  Industry<br/>Giants.
                </h2>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/70">
                  Our reputation is defined by the trust of the industry giants we serve. Since 2012, we have proudly collaborated with a diverse portfolio of global hospitality leaders, major banks, and iconic F&B outlets who share our unwavering commitment to precision. Each partnership represents a shared vision of excellence, turning ambitious goals into sustainable operational realities.
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute inset-0" style={{ background: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK}, \${C_BLUE})\` }} />
               <div className="relative z-10 text-white">
                 <div className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold mb-12 text-white/70 uppercase tracking-[0.2em] border-b border-white/30 pb-4 inline-block self-start">The Roster</div>
                 <div className="flex flex-wrap gap-x-12 gap-y-8">
                    {["Baron Hotels", "Kempinski", "Marriott", "Dunkin'", "TBS", "GUC"].map((brand) => (
                      <div key={brand} className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[40px] tracking-tighter uppercase text-white hover:text-white/80 transition-colors cursor-default drop-shadow-md">
                        {brand}
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
`;

content = content.replace(aboutPageRegex, newAboutPage);
fs.writeFileSync('src/app/App.tsx', content);

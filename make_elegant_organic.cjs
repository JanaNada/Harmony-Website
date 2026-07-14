const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const aboutPageRegex = /function AboutPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function MissionPage|function ContactPage)/;

const newAboutPage = `function AboutPage({ go }: { go: (p: Page) => void }) {
  const whyPartnerReasons = [
    { title: "End-to-End Expertise", text: "We expertly navigate the complexities of business setup, managing legal structures, financial planning, and facility logistics so you can focus entirely on scaling your core business.", color: C_ORANGE },
    { title: "Data-Driven Results", text: "We identify weak spots and elevate your strengths through rigorous analysis, ensuring your business is structurally built for long-term profitability.", color: C_PINK },
    { title: "Global Standards", text: "We seamlessly blend elite international hospitality benchmarks with our deep, localized knowledge of the Egyptian market to deliver highly creative and practical solutions.", color: C_BLUE }
  ];

  const coreValues = [
    { num: "01", title: "Practical Wisdom", text: "Our consultancy goes beyond theory; it is deeply anchored in the reality of navigating the global hospitality industry.", color: C_ORANGE },
    { num: "02", title: "Harmonious Partnership", text: "By fully understanding your brand's unique character, we act as a true extension of your team to create customized, perfectly aligned solutions.", color: C_PINK },
    { num: "03", title: "Operational Integrity", text: "We commit to absolute transparency, using data-driven precision to repair operations and ensure your business transitions to profitability.", color: C_BLUE },
    { num: "04", title: "Human-Centric Growth", text: "We recognize that a business relies on its people, heavily investing in high-qualification teams through expert recruitment and rigorous training.", color: C_GREEN },
    { num: "05", title: "Quality Without Compromise", text: "We strictly adhere to the highest international safety and efficiency standards across all food, kitchen, and event logistics.", color: C_ORANGE },
    { num: "06", title: "Innovation & Agility", text: "We keep your brand relevant in a dynamic market by blending creative concept development with cutting-edge digital tools.", color: C_PINK }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      {/* Soft Colorful Ambient Backgrounds */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none z-0" style={{ height: '200vh' }}>
        <div className="absolute -top-40 -left-20 w-[600px] h-[600px] bg-[#F5841F]/15 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] -right-40 w-[700px] h-[700px] bg-[#3AADE0]/10 blur-[150px] rounded-full" />
        <div className="absolute top-[60%] left-10 w-[500px] h-[500px] bg-[#E91E8C]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-[104px] pb-32">
        {/* Intro Image */}
        <div className="max-w-[1000px] mx-auto px-6 mb-24 md:mb-32">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/40 via-[#E91E8C]/30 to-[#3AADE0]/40 blur-[60px] rounded-[60px] opacity-40 group-hover:opacity-70 transition-opacity duration-700" />
            <div className="relative bg-white/60 backdrop-blur-2xl p-6 md:p-10 rounded-[48px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/60">
              <ImageWithFallback src={interactiveImg} alt="Harmony Club House" className="w-full h-auto max-h-[450px] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
          </div>
        </div>

        {/* Who We Are */}
        <div className="max-w-[800px] mx-auto px-6 text-center mb-32 md:mb-48">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: C_ORANGE }}>Our Story</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Redefining the art of <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK})\` }}>hospitality.</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            Established in 2012, Harmony Club House (HCH) stands as a premier platform for F&B development and hospitality consultancy. We are a dedicated team of passionate entrepreneurs and experts, bringing over 13 years of hands-on international experience across four continents. From initial feasibility studies and innovative kitchen design to menu engineering and complete operational restructuring, we have successfully launched over 30 projects and trained more than 2,500 professionals.
          </p>
        </div>

        {/* Why Partner With Us */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 md:mb-48">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a] mb-6">Why Partner With Us?</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 max-w-[600px] mx-auto leading-[1.8]">
              We believe every brand has a unique story, and we help you tell it through operational excellence anchored in first-hand experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {whyPartnerReasons.map((r, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-lg p-10 md:p-12 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-8" style={{ backgroundColor: \`\${r.color}15\`, color: r.color }}>
                  <span className="font-bold text-[18px]">0{i+1}</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#1a1a1a] mb-4 leading-[1.3]">{r.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/60">{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 md:mb-48">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-[1000px] mx-auto">
            {coreValues.map((v, i) => (
              <div key={i} className="flex gap-6 md:gap-8 items-start group">
                <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[40px] opacity-20 group-hover:opacity-100 transition-opacity duration-500" style={{ color: v.color }}>
                  {v.num}
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#1a1a1a] mb-3 leading-[1.3]">{v.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/60">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Partners */}
        <div className="max-w-[1000px] mx-auto px-6 text-center">
           <div className="bg-white/80 backdrop-blur-xl p-10 md:p-20 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white">
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a] mb-8">Our Success Partners</h2>
             <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8] max-w-[800px] mx-auto mb-16">
               Our reputation is defined by the trust of the industry giants we serve. Since 2012, we have proudly collaborated with a diverse portfolio of global hospitality leaders, major banks, and iconic F&B outlets who share our unwavering commitment to precision.
             </p>
             <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                {["Baron Hotels", "Kempinski", "Marriott", "Dunkin'", "TBS", "GUC"].map((brand, i) => {
                  const colors = [C_ORANGE, C_PINK, C_BLUE, C_GREEN, C_ORANGE, C_PINK];
                  return (
                    <div key={brand} className="py-3 px-8 rounded-full bg-[#FAF7F2] font-['Plus_Jakarta_Sans'] font-bold text-[16px] md:text-[20px] transition-transform duration-300 hover:scale-105 shadow-sm border border-black/5" style={{ color: colors[i] }}>
                      {brand}
                    </div>
                  );
                })}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(aboutPageRegex, newAboutPage);
fs.writeFileSync('src/app/App.tsx', content);

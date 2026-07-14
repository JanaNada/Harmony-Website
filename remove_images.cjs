const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const aboutPageRegex = /function AboutPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function MissionPage|function ContactPage)/;

const newAboutPage = `function AboutPage({ go }: { go: (p: Page) => void }) {
  const whyPartnerReasons = [
    { title: "End-to-End Expertise", text: "We expertly navigate the complexities of business setup, managing legal structures, financial planning, and facility logistics so you can focus entirely on scaling your core business.", color: C_ORANGE },
    { title: "Data-Driven Results", text: "We identify weak spots and elevate your strengths through rigorous analysis, ensuring your business is structurally built for long-term profitability.", color: C_PINK },
    { title: "Global Standards, Local Insights", text: "We seamlessly blend elite international hospitality benchmarks with our deep, localized knowledge of the Egyptian market to deliver highly creative and practical solutions.", color: C_BLUE }
  ];

  const coreValues = [
    { title: "Practical Wisdom", text: "Our consultancy goes beyond theory; it is deeply anchored in the reality of navigating the global hospitality industry.", color: C_ORANGE },
    { title: "Harmonious Partnership", text: "By fully understanding your brand's unique character, we act as a true extension of your team to create customized, perfectly aligned solutions.", color: C_PINK },
    { title: "Operational Integrity", text: "We commit to absolute transparency, using data-driven precision to repair operations and ensure your business transitions to profitability.", color: C_BLUE },
    { title: "Human-Centric Growth", text: "We recognize that a business relies on its people, heavily investing in high-qualification teams through expert recruitment and rigorous training.", color: C_GREEN },
    { title: "Quality Without Compromise", text: "We strictly adhere to the highest international safety and efficiency standards across all food, kitchen, and event logistics.", color: C_ORANGE },
    { title: "Innovation & Agility", text: "We keep your brand relevant in a dynamic market by blending creative concept development with cutting-edge digital tools.", color: C_PINK }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white pt-[104px]">
      {/* Section 1: Who We Are & Our Story */}
      <section className="py-20 md:py-24 bg-[#FAF7F2]">
        <div className="max-w-[900px] mx-auto px-8 text-center">
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#1a1a1a] mb-6" style={{ fontSize: "clamp(36px, 5vw, 48px)" }}>Who We Are</h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8]">
            Established in 2012, Harmony Club House (HCH) stands as a premier platform for F&B development and hospitality consultancy. We are a dedicated team of passionate entrepreneurs and experts, bringing over 13 years of hands-on international experience across four continents. We do not just consult; we partner with you to redefine industry standards. From initial feasibility studies and innovative kitchen design to menu engineering and complete operational restructuring, we have successfully launched over 30 projects and trained more than 2,500 professionals.
          </p>
        </div>
      </section>

      {/* Section 2: Why Partner With Us? */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="mb-16 max-w-[800px] mx-auto text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] text-[#1a1a1a] mb-6">Why Partner With Us?</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8]">
              We believe every brand has a unique story, and we help you tell it through operational excellence anchored in first-hand experience. We provide the strategic roadmap necessary to turn your goals into a tangible, high-impact reality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyPartnerReasons.map((r, i) => (
              <div key={i} className="bg-[#FAF7F2] p-8 rounded-[24px] border border-black/[0.04] transition-transform hover:-translate-y-1">
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-4 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  {r.title}
                </h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14.5px] text-[#1a1a1a]/60 leading-[1.7]">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Our Core Values */}
      <section className="py-20 md:py-32 bg-[#FAF7F2]">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] text-[#1a1a1a] mb-16 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-[24px] border border-black/[0.04] shadow-sm text-left">
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-2" style={{ color: v.color }}>{v.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14.5px] text-[#1a1a1a]/60 leading-[1.6]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Our Success Partners */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="mb-16 max-w-[800px] mx-auto text-center">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] text-[#1a1a1a] mb-6">Our Success Partners</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8]">
              Our reputation is defined by the trust of the industry giants we serve. Since 2012, we have proudly collaborated with a diverse portfolio of global hospitality leaders, major banks, and iconic F&B outlets who share our unwavering commitment to precision. We are the trusted operational engine behind luxurious standards and fast-paced innovations for names like Baron Hotels, Kempinski, Marriott, Dunkin', TBS, and the German University in Cairo (GUC). Each partnership represents a shared vision of excellence, turning ambitious goals into sustainable operational realities.
            </p>
          </div>

          {/* Logo Marquee Placeholder Area */}
          <div className="border-t border-black/[0.06] pt-12">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale">
              {["Baron Hotels", "Kempinski", "Marriott", "Dunkin'", "TBS", "GUC"].map((brand) => (
                <div key={brand} className="font-['Plus_Jakarta_Sans'] font-extrabold text-[20px] md:text-[24px] tracking-tight text-[#1a1a1a]">
                  {brand}
                </div>
              ))}
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

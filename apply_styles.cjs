const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const ambientBackground = `
      {/* Soft Colorful Ambient Backgrounds (Fixed to cover entire scroll) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>
`;

// Extract components manually to be safe
const homePageRegex = /function HomePage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function ServicesPage)/;
const aboutPageRegex = /function AboutPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function MissionPage|function ContactPage)/;

const newHomePage = `function HomePage({ go }: { go: (p: Page) => void }) {
  const services: { img: string; label: string; page: Page; color: string; glow: string; }[] = [
    { img: mgmtIcon, label: "Management", page: "services", color: C_ORANGE, glow: \`\${C_ORANGE}35\` },
    { img: eventsIcon, label: "Events", page: "stories", color: C_PINK, glow: \`\${C_PINK}35\` },
    { img: marketingIcon, label: "Marketing", page: "services", color: C_BLUE, glow: \`\${C_BLUE}35\` },
    { img: recruitmentIcon, label: "Recruitment", page: "about", color: C_GREEN, glow: \`\${C_GREEN}35\` },
  ];

  const socialIcons = [
    { Icon: Instagram, label: "Instagram", color: C_PINK },
    { Icon: Facebook, label: "Facebook", color: C_BLUE },
    { Icon: Linkedin, label: "LinkedIn", color: C_BLUE },
    { Icon: Twitter, label: "Twitter / X", color: C_BLUE },
    { Icon: Youtube, label: "YouTube", color: C_ORANGE },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-[#FAF7F2] relative">
${ambientBackground}

      <div className="relative z-10 pt-[104px] pb-32">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center px-6 pt-10 pb-20 gap-8">
          {/* Logo */}
          <div className="w-full max-w-[800px] flex justify-center mb-8">
            <ImageWithFallback
              src={logoImg}
              alt="Harmony Club House"
              className="object-contain w-full h-auto max-h-[160px] drop-shadow-xl"
            />
          </div>

          {/* Headline */}
          <div className="text-center max-w-[860px]">
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#1a1a1a] leading-[1.15] tracking-tight mb-8" style={{ fontSize: "30px" }}>
              Elevating hospitality through expert <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK})\` }}>management</span>, curated <span style={{ color: C_PINK }}>events</span>, strategic <span style={{ color: C_BLUE }}>marketing</span>, and top-tier <span style={{ color: C_GREEN }}>recruitment</span>.
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-center text-[#1a1a1a]/60 max-w-[600px] mx-auto font-medium leading-[1.8]" style={{ fontSize: "clamp(13px, 1.5vw, 16px)" }}>
              We bridge the gap between ambition and operational reality, transforming concepts into industry-leading destinations.
            </p>
          </div>
        </div>

        {/* ── Welcome Section ──────────────────────────────────── */}
        <div className="max-w-[1200px] w-full mx-auto px-6 mb-32 md:mb-48">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="relative order-2 md:order-1 group">
               <div className="absolute inset-0 bg-gradient-to-r from-[#F5841F]/30 via-[#E91E8C]/20 to-[#3AADE0]/30 blur-[50px] rounded-[60px] opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
               <div className="relative bg-white/60 backdrop-blur-2xl p-4 md:p-6 rounded-[48px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/60">
                <div className="rounded-[32px] overflow-hidden aspect-[4/3] bg-black/5">
                  <ImageWithFallback 
                    src={welcomeImg} 
                    alt="Hospitality Interior" 
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.03]"
                  />
                </div>
                {/* Small circular badge */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-28 md:h-28 bg-white/80 backdrop-blur-xl rounded-full p-2 shadow-xl shadow-black/5 flex items-center justify-center border border-white">
                  <div className="w-full h-full rounded-full border border-dashed border-[#1a1a1a]/20 flex flex-col items-center justify-center font-['Plus_Jakarta_Sans'] text-[#1a1a1a]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]/50">Est.</span>
                    <span className="text-[16px] font-extrabold">2013</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 text-center md:text-left">
              <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: C_ORANGE }}>Welcome</span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] text-[#1a1a1a] mb-8 leading-[1.1] tracking-tight">
                Welcome to Harmony Club House
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">
                We are a premium hospitality consultancy dedicated to elevating brand experiences. With over 13 years of industry obsession, we provide hands-on leadership, strategic direction, and creative execution to hospitality businesses worldwide. Our approach is grounded in evidence, accountability, and putting people at the center of every strategy.
              </p>
            </div>
          </div>
        </div>

        {/* ── Service Cards ────────────────────────────────────── */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 md:mb-48">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">Our Expertise</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {services.map((s) => (
              <button
                key={s.label}
                onClick={() => go(s.page)}
                className="group flex flex-col items-center gap-6 focus:outline-none w-[140px] md:w-[200px]"
                aria-label={\`Go to \${s.label} services\`}
              >
                <div className="relative w-full aspect-square">
                  <div className="absolute inset-0 rounded-[40px] blur-[30px] opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: s.color }} />
                  <div className="relative w-full h-full bg-white/80 backdrop-blur-xl border border-white rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center p-6 md:p-8 transition-transform duration-500 group-hover:-translate-y-3">
                    <ImageWithFallback src={s.img} alt={\`\${s.label} Services\`} className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
                <span className="font-['Plus_Jakarta_Sans'] text-[14px] md:text-[16px] font-bold text-[#1a1a1a]/70 group-hover:text-[#1a1a1a] transition-colors duration-300">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Footer / Community ───────────────────────────────── */}
        <div className="max-w-[1000px] mx-auto px-6 text-center">
           <div className="bg-white/80 backdrop-blur-xl p-10 md:p-20 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white">
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[40px] tracking-tight text-[#1a1a1a] mb-4">Join our community</h2>
             <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8] max-w-[600px] mx-auto mb-12">
               Follow us for hospitality insights & updates
             </p>
             <div className="flex items-center justify-center gap-4 mb-16">
               {socialIcons.map(({ Icon, label, color }) => (
                 <button
                   key={label}
                   aria-label={label}
                   className="w-14 h-14 rounded-full bg-[#FAF7F2] shadow-sm border border-black/5 flex items-center justify-center text-[#1a1a1a]/40 transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-md"
                   onMouseEnter={(e) => {
                     const el = e.currentTarget as HTMLButtonElement;
                     el.style.color = color;
                   }}
                   onMouseLeave={(e) => {
                     const el = e.currentTarget as HTMLButtonElement;
                     el.style.color = "";
                   }}
                 >
                   <Icon size={22} />
                 </button>
               ))}
             </div>
             <p className="font-['Plus_Jakarta_Sans'] text-[12px] md:text-[13px] text-[#1a1a1a]/30 tracking-wide font-medium">
               © 2026 Harmony Club House · Management · Events · Marketing · Recruitment
             </p>
           </div>
        </div>
      </div>
    </div>
  );
}
`;

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
${ambientBackground}

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

content = content.replace(homePageRegex, newHomePage + '\n\n');
content = content.replace(aboutPageRegex, newAboutPage + '\n\n');

fs.writeFileSync('src/app/App.tsx', content);

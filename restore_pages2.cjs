const fs = require('fs');

let fileContent = fs.readFileSync('src/app/App.tsx', 'utf8');

const C_ORANGE = "#F5841F";
const C_PINK = "#E91E8C";
const C_BLUE = "#3AADE0";
const C_GREEN = "#78BE1F";

const ambientBackground = `
      {/* Soft Colorful Ambient Backgrounds (Fixed to cover entire scroll) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>
`;

const storiesPage = `
function StoriesPage({ go }: { go: (p: Page) => void }) {
  const stories = [
    { img: "photo-1566073771259-6a8506099945", tag: "Hotel Operations", tagColor: "${C_ORANGE}", title: "From Near-Closure to 91% Occupancy", client: "Luxury Resort Chain — Red Sea", result: "Revenue tripled. TripAdvisor rating 3.1 → 4.7." },
    { img: "photo-1555396273-367ea4eb4db5", tag: "F&B Brand", tagColor: "${C_PINK}", title: "Launching a Multi-Branch Fast-Casual Concept", client: "Restaurant Group — Cairo", result: "5 branches in 24 months. 200K social followers." },
    { img: "photo-1540575467063-178a50c2df87", tag: "Corporate Events", tagColor: "${C_BLUE}", title: "500-Delegate Annual Conference", client: "Vodafone — Egypt", result: "Delivered on time, under budget. 98% satisfaction." },
    { img: "photo-1504674900247-0877df9cc836", tag: "F&B Consultancy", tagColor: "${C_GREEN}", title: "Menu Redesign & Kitchen Overhaul", client: "Hardee's — Middle East", result: "Food cost -18%. Speed of service +30%." },
    { img: "photo-1551632811-561732d1e306", tag: "Recruitment", tagColor: "${C_ORANGE}", title: "Training 400 Hospitality Professionals", client: "Kempinski Hotels — Egypt", result: "96% program completion. Measurable service improvement." },
    { img: "photo-1520250497591-112f2f40a3f4", tag: "Hotel Operations", tagColor: "${C_PINK}", title: "Pre-Opening for Boutique Hotel", client: "Independent Group — Alexandria", result: "80% occupancy in first quarter." },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
${ambientBackground}
      <div className="relative z-10 pt-24 pb-32">
        <div className="max-w-[800px] mx-auto px-6 text-center mb-20 md:mb-32">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: "${C_PINK}" }}>Portfolio</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, ${C_PINK}, ${C_BLUE})\` }}>Stories.</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            30+ projects across 4 continents. Real challenges, real results.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {stories.map((s, i) => (
              <div key={i} className="group bg-white/60 backdrop-blur-xl rounded-[40px] p-4 border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-500 cursor-pointer">
                <div className="relative overflow-hidden bg-black/5 rounded-[32px] aspect-[4/3] mb-6">
                  <img src={\`https://images.unsplash.com/\${s.img}?w=600&h=450&fit=crop&auto=format\`} alt={s.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.5s]" />
                  <div className="absolute top-4 left-4 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full text-white shadow-lg backdrop-blur-md bg-black/20 border border-white/20">
                    <span style={{ color: s.tagColor }} className="drop-shadow-md">{s.tag}</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#1a1a1a] mb-2 leading-[1.3]">{s.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#1a1a1a]/50 mb-6 font-medium">{s.client}</p>
                  <div className="pt-5 border-t border-black/[0.05]">
                    <div className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/40 mb-2">The Result</div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/80 font-semibold leading-[1.6]">{s.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-[800px] mx-auto px-6 text-center mt-32 md:mt-40">
           <div className="bg-white/80 backdrop-blur-xl p-12 md:p-20 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white">
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[40px] tracking-tight text-[#1a1a1a] mb-8">Your success story starts here.</h2>
             <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: \`linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})\` }}>
               Start a Conversation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
`;

const aboutPage = `
function AboutPage({ go }: { go: (p: Page) => void }) {
  const whyPartnerReasons = [
    { title: "End-to-End Expertise", text: "We expertly navigate the complexities of business setup, managing legal structures, financial planning, and facility logistics so you can focus entirely on scaling your core business.", color: "${C_ORANGE}" },
    { title: "Data-Driven Results", text: "We identify weak spots and elevate your strengths through rigorous analysis, ensuring your business is structurally built for long-term profitability.", color: "${C_PINK}" },
    { title: "Global Standards", text: "We seamlessly blend elite international hospitality benchmarks with our deep, localized knowledge of the Egyptian market to deliver highly creative and practical solutions.", color: "${C_BLUE}" }
  ];

  const coreValues = [
    { num: "01", title: "Practical Wisdom", text: "Our consultancy goes beyond theory; it is deeply anchored in the reality of navigating the global hospitality industry.", color: "${C_ORANGE}" },
    { num: "02", title: "Harmonious Partnership", text: "By fully understanding your brand's unique character, we act as a true extension of your team to create customized, perfectly aligned solutions.", color: "${C_PINK}" },
    { num: "03", title: "Operational Integrity", text: "We commit to absolute transparency, using data-driven precision to repair operations and ensure your business transitions to profitability.", color: "${C_BLUE}" },
    { num: "04", title: "Human-Centric Growth", text: "We recognize that a business relies on its people, heavily investing in high-qualification teams through expert recruitment and rigorous training.", color: "${C_GREEN}" },
    { num: "05", title: "Quality Without Compromise", text: "We strictly adhere to the highest international safety and efficiency standards across all food, kitchen, and event logistics.", color: "${C_ORANGE}" },
    { num: "06", title: "Innovation & Agility", text: "We keep your brand relevant in a dynamic market by blending creative concept development with cutting-edge digital tools.", color: "${C_PINK}" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
${ambientBackground}
      <div className="relative z-10 pb-32">
        {/* Intro Image */}
        <div className="w-full mb-16 md:mb-24">
          <div className="relative w-full">
            <ImageWithFallback src={interactiveImg} alt="Harmony Club House" className="w-full h-auto object-cover" />
          </div>
        </div>

        {/* Who We Are */}
        <div className="max-w-[800px] mx-auto px-6 text-center mb-32 md:mb-48">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: "${C_ORANGE}" }}>Our Story</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Redefining the art of <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})\` }}>hospitality.</span>
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
             <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
               {/* Fixed partner variable references to match what's currently active */}
               <ImageWithFallback src={partnersBottomImg} alt="Our Success Partners" className="w-full h-auto max-w-[800px] object-contain rounded-2xl drop-shadow-md" />
             </div>
           </div>
        </div>

        {/* Footer / Bottom Image */}
        <div className="w-full flex justify-center mt-16 md:mt-24 mb-16 px-6">
           <ImageWithFallback 
             src={partnersBottomImg} 
             alt="Harmony Partners Overview" 
             className="w-full max-w-[1200px] h-auto object-cover rounded-[40px] shadow-xl border border-black/5" 
           />
        </div>
      </div>
    </div>
  );
}
`;

const missionPage = `
function MissionPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Settings, title: "Operational Excellence", text: "We repair weak spots and elevate strengths through strategic planning and precise analysis.", color: "${C_ORANGE}" },
    { icon: Users, title: "Human Capital Development", text: "We build high-performing teams through expert recruitment and hands-on training for long-term stability.", color: "${C_PINK}" },
    { icon: ShieldCheck, title: "Quality & Safety", text: "We deliver world-class F&B and facility services, strictly adhering to the highest international safety and hygiene standards.", color: "${C_BLUE}" },
    { icon: Lightbulb, title: "Creative Innovation", text: "We blend concept creation with artistic execution—from menu engineering to digital marketing—to deliver memorable customer experiences.", color: "${C_GREEN}" },
    { icon: Handshake, title: "Client-Centric Approach", text: "We handle the complex operations and logistics so you can focus on your core business. We build long-term partnerships by understanding your unique brand story.", color: "${C_ORANGE}" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
${ambientBackground}
      <div className="relative z-10 pb-16">
        
        {/* Top Image (Full Bleed, No Void Space) */}
        <div className="w-full flex justify-center mb-12">
          <ImageWithFallback 
            src={missionTopImg} 
            alt="Mission and Vision" 
            className="w-full h-auto object-cover" 
          />
        </div>

        {/* Section 1: Our Mission */}
        <div className="max-w-[800px] mx-auto px-6 mb-16 text-center">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: "${C_ORANGE}" }}>Mission</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, ${C_ORANGE}, ${C_PINK})\` }}>Mission.</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            Our mission is to bridge the gap between operational excellence and sustainable growth. We offer end-to-end, integrated solutions tailored to your unique brand.
          </p>
        </div>

        {/* Section 2: Our Commitments (The 5 Pillars) */}
        <div className="max-w-[1200px] mx-auto px-6 mb-16">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">We are committed to:</h2>
          </div>
          {/* Centering a 5-card grid by using flex wrap or custom grid col spans */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {pillars.map((p, i) => (
              <div key={p.title} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] bg-white/60 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: \`\${p.color}15\`, color: p.color }}>
                  <p.icon size={24} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[20px] text-[#1a1a1a] mb-3 leading-[1.3]">{p.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/60">{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Our Vision */}
        <div className="w-full px-0">
          <div className="w-full bg-[#111111] py-16 px-6 md:px-12 relative overflow-hidden">
            {/* Premium dark glows */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#3AADE0]/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-[900px] mx-auto text-center">
              <span className="inline-block py-2 px-6 rounded-full bg-white/10 text-white backdrop-blur-md border border-white/10 text-[11px] font-bold uppercase tracking-[0.2em] mb-8">Vision</span>
              <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[64px] tracking-tight text-white mb-8">
                Our Vision
              </h2>
              <p className="font-['Plus_Jakarta_Sans'] text-[18px] md:text-[22px] text-white/70 leading-[1.7] font-medium">
                To become a leading force in the hospitality industry by providing services beyond expectations. We implement flawless operational and event experiences that exceed client goals and unlock every project's highest potential.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
`;

fileContent = fileContent.replace(/function ContactPage\(\) \{/, storiesPage + "\n\n" + aboutPage + "\n\n" + missionPage + "\n\nfunction ContactPage() {");
fs.writeFileSync('src/app/App.tsx', fileContent);

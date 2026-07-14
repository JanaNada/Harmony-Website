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

const servicesPageRegex = /function ServicesPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function StoriesPage)/;

const newServicesPage = `function ServicesPage({ go }: { go: (p: Page) => void }) {
  const services = [
    {
      color: C_ORANGE,
      n: "01",
      img: mgmtIcon,
      label: "Management & Consultancy",
      tagline: "Your strategy. Our obsession.",
      problem: "Most hospitality businesses struggle not from lack of passion, but from lack of operational clarity — unclear positioning, inefficient processes, and reactive decision-making that limits growth.",
      solution: "We bring structured thinking and hands-on leadership to every layer of your operation. From concept validation to P&L ownership, we work inside your business — not just around it.",
      deliverables: ["Operational audit & roadmap", "Concept development & positioning", "Financial modeling & KPI frameworks", "SOPs and team structure design", "Ongoing advisory & board support"],
      outcome: "A business that runs with clarity, scales with confidence, and grows beyond its founder.",
      unsplashImg: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=580&h=440&fit=crop&auto=format",
    },
    {
      color: C_PINK,
      n: "02",
      img: eventsIcon,
      label: "Events",
      tagline: "Experiences people remember for years.",
      problem: "Events are high-stakes. A poor experience can damage a brand permanently. Yet most companies approach them reactively — choosing vendors over crafting strategy.",
      solution: "We design event experiences from the ground up — concept, venue, production, and guest journey — ensuring every touchpoint reinforces the brand and exceeds expectations.",
      deliverables: ["Event concept & creative direction", "Vendor sourcing & management", "Full production & logistics", "Brand activation design", "Corporate event planning"],
      outcome: "Events that generate buzz, reinforce brand equity, and create genuine business value.",
      unsplashImg: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=580&h=440&fit=crop&auto=format",
    },
    {
      color: C_BLUE,
      n: "03",
      img: marketingIcon,
      label: "Marketing",
      tagline: "Brand desire, built deliberately.",
      problem: "In a saturated hospitality market, visibility alone doesn't drive business. Most brands lack a consistent identity, a strategic content approach, and a digital presence that converts.",
      solution: "We build brand systems that communicate premium value — from visual identity through digital channels, community building, and performance marketing.",
      deliverables: ["Brand identity & guidelines", "Social media strategy & content", "Digital marketing campaigns", "Photography & videography direction", "PR & influencer partnerships"],
      outcome: "A brand with magnetic appeal, loyal community, and marketing that pays for itself.",
      unsplashImg: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=580&h=440&fit=crop&auto=format",
    },
    {
      color: C_GREEN,
      n: "04",
      img: recruitmentIcon,
      label: "Recruitment & Training",
      tagline: "The team that defines the experience.",
      problem: "Hospitality excellence lives or dies with people. Yet most operators struggle to find, onboard, and retain talent that matches their brand standards and service vision.",
      solution: "We source, assess, and develop hospitality professionals who don't just fill roles — they elevate your culture. And we build training systems that make excellence repeatable.",
      deliverables: ["Talent sourcing & assessment", "Onboarding program design", "Service standards training", "Leadership development", "HR policies & culture frameworks"],
      outcome: "A high-performing team that delivers consistent, brand-aligned experiences at every level.",
      unsplashImg: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=580&h=440&fit=crop&auto=format",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
${ambientBackground}
      <div className="relative z-10 pt-24 pb-32">
        <div className="max-w-[800px] mx-auto px-6 text-center mb-24">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: C_ORANGE }}>Expertise</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK})\` }}>Services.</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            Four deep practice areas covering every dimension of hospitality success.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 flex flex-col gap-32">
          {services.map((s, i) => (
            <div key={s.label} className={\`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center \${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}\`}>
              <div className={\`\${i % 2 === 1 ? 'lg:order-2' : ''}\`}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: \`\${s.color}15\`, color: s.color }}>
                  <span className="font-bold text-[24px]">{s.n}</span>
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[40px] text-[#1a1a1a] mb-6 tracking-tight leading-[1.1]">{s.tagline}</h2>
                <div className="w-16 h-1.5 rounded-full mb-8" style={{ background: s.color }} />
                
                <div className="space-y-6 mb-10">
                  <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]">
                    <div className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/40 mb-3">The challenge</div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/70 leading-[1.8]">{s.problem}</p>
                  </div>
                  <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)]">
                    <div className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/40 mb-3">Our approach</div>
                    <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/70 leading-[1.8]">{s.solution}</p>
                  </div>
                </div>

                <div className="mb-10 pl-4">
                  <div className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/40 mb-6">What you get</div>
                  <div className="flex flex-col gap-4">
                    {s.deliverables.map((d) => (
                      <div key={d} className="flex items-start gap-4">
                        <CheckCircle2 size={20} style={{ color: s.color }} className="flex-shrink-0 mt-0.5" />
                        <span className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/70 font-medium">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => go("contact")}
                  className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg group"
                  style={{ background: s.color, boxShadow: \`0 10px 30px -10px \${s.color}\` }}
                >
                  Discuss {s.label}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className={\`relative group \${i % 2 === 1 ? 'lg:order-1' : ''}\`}>
                <div className="absolute inset-0 blur-[50px] opacity-20 rounded-[48px] transition-opacity duration-700 group-hover:opacity-40" style={{ backgroundColor: s.color }} />
                <div className="relative bg-white/60 backdrop-blur-2xl p-4 md:p-6 rounded-[48px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white/60">
                  <div className="rounded-[32px] overflow-hidden aspect-[4/3] bg-black/5">
                    <img
                      src={s.unsplashImg}
                      alt={s.label}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
`;

const storiesPageRegex = /function StoriesPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function AboutPage)/;

const newStoriesPage = `function StoriesPage({ go }: { go: (p: Page) => void }) {
  const stories = [
    { img: "photo-1566073771259-6a8506099945", tag: "Hotel Operations", tagColor: C_ORANGE, title: "From Near-Closure to 91% Occupancy", client: "Luxury Resort Chain — Red Sea", result: "Revenue tripled. TripAdvisor rating 3.1 → 4.7." },
    { img: "photo-1555396273-367ea4eb4db5", tag: "F&B Brand", tagColor: C_PINK, title: "Launching a Multi-Branch Fast-Casual Concept", client: "Restaurant Group — Cairo", result: "5 branches in 24 months. 200K social followers." },
    { img: "photo-1540575467063-178a50c2df87", tag: "Corporate Events", tagColor: C_BLUE, title: "500-Delegate Annual Conference", client: "Vodafone — Egypt", result: "Delivered on time, under budget. 98% satisfaction." },
    { img: "photo-1504674900247-0877df9cc836", tag: "F&B Consultancy", tagColor: C_GREEN, title: "Menu Redesign & Kitchen Overhaul", client: "Hardee's — Middle East", result: "Food cost -18%. Speed of service +30%." },
    { img: "photo-1551632811-561732d1e306", tag: "Recruitment", tagColor: C_ORANGE, title: "Training 400 Hospitality Professionals", client: "Kempinski Hotels — Egypt", result: "96% program completion. Measurable service improvement." },
    { img: "photo-1520250497591-112f2f40a3f4", tag: "Hotel Operations", tagColor: C_PINK, title: "Pre-Opening for Boutique Hotel", client: "Independent Group — Alexandria", result: "80% occupancy in first quarter." },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
${ambientBackground}
      <div className="relative z-10 pt-24 pb-32">
        <div className="max-w-[800px] mx-auto px-6 text-center mb-20 md:mb-32">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: C_PINK }}>Portfolio</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, \${C_PINK}, \${C_BLUE})\` }}>Stories.</span>
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
             <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK})\` }}>
               Start a Conversation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
`;

const missionPageRegex = /function MissionPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function ContactPage)/;

const newMissionPage = `function MissionPage({ go }: { go: (p: Page) => void }) {
  const values = [
    { title: "Partnership over transaction", desc: "We measure our success by yours.", color: C_ORANGE },
    { title: "Craft over convenience", desc: "Every recommendation is grounded in evidence and accountability.", color: C_PINK },
    { title: "People at the center", desc: "Hospitality is human. We design every strategy with real people at heart.", color: C_BLUE },
    { title: "Courage to lead", desc: "We tell our clients the truth, even when it's uncomfortable.", color: C_GREEN },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
${ambientBackground}
      <div className="relative z-10 pt-24 pb-32">
        <div className="max-w-[800px] mx-auto px-6 text-center mb-24 md:mb-32">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: C_BLUE }}>Identity</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Mission & <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, \${C_BLUE}, \${C_GREEN})\` }}>Vision.</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            The principles that drive our consultancy forward.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            <div className="bg-white/80 backdrop-blur-xl rounded-[48px] p-10 md:p-16 border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5841F]/10 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: \`\${C_ORANGE}15\`, color: C_ORANGE }}>
                  <span className="font-bold text-[24px]">M</span>
                </div>
                <div className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold uppercase tracking-[0.2em] mb-4 text-[#1a1a1a]/40">Our Mission</div>
                <p className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-[#1a1a1a] leading-[1.25] tracking-tight">
                  To bridge the gap between hospitality ambition and operational reality.
                </p>
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] rounded-[48px] p-10 md:p-16 border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#E91E8C]/20 blur-[80px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-50" />
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/10 text-white">
                  <span className="font-bold text-[24px]">V</span>
                </div>
                <div className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold uppercase tracking-[0.2em] mb-4 text-white/50">Our Vision</div>
                <p className="font-['Plus_Jakarta_Sans'] font-extrabold text-[28px] md:text-[36px] text-white leading-[1.25] tracking-tight">
                  A hospitality industry where every passionate entrepreneur has access to world-class expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[40px] tracking-tight text-[#1a1a1a]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white/60 backdrop-blur-xl p-10 md:p-12 rounded-[40px] border border-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:-translate-y-2 transition-transform duration-500">
                <div className="w-12 h-1.5 rounded-full mb-8" style={{ background: v.color }} />
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[22px] text-[#1a1a1a] mb-4 leading-[1.3]">{v.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.7] font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(servicesPageRegex, newServicesPage + '\n\n');
content = content.replace(storiesPageRegex, newStoriesPage + '\n\n');
content = content.replace(missionPageRegex, newMissionPage + '\n\n');

fs.writeFileSync('src/app/App.tsx', content);

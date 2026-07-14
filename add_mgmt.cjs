const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// Update Page type
if (!content.includes('"management"')) {
  content = content.replace(
    /type Page = "home" \| "services" \| "stories" \| "about" \| "mission" \| "fnb" \| "catering" \| "recruitment" \| "marketing" \| "events" \| "contact";/,
    'type Page = "home" | "services" | "stories" | "about" | "mission" | "fnb" | "catering" | "recruitment" | "marketing" | "events" | "management" | "contact";'
  );
}

// Update imports
content = content.replace(
  /import \{([^}]+)\} from 'lucide-react';/,
  function(match, p1) {
    if (!p1.includes('PieChart,')) {
      return "import { " + p1 + ", PieChart, Building, Monitor } from 'lucide-react';";
    }
    return match;
  }
);

// Update links in HomePage and ServicesPage
content = content.replace(
  /\{ img: mgmtIcon, label: "Management", page: "services", color: C_ORANGE, glow: \`\$\{C_ORANGE\}35\` \}/g,
  '{ img: mgmtIcon, label: "Management", page: "management", color: C_ORANGE, glow: `${C_ORANGE}35` }'
);
content = content.replace(
  /\{ img: mgmtIcon, label: "Management & Consultancy", page: "services", color: C_ORANGE, glow: \`\$\{C_ORANGE\}35\` \}/g, // Just in case
  '{ img: mgmtIcon, label: "Management & Consultancy", page: "management", color: C_ORANGE, glow: `${C_ORANGE}35` }'
);

const mgmtPageCode = `
function ManagementPage({ go }: { go: (p: Page) => void }) {
  const competencies = [
    { icon: PieChart, title: "Operations & Finance", text: "Optimize your bottom line with ROI analysis, data-driven menu engineering, stringent cost control, and accurate budgeting.", color: C_ORANGE, img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" },
    { icon: Briefcase, title: "Corporate Finance & Structure", text: "Professional oversight to stabilize and scale, including crisis management, legal structuring, and HR/payroll optimization.", color: C_PINK, img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" },
    { icon: Building, title: "Hotel & Resort Consultancy", text: "Specialized asset management, strict brand standard compliance, and professional management agreements for large-scale properties.", color: C_BLUE, img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" },
    { icon: Monitor, title: "Integrated Technology", text: "Equipping your team with robust POS system integration, guest-facing digital solutions, and real-time analytical tools.", color: C_GREEN, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" },
    { icon: Palette, title: "Marketing & Brand Identity", text: "Elevating your market presence through cohesive identity design, menu aesthetics, and conversion-focused SEO.", color: C_ORANGE, img: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80" }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#F5841F]/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#E91E8C]/15 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#F5841F]/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-0">
        
        {/* Section 1: Division Header & Intro */}
        <div className="px-6 mb-32">
          <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-sm border border-black/5 mt-8 group bg-white/40 backdrop-blur-xl">
            {/* Added Hero Image blending gracefully without black borders */}
            <div className="absolute inset-0 w-full h-full p-6">
              <ImageWithFallback src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80" alt="Management & Consultancy" className="w-full h-full object-cover rounded-[32px] opacity-20 transition-transform duration-[2s] group-hover:scale-[1.03]" />
            </div>
            
            <div className="relative z-10 bg-white/90 backdrop-blur-2xl max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <span className="inline-block py-2 px-6 rounded-full bg-white text-[#1a1a1a] text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-black/5 shadow-sm" style={{ color: C_ORANGE }}>Specialized Division</span>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Management & Consultancy:<br/>Driving Operational Excellence
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[800px] mx-auto">
                We operate as strategic partners in your business success. Anchored in 13+ years of global experience, we provide end-to-end management solutions that transition F&B and hospitality ventures from operational challenges to sustained profitability. We repair weak spots and elevate strengths through rigorous analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Strategic Core Competencies (The 5 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32 px-6">
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-[#1a1a1a]/50">Competencies</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">Strategic Core Competencies</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {competencies.map((item, i) => (
              <div key={i} className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 flex flex-col group">
                {/* Background image in the box */}
                <div className="absolute inset-0 z-0">
                  <ImageWithFallback src={item.img} alt={item.title} className="w-full h-full object-cover opacity-10 transition-transform duration-[2s] group-hover:scale-[1.05]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40" />
                </div>
                
                <div className="relative z-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm bg-white" style={{ color: item.color }}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/70 font-medium">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Partner With Us? (Footer CTA) */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#F5841F]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/15 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[800px] mx-auto text-center">
            <span className="inline-block py-2 px-6 rounded-full bg-white/10 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/10 shadow-sm">Why Partner With Us?</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[56px] text-white mb-6 tracking-tight leading-[1.1]">
              Practical, Sustainable, and Scalable Solutions
            </h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-white/70 leading-[1.8] font-medium max-w-[600px] mx-auto mb-10">
              Founded on the 'been there, done that' philosophy, we combine academic rigor with hands-on operational experience. Let us supply the strategic plans necessary to achieve industry-leading results.
            </p>
            <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-10 py-5 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(245,132,31,0.5)] group" style={{ background: C_ORANGE }}>
              Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
`;

const contactRegex = /function ContactPage/;
if (content.match(contactRegex) && !content.includes('function ManagementPage')) {
  content = content.replace(contactRegex, mgmtPageCode + '\n\n$&');
}

const routingRegex = /\{page === "events" && <EventsPage go=\{go\} \/>\}/;
if (content.match(routingRegex) && !content.includes('<ManagementPage')) {
  content = content.replace(routingRegex, `$&
      {page === "management" && <ManagementPage go={go} />}`);
}

fs.writeFileSync('src/app/App.tsx', content);

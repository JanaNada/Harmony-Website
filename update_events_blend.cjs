const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const eventsPageRegex = /function EventsPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function ContactPage)/;

const newEventsPage = `function EventsPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Building2, title: "Corporate & Business", text: "Conferences, seminars, and annual meetings managed flawlessly to project your brand's authority.", color: C_BLUE },
    { icon: Landmark, title: "Governmental & Official", text: "Executing high-profile functions with strict protocol expertise, professionalism, and security.", color: C_GREEN },
    { icon: Music, title: "Celebrations & Social", text: "Crafting aesthetic, culinary, and atmospheric elements for grand weddings, proms, and intimate gatherings.", color: C_PINK },
    { icon: LayoutTemplate, title: "Exhibitions & Activations", text: "Bringing brand activations to life by managing everything from stand logistics to crowd flow.", color: C_ORANGE }
  ];

  const advantages = [
    { title: "Creative Concepts", text: "We develop unique concepts that reflect your brand’s personality and the event's purpose." },
    { title: "End-to-End Logistics", text: "We manage the entire lifecycle, including venue coordination, supply chains, and on-site troubleshooting." },
    { title: "Seamless Experience", text: "We meticulously align all departments to ensure a smooth, stress-free experience for your guests." },
    { title: "Professionalism", text: "We apply the same elite standards of quality, safety, and operational excellence to every single detail." }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#E91E8C]/20 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#3AADE0]/15 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#F5841F]/20 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-0">
        
        {/* Section 1: Division Header & Intro */}
        <div className="px-6 mb-32">
          <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-sm border border-black/5 mt-8 group bg-white/40 backdrop-blur-xl">
            {/* Added Hero Image blending gracefully without black borders */}
            <div className="absolute inset-0 w-full h-full p-6">
              <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=1600&q=80" alt="Event Management" className="w-full h-full object-cover rounded-[32px] opacity-20 transition-transform duration-[2s] group-hover:scale-[1.03]" />
            </div>
            
            <div className="relative z-10 bg-white/90 backdrop-blur-2xl max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
              <span className="inline-block py-2 px-6 rounded-full bg-white text-[#1a1a1a] text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-black/5 shadow-sm" style={{ color: C_PINK }}>Specialized Division</span>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Event Management Division:<br/>Crafting Unforgettable Experiences
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[800px] mx-auto">
                We transform visions into seamless, high-impact realities. By combining creative conceptualization with rigorous logistical precision, we ensure every detail—from the initial spark to the final guest departure—is managed with professional care.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Our Expertise (The 4 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32 px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">We Curate Experiences</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pillars.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 text-center flex flex-col items-center group">
                {/* Colorful vibrant icons */}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: \`\${item.color}15\`, color: item.color }}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/60 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Partner with HCH? */}
        <div className="max-w-[1400px] mx-auto mb-32 px-6">
          <div className="rounded-[48px] p-8 md:p-16 border border-white/30 shadow-2xl relative overflow-hidden group">
            {/* Blended multi-color ambient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E91E8C] via-[#3AADE0] to-[#F5841F] opacity-90 transition-transform duration-1000 group-hover:scale-105" />

            <div className="relative z-10">
              <div className="text-center mb-16">
                <span className="inline-block py-2 px-6 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-white/10 shadow-sm">Advantage</span>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[48px] text-white leading-[1.1] tracking-tight">The HCH Advantage</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {advantages.map((adv, i) => (
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

        {/* Section 4: Our Commitment (Footer) */}
        <div className="w-full bg-[#111111] py-24 md:py-32 px-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-[#E91E8C]/20 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-[#3AADE0]/20 blur-[150px] rounded-full pointer-events-none" />
          
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

      </div>
    </div>
  );
}
`;

content = content.replace(eventsPageRegex, newEventsPage + '\n\n');
fs.writeFileSync('src/app/App.tsx', content);

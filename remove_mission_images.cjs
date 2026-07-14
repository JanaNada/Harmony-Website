const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const missionPageRegex = /function MissionPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function ContactPage)/;

const newMissionPage = `function MissionPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Settings, title: "Operational Excellence", text: "We repair weak spots and elevate strengths through strategic planning and precise analysis.", color: C_ORANGE },
    { icon: Users, title: "Human Capital Development", text: "We build high-performing teams through expert recruitment and hands-on training for long-term stability.", color: C_PINK },
    { icon: ShieldCheck, title: "Quality & Safety", text: "We deliver world-class F&B and facility services, strictly adhering to the highest international safety and hygiene standards.", color: C_BLUE },
    { icon: Lightbulb, title: "Creative Innovation", text: "We blend concept creation with artistic execution—from menu engineering to digital marketing—to deliver memorable customer experiences.", color: C_GREEN },
    { icon: Handshake, title: "Client-Centric Approach", text: "We handle the complex operations and logistics so you can focus on your core business. We build long-term partnerships by understanding your unique brand story.", color: C_ORANGE }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      {/* Soft Colorful Ambient Backgrounds (Fixed to cover entire scroll) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32">
        
        {/* Section 1: Our Mission */}
        <div className="max-w-[800px] mx-auto px-6 mb-32 md:mb-40 text-center">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: C_ORANGE }}>Mission</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, \${C_ORANGE}, \${C_PINK})\` }}>Mission.</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            Our mission is to bridge the gap between operational excellence and sustainable growth. We offer end-to-end, integrated solutions tailored to your unique brand.
          </p>
        </div>

        {/* Section 2: Our Commitments (The 5 Pillars) */}
        <div className="max-w-[1200px] mx-auto px-6 mb-32 md:mb-40">
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
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <div className="w-full bg-[#111111] py-24 md:py-32 px-6 md:px-12 relative overflow-hidden rounded-[48px]">
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

content = content.replace(missionPageRegex, newMissionPage + '\n\n');
fs.writeFileSync('src/app/App.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// Update icons
content = content.replace(
  /import \{([^}]+)\} from "lucide-react";/,
  (match, p1) => {
    if (!p1.includes('Coffee')) {
      return `import { ${p1}, Coffee, Briefcase, PartyPopper, Sparkles } from "lucide-react";`;
    }
    return match;
  }
);

// Replace CateringPage
const cateringRegex = /function CateringPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function ContactPage)/;

const newCateringPage = `function CateringPage({ go }: { go: (p: Page) => void }) {
  const pillars = [
    { icon: Coffee, title: "Diverse Menus", text: "From quick coffee breaks to elaborate gala dinners, our menus are customized to suit the exact tone of your event.", color: C_ORANGE },
    { icon: Briefcase, title: "Corporate Catering", text: "Reliable, efficient catering for business meetings and conferences to keep your team energized and focused.", color: C_BLUE },
    { icon: PartyPopper, title: "Event Solutions", text: "Managing the logistics of delivery, setup, and service for large-scale exhibitions and exclusive gatherings alike.", color: C_PINK },
    { icon: Sparkles, title: "Cleanliness & Safety", text: "Maintaining the highest international hygiene benchmarks, ensuring all preparation and service areas are impeccable.", color: C_GREEN }
  ];

  const advantages = [
    { title: "First-Hand Expertise", text: "Deep F&B roots mean we understand exactly how catering fits into your event's wider operational success." },
    { title: "Logistical Precision", text: "We flawlessly manage the entire supply chain, ensuring timely delivery, seamless setup, and fluid service." },
    { title: "Value-Added Service", text: "We bring strict operational discipline to presentation and consistency so you can focus entirely on your guests." },
    { title: "Trusted Quality", text: "We are the reliable partner for prestigious organizations, consistently matching the elite standards of our clients." }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#F5841F]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#3AADE0]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32 px-6">
        {/* Section 1: Division Header & Philosophy */}
        <div className="relative w-full max-w-[1200px] mx-auto min-h-[60vh] rounded-[48px] overflow-hidden flex items-center justify-center shadow-2xl border border-white/50 mb-32">
          {/* CRITICAL: GREY PLACEHOLDER FOR IMAGE */}
          <div className="absolute inset-0 w-full h-full bg-[#E0DCD5]"></div>
          
          <div className="relative z-10 bg-white/80 backdrop-blur-2xl max-w-[900px] w-[90%] p-10 md:p-16 rounded-[40px] text-center border border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)] mt-8">
            <span className="inline-block py-2 px-6 rounded-full bg-white text-[#1a1a1a] text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-black/5 shadow-sm" style={{ color: C_PINK }}>Specialized Service</span>
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[52px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
              Catering Services:<br/>Culinary Excellence, Delivered
            </h1>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[800px] mx-auto">
              We redefine the catering experience by blending culinary artistry with operational precision. Whether hosting an intimate corporate breakfast or a high-profile gala, we deliver 'home-style' taste, impeccable hygiene, and professional service. We believe food is the centerpiece of any successful gathering; every meal is not just prepared—it is crafted.
            </p>
          </div>
        </div>

        {/* Section 2: What We Offer (The 4 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32">
          <div className="text-center mb-16 md:mb-20">
            <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-[#1a1a1a]/50">Solutions</span>
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a]">Tailored Catering Solutions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {pillars.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 text-center flex flex-col items-center group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" style={{ backgroundColor: \`\${item.color}15\`, color: item.color }}>
                  <item.icon size={28} />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/60 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why Choose HCH? */}
        <div className="max-w-[1400px] mx-auto mb-32">
          <div className="rounded-[48px] p-8 md:p-16 border border-white/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E91E8C] via-[#F5841F] to-[#E91E8C] opacity-90 transition-transform duration-1000 group-hover:scale-105" />
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                <span className="inline-block py-2 px-6 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md border border-white/20 shadow-sm">The HCH Advantage</span>
                <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[36px] md:text-[48px] text-white leading-[1.1] tracking-tight">Why Choose HCH?</h2>
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

        {/* Section 4: Our Commitment (Footer CTA) */}
        <div className="max-w-[800px] mx-auto text-center">
           <div className="bg-white/80 backdrop-blur-xl p-10 md:p-16 rounded-[48px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-white">
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[40px] tracking-tight text-[#1a1a1a] mb-6">Your Preferred Catering Partner</h2>
             <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8] max-w-[600px] mx-auto mb-10">
               We take pride in the operational rigor required to turn any gathering into a truly memorable experience. Let us meet your catering requirements with accuracy, professionalism, and a genuine passion for hospitality.
             </p>
             <button onClick={() => go("contact")} className="inline-flex items-center gap-3 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white px-8 py-4 rounded-full transition-all duration-300 hover:scale-[1.05] shadow-[0_15px_30px_-10px_rgba(233,30,140,0.5)] group" style={{ background: \`linear-gradient(135deg, \${C_PINK}, \${C_ORANGE})\` }}>
               Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>

      </div>
    </div>
  );
}
`;

content = content.replace(cateringRegex, newCateringPage + '\n\n');
fs.writeFileSync('src/app/App.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const storiesPageRegex = /function StoriesPage\(\{ go \}: \{ go: \(p: Page\) => void \}\) \{[\s\S]*?(?=function AboutPage)/;

const newStoriesPage = `function StoriesPage({ go }: { go: (p: Page) => void }) {
  // Empty placeholder array to maintain the exact grid structure without actual stories or images
  const placeholderCards = [1, 2, 3];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">

      {/* Soft Colorful Ambient Backgrounds (Fixed to cover entire scroll) */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#F5841F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] bg-[#E91E8C]/15 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32">
        <div className="max-w-[800px] mx-auto px-6 text-center mb-20 md:mb-32">
          <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: "#E91E8C" }}>Portfolio</span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[60px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
            Our <span className="text-transparent bg-clip-text" style={{ backgroundImage: \`linear-gradient(135deg, #E91E8C, #3AADE0)\` }}>Stories.</span>
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] leading-[1.8] text-[#1a1a1a]/70 font-medium">
            30+ projects across 4 continents. Real challenges, real results.
          </p>
        </div>

        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {placeholderCards.map((_, i) => (
              <div key={i} className="group bg-white/60 backdrop-blur-xl rounded-[40px] p-4 border border-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] transition-all duration-500">
                {/* Empty Image Placeholder */}
                <div className="relative overflow-hidden bg-[#E0DCD5] rounded-[32px] aspect-[4/3] mb-6 flex items-center justify-center border border-black/5">
                  <div className="font-['Plus_Jakarta_Sans'] font-bold text-[#1a1a1a]/20 text-[14px] uppercase tracking-widest">
                    Image
                  </div>
                </div>
                {/* Empty Text Skeleton Structure */}
                <div className="px-4 pb-4">
                  <div className="w-3/4 h-6 bg-black/5 rounded-md mb-3" />
                  <div className="w-1/2 h-4 bg-black/5 rounded-md mb-6" />
                  <div className="pt-5 border-t border-black/[0.05]">
                    <div className="font-['Plus_Jakarta_Sans'] text-[11px] font-bold uppercase tracking-[0.1em] text-[#1a1a1a]/40 mb-3">The Result</div>
                    <div className="w-full h-4 bg-black/5 rounded-md mb-2" />
                    <div className="w-4/5 h-4 bg-black/5 rounded-md" />
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

content = content.replace(storiesPageRegex, newStoriesPage + '\n\n');
fs.writeFileSync('src/app/App.tsx', content);

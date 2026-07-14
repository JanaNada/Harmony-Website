const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// 1. Update Page type
if (!content.includes('"recruitment"')) {
  content = content.replace(
    /type Page = "home" \| "services" \| "stories" \| "about" \| "mission" \| "fnb" \| "catering" \| "contact";/,
    'type Page = "home" | "services" | "stories" | "about" | "mission" | "fnb" | "catering" | "recruitment" | "contact";'
  );
}

// 2. Fix the link in ServicesPage
const oldRecruitmentLink = /\{ img: recruitmentIcon, label: "Recruitment", page: "about", color: C_GREEN, glow: `\$\{C_GREEN\}35` \}/;
if (content.match(oldRecruitmentLink)) {
  content = content.replace(oldRecruitmentLink, '{ img: recruitmentIcon, label: "Recruitment", page: "recruitment", color: C_GREEN, glow: `${C_GREEN}35` }');
}

// 3. Define the new page
const recruitmentPageCode = `
function RecruitmentPage({ go }: { go: (p: Page) => void }) {
  const recruitmentPillars = [
    { title: "Candidate Sourcing", text: "Selecting top-quality candidates perfectly compatible with the job." },
    { title: "Technical Assessments", text: "Facilitating tests to guarantee candidates possess the required skills." },
    { title: "Interview Management", text: "Conducting initial interviews to deliver only a highly curated shortlist." },
    { title: "Continuity & Replacement", text: "Ensuring stability with guaranteed replacements within an agreed grace period." }
  ];

  const trainingPrograms = [
    { title: "Customized Upskilling", text: "Focused programs designed to train employees for their exact titles and responsibilities." },
    { title: "Practical Preparation", text: "Training candidates on the core realities of your business so they are fully prepared on day one." },
    { title: "Data-Driven Stability", text: "Utilizing our labor analyzing system to monitor workforce effectiveness and drastically reduce turnover." }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF7F2] text-[#1a1a1a] relative">
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[0%] left-[-10%] w-[50vw] h-[50vw] bg-[#78BE1F]/15 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] bg-[#3AADE0]/10 blur-[150px] rounded-full mix-blend-multiply" />
      </div>

      <div className="relative z-10 pt-24 pb-32 px-6">
        
        {/* Section 1: Department Header & Overview */}
        <div className="max-w-[1200px] mx-auto mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-full aspect-[4/3] bg-[#E0DCD5] rounded-[40px] shadow-2xl border border-white/50"></div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="inline-block py-2 px-6 rounded-full bg-white shadow-sm text-[11px] font-bold uppercase tracking-[0.2em] mb-6 text-[#78BE1F]">Department</span>
              <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">
                Training & Recruitment Solutions
              </h1>
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-[1.8] font-medium">
                Founded in 2012, Harmony Club House provides specialized hiring and professional development solutions. We ensure our clients receive high-quality, risk-free, and highly skilled employees ready to meet the dynamic demands of the market.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Vision & Mission (Split Layout) */}
        <div className="max-w-[1200px] mx-auto mb-32 rounded-[48px] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60">
          {/* Left Side - Our Vision */}
          <div className="md:w-1/2 bg-white/90 backdrop-blur-xl p-10 md:p-16">
             <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8" style={{ backgroundColor: \`\${C_BLUE}15\`, color: C_BLUE }}>
               <span className="font-bold text-[24px]">V</span>
             </div>
             <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] text-[#1a1a1a] mb-6">Our Vision</h2>
             <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/70 leading-[1.8] font-medium">
               To provide services beyond expectations by generating perfectly matched applicants. We identify, vet, and train qualified candidates before they ever reach your HR department.
             </p>
          </div>
          
          {/* Right Side - Our Mission */}
          <div className="md:w-1/2 bg-[#1a1a1a] p-10 md:p-16 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#78BE1F]/20 blur-[80px] rounded-full pointer-events-none" />
             <div className="relative z-10">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-white/10">
                 <span className="font-bold text-[24px]">M</span>
               </div>
               <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] text-white mb-8">Our Mission</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-2" style={{ color: C_GREEN }}>Team Building</h3>
                   <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-white/70 leading-[1.6]">Creating harmonious, highly-qualified teams.</p>
                 </div>
                 <div>
                   <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-2" style={{ color: C_GREEN }}>Performance Enhancement</h3>
                   <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-white/70 leading-[1.6]">Tailored training programs to elevate staff performance.</p>
                 </div>
                 <div>
                   <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] mb-2" style={{ color: C_GREEN }}>Staff Stability</h3>
                   <p className="font-['Plus_Jakarta_Sans'] text-[14px] text-white/70 leading-[1.6]">Maintaining workforce stability through our proprietary labor analyzing system.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Section 3: Recruitment Services (The 4 Pillars) */}
        <div className="max-w-[1200px] mx-auto mb-32">
          <div className="text-center mb-16 md:mb-20 max-w-[800px] mx-auto">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a] mb-6">End-to-End Recruitment Services</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8]">
              We act as an extension of your HR department, handling the entire recruitment lifecycle:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {recruitmentPillars.map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] border border-white hover:-translate-y-2 transition-transform duration-500 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#EBE7E0] border border-black/5 mb-6 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-[#1a1a1a]/10" />
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#1a1a1a] mb-3 leading-[1.3] tracking-tight">{item.title}</h3>
                <p className="font-['Plus_Jakarta_Sans'] text-[14px] leading-[1.6] text-[#1a1a1a]/60 font-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Professional Training Programs */}
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 md:mb-20 max-w-[800px] mx-auto">
            <h2 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[32px] md:text-[48px] tracking-tight text-[#1a1a1a] mb-6">Professional Training Programs</h2>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8]">
              A team is only as good as its training. We bridge the gap between potential and performance:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {trainingPrograms.map((program, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white group hover:-translate-y-2 transition-transform duration-500">
                <div className="w-full aspect-[4/3] bg-[#E0DCD5]"></div>
                <div className="p-8 md:p-10">
                  <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-[22px] text-[#1a1a1a] mb-4 leading-[1.3]">{program.title}</h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] leading-[1.7] text-[#1a1a1a]/60">{program.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
`;

// Inject the component before ContactPage
const contactRegex = /function ContactPage/;
if (content.match(contactRegex) && !content.includes('function RecruitmentPage')) {
  content = content.replace(contactRegex, recruitmentPageCode + '\n\n$&');
}

// Inject the routing logic in App
const routingRegex = /\{page === "catering" && <CateringPage go=\{go\} \/>\}/;
if (content.match(routingRegex) && !content.includes('<RecruitmentPage')) {
  content = content.replace(routingRegex, `$&
      {page === "recruitment" && <RecruitmentPage go={go} />}`);
}

fs.writeFileSync('src/app/App.tsx', content);

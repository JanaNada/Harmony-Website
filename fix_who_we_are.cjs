const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const oldHeroRegex = /\{\/\* Premium About Hero Image \*\/\}[\s\S]*?\{\/\* Section 1: Who We Are & Our Story \*\/\}/;

content = content.replace(oldHeroRegex, '{/* Section 1: Who We Are & Our Story */}');

const section1Regex = /\{\/\* Section 1: Who We Are & Our Story \*\/\}[\s\S]*?\{\/\* Section 2: Why Partner With Us\? \*\/\}/;

const newSection1 = `{/* Section 1: Who We Are & Our Story */}
      <section className="py-20 md:py-32 bg-[#FAF7F2]">
        <div className="max-w-[1200px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#1a1a1a] mb-6" style={{ fontSize: "clamp(36px, 5vw, 48px)" }}>Who We Are</h1>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] text-[#1a1a1a]/60 leading-[1.8]">
              Established in 2012, Harmony Club House (HCH) stands as a premier platform for F&B development and hospitality consultancy. We are a dedicated team of passionate entrepreneurs and experts, bringing over 13 years of hands-on international experience across four continents. We do not just consult; we partner with you to redefine industry standards. From initial feasibility studies and innovative kitchen design to menu engineering and complete operational restructuring, we have successfully launched over 30 projects and trained more than 2,500 professionals.
            </p>
          </div>
          <div className="order-1 lg:order-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#F5841F]/40 via-[#E91E8C]/20 to-[#3AADE0]/40 blur-[80px] opacity-50 rounded-[40px] transition-all duration-700 group-hover:opacity-70 group-hover:blur-[100px]" />
            <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-black/[0.04]">
              <ImageWithFallback src={aboutHeroImg} alt="Who We Are" className="w-full aspect-[4/5] object-cover transition-transform duration-[1.5s] hover:scale-[1.02]" />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Why Partner With Us? */}`;

content = content.replace(section1Regex, newSection1);

fs.writeFileSync('src/app/App.tsx', content);

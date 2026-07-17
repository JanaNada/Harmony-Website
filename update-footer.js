const fs = require('fs');
let code = fs.readFileSync('src/app/App.tsx', 'utf8');

const footerCode = \
const FOOTER_SERVICES = [
  { id: "management", color: "#F5841F", label: "Management", features: ["Pre-opening planning & setup", "Operations audit & restructuring", "Menu engineering", "P&L optimization"] },
  { id: "events", color: "#E91E8C", label: "Events", features: ["Venue scouting & negotiation", "Bespoke catering design", "AV & décor coordination", "Guest management"] },
  { id: "marketing", color: "#3AADE0", label: "Marketing", features: ["Brand identity & positioning", "Social media strategy", "Influencer & PR campaigns", "Photography direction"] },
  { id: "recruitment", color: "#78BE1F", label: "Recruitment", features: ["Executive placement", "Chef & culinary sourcing", "FOH & BOH recruitment", "Event & seasonal staffing"] }
];

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 w-full mt-24">
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #F5841F, #E91E8C, #3AADE0, #78BE1F)' }} />
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border border-gray-100 p-1.5 shadow-sm">
                <img src="/imports/friend-logo.png" alt="HCH" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-[#1a1a1a] text-[15px] tracking-tight leading-none mb-1.5">HARMONY CLUB HOUSE</div>
                <div className="font-['Plus_Jakarta_Sans'] text-[11px] text-[#1a1a1a]/40 font-bold uppercase tracking-wider">Est. 2012 · Cairo, Egypt</div>
              </div>
            </div>
            <p className="font-['Plus_Jakarta_Sans'] text-[15px] text-[#1a1a1a]/60 font-medium leading-[1.8] max-w-[320px]">
              Premier F&B development and hospitality consultancy with over 13 years of international excellence.
            </p>
          </div>
          {FOOTER_SERVICES.map(s => (
            <div key={s.id}>
              <div className="font-['Plus_Jakarta_Sans'] text-[12px] font-extrabold mb-4 uppercase tracking-[0.1em]" style={{ color: s.color }}>{s.label}</div>
              {s.features.map(f => (
                <div key={f} className="font-['Plus_Jakarta_Sans'] text-[14px] text-[#1a1a1a]/50 mb-3 hover:text-[#1a1a1a] cursor-pointer transition-colors leading-relaxed font-medium">{f}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-black/[0.04] flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-[#1a1a1a]/40 font-['Plus_Jakarta_Sans'] font-medium">
          <span>© 2024 Harmony Club House. All rights reserved.</span>
          <div className="flex gap-8">
            {["Privacy", "Terms", "Cookies"].map(l => (
              <span key={l} className="hover:text-[#1a1a1a] cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
\;

// Insert Footer definition before App component
code = code.replace(/export default function App\(\) \{/, footerCode + '\nexport default function App() {');

// We have exactly 12 page components to update.
const pageNames = [
  "HomePage", "ServicesPage", "StoriesPage", "AboutPage", 
  "MissionPage", "FnbPage", "CateringPage", "RecruitmentPage", 
  "MarketingPage", "EventsPage", "ManagementPage", "ContactPage"
];

for (const p of pageNames) {
  // We look for the page function, then find the last </div> before the closing ); }
  const regex = new RegExp(\(function \[\\\\s\\\\S]*?)(</div>\\\\s*\\\\)\\\\s*;\\\\s*\\\\})\, 'g');
  code = code.replace(regex, '\  <Footer />\\n    \');
}

fs.writeFileSync('src/app/App.tsx', code, 'utf8');
console.log('Updated App.tsx successfully');

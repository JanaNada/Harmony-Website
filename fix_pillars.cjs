const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// There's a lingering pillars.map in ServicesPage because of a messy previous replace.
// Let's remove the bad block from ServicesPage.

const badServicesSectionRegex = /\{\/\* Section 2: Our Commitments \(The 5 Pillars\) \*\/\}\s*<div className="max-w-\[1200px\] mx-auto px-6 mb-16">\s*<div className="text-center mb-16 md:mb-20">\s*<h2 className="font-\['Plus_Jakarta_Sans'\] font-extrabold text-\[32px\] md:text-\[48px\] tracking-tight text-\[\#1a1a1a\]">We are committed to:<\/h2>\s*<\/div>\s*\{\/\* Centering a 5-card grid by using flex wrap or custom grid col spans \*\/\}\s*<div className="flex flex-wrap justify-center gap-6 md:gap-8">\s*\{pillars\.map\(\(p, i\) => \([\s\S]*?<\/div>\s*\)\)\}\s*<\/div>\s*<\/div>\s*\{\/\* Section 3: Our Vision \*\/\}\s*<div className="w-full px-0">\s*<div className="w-full bg-\[\#111111\] py-16 px-6 md:px-12 relative overflow-hidden">\s*\{\/\* Premium dark glows \*\/\}\s*<div className="absolute top-\[-10%\] right-\[-5%\] w-\[500px\] h-\[500px\] bg-\[\#3AADE0\]\/20 blur-\[120px\] rounded-full pointer-events-none" \/>\s*<div className="absolute bottom-\[-10%\] left-\[-5%\] w-\[500px\] h-\[500px\] bg-\[\#E91E8C\]\/20 blur-\[120px\] rounded-full pointer-events-none" \/>\s*<div className="relative z-10 max-w-\[900px\] mx-auto text-center">\s*<span className="inline-block py-2 px-6 rounded-full bg-white\/10 text-white backdrop-blur-md border border-white\/10 text-\[11px\] font-bold uppercase tracking-\[0\.2em\] mb-8">Vision<\/span>\s*<h2 className="font-\['Plus_Jakarta_Sans'\] font-extrabold text-\[40px\] md:text-\[64px\] tracking-tight text-white mb-8">\s*Our Vision\s*<\/h2>\s*<p className="font-\['Plus_Jakarta_Sans'\] text-\[18px\] md:text-\[22px\] text-white\/70 leading-\[1\.7\] font-medium">\s*To become a leading force in the hospitality industry by providing services beyond expectations\. We implement flawless operational and event experiences that exceed client goals and unlock every project's highest potential\.\s*<\/p>\s*<\/div>\s*<\/div>\s*<\/div>/;

content = content.replace(badServicesSectionRegex, '');

fs.writeFileSync('src/app/App.tsx', content);

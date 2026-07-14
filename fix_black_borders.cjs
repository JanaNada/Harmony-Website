const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// F&B Page Top Hero
const fnbHeroRegex = /<div className="absolute inset-0 w-full h-full bg-\[\#111\]">\s*<img\s*src="https:\/\/images\.unsplash\.com\/photo-1514933651103-005eec06c04b\?w=1600&q=80"\s*alt="High-end restaurant"\s*className="w-full h-full object-cover opacity-50 mix-blend-overlay"\s*\/>\s*<\/div>\s*<div className="absolute inset-0 bg-gradient-to-t from-black\/80 via-transparent to-transparent pointer-events-none" \/>/;

const newFnbHero = `<div className="absolute inset-0 w-full h-full bg-[#FAF7F2]">
            <img 
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1600&q=80" 
              alt="High-end restaurant" 
              className="w-full h-full object-cover opacity-20" 
            />
          </div>`;

content = content.replace(fnbHeroRegex, newFnbHero);

// F&B Title text (since the background is now light, we need to make the text dark)
const fnbTextRegex = /<h1 className="font-\['Plus_Jakarta_Sans'\] font-extrabold text-\[40px\] md:text-\[56px\] leading-\[1\.1\] tracking-tight mb-8 text-white">/g;
content = content.replace(fnbTextRegex, '<h1 className="font-[\'Plus_Jakarta_Sans\'] font-extrabold text-[40px] md:text-[56px] leading-[1.1] tracking-tight mb-8 text-[#1a1a1a]">');

const fnbPRegex = /<p className="font-\['Plus_Jakarta_Sans'\] text-\[16px\] md:text-\[20px\] text-white\/90 leading-\[1\.8\] font-medium max-w-\[700px\] mx-auto">/g;
content = content.replace(fnbPRegex, '<p className="font-[\'Plus_Jakarta_Sans\'] text-[16px] md:text-[20px] text-[#1a1a1a]/70 leading-[1.8] font-medium max-w-[700px] mx-auto">');


// Catering Page Top Hero
const cateringHeroRegex = /<div className="absolute inset-0 w-full h-full bg-\[\#E0DCD5\]"><\/div>/;
const newCateringHero = `<div className="absolute inset-0 w-full h-full bg-[#FAF7F2]"></div>`;
content = content.replace(cateringHeroRegex, newCateringHero);


fs.writeFileSync('src/app/App.tsx', content);

const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const missionRegex = /<div className="relative z-10 pt-24 pb-32">[\s\S]*?\{\/\* Section 1: Our Mission \*\/\}\s*<div className="max-w-\[800px\] mx-auto px-6 mb-32 md:mb-40 text-center">/g;

const newMissionIntro = `<div className="relative z-10 pb-16">
        
        {/* Top Image (Full Bleed, No Void Space) */}
        <div className="w-full flex justify-center mb-12">
          <ImageWithFallback 
            src={missionTopImg} 
            alt="Mission and Vision" 
            className="w-full h-auto object-cover" 
          />
        </div>

        {/* Section 1: Our Mission */}
        <div className="max-w-[800px] mx-auto px-6 mb-16 text-center">`;

content = content.replace(missionRegex, newMissionIntro);

// Also fix the other sections to minimize void space
const section2Regex = /<\/div>\s*\{\/\* Section 2: Our Commitments \(The 5 Pillars\) \*\/\}\s*<div className="max-w-\[1200px\] mx-auto px-6 mb-32 md:mb-40">/;
const newSection2 = `</div>

        {/* Section 2: Our Commitments (The 5 Pillars) */}
        <div className="max-w-[1200px] mx-auto px-6 mb-16">`;
content = content.replace(section2Regex, newSection2);


const section3Regex = /<\/div>\s*\{\/\* Section 3: Our Vision \*\/\}\s*<div className="max-w-\[1400px\] mx-auto px-4 md:px-6">/
const newSection3 = `</div>

        {/* Section 3: Our Vision */}
        <div className="w-full px-0">`;
content = content.replace(section3Regex, newSection3);

// The vision block had rounded corners and side padding, removing them to go full bleed
const visionBlockRegex = /<div className="w-full bg-\[#111111\] py-24 md:py-32 px-6 md:px-12 relative overflow-hidden rounded-\[48px\]">/;
const newVisionBlock = `<div className="w-full bg-[#111111] py-16 px-6 md:px-12 relative overflow-hidden">`;
content = content.replace(visionBlockRegex, newVisionBlock);


fs.writeFileSync('src/app/App.tsx', content);

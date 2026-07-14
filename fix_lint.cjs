const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// The error "Source node not found" usually happens when Figma's AST parser gets confused by weird code formatting or unused variables that break compilation.

// Remove unused aboutHeroImg which might be causing issues
content = content.replace(/const aboutHeroImg = "https:\/\/images.unsplash.com\/photo-1566073771259-6a8506099945\?w=800&q=80";\n/, '');

// Make sure the image imports are perfectly clean
const importsBlock = `import logoImg from "@/imports/image-10.png";
import mgmtIcon from "@/imports/image.png";
import eventsIcon from "@/imports/image-2.png";
import marketingIcon from "@/imports/image-3.png";
import recruitmentIcon from "@/imports/image-4.png";
import welcomeImg from "@/imports/image-11.png";
import aboutImg1 from "@/imports/image-12.png";
import aboutImg2 from "@/imports/image-13.png";
import aboutImg3 from "@/imports/image-14.png";
import aboutImg4 from "@/imports/image-15.png";
import interactiveImg from "@/imports/image-5.png";
import partnersBottomImg from "@/imports/image-6.png";`;

content = content.replace(/import logoImg from "@\/imports\/image-10\.png";[\s\S]*?import partnersBottomImg from "@\/imports\/image-6\.png";/, importsBlock);

fs.writeFileSync('src/app/App.tsx', content);

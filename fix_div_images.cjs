const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// 1. Change the imports
if (!content.includes('divFnbImg from "@/imports/image-16.png"')) {
  content = content.replace(/import divFnbImg from "@\/imports\/image-8\.png";/, 'import divFnbImg from "@/imports/image-16.png";');
  content = content.replace(/import divCateringImg from "@\/imports\/image-9\.png";/, 'import divCateringImg from "@/imports/image-17.png";');
}

// 2. Change the aspect and object-cover to object-contain without cutting
content = content.replace(
  /className="relative w-full aspect-\[4\/3\] object-cover rounded-\[32px\] shadow-\[0_20px_40px_-15px_rgba\(0,0,0,0\.1\)\] border border-white\/60 transition-transform duration-700 group-hover:scale-\[1\.02\]"/g,
  'className="relative w-full h-auto object-contain rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white/60 transition-transform duration-700 group-hover:scale-[1.02] bg-white"'
);

fs.writeFileSync('src/app/App.tsx', content);

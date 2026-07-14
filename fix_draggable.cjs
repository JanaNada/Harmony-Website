const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// Add motion import
if (!content.includes('motion/react')) {
  content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { motion } from "motion/react";');
}

if (!content.includes('image-17.png')) {
  content = content.replace('import aboutImg4 from "@/imports/image-15.png";', 'import aboutImg4 from "@/imports/image-15.png";\nimport interactiveImg from "@/imports/image-17.png";');
}

const sectionRegex = /<div className="flex-1 overflow-y-auto bg-white pt-\[104px\]">\s*\{\/\* Section 1: Who We Are & Our Story \*\/\}\s*<section className="py-20 md:py-24 bg-\[\#FAF7F2\]">/;

const newSection = `<div className="flex-1 overflow-y-auto bg-white pt-[70px]">
      {/* Draggable and Resizable Interactive Image */}
      <div className="relative w-full max-w-[1200px] mx-auto z-10" style={{ height: 0 }}>
        <motion.div
          drag
          dragMomentum={false}
          className="absolute bg-white p-2 rounded-2xl shadow-2xl border border-black/5 cursor-grab active:cursor-grabbing"
          style={{
            top: 20,
            left: 20,
            width: 250,
            height: 250,
            resize: "both",
            overflow: "hidden",
            zIndex: 50
          }}
        >
          {/* Resize handle hint */}
          <div className="absolute bottom-1 right-1 w-4 h-4 cursor-se-resize opacity-50 flex items-center justify-center pointer-events-none">
             ↘
          </div>
          <ImageWithFallback src={interactiveImg} alt="Interactive" className="w-full h-full object-cover rounded-xl pointer-events-none" />
        </motion.div>
      </div>

      {/* Section 1: Who We Are & Our Story */}
      <section className="pt-10 pb-20 md:pt-16 md:pb-24 bg-[#FAF7F2]">`;

content = content.replace(sectionRegex, newSection);

fs.writeFileSync('src/app/App.tsx', content);

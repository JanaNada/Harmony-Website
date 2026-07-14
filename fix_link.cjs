const fs = require('fs');
let content = fs.readFileSync('src/app/App.tsx', 'utf8');

const regex = /\{ img: recruitmentIcon, label: "Recruitment", page: "about", color: C_GREEN, glow: \`\$\{C_GREEN\}35\` \}/g;

content = content.replace(regex, '{ img: recruitmentIcon, label: "Recruitment", page: "recruitment", color: C_GREEN, glow: `${C_GREEN}35` }');

fs.writeFileSync('src/app/App.tsx', content);

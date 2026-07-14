const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

content = content.replace(/import mgmtIcon from "@\/imports\/image-5.png";/, 'const mgmtIcon = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80";');
content = content.replace(/import eventsIcon from "@\/imports\/image-6.png";/, 'const eventsIcon = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80";');
content = content.replace(/import marketingIcon from "@\/imports\/image-7.png";/, 'const marketingIcon = "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80";');
content = content.replace(/import recruitmentIcon from "@\/imports\/image-8.png";/, 'const recruitmentIcon = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80";');

content = content.replace(/import interactiveImg from "@\/imports\/image-17.png";/, 'const interactiveImg = "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80";');
content = content.replace(/import aboutHeroImg from "@\/imports\/image-16.png";/, 'const aboutHeroImg = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";');
content = content.replace(/import partnersBottomImg from "@\/imports\/image-18.png";/, 'const partnersBottomImg = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80";');

fs.writeFileSync('src/app/App.tsx', content);

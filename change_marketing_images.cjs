const fs = require('fs');

let content = fs.readFileSync('src/app/App.tsx', 'utf8');

// The main hero image
content = content.replace(
  /src="https:\/\/images.unsplash.com\/photo-1542744173-8e7e53415bb0\?w=1600&q=80"/,
  'src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80"'
);

// Block 1 (Industry Expertise)
content = content.replace(
  /<img src="https:\/\/images.unsplash.com\/photo-1552664730-d307ca884978\?w=800&q=80" alt="Industry Expertise"/,
  '<img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" alt="Industry Expertise"'
);

// Block 2 (Creative Execution)
content = content.replace(
  /<img src="https:\/\/images.unsplash.com\/photo-1600880292203-757bb62b4baf\?w=800&q=80" alt="Creative Execution"/,
  '<img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80" alt="Creative Execution"'
);

// Block 3 (Measurable ROI)
content = content.replace(
  /<img src="https:\/\/images.unsplash.com\/photo-1460925895917-afdab827c52f\?w=800&q=80" alt="Measurable ROI"/,
  '<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Measurable ROI"'
);

fs.writeFileSync('src/app/App.tsx', content);

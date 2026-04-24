const fs = require('fs');
const path = 'web/src/pages/Home/components/LandingHero.jsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  /\/\/ Assume each column is roughly 260px wide \+ 32px gap = 292px/,
  '// Column width: 220px + 32px gap = 252px'
);
fs.writeFileSync(path, content);

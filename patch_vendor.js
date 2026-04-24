const fs = require('fs');

const cssPath = 'web/src/pages/Home/home.css';
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Remove overflow: hidden from robot-layer
css = css.replace(
  /\.ald-home-hero__robot-layer\s*\{[^}]*overflow:\s*hidden;[^}]*\}/g,
  (match) => match.replace(/\s*overflow:\s*hidden;/g, '')
);

// 2. Fix the vendor column width
css = css.replace(
  /\.ald-home-vendor-col\s*\{[^}]*\}/g,
  (match) => {
    // Replace flex: 0 0 130px with flex: 0 0 220px to match child width
    return match.replace(/flex:\s*0\s*0\s*130px;/, 'flex: 0 0 220px;');
  }
);

// 3. Remove media query override for robot-vendors that limits it
css = css.replace(
  /\.ald-home-hero__robot-vendors\s*\{[^}]*left:\s*46%;[^}]*\}/g,
  (match) => {
    return match.replace(/left:\s*46%;/, 'left: 0;')
                .replace(/right:\s*32px;/, '')
                .replace(/width:\s*auto;/, 'width: 100%;');
  }
);

fs.writeFileSync(cssPath, css);


const jsPath = 'web/src/pages/Home/components/LandingHero.jsx';
let js = fs.readFileSync(jsPath, 'utf8');

// Update JS column calculation
js = js.replace(/const colWidth = 292;/g, 'const colWidth = 252;');

fs.writeFileSync(jsPath, js);

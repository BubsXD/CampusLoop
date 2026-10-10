const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const svgBase = (id, grad1, grad2, content) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${grad1}"/>
      <stop offset="100%" stop-color="${grad2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#g-${id})" rx="16"/>
  <circle cx="60" cy="50" r="30" fill="#ffffff" opacity="0.05"/>
  <circle cx="340" cy="240" r="40" fill="#ffffff" opacity="0.05"/>
  <ellipse cx="200" cy="250" rx="90" ry="15" fill="#2E3440" opacity="0.25"/>
  ${content}
</svg>`;

const images = {
  'scientific-calculator.svg': svgBase('calc', '#5E81AC', '#81A1C1', `
    <rect x="140" y="40" width="120" height="200" rx="12" fill="#ECEFF4"/>
    <rect x="150" y="55" width="100" height="50" rx="6" fill="#81A1C1"/>
    <rect x="155" y="120" width="20" height="15" rx="3" fill="#4C566A"/>
    <rect x="185" y="120" width="20" height="15" rx="3" fill="#4C566A"/>
    <rect x="215" y="120" width="20" height="15" rx="3" fill="#4C566A"/>
    <rect x="155" y="145" width="20" height="15" rx="3" fill="#88C0D0"/>
    <rect x="185" y="145" width="20" height="15" rx="3" fill="#D8DEE9"/>
    <rect x="215" y="145" width="20" height="15" rx="3" fill="#D8DEE9"/>
    <rect x="155" y="170" width="20" height="15" rx="3" fill="#D8DEE9"/>
    <rect x="185" y="170" width="20" height="15" rx="3" fill="#D8DEE9"/>
    <rect x="215" y="170" width="20" height="15" rx="3" fill="#D8DEE9"/>
    <rect x="155" y="195" width="20" height="15" rx="3" fill="#D8DEE9"/>
    <rect x="185" y="195" width="20" height="15" rx="3" fill="#D8DEE9"/>
    <rect x="215" y="195" width="20" height="15" rx="3" fill="#EBCB8B"/>
  `),
  'dslr-camera.svg': svgBase('dslr', '#81A1C1', '#B48EAD', `
    <rect x="120" y="120" width="160" height="100" rx="16" fill="#3B4252"/>
    <path d="M 160 120 L 170 90 L 230 90 L 240 120 Z" fill="#4C566A"/>
    <rect x="130" y="105" width="20" height="15" rx="4" fill="#D8DEE9"/>
    <circle cx="200" cy="170" r="50" fill="#2E3440"/>
    <circle cx="200" cy="170" r="40" fill="#4C566A"/>
    <circle cx="200" cy="170" r="25" fill="#2E3440"/>
    <circle cx="210" cy="160" r="5" fill="#ECEFF4" opacity="0.6"/>
  `),
  'drafter-set.svg': svgBase('draft', '#88C0D0', '#A3BE8C', `
    <rect x="100" y="70" width="200" height="150" rx="12" fill="#3B4252"/>
    <path d="M 120 190 L 200 90 L 280 190 Z" fill="none" stroke="#ECEFF4" stroke-width="8" stroke-linejoin="round"/>
    <rect x="130" y="120" width="140" height="12" rx="4" fill="#EBCB8B" transform="rotate(20 200 150)"/>
    <rect x="130" y="170" width="140" height="12" rx="4" fill="#D8DEE9"/>
    <circle cx="200" cy="90" r="8" fill="#4C566A"/>
  `),
  'city-cycle.svg': svgBase('cycle', '#A3BE8C', '#EBCB8B', `
    <circle cx="140" cy="180" r="40" fill="none" stroke="#4C566A" stroke-width="8"/>
    <circle cx="260" cy="180" r="40" fill="none" stroke="#4C566A" stroke-width="8"/>
    <circle cx="140" cy="180" r="30" fill="none" stroke="#D8DEE9" stroke-width="2"/>
    <circle cx="260" cy="180" r="30" fill="none" stroke="#D8DEE9" stroke-width="2"/>
    <path d="M 140 180 L 190 180 L 230 110 L 170 110 Z" fill="none" stroke="#88C0D0" stroke-width="6" stroke-linejoin="round"/>
    <path d="M 190 180 L 170 110 L 160 80" fill="none" stroke="#88C0D0" stroke-width="6" stroke-linecap="round"/>
    <path d="M 260 180 L 230 110 L 240 70" fill="none" stroke="#88C0D0" stroke-width="6" stroke-linecap="round"/>
    <rect x="140" y="75" width="40" height="10" rx="5" fill="#3B4252"/>
    <path d="M 220 70 L 260 70" fill="none" stroke="#3B4252" stroke-width="6" stroke-linecap="round"/>
    <path d="M 245 70 L 245 90 L 275 90 L 275 70 Z" fill="#D8DEE9"/>
  `),
  'engineering-maths-textbook.svg': svgBase('emaths', '#D08770', '#BF616A', `
    <rect x="130" y="50" width="130" height="180" rx="6" fill="#ECEFF4"/>
    <rect x="135" y="50" width="125" height="180" rx="6" fill="#BF616A"/>
    <rect x="135" y="50" width="15" height="180" fill="#3B4252" opacity="0.2"/>
    <path d="M 160 100 Q 190 60 220 100 T 240 140" fill="none" stroke="#EBCB8B" stroke-width="6" stroke-linecap="round"/>
    <path d="M 160 160 L 200 160 L 170 190 L 210 190" fill="none" stroke="#ECEFF4" stroke-width="6" stroke-linejoin="round"/>
  `),
  'arduino-starter-kit.svg': svgBase('arduino', '#5E81AC', '#88C0D0', `
    <rect x="120" y="90" width="150" height="100" rx="8" fill="#88C0D0"/>
    <rect x="120" y="100" width="20" height="30" fill="#ECEFF4"/>
    <rect x="140" y="160" width="60" height="20" fill="#2E3440"/>
    <circle cx="230" cy="140" r="15" fill="#2E3440"/>
    <rect x="130" y="90" width="130" height="8" fill="#3B4252"/>
    <rect x="130" y="182" width="130" height="8" fill="#3B4252"/>
    <circle cx="280" cy="110" r="8" fill="#BF616A"/>
    <path d="M 280 118 L 280 150" stroke="#ECEFF4" stroke-width="3"/>
  `),
  'bluetooth-speaker.svg': svgBase('bt', '#81A1C1', '#B48EAD', `
    <rect x="140" y="60" width="120" height="160" rx="20" fill="#4C566A"/>
    <circle cx="200" cy="140" r="40" fill="#3B4252"/>
    <circle cx="200" cy="140" r="20" fill="#2E3440"/>
    <path d="M 180 50 C 180 30 220 30 220 50" fill="none" stroke="#ECEFF4" stroke-width="6" stroke-linecap="round"/>
    <path d="M 130 140 A 60 60 0 0 0 130 100" fill="none" stroke="#88C0D0" stroke-width="4" stroke-linecap="round"/>
    <path d="M 270 140 A 60 60 0 0 1 270 100" fill="none" stroke="#88C0D0" stroke-width="4" stroke-linecap="round"/>
  `),
  'lab-coat.svg': svgBase('coat', '#B48EAD', '#A3BE8C', `
    <path d="M 180 40 L 220 40 L 200 20 Z" fill="none" stroke="#D08770" stroke-width="6" stroke-linejoin="round"/>
    <path d="M 140 80 Q 200 60 260 80 L 270 160 L 240 160 L 230 250 L 170 250 L 160 160 L 130 160 Z" fill="#ECEFF4"/>
    <path d="M 200 80 L 200 250" fill="none" stroke="#D8DEE9" stroke-width="4"/>
    <path d="M 180 80 L 200 120 L 220 80" fill="none" stroke="#D8DEE9" stroke-width="4" stroke-linejoin="round"/>
    <rect x="210" y="160" width="20" height="25" rx="3" fill="#D8DEE9"/>
    <circle cx="190" cy="140" r="3" fill="#4C566A"/>
    <circle cx="190" cy="170" r="3" fill="#4C566A"/>
    <circle cx="190" cy="200" r="3" fill="#4C566A"/>
  `),
  'casio-fx-991ex.svg': svgBase('casio', '#5E81AC', '#4C566A', `
    <rect x="135" y="40" width="130" height="210" rx="8" fill="#3B4252"/>
    <rect x="145" y="55" width="110" height="40" rx="4" fill="#D8DEE9"/>
    <rect x="155" y="110" width="15" height="10" rx="2" fill="#ECEFF4"/>
    <rect x="180" y="110" width="15" height="10" rx="2" fill="#ECEFF4"/>
    <rect x="205" y="110" width="15" height="10" rx="2" fill="#ECEFF4"/>
    <rect x="230" y="110" width="15" height="10" rx="2" fill="#ECEFF4"/>
    <rect x="155" y="130" width="15" height="10" rx="2" fill="#A3BE8C"/>
    <rect x="180" y="130" width="15" height="10" rx="2" fill="#A3BE8C"/>
    <rect x="205" y="130" width="15" height="10" rx="2" fill="#A3BE8C"/>
    <rect x="230" y="130" width="15" height="10" rx="2" fill="#A3BE8C"/>
    <circle cx="195" cy="165" r="20" fill="#4C566A"/>
    <rect x="155" y="195" width="20" height="12" rx="2" fill="#ECEFF4"/>
    <rect x="190" y="195" width="20" height="12" rx="2" fill="#ECEFF4"/>
    <rect x="225" y="195" width="20" height="12" rx="2" fill="#ECEFF4"/>
    <rect x="155" y="215" width="20" height="12" rx="2" fill="#ECEFF4"/>
    <rect x="190" y="215" width="20" height="12" rx="2" fill="#ECEFF4"/>
    <rect x="225" y="215" width="20" height="12" rx="2" fill="#ECEFF4"/>
  `),
  'mountain-bike.svg': svgBase('mbike', '#A3BE8C', '#BF616A', `
    <circle cx="130" cy="180" r="45" fill="none" stroke="#2E3440" stroke-width="14"/>
    <circle cx="270" cy="180" r="45" fill="none" stroke="#2E3440" stroke-width="14"/>
    <circle cx="130" cy="180" r="35" fill="none" stroke="#D8DEE9" stroke-width="2"/>
    <circle cx="270" cy="180" r="35" fill="none" stroke="#D8DEE9" stroke-width="2"/>
    <path d="M 130 180 L 180 180 L 220 120 L 160 120 Z" fill="none" stroke="#EBCB8B" stroke-width="8" stroke-linejoin="round"/>
    <path d="M 180 180 L 160 120 L 150 90" fill="none" stroke="#EBCB8B" stroke-width="8" stroke-linecap="round"/>
    <path d="M 270 180 L 220 120 L 230 80" fill="none" stroke="#EBCB8B" stroke-width="8" stroke-linecap="round"/>
    <path d="M 220 120 L 250 180" fill="none" stroke="#EBCB8B" stroke-width="6" stroke-linecap="round"/>
    <rect x="130" y="85" width="40" height="10" rx="5" fill="#3B4252"/>
    <path d="M 210 80 L 250 80" fill="none" stroke="#3B4252" stroke-width="8" stroke-linecap="round"/>
  `),
  'data-structures-textbook.svg': svgBase('dst', '#81A1C1', '#5E81AC', `
    <rect x="130" y="50" width="130" height="180" rx="6" fill="#ECEFF4"/>
    <rect x="135" y="50" width="125" height="180" rx="6" fill="#5E81AC"/>
    <rect x="135" y="50" width="15" height="180" fill="#3B4252" opacity="0.2"/>
    <circle cx="195" cy="90" r="12" fill="#ECEFF4"/>
    <circle cx="170" cy="130" r="12" fill="#ECEFF4"/>
    <circle cx="220" cy="130" r="12" fill="#ECEFF4"/>
    <circle cx="195" cy="170" r="12" fill="#ECEFF4"/>
    <path d="M 195 90 L 170 130 M 195 90 L 220 130 M 170 130 L 195 170 M 220 130 L 195 170" fill="none" stroke="#ECEFF4" stroke-width="4"/>
  `),
  'ring-light-tripod.svg': svgBase('ringlight', '#B48EAD', '#D08770', `
    <path d="M 200 160 L 170 260 M 200 160 L 200 260 M 200 160 L 230 260" fill="none" stroke="#4C566A" stroke-width="8" stroke-linecap="round"/>
    <circle cx="200" cy="100" r="50" fill="none" stroke="#EBCB8B" stroke-width="12"/>
    <circle cx="200" cy="100" r="50" fill="none" stroke="#ECEFF4" stroke-width="4" opacity="0.8"/>
    <rect x="190" y="90" width="20" height="30" rx="2" fill="#3B4252"/>
  `)
};

for(let name in images) {
  fs.writeFileSync(path.join(dir, name), images[name]);
}

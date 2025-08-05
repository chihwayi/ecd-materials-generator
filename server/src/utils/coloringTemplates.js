// Realistic coloring book style SVG templates for children

const coloringTemplates = {
  lion: `<svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Lion's mane -->
    <path d="M300 170 C240 140, 180 180, 170 240 C160 290, 180 330, 220 360 C190 390, 210 430, 250 440 C280 450, 360 450, 390 440 C430 430, 450 390, 420 360 C460 330, 480 290, 470 240 C460 180, 400 140, 300 170 Z" 
          fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Lion's head -->
    <ellipse cx="300" cy="260" rx="80" ry="75" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Eyes -->
    <ellipse cx="270" cy="240" rx="12" ry="16" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="330" cy="240" rx="12" ry="16" fill="none" stroke="#000" stroke-width="3"/>
    <circle cx="270" cy="240" r="4" fill="#000"/>
    <circle cx="330" cy="240" r="4" fill="#000"/>
    
    <!-- Nose -->
    <path d="M290 270 L310 270 L300 285 Z" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Mouth -->
    <path d="M300 285 Q285 300 270 295" fill="none" stroke="#000" stroke-width="3"/>
    <path d="M300 285 Q315 300 330 295" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Whiskers -->
    <line x1="240" y1="275" x2="265" y2="270" stroke="#000" stroke-width="2"/>
    <line x1="240" y1="290" x2="265" y2="285" stroke="#000" stroke-width="2"/>
    <line x1="335" y1="270" x2="360" y2="275" stroke="#000" stroke-width="2"/>
    <line x1="335" y1="285" x2="360" y2="290" stroke="#000" stroke-width="2"/>
    
    <!-- Ears -->
    <ellipse cx="260" cy="210" rx="20" ry="28" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="340" cy="210" rx="20" ry="28" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="260" cy="218" rx="12" ry="16" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="340" cy="218" rx="12" ry="16" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Body -->
    <ellipse cx="300" cy="380" rx="100" ry="80" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Legs -->
    <ellipse cx="250" cy="430" rx="20" ry="40" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="285" cy="430" rx="20" ry="40" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="315" cy="430" rx="20" ry="40" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="350" cy="430" rx="20" ry="40" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Paws -->
    <ellipse cx="250" cy="465" rx="16" ry="10" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="285" cy="465" rx="16" ry="10" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="315" cy="465" rx="16" ry="10" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="350" cy="465" rx="16" ry="10" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Tail -->
    <path d="M400 380 Q440 350, 450 310 Q455 295, 450 280" fill="none" stroke="#000" stroke-width="3"/>
    <ellipse cx="450" cy="270" rx="12" ry="16" fill="none" stroke="#000" stroke-width="3"/>
  </svg>`,

  tree: `<svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Tree trunk -->
    <rect x="275" y="350" width="50" height="130" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Tree bark texture -->
    <line x1="285" y1="365" x2="285" y2="470" stroke="#000" stroke-width="2"/>
    <line x1="295" y1="360" x2="295" y2="475" stroke="#000" stroke-width="2"/>
    <line x1="305" y1="365" x2="305" y2="470" stroke="#000" stroke-width="2"/>
    <line x1="315" y1="360" x2="315" y2="475" stroke="#000" stroke-width="2"/>
    
    <!-- Tree crown - multiple cloud-like shapes -->
    <path d="M200 260 Q170 230, 185 200 Q200 170, 230 185 Q260 160, 290 175 Q320 150, 350 175 Q380 160, 410 185 Q440 170, 425 200 Q450 230, 410 260 Q440 290, 410 320 Q380 350, 350 335 Q320 360, 290 335 Q260 350, 230 320 Q200 290, 200 260 Z" 
          fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Leaves detail -->
    <path d="M230 220 Q245 205, 260 220 Q245 235, 230 220" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M290 205 Q305 190, 320 205 Q305 220, 290 205" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M350 215 Q365 200, 380 215 Q365 230, 350 215" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M240 260 Q255 245, 270 260 Q255 275, 240 260" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M330 250 Q345 235, 360 250 Q345 265, 330 250" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M210 290 Q225 275, 240 290 Q225 305, 210 290" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M370 295 Q385 280, 400 295 Q385 310, 370 295" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Branches -->
    <line x1="300" y1="350" x2="260" y2="310" stroke="#000" stroke-width="3"/>
    <line x1="300" y1="360" x2="340" y2="320" stroke="#000" stroke-width="3"/>
    <line x1="300" y1="370" x2="230" y2="340" stroke="#000" stroke-width="2"/>
    <line x1="300" y1="380" x2="370" y2="350" stroke="#000" stroke-width="2"/>
    
    <!-- Ground -->
    <path d="M100 480 Q300 465, 500 480" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Grass -->
    <path d="M150 480 L158 465 L166 480" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M180 480 L188 465 L196 480" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M420 480 L428 465 L436 480" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M450 480 L458 465 L466 480" fill="none" stroke="#000" stroke-width="2"/>
  </svg>`,

  house: `<svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
    <!-- House base -->
    <rect x="175" y="250" width="250" height="190" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Roof -->
    <path d="M150 250 L300 150 L450 250 Z" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Roof tiles -->
    <path d="M165 235 Q190 230, 215 235" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M215 230 Q240 225, 265 230" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M265 225 Q290 220, 315 225" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M315 220 Q340 215, 365 220" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M365 225 Q390 220, 415 225" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M415 230 Q430 225, 440 230" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Door -->
    <rect x="260" y="350" width="80" height="90" fill="none" stroke="#000" stroke-width="3"/>
    <circle cx="325" cy="395" r="4" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Door panels -->
    <rect x="268" y="358" width="64" height="38" fill="none" stroke="#000" stroke-width="2"/>
    <rect x="268" y="405" width="64" height="32" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Windows -->
    <rect x="200" y="290" width="50" height="50" fill="none" stroke="#000" stroke-width="3"/>
    <line x1="225" y1="290" x2="225" y2="340" stroke="#000" stroke-width="2"/>
    <line x1="200" y1="315" x2="250" y2="315" stroke="#000" stroke-width="2"/>
    
    <rect x="350" y="290" width="50" height="50" fill="none" stroke="#000" stroke-width="3"/>
    <line x1="375" y1="290" x2="375" y2="340" stroke="#000" stroke-width="2"/>
    <line x1="350" y1="315" x2="400" y2="315" stroke="#000" stroke-width="2"/>
    
    <!-- Window boxes -->
    <rect x="193" y="340" width="64" height="10" fill="none" stroke="#000" stroke-width="2"/>
    <rect x="343" y="340" width="64" height="10" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Flowers in window boxes -->
    <circle cx="208" cy="333" r="4" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="223" cy="330" r="4" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="238" cy="333" r="4" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="248" cy="330" r="4" fill="none" stroke="#000" stroke-width="2"/>
    
    <circle cx="358" cy="333" r="4" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="373" cy="330" r="4" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="388" cy="333" r="4" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="398" cy="330" r="4" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Chimney -->
    <rect x="360" y="175" width="32" height="75" fill="none" stroke="#000" stroke-width="3"/>
    <rect x="354" y="168" width="44" height="12" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Smoke -->
    <path d="M376 168 Q380 155, 374 140 Q368 125, 380 110" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Ground -->
    <path d="M50 450 Q300 435, 550 450" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Path to door -->
    <path d="M300 450 L300 450 Q300 435, 300 420" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="285" cy="435" rx="10" ry="5" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="315" cy="442" rx="10" ry="5" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="292" cy="450" rx="10" ry="5" fill="none" stroke="#000" stroke-width="2"/>
  </svg>`,


  car: `<svg width="600" height="500" viewBox="0 0 600 500" xmlns="http://www.w3.org/2000/svg">
    <!-- Car body -->
    <rect x="140" y="275" width="320" height="100" rx="12" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Car roof -->
    <path d="M190 275 Q220 225, 270 225 L330 225 Q380 225, 410 275" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Windows -->
    <path d="M205 270 Q225 240, 265 240 L335 240 Q375 240, 395 270" fill="none" stroke="#000" stroke-width="3"/>
    <line x1="300" y1="240" x2="300" y2="270" stroke="#000" stroke-width="2"/>
    
    <!-- Windshield wipers -->
    <path d="M240 255 Q248 248, 256 255" fill="none" stroke="#000" stroke-width="2"/>
    <path d="M344" y1="255" Q352 248, 360 255" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Headlights -->
    <circle cx="460" cy="300" r="20" fill="none" stroke="#000" stroke-width="3"/>
    <circle cx="460" cy="300" r="10" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Taillights -->
    <rect x="130" y="290" width="12" height="20" fill="none" stroke="#000" stroke-width="3"/>
    <rect x="130" y="320" width="12" height="20" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Wheels -->
    <circle cx="200" cy="400" r="45" fill="none" stroke="#000" stroke-width="4"/>
    <circle cx="200" cy="400" r="25" fill="none" stroke="#000" stroke-width="3"/>
    <circle cx="200" cy="400" r="6" fill="#000"/>
    
    <circle cx="400" cy="400" r="45" fill="none" stroke="#000" stroke-width="4"/>
    <circle cx="400" cy="400" r="25" fill="none" stroke="#000" stroke-width="3"/>
    <circle cx="400" cy="400" r="6" fill="#000"/>
    
    <!-- Wheel spokes -->
    <line x1="175" y1="400" x2="225" y2="400" stroke="#000" stroke-width="2"/>
    <line x1="200" y1="375" x2="200" y2="425" stroke="#000" stroke-width="2"/>
    <line x1="182" y1="382" x2="218" y2="418" stroke="#000" stroke-width="2"/>
    <line x1="218" y1="382" x2="182" y2="418" stroke="#000" stroke-width="2"/>
    
    <line x1="375" y1="400" x2="425" y2="400" stroke="#000" stroke-width="2"/>
    <line x1="400" y1="375" x2="400" y2="425" stroke="#000" stroke-width="2"/>
    <line x1="382" y1="382" x2="418" y2="418" stroke="#000" stroke-width="2"/>
    <line x1="418" y1="382" x2="382" y2="418" stroke="#000" stroke-width="2"/>
    
    <!-- Door handles -->
    <rect x="240" y="315" width="10" height="5" fill="none" stroke="#000" stroke-width="2"/>
    <rect x="350" y="315" width="10" height="5" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Door lines -->
    <line x1="240" y1="275" x2="240" y2="375" stroke="#000" stroke-width="2"/>
    <line x1="360" y1="275" x2="360" y2="375" stroke="#000" stroke-width="2"/>
    
    <!-- Bumper -->
    <rect x="125" y="365" width="350" height="12" rx="6" fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- License plate -->
    <rect x="265" y="372" width="70" height="25" fill="none" stroke="#000" stroke-width="2"/>
    <text x="300" y="388" text-anchor="middle" font-family="Arial" font-size="10" fill="none" stroke="#000" stroke-width="1">ABC123</text>
    
    <!-- Ground -->
    <path d="M50 460 Q300 445, 550 460" fill="none" stroke="#000" stroke-width="3"/>
  </svg>`
};

module.exports = coloringTemplates;
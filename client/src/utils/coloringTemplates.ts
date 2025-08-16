// Coloring Templates Collection
export interface ColoringTemplate {
  id: string;
  name: string;
  category: string;
  type: 'svg' | 'image';
  content: string; // SVG string or image URL
  culturalContext?: string;
}

export const coloringTemplates: ColoringTemplate[] = [
  {
    id: 'zimbabwe-flag',
    name: 'Zimbabwe Flag',
    category: 'cultural',
    type: 'svg',
    culturalContext: 'zimbabwean',
    content: `<svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg">
      <!-- Flag outline -->
      <rect x="10" y="10" width="380" height="230" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Horizontal stripes -->
      <line x1="10" y1="43" x2="390" y2="43" stroke="#000" stroke-width="2"/>
      <line x1="10" y1="76" x2="390" y2="76" stroke="#000" stroke-width="2"/>
      <line x1="10" y1="109" x2="390" y2="109" stroke="#000" stroke-width="2"/>
      <line x1="10" y1="142" x2="390" y2="142" stroke="#000" stroke-width="2"/>
      <line x1="10" y1="175" x2="390" y2="175" stroke="#000" stroke-width="2"/>
      <line x1="10" y1="208" x2="390" y2="208" stroke="#000" stroke-width="2"/>
      
      <!-- Triangle -->
      <polygon points="10,10 10,240 130,125" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Star -->
      <polygon points="70,125 75,110 80,125 90,120 82,135 90,150 80,145 75,160 70,145 60,150 68,135 60,120" 
               fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Bird outline -->
      <path d="M 90 115 Q 100 105 110 115 Q 115 120 110 130 Q 100 135 90 130 Q 85 125 90 115" 
            fill="none" stroke="#000" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'african-lion',
    name: 'African Lion',
    category: 'animals',
    type: 'svg',
    culturalContext: 'african',
    content: `<svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
      <!-- Mane -->
      <circle cx="150" cy="120" r="80" fill="none" stroke="#000" stroke-width="3"/>
      <circle cx="120" cy="90" r="25" fill="none" stroke="#000" stroke-width="2"/>
      <circle cx="180" cy="90" r="25" fill="none" stroke="#000" stroke-width="2"/>
      <circle cx="100" cy="130" r="20" fill="none" stroke="#000" stroke-width="2"/>
      <circle cx="200" cy="130" r="20" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Head -->
      <ellipse cx="150" cy="120" rx="50" ry="45" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Eyes -->
      <circle cx="135" cy="105" r="8" fill="none" stroke="#000" stroke-width="2"/>
      <circle cx="165" cy="105" r="8" fill="none" stroke="#000" stroke-width="2"/>
      <circle cx="135" cy="105" r="3" fill="#000"/>
      <circle cx="165" cy="105" r="3" fill="#000"/>
      
      <!-- Nose -->
      <ellipse cx="150" cy="125" rx="6" ry="4" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Mouth -->
      <path d="M 140 135 Q 150 145 160 135" fill="none" stroke="#000" stroke-width="2"/>
      <line x1="150" y1="125" x2="150" y2="135" stroke="#000" stroke-width="2"/>
      
      <!-- Ears -->
      <ellipse cx="125" cy="85" rx="12" ry="15" fill="none" stroke="#000" stroke-width="2"/>
      <ellipse cx="175" cy="85" rx="12" ry="15" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Whiskers -->
      <line x1="110" y1="120" x2="90" y2="115" stroke="#000" stroke-width="1"/>
      <line x1="110" y1="130" x2="90" y2="130" stroke="#000" stroke-width="1"/>
      <line x1="190" y1="120" x2="210" y2="115" stroke="#000" stroke-width="1"/>
      <line x1="190" y1="130" x2="210" y2="130" stroke="#000" stroke-width="1"/>
    </svg>`
  },
  {
    id: 'traditional-hut',
    name: 'Traditional Hut',
    category: 'cultural',
    type: 'svg',
    culturalContext: 'african',
    content: `<svg viewBox="0 0 300 250" xmlns="http://www.w3.org/2000/svg">
      <!-- Hut base -->
      <circle cx="150" cy="180" r="80" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Roof -->
      <path d="M 70 180 Q 150 50 230 180" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Door -->
      <rect x="135" y="160" width="30" height="40" rx="15" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Windows -->
      <circle cx="110" cy="150" r="12" fill="none" stroke="#000" stroke-width="2"/>
      <circle cx="190" cy="150" r="12" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Roof texture lines -->
      <path d="M 80 170 Q 150 70 220 170" fill="none" stroke="#000" stroke-width="1"/>
      <path d="M 90 160 Q 150 80 210 160" fill="none" stroke="#000" stroke-width="1"/>
      <path d="M 100 150 Q 150 90 200 150" fill="none" stroke="#000" stroke-width="1"/>
      
      <!-- Ground -->
      <line x1="50" y1="220" x2="250" y2="220" stroke="#000" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'baobab-tree',
    name: 'Baobab Tree',
    category: 'nature',
    type: 'svg',
    culturalContext: 'african',
    content: `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <!-- Trunk -->
      <ellipse cx="150" cy="220" rx="40" ry="60" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Main branches -->
      <path d="M 130 170 Q 100 150 80 120" fill="none" stroke="#000" stroke-width="3"/>
      <path d="M 150 160 Q 150 130 140 100" fill="none" stroke="#000" stroke-width="3"/>
      <path d="M 170 170 Q 200 150 220 120" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Smaller branches -->
      <path d="M 80 120 L 70 110" fill="none" stroke="#000" stroke-width="2"/>
      <path d="M 80 120 L 75 130" fill="none" stroke="#000" stroke-width="2"/>
      <path d="M 140 100 L 130 90" fill="none" stroke="#000" stroke-width="2"/>
      <path d="M 140 100 L 150 85" fill="none" stroke="#000" stroke-width="2"/>
      <path d="M 220 120 L 230 110" fill="none" stroke="#000" stroke-width="2"/>
      <path d="M 220 120 L 225 130" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Trunk texture -->
      <line x1="120" y1="200" x2="125" y2="240" stroke="#000" stroke-width="1"/>
      <line x1="150" y1="190" x2="150" y2="250" stroke="#000" stroke-width="1"/>
      <line x1="180" y1="200" x2="175" y2="240" stroke="#000" stroke-width="1"/>
      
      <!-- Ground -->
      <ellipse cx="150" cy="270" rx="60" ry="10" fill="none" stroke="#000" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'elephant',
    name: 'African Elephant',
    category: 'animals',
    type: 'svg',
    culturalContext: 'african',
    content: `<svg viewBox="0 0 350 250" xmlns="http://www.w3.org/2000/svg">
      <!-- Body -->
      <ellipse cx="200" cy="150" rx="80" ry="50" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Head -->
      <circle cx="120" cy="120" r="45" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Ears -->
      <ellipse cx="90" cy="100" rx="25" ry="35" fill="none" stroke="#000" stroke-width="2"/>
      <ellipse cx="150" cy="100" rx="25" ry="35" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Trunk -->
      <path d="M 100 140 Q 80 160 70 180 Q 60 200 80 210" fill="none" stroke="#000" stroke-width="3"/>
      
      <!-- Eyes -->
      <circle cx="110" cy="110" r="5" fill="none" stroke="#000" stroke-width="2"/>
      <circle cx="130" cy="110" r="5" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Legs -->
      <rect x="160" y="190" width="15" height="40" fill="none" stroke="#000" stroke-width="2"/>
      <rect x="190" y="190" width="15" height="40" fill="none" stroke="#000" stroke-width="2"/>
      <rect x="220" y="190" width="15" height="40" fill="none" stroke="#000" stroke-width="2"/>
      <rect x="250" y="190" width="15" height="40" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Tail -->
      <path d="M 280 160 Q 300 170 295 185" fill="none" stroke="#000" stroke-width="2"/>
      
      <!-- Tusks -->
      <path d="M 105 125 L 95 135" fill="none" stroke="#000" stroke-width="2"/>
      <path d="M 135 125 L 145 135" fill="none" stroke="#000" stroke-width="2"/>
    </svg>`
  }
];

export const getTemplatesByCategory = (category: string) => {
  return coloringTemplates.filter(template => template.category === category);
};

export const getTemplateById = (id: string) => {
  return coloringTemplates.find(template => template.id === id);
};

export const getAllCategories = () => {
  return [...new Set(coloringTemplates.map(template => template.category))];
};
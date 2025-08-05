const { Template } = require('../models');

// Additional realistic coloring templates
const additionalTemplates = {
  butterfly: `<svg width="500" height="400" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
    <!-- Butterfly body -->
    <ellipse cx="250" cy="200" rx="8" ry="80" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Body segments -->
    <line x1="250" y1="140" x2="250" y2="260" stroke="#000" stroke-width="1"/>
    <circle cx="250" cy="150" r="3" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="250" cy="170" r="3" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="250" cy="190" r="3" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="250" cy="210" r="3" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="250" cy="230" r="3" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="250" cy="250" r="3" fill="none" stroke="#000" stroke-width="1"/>
    
    <!-- Head -->
    <circle cx="250" cy="130" r="12" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Antennae -->
    <path d="M245 125 Q240 115, 235 110" stroke="#000" stroke-width="2"/>
    <path d="M255 125 Q260 115, 265 110" stroke="#000" stroke-width="2"/>
    <circle cx="235" cy="110" r="3" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="265" cy="110" r="3" fill="none" stroke="#000" stroke-width="1"/>
    
    <!-- Upper wings -->
    <path d="M258 160 Q300 140, 320 160 Q340 180, 320 200 Q300 220, 280 210 Q270 190, 258 160" 
          fill="none" stroke="#000" stroke-width="2"/>
    <path d="M242 160 Q200 140, 180 160 Q160 180, 180 200 Q200 220, 220 210 Q230 190, 242 160" 
          fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Lower wings -->
    <path d="M258 200 Q290 220, 300 240 Q310 260, 290 270 Q270 260, 260 240 Q258 220, 258 200" 
          fill="none" stroke="#000" stroke-width="2"/>
    <path d="M242 200 Q210 220, 200 240 Q190 260, 210 270 Q230 260, 240 240 Q242 220, 242 200" 
          fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Wing patterns -->
    <circle cx="290" cy="170" r="8" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="210" cy="170" r="8" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="285" cy="190" r="5" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="215" cy="190" r="5" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="280" cy="240" r="6" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="220" cy="240" r="6" fill="none" stroke="#000" stroke-width="1"/>
    
    <!-- Wing details -->
    <path d="M270 165 Q280 160, 290 165" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M230 165 Q220 160, 210 165" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M275 185 Q285 180, 295 185" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M225 185 Q215 180, 205 185" fill="none" stroke="#000" stroke-width="1"/>
  </svg>`,

  flower: `<svg width="500" height="400" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
    <!-- Stem -->
    <line x1="250" y1="350" x2="250" y2="200" stroke="#000" stroke-width="4"/>
    
    <!-- Leaves -->
    <path d="M250 280 Q220 270, 200 290 Q210 310, 240 300 Q250 290, 250 280" 
          fill="none" stroke="#000" stroke-width="2"/>
    <path d="M250 260 Q280 250, 300 270 Q290 290, 260 280 Q250 270, 250 260" 
          fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Leaf veins -->
    <line x1="225" y1="285" x2="235" y2="295" stroke="#000" stroke-width="1"/>
    <line x1="220" y1="295" x2="230" y2="300" stroke="#000" stroke-width="1"/>
    <line x1="275" y1="265" x2="285" y2="275" stroke="#000" stroke-width="1"/>
    <line x1="280" y1="275" x2="290" y2="280" stroke="#000" stroke-width="1"/>
    
    <!-- Flower center -->
    <circle cx="250" cy="180" r="25" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="250" cy="180" r="15" fill="none" stroke="#000" stroke-width="1"/>
    <circle cx="250" cy="180" r="8" fill="none" stroke="#000" stroke-width="1"/>
    
    <!-- Petals -->
    <ellipse cx="250" cy="140" rx="15" ry="25" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="285" cy="155" rx="15" ry="25" fill="none" stroke="#000" stroke-width="2" transform="rotate(45 285 155)"/>
    <ellipse cx="290" cy="180" rx="15" ry="25" fill="none" stroke="#000" stroke-width="2" transform="rotate(90 290 180)"/>
    <ellipse cx="285" cy="205" rx="15" ry="25" fill="none" stroke="#000" stroke-width="2" transform="rotate(135 285 205)"/>
    <ellipse cx="250" cy="220" rx="15" ry="25" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="215" cy="205" rx="15" ry="25" fill="none" stroke="#000" stroke-width="2" transform="rotate(-135 215 205)"/>
    <ellipse cx="210" cy="180" rx="15" ry="25" fill="none" stroke="#000" stroke-width="2" transform="rotate(-90 210 180)"/>
    <ellipse cx="215" cy="155" rx="15" ry="25" fill="none" stroke="#000" stroke-width="2" transform="rotate(-45 215 155)"/>
    
    <!-- Petal details -->
    <path d="M250 130 Q245 140, 250 150" stroke="#000" stroke-width="1"/>
    <path d="M250 210 Q245 200, 250 190" stroke="#000" stroke-width="1"/>
    
    <!-- Ground -->
    <path d="M150 350 Q250 340, 350 350" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Small grass -->
    <path d="M200 350 L205 340 L210 350" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M290 350 L295 340 L300 350" fill="none" stroke="#000" stroke-width="1"/>
  </svg>`,

  elephant: `<svg width="500" height="400" viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <ellipse cx="280" cy="250" rx="80" ry="60" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Head -->
    <circle cx="200" cy="200" r="50" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Ears -->
    <ellipse cx="170" cy="180" rx="25" ry="40" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="230" cy="180" rx="25" ry="40" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Ear details -->
    <path d="M155 170 Q165 160, 175 170" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M215 170 Q225 160, 235 170" fill="none" stroke="#000" stroke-width="1"/>
    
    <!-- Eyes -->
    <circle cx="185" cy="190" r="8" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="215" cy="190" r="8" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="185" cy="190" r="3" fill="#000"/>
    <circle cx="215" cy="190" r="3" fill="#000"/>
    
    <!-- Trunk -->
    <path d="M200 230 Q180 260, 160 290 Q140 320, 150 350" 
          fill="none" stroke="#000" stroke-width="3"/>
    
    <!-- Trunk tip -->
    <ellipse cx="150" cy="350" rx="8" ry="12" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Trunk segments -->
    <path d="M190 245 Q185 250, 190 255" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M175 270 Q170 275, 175 280" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M165 295 Q160 300, 165 305" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M155 320 Q150 325, 155 330" fill="none" stroke="#000" stroke-width="1"/>
    
    <!-- Tusks -->
    <path d="M180 220 Q175 240, 170 260" stroke="#000" stroke-width="2"/>
    <path d="M220 220 Q225 240, 230 260" stroke="#000" stroke-width="2"/>
    
    <!-- Legs -->
    <rect x="240" y="300" width="20" height="50" fill="none" stroke="#000" stroke-width="2"/>
    <rect x="270" y="300" width="20" height="50" fill="none" stroke="#000" stroke-width="2"/>
    <rect x="300" y="300" width="20" height="50" fill="none" stroke="#000" stroke-width="2"/>
    <rect x="330" y="300" width="20" height="50" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Feet -->
    <ellipse cx="250" cy="360" rx="15" ry="8" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="280" cy="360" rx="15" ry="8" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="310" cy="360" rx="15" ry="8" fill="none" stroke="#000" stroke-width="2"/>
    <ellipse cx="340" cy="360" rx="15" ry="8" fill="none" stroke="#000" stroke-width="2"/>
    
    <!-- Tail -->
    <path d="M360 250 Q380 260, 385 280" stroke="#000" stroke-width="2"/>
    <path d="M385 280 Q390 285, 385 290 Q380 285, 385 280" fill="none" stroke="#000" stroke-width="1"/>
    
    <!-- Body texture -->
    <path d="M250 230 Q260 225, 270 230" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M290 240 Q300 235, 310 240" fill="none" stroke="#000" stroke-width="1"/>
    <path d="M260 260 Q270 255, 280 260" fill="none" stroke="#000" stroke-width="1"/>
  </svg>`
};

function encodeToBase64(svgString) {
  return Buffer.from(svgString).toString('base64');
}

function createTemplateContent(svgString, title, instructions) {
  const base64SVG = `data:image/svg+xml;base64,${encodeToBase64(svgString)}`;
  
  return {
    elements: [
      {
        id: "coloring-canvas",
        size: { width: 500, height: 400 },
        type: "drawing-canvas",
        content: {
          canvasData: base64SVG,
          instructions: instructions
        },
        position: { x: 50, y: 50 }
      },
      {
        id: "instructions",
        size: { width: 400, height: 40 },
        type: "text",
        content: {
          text: `🎨 ${title}`,
          color: "#000000",
          fontSize: 24
        },
        position: { x: 50, y: 20 }
      }
    ]
  };
}

async function addMoreColoringTemplates() {
  try {
    console.log('🎨 Adding more realistic coloring templates...');

    // Add Beautiful Butterfly Coloring
    const butterflyContent = createTemplateContent(
      additionalTemplates.butterfly,
      'Color the Beautiful Butterfly!',
      'Color the butterfly with bright, vibrant colors. Use different colors for each wing section and add patterns to make it beautiful!'
    );

    await Template.create({
      name: 'Beautiful Butterfly Coloring',
      description: 'A detailed butterfly coloring page with realistic wing patterns and body segments',
      category: 'art',
      subcategory: 'animals',
      difficulty: 'beginner',
      ageGroupMin: 3,
      ageGroupMax: 8,
      culturalTags: ['nature', 'insects'],
      languages: ['en', 'sn', 'nd'],
      content: butterflyContent,
      creatorId: null,
      isPremium: false,
      isActive: true
    });
    console.log('✅ Added Beautiful Butterfly Coloring template');

    // Add Pretty Flower Coloring
    const flowerContent = createTemplateContent(
      additionalTemplates.flower,
      'Color the Pretty Flower!',
      'Color the flower with your favorite colors. Use bright colors for the petals, green for the stem and leaves, and yellow for the center!'
    );

    await Template.create({
      name: 'Pretty Flower Coloring',
      description: 'A detailed flower coloring page with petals, stem, and leaves',
      category: 'art',
      subcategory: 'nature',
      difficulty: 'beginner',
      ageGroupMin: 3,
      ageGroupMax: 8,
      culturalTags: ['nature', 'plants'],
      languages: ['en', 'sn', 'nd'],
      content: flowerContent,
      creatorId: null,
      isPremium: false,
      isActive: true
    });
    console.log('✅ Added Pretty Flower Coloring template');

    // Add African Elephant Coloring
    const elephantContent = createTemplateContent(
      additionalTemplates.elephant,
      'Color the African Elephant!',
      'Color the elephant with gray colors. Add details to the trunk, ears, and tusks. Make it look like a real African elephant!'
    );

    await Template.create({
      name: 'African Elephant Coloring',
      description: 'A detailed African elephant coloring page with trunk, tusks, and large ears',
      category: 'cultural',
      subcategory: 'animals',
      difficulty: 'intermediate',
      ageGroupMin: 4,
      ageGroupMax: 10,
      culturalTags: ['african_animals', 'wildlife'],
      languages: ['en', 'sn', 'nd'],
      content: elephantContent,
      creatorId: null,
      isPremium: false,
      isActive: true
    });
    console.log('✅ Added African Elephant Coloring template');

    console.log('🎉 All new coloring templates added successfully!');

  } catch (error) {
    console.error('❌ Error adding coloring templates:', error);
  }
}

// Run the script if executed directly
if (require.main === module) {
  addMoreColoringTemplates().then(() => {
    console.log('✨ New coloring templates added successfully!');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Failed to add templates:', error);
    process.exit(1);
  });
}

module.exports = { addMoreColoringTemplates };
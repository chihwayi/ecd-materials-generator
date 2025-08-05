const { Template } = require('../models');
const coloringTemplates = require('../utils/coloringTemplates');

// Function to encode SVG to base64
function encodeToBase64(svgString) {
  return Buffer.from(svgString).toString('base64');
}

// Function to create template content with improved SVG
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

async function updateColoringTemplates() {
  try {
    console.log('🎨 Updating coloring templates with realistic designs...');

    // Update African Lion Coloring
    const lionTemplate = await Template.findOne({ where: { name: 'African Lion Coloring' } });
    if (lionTemplate) {
      const lionContent = createTemplateContent(
        coloringTemplates.lion,
        'Color the African Lion!',
        'Color the lion with golden yellow and brown colors. Add details to the mane, body, and paws. Make it look like a real African lion!'
      );
      
      await lionTemplate.update({ content: lionContent });
      console.log('✅ Updated African Lion Coloring template');
    }

    // Update Simple Tree Coloring
    const treeTemplate = await Template.findOne({ where: { name: 'Simple Tree Coloring' } });
    if (treeTemplate) {
      const treeContent = createTemplateContent(
        coloringTemplates.tree,
        'Color the Beautiful Tree!',
        'Color the tree with brown trunk and green leaves. Add different shades of green for the leaves and brown for the bark texture.'
      );
      
      await treeTemplate.update({ content: treeContent });
      console.log('✅ Updated Simple Tree Coloring template');
    }

    // Update Simple House Coloring
    const houseTemplate = await Template.findOne({ where: { name: 'Simple House Coloring' } });
    if (houseTemplate) {
      const houseContent = createTemplateContent(
        coloringTemplates.house,
        'Color the Cozy House!',
        'Color the house with your favorite colors. Use red or brown for the roof, different colors for the walls, and bright colors for the flowers in the window boxes.'
      );
      
      await houseTemplate.update({ content: houseContent });
      console.log('✅ Updated Simple House Coloring template');
    }

    // Update Simple Car Coloring
    const carTemplate = await Template.findOne({ where: { name: 'Simple Car Coloring' } });
    if (carTemplate) {
      const carContent = createTemplateContent(
        coloringTemplates.car,
        'Color the Cool Car!',
        'Color the car with your favorite color. Make the wheels black or gray, add bright colors for the headlights, and don\'t forget to color the license plate!'
      );
      
      await carTemplate.update({ content: carContent });
      console.log('✅ Updated Simple Car Coloring template');
    }

    console.log('🎉 All coloring templates updated successfully!');
    console.log('📝 Templates now feature:');
    console.log('   - More realistic proportions');
    console.log('   - Detailed features (eyes, textures, etc.)');
    console.log('   - Child-friendly coloring book style');
    console.log('   - Better educational value');

  } catch (error) {
    console.error('❌ Error updating coloring templates:', error);
  }
}

// Run the update if this script is executed directly
if (require.main === module) {
  updateColoringTemplates().then(() => {
    console.log('✨ Coloring template update complete!');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Update failed:', error);
    process.exit(1);
  });
}

module.exports = { updateColoringTemplates };
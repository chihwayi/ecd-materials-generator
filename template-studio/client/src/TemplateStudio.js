import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const TemplateStudio = ({ onNavigateToMarketplace }) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [activeTab, setActiveTab] = useState('shapes');
  const [selectedObject, setSelectedObject] = useState(null);
  const [fontSize, setFontSize] = useState(24);
  const [templateData, setTemplateData] = useState({
    name: 'My Fun Template',
    description: 'A colorful learning activity for kids',
    category: 'art',
    difficulty: 'easy',
    ageGroupMin: 3,
    ageGroupMax: 8
  });

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff'
    });
    
    fabricCanvas.on('selection:created', (e) => setSelectedObject(e.selected[0]));
    fabricCanvas.on('selection:updated', (e) => setSelectedObject(e.selected[0]));
    fabricCanvas.on('selection:cleared', () => setSelectedObject(null));
    
    setCanvas(fabricCanvas);
    return () => fabricCanvas.dispose();
  }, []);

  const addShape = (shapeType) => {
    if (!canvas) return;
    let shape;
    const coloringStyle = { fill: 'transparent', stroke: '#000', strokeWidth: 3 };
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    switch (shapeType) {
      case 'circle': 
        shape = new fabric.Circle({ radius: 50, left: centerX-50, top: centerY-50, ...coloringStyle }); 
        break;
      case 'rectangle': 
        shape = new fabric.Rect({ width: 100, height: 60, left: centerX-50, top: centerY-30, ...coloringStyle }); 
        break;
      case 'triangle': 
        shape = new fabric.Triangle({ width: 80, height: 80, left: centerX-40, top: centerY-40, ...coloringStyle }); 
        break;
      case 'star': 
        const starPoints = [];
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? 40 : 20;
          const angle = (i * Math.PI) / 5;
          starPoints.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
        }
        shape = new fabric.Polygon(starPoints, { left: centerX, top: centerY, ...coloringStyle });
        break;
      case 'heart': 
        shape = new fabric.Path('M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z', { left: centerX-24, top: centerY-24, scaleX: 2, scaleY: 2, ...coloringStyle }); 
        break;
      case 'text': 
        shape = new fabric.Text('ABC', { left: centerX-20, top: centerY-12, fontSize: fontSize, fill: '#000', fontFamily: 'Arial', fontWeight: 'bold' }); 
        break;
      
      // Simple realistic objects for kids
      case 'sun': 
        shape = new fabric.Group([
          new fabric.Circle({ radius: 40, left: 0, top: 0, ...coloringStyle }),
          new fabric.Line([-60, 0, -45, 0], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Line([45, 0, 60, 0], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Line([0, -60, 0, -45], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Line([0, 45, 0, 60], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Line([-42, -42, -32, -32], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Line([32, -32, 42, -42], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Line([-42, 42, -32, 32], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Line([32, 32, 42, 42], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Circle({ radius: 4, left: -15, top: -10, fill: '#000' }),
          new fabric.Circle({ radius: 4, left: 15, top: -10, fill: '#000' }),
          new fabric.Path('M-10,10 Q0,20 10,10', { fill: 'transparent', stroke: '#000', strokeWidth: 3 })
        ], { left: centerX, top: centerY });
        break;
      
      case 'house': 
        shape = new fabric.Group([
          new fabric.Rect({ width: 100, height: 80, left: -50, top: -10, ...coloringStyle }),
          new fabric.Polygon([{x:-60,y:-50},{x:0,y:-90},{x:60,y:-50}], { left: 0, top: 0, ...coloringStyle }),
          new fabric.Rect({ width: 25, height: 40, left: -40, top: -5, ...coloringStyle }),
          new fabric.Rect({ width: 20, height: 20, left: 20, top: -35, ...coloringStyle }),
          new fabric.Circle({ radius: 2, left: -30, top: 15, fill: '#000' })
        ], { left: centerX, top: centerY });
        break;
      
      case 'car': 
        shape = new fabric.Group([
          new fabric.Rect({ width: 120, height: 40, left: -60, top: -10, ...coloringStyle }),
          new fabric.Rect({ width: 50, height: 30, left: -50, top: -40, ...coloringStyle }),
          new fabric.Circle({ radius: 18, left: -35, top: 30, ...coloringStyle }),
          new fabric.Circle({ radius: 18, left: 35, top: 30, ...coloringStyle }),
          new fabric.Rect({ width: 15, height: 12, left: -45, top: -35, ...coloringStyle }),
          new fabric.Rect({ width: 15, height: 12, left: -25, top: -35, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      
      case 'tree': 
        shape = new fabric.Group([
          new fabric.Rect({ width: 20, height: 60, left: -10, top: 30, ...coloringStyle }),
          new fabric.Circle({ radius: 50, left: 0, top: -20, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      
      case 'flower': 
        shape = new fabric.Group([
          new fabric.Circle({ radius: 20, left: 0, top: -40, ...coloringStyle }),
          new fabric.Circle({ radius: 20, left: 35, top: -20, ...coloringStyle }),
          new fabric.Circle({ radius: 20, left: 35, top: 20, ...coloringStyle }),
          new fabric.Circle({ radius: 20, left: 0, top: 40, ...coloringStyle }),
          new fabric.Circle({ radius: 20, left: -35, top: 20, ...coloringStyle }),
          new fabric.Circle({ radius: 20, left: -35, top: -20, ...coloringStyle }),
          new fabric.Circle({ radius: 15, left: 0, top: 0, ...coloringStyle }),
          new fabric.Rect({ width: 8, height: 80, left: -4, top: 50, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      
      case 'cat': 
        shape = new fabric.Group([
          new fabric.Circle({ radius: 35, left: 0, top: 0, ...coloringStyle }),
          new fabric.Triangle({ width: 25, height: 25, left: -30, top: -35, ...coloringStyle }),
          new fabric.Triangle({ width: 25, height: 25, left: 5, top: -35, ...coloringStyle }),
          new fabric.Ellipse({ rx: 40, ry: 30, left: 0, top: 50, ...coloringStyle }),
          new fabric.Circle({ radius: 4, left: -12, top: -8, fill: '#000' }),
          new fabric.Circle({ radius: 4, left: 12, top: -8, fill: '#000' }),
          new fabric.Path('M-8,8 Q0,15 8,8', { fill: 'transparent', stroke: '#000', strokeWidth: 3 })
        ], { left: centerX, top: centerY });
        break;
      
      case 'dog': 
        shape = new fabric.Group([
          new fabric.Ellipse({ rx: 35, ry: 30, left: 0, top: 0, ...coloringStyle }),
          new fabric.Ellipse({ rx: 20, ry: 15, left: -30, top: -20, ...coloringStyle }),
          new fabric.Ellipse({ rx: 20, ry: 15, left: 30, top: -20, ...coloringStyle }),
          new fabric.Ellipse({ rx: 45, ry: 35, left: 0, top: 55, ...coloringStyle }),
          new fabric.Circle({ radius: 4, left: -12, top: -8, fill: '#000' }),
          new fabric.Circle({ radius: 4, left: 12, top: -8, fill: '#000' }),
          new fabric.Ellipse({ rx: 8, ry: 6, left: 0, top: 8, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      
      case 'fish': 
        shape = new fabric.Group([
          new fabric.Ellipse({ rx: 50, ry: 35, left: 0, top: 0, ...coloringStyle }),
          new fabric.Triangle({ width: 40, height: 30, left: 45, top: -15, ...coloringStyle }),
          new fabric.Circle({ radius: 6, left: -25, top: -12, fill: '#000' }),
          new fabric.Path('M-20,12 Q-10,20 0,12', { fill: 'transparent', stroke: '#000', strokeWidth: 2 })
        ], { left: centerX, top: centerY });
        break;
      
      case 'apple': 
        shape = new fabric.Group([
          new fabric.Circle({ radius: 40, left: 0, top: 10, ...coloringStyle }),
          new fabric.Rect({ width: 6, height: 25, left: -3, top: -40, ...coloringStyle }),
          new fabric.Ellipse({ rx: 15, ry: 10, left: 10, top: -35, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      
      // More shapes
      case 'diamond':
        shape = new fabric.Polygon([{x:0,y:-40},{x:40,y:0},{x:0,y:40},{x:-40,y:0}], { left: centerX, top: centerY, ...coloringStyle });
        break;
      case 'hexagon':
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          hexPoints.push({ x: Math.cos(angle) * 40, y: Math.sin(angle) * 40 });
        }
        shape = new fabric.Polygon(hexPoints, { left: centerX, top: centerY, ...coloringStyle });
        break;
      case 'oval':
        shape = new fabric.Ellipse({ rx: 60, ry: 40, left: centerX-60, top: centerY-40, ...coloringStyle });
        break;
      case 'crescent':
        shape = new fabric.Path('M40,0 A40,40 0 1,1 0,40 A20,20 0 1,0 40,0 Z', { left: centerX, top: centerY, ...coloringStyle });
        break;
      case 'arrow':
        shape = new fabric.Polygon([{x:-40,y:0},{x:-10,y:-20},{x:-10,y:-10},{x:40,y:-10},{x:40,y:10},{x:-10,y:10},{x:-10,y:20}], { left: centerX, top: centerY, ...coloringStyle });
        break;
      
      // More animals
      case 'bird':
        shape = new fabric.Group([
          new fabric.Ellipse({ rx: 30, ry: 25, left: 0, top: 0, ...coloringStyle }),
          new fabric.Triangle({ width: 20, height: 15, left: 25, top: -8, ...coloringStyle }),
          new fabric.Circle({ radius: 4, left: -10, top: -8, fill: '#000' }),
          new fabric.Ellipse({ rx: 25, ry: 15, left: -35, top: -10, ...coloringStyle }),
          new fabric.Ellipse({ rx: 20, ry: 12, left: -35, top: 15, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      case 'butterfly':
        shape = new fabric.Group([
          new fabric.Ellipse({ rx: 3, ry: 40, left: 0, top: 0, ...coloringStyle }),
          new fabric.Ellipse({ rx: 25, ry: 35, left: -30, top: -20, ...coloringStyle }),
          new fabric.Ellipse({ rx: 25, ry: 35, left: 30, top: -20, ...coloringStyle }),
          new fabric.Ellipse({ rx: 20, ry: 25, left: -25, top: 20, ...coloringStyle }),
          new fabric.Ellipse({ rx: 20, ry: 25, left: 25, top: 20, ...coloringStyle }),
          new fabric.Line([0, -40, -10, -50], { stroke: '#000', strokeWidth: 2 }),
          new fabric.Line([0, -40, 10, -50], { stroke: '#000', strokeWidth: 2 })
        ], { left: centerX, top: centerY });
        break;
      case 'rabbit':
        shape = new fabric.Group([
          new fabric.Circle({ radius: 30, left: 0, top: 10, ...coloringStyle }),
          new fabric.Ellipse({ rx: 8, ry: 25, left: -15, top: -30, ...coloringStyle }),
          new fabric.Ellipse({ rx: 8, ry: 25, left: 15, top: -30, ...coloringStyle }),
          new fabric.Ellipse({ rx: 35, ry: 25, left: 0, top: 50, ...coloringStyle }),
          new fabric.Circle({ radius: 3, left: -10, top: 5, fill: '#000' }),
          new fabric.Circle({ radius: 3, left: 10, top: 5, fill: '#000' }),
          new fabric.Ellipse({ rx: 6, ry: 4, left: 0, top: 18, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      case 'elephant':
        shape = new fabric.Group([
          new fabric.Circle({ radius: 40, left: 0, top: 0, ...coloringStyle }),
          new fabric.Ellipse({ rx: 50, ry: 35, left: 0, top: 50, ...coloringStyle }),
          new fabric.Ellipse({ rx: 15, ry: 40, left: 35, top: 25, ...coloringStyle }),
          new fabric.Circle({ radius: 4, left: -15, top: -10, fill: '#000' }),
          new fabric.Circle({ radius: 4, left: 15, top: -10, fill: '#000' })
        ], { left: centerX, top: centerY });
        break;
      
      // More objects
      case 'balloon':
        shape = new fabric.Group([
          new fabric.Ellipse({ rx: 30, ry: 40, left: 0, top: 0, ...coloringStyle }),
          new fabric.Line([0, 40, 0, 100], { stroke: '#000', strokeWidth: 2 })
        ], { left: centerX, top: centerY });
        break;
      case 'boat':
        shape = new fabric.Group([
          new fabric.Polygon([{x:-50,y:20},{x:50,y:20},{x:40,y:40},{x:-40,y:40}], { left: 0, top: 0, ...coloringStyle }),
          new fabric.Rect({ width: 4, height: 60, left: -2, top: -40, ...coloringStyle }),
          new fabric.Polygon([{x:0,y:-40},{x:30,y:-20},{x:0,y:0}], { left: 0, top: 0, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      case 'cake':
        shape = new fabric.Group([
          new fabric.Rect({ width: 80, height: 40, left: -40, top: 20, ...coloringStyle }),
          new fabric.Rect({ width: 60, height: 30, left: -30, top: -10, ...coloringStyle }),
          new fabric.Rect({ width: 40, height: 20, left: -20, top: -30, ...coloringStyle }),
          new fabric.Rect({ width: 3, height: 15, left: -1, top: -45, ...coloringStyle }),
          new fabric.Ellipse({ rx: 8, ry: 5, left: 0, top: -50, fill: '#ff6b6b' })
        ], { left: centerX, top: centerY });
        break;
      case 'ice_cream':
        shape = new fabric.Group([
          new fabric.Triangle({ width: 30, height: 60, left: -15, top: 30, ...coloringStyle }),
          new fabric.Circle({ radius: 25, left: 0, top: -20, ...coloringStyle }),
          new fabric.Circle({ radius: 20, left: 0, top: -45, ...coloringStyle })
        ], { left: centerX, top: centerY });
        break;
      case 'umbrella':
        shape = new fabric.Group([
          new fabric.Path('M-40,0 Q-40,-30 0,-40 Q40,-30 40,0 Q20,10 0,0 Q-20,10 -40,0', { left: 0, top: 0, ...coloringStyle }),
          new fabric.Rect({ width: 4, height: 80, left: -2, top: 0, ...coloringStyle }),
          new fabric.Path('M0,80 Q10,85 15,80', { fill: 'transparent', stroke: '#000', strokeWidth: 3 })
        ], { left: centerX, top: centerY });
        break;
      case 'clock':
        shape = new fabric.Group([
          new fabric.Circle({ radius: 40, left: 0, top: 0, ...coloringStyle }),
          new fabric.Line([0, 0, 0, -25], { stroke: '#000', strokeWidth: 4 }),
          new fabric.Line([0, 0, 15, 0], { stroke: '#000', strokeWidth: 3 }),
          new fabric.Circle({ radius: 3, left: 0, top: 0, fill: '#000' })
        ], { left: centerX, top: centerY });
        break;
      case 'rainbow':
        shape = new fabric.Group([
          new fabric.Path('M-60,0 Q0,-60 60,0', { fill: 'transparent', stroke: '#ff0000', strokeWidth: 8 }),
          new fabric.Path('M-55,5 Q0,-50 55,5', { fill: 'transparent', stroke: '#ff8800', strokeWidth: 8 }),
          new fabric.Path('M-50,10 Q0,-40 50,10', { fill: 'transparent', stroke: '#ffff00', strokeWidth: 8 }),
          new fabric.Path('M-45,15 Q0,-30 45,15', { fill: 'transparent', stroke: '#00ff00', strokeWidth: 8 }),
          new fabric.Path('M-40,20 Q0,-20 40,20', { fill: 'transparent', stroke: '#0088ff', strokeWidth: 8 }),
          new fabric.Path('M-35,25 Q0,-10 35,25', { fill: 'transparent', stroke: '#8800ff', strokeWidth: 8 })
        ], { left: centerX, top: centerY });
        break;
    }

    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const exportTemplate = async () => {
    if (!canvas || !templateData.name) {
      alert('Please fill in template name');
      return;
    }

    const canvasData = canvas.toJSON();
    const thumbnail = canvas.toDataURL('image/png');

    const template = {
      ...templateData,
      content: { type: 'fabric_canvas', canvas: canvasData },
      thumbnail,
      authorName: 'Template Creator'
    };

    // Mock save functionality since no backend API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage as mock
      const savedTemplates = JSON.parse(localStorage.getItem('ecd_templates') || '[]');
      const newTemplate = {
        ...template,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        downloads: 0,
        rating: 0
      };
      savedTemplates.push(newTemplate);
      localStorage.setItem('ecd_templates', JSON.stringify(savedTemplates));
      
      alert(`✅ Template "${templateData.name}" saved successfully!\n\n🎨 Your template is now available in the marketplace.`);
    } catch (error) {
      alert('❌ Error saving template. Please try again.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f2f5'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0
    },
    headerControls: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    input: {
      padding: '8px 12px',
      border: '2px solid white',
      borderRadius: '8px',
      fontSize: '16px'
    },
    select: {
      padding: '8px 12px',
      border: '2px solid white',
      borderRadius: '8px',
      fontSize: '16px',
      backgroundColor: 'white'
    },
    button: {
      padding: '10px 20px',
      backgroundColor: 'white',
      color: '#667eea',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    toolbar: {
      backgroundColor: 'white',
      padding: '10px 20px',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      gap: '10px'
    },
    tabButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    activeTab: {
      backgroundColor: '#667eea',
      color: 'white'
    },
    inactiveTab: {
      backgroundColor: '#f8f9fa',
      color: '#666'
    },
    mainContent: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden'
    },
    sidebar: {
      width: '300px',
      backgroundColor: 'white',
      borderRight: '1px solid #ddd',
      padding: '20px',
      overflowY: 'auto'
    },
    canvasArea: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    },
    canvasContainer: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    toolGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '20px',
      maxHeight: '400px',
      overflowY: 'auto'
    },
    toolButton: {
      padding: '15px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      backgroundColor: 'white',
      cursor: 'pointer',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.3s'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#333'
    },
    fontSizeControl: {
      marginBottom: '20px'
    },
    slider: {
      width: '100%',
      marginBottom: '10px'
    }
  };

  const renderToolPanel = () => {
    switch (activeTab) {
      case 'shapes':
        return (
          <div>
            <h3 style={styles.sectionTitle}>🔷 Basic Shapes</h3>
            <div style={styles.toolGrid}>
              {['circle', 'rectangle', 'triangle', 'star', 'heart', 'diamond', 'hexagon', 'oval', 'crescent', 'arrow'].map(shape => (
                <button 
                  key={shape} 
                  onClick={() => addShape(shape)} 
                  style={styles.toolButton}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#e3f2fd'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {shape === 'circle' && '⭕'} 
                  {shape === 'rectangle' && '⬜'} 
                  {shape === 'triangle' && '🔺'} 
                  {shape === 'star' && '⭐'} 
                  {shape === 'heart' && '❤️'}
                  {shape === 'diamond' && '💎'} 
                  {shape === 'hexagon' && '⬡'} 
                  {shape === 'oval' && '🥚'} 
                  {shape === 'crescent' && '🌙'} 
                  {shape === 'arrow' && '➡️'}
                  <br/>{shape}
                </button>
              ))}
            </div>
          </div>
        );
      case 'objects':
        return (
          <div>
            <h3 style={styles.sectionTitle}>🏠 Fun Objects</h3>
            <div style={styles.toolGrid}>
              {['sun', 'house', 'car', 'tree', 'flower', 'cat', 'dog', 'fish', 'apple', 'bird', 'butterfly', 'rabbit', 'elephant', 'balloon', 'boat', 'cake', 'ice_cream', 'umbrella', 'clock', 'rainbow'].map(obj => (
                <button 
                  key={obj} 
                  onClick={() => addShape(obj)} 
                  style={styles.toolButton}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#e8f5e8'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  {obj === 'sun' && '☀️'} 
                  {obj === 'house' && '🏠'} 
                  {obj === 'car' && '🚗'} 
                  {obj === 'tree' && '🌳'} 
                  {obj === 'flower' && '🌸'} 
                  {obj === 'cat' && '🐱'} 
                  {obj === 'dog' && '🐶'} 
                  {obj === 'fish' && '🐟'} 
                  {obj === 'apple' && '🍎'}
                  {obj === 'bird' && '🐦'} 
                  {obj === 'butterfly' && '🦋'} 
                  {obj === 'rabbit' && '🐰'} 
                  {obj === 'elephant' && '🐘'} 
                  {obj === 'balloon' && '🎈'} 
                  {obj === 'boat' && '⛵'} 
                  {obj === 'cake' && '🎂'} 
                  {obj === 'ice_cream' && '🍦'} 
                  {obj === 'umbrella' && '☂️'} 
                  {obj === 'clock' && '🕐'} 
                  {obj === 'rainbow' && '🌈'}
                  <br/>{obj}
                </button>
              ))}
            </div>
          </div>
        );
      case 'text':
        return (
          <div>
            <h3 style={styles.sectionTitle}>📝 Text Tools</h3>
            <button 
              onClick={() => addShape('text')} 
              style={{...styles.toolButton, width: '100%', marginBottom: '20px'}}
              onMouseOver={(e) => e.target.style.backgroundColor = '#fff3e0'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              📝 Add Text
            </button>
            
            <div style={styles.fontSizeControl}>
              <h4>Font Size: {fontSize}px</h4>
              <input 
                type="range" 
                min="16" 
                max="72" 
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                style={styles.slider}
              />
              <div style={{textAlign: 'center', fontSize: fontSize + 'px', fontWeight: 'bold'}}>
                ABC
              </div>
            </div>
          </div>
        );
      case 'tools':
        return (
          <div>
            <h3 style={styles.sectionTitle}>🛠️ Edit Tools</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <button 
                onClick={deleteSelected} 
                style={{...styles.toolButton, backgroundColor: '#ffebee', color: '#d32f2f'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#ffcdd2'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ffebee'}
              >
                🗑️ Delete Selected
              </button>
              <button 
                onClick={() => canvas?.clear()} 
                style={{...styles.toolButton, backgroundColor: '#f3e5f5', color: '#7b1fa2'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e1bee7'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#f3e5f5'}
              >
                🧹 Clear All
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎨 ECD Template Studio</h1>
        <div style={styles.headerControls}>
          <input 
            type="text" 
            value={templateData.name} 
            onChange={(e) => setTemplateData({...templateData, name: e.target.value})} 
            style={styles.input}
            placeholder="Template name..."
          />
          <select 
            value={templateData.difficulty} 
            onChange={(e) => setTemplateData({...templateData, difficulty: e.target.value})} 
            style={styles.select}
          >
            <option value="easy">🟢 Easy (Ages 3-5)</option>
            <option value="medium">🟡 Medium (Ages 5-7)</option>
            <option value="hard">🔴 Hard (Ages 7+)</option>
          </select>
          {onNavigateToMarketplace && (
            <button 
              onClick={onNavigateToMarketplace} 
              style={{...styles.button, backgroundColor: 'rgba(255,255,255,0.2)', color: 'white'}}
            >
              🏪 Marketplace
            </button>
          )}
          <button onClick={exportTemplate} style={styles.button}>
            💾 Save Template
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        {[
          {id:'shapes', label:'🔷 Shapes'},
          {id:'objects', label:'🏠 Objects'},
          {id:'text', label:'📝 Text'},
          {id:'tools', label:'🛠️ Tools'}
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            style={{
              ...styles.tabButton,
              ...(activeTab === tab.id ? styles.activeTab : styles.inactiveTab)
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {renderToolPanel()}
        </div>

        {/* Canvas Area */}
        <div style={styles.canvasArea}>
          <div style={styles.canvasContainer}>
            <h3 style={{textAlign: 'center', marginBottom: '20px', color: '#333'}}>
              🎨 Your Creative Canvas
            </h3>
            <canvas ref={canvasRef} style={{border: '2px dashed #ddd', borderRadius: '8px'}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateStudio;
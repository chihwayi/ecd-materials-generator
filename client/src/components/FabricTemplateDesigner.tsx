import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const SHAPE_CATEGORIES = {
  basic: {
    name: 'Basic Shapes',
    icon: '⬜',
    shapes: [
      { type: 'rect', name: 'Rectangle', icon: '▭' },
      { type: 'circle', name: 'Circle', icon: '○' },
      { type: 'triangle', name: 'Triangle', icon: '△' },
      { type: 'line', name: 'Line', icon: '─' },
      { type: 'square', name: 'Square', icon: '⬜' },
      { type: 'oval', name: 'Oval', icon: '⭕' },
      { type: 'diamond', name: 'Diamond', icon: '💎' },
      { type: 'hexagon', name: 'Hexagon', icon: '⬡' }
    ]
  },
  animals: {
    name: 'Animals',
    icon: '🐶',
    shapes: [
      { type: 'dog', name: 'Dog', icon: '🐶' },
      { type: 'cat', name: 'Cat', icon: '🐱' },
      { type: 'elephant', name: 'Elephant', icon: '🐘' },
      { type: 'lion', name: 'Lion', icon: '🦁' },
      { type: 'tiger', name: 'Tiger', icon: '🐅' },
      { type: 'bear', name: 'Bear', icon: '🐻' },
      { type: 'rabbit', name: 'Rabbit', icon: '🐰' },
      { type: 'fox', name: 'Fox', icon: '🦊' },
      { type: 'cow', name: 'Cow', icon: '🐄' },
      { type: 'pig', name: 'Pig', icon: '🐷' },
      { type: 'sheep', name: 'Sheep', icon: '🐑' },
      { type: 'horse', name: 'Horse', icon: '🐴' },
      { type: 'chicken', name: 'Chicken', icon: '🐔' },
      { type: 'duck', name: 'Duck', icon: '🦆' },
      { type: 'bird', name: 'Bird', icon: '🐦' },
      { type: 'fish', name: 'Fish', icon: '🐟' },
      { type: 'butterfly', name: 'Butterfly', icon: '🦋' },
      { type: 'bee', name: 'Bee', icon: '🐝' },
      { type: 'ladybug', name: 'Ladybug', icon: '🐞' },
      { type: 'spider', name: 'Spider', icon: '🕷️' }
    ]
  },
  people: {
    name: 'People & Family',
    icon: '👤',
    shapes: [
      { type: 'person', name: 'Person', icon: '👤' },
      { type: 'boy', name: 'Boy', icon: '👦' },
      { type: 'girl', name: 'Girl', icon: '👧' },
      { type: 'man', name: 'Man', icon: '👨' },
      { type: 'woman', name: 'Woman', icon: '👩' },
      { type: 'baby', name: 'Baby', icon: '👶' },
      { type: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
      { type: 'teacher', name: 'Teacher', icon: '👩‍🏫' },
      { type: 'doctor', name: 'Doctor', icon: '👨‍⚕️' },
      { type: 'police', name: 'Police', icon: '👮' },
      { type: 'firefighter', name: 'Firefighter', icon: '👨‍🚒' },
      { type: 'farmer', name: 'Farmer', icon: '👨‍🌾' }
    ]
  },
  buildings: {
    name: 'Buildings & Places',
    icon: '🏠',
    shapes: [
      { type: 'house', name: 'House', icon: '🏠' },
      { type: 'school', name: 'School', icon: '🏫' },
      { type: 'hospital', name: 'Hospital', icon: '🏥' },
      { type: 'church', name: 'Church', icon: '⛪' },
      { type: 'castle', name: 'Castle', icon: '🏰' },
      { type: 'office', name: 'Office', icon: '🏢' },
      { type: 'factory', name: 'Factory', icon: '🏭' },
      { type: 'bank', name: 'Bank', icon: '🏦' },
      { type: 'store', name: 'Store', icon: '🏪' },
      { type: 'tent', name: 'Tent', icon: '⛺' },
      { type: 'lighthouse', name: 'Lighthouse', icon: '🗼' }
    ]
  },
  transport: {
    name: 'Transportation',
    icon: '🚗',
    shapes: [
      { type: 'car', name: 'Car', icon: '🚗' },
      { type: 'bus', name: 'Bus', icon: '🚌' },
      { type: 'truck', name: 'Truck', icon: '🚚' },
      { type: 'bicycle', name: 'Bicycle', icon: '🚲' },
      { type: 'motorcycle', name: 'Motorcycle', icon: '🏍️' },
      { type: 'train', name: 'Train', icon: '🚂' },
      { type: 'airplane', name: 'Airplane', icon: '✈️' },
      { type: 'helicopter', name: 'Helicopter', icon: '🚁' },
      { type: 'boat', name: 'Boat', icon: '⛵' },
      { type: 'ship', name: 'Ship', icon: '🚢' },
      { type: 'rocket', name: 'Rocket', icon: '🚀' },
      { type: 'ambulance', name: 'Ambulance', icon: '🚑' },
      { type: 'firetruck', name: 'Fire Truck', icon: '🚒' },
      { type: 'police_car', name: 'Police Car', icon: '🚓' }
    ]
  },
  nature: {
    name: 'Nature & Weather',
    icon: '🌳',
    shapes: [
      { type: 'tree', name: 'Tree', icon: '🌳' },
      { type: 'flower', name: 'Flower', icon: '🌸' },
      { type: 'rose', name: 'Rose', icon: '🌹' },
      { type: 'sunflower', name: 'Sunflower', icon: '🌻' },
      { type: 'tulip', name: 'Tulip', icon: '🌷' },
      { type: 'cactus', name: 'Cactus', icon: '🌵' },
      { type: 'palm_tree', name: 'Palm Tree', icon: '🌴' },
      { type: 'sun', name: 'Sun', icon: '☀️' },
      { type: 'moon', name: 'Moon', icon: '🌙' },
      { type: 'star', name: 'Star', icon: '⭐' },
      { type: 'cloud', name: 'Cloud', icon: '☁️' },
      { type: 'rainbow', name: 'Rainbow', icon: '🌈' },
      { type: 'lightning', name: 'Lightning', icon: '⚡' },
      { type: 'snowflake', name: 'Snowflake', icon: '❄️' },
      { type: 'mountain', name: 'Mountain', icon: '⛰️' },
      { type: 'volcano', name: 'Volcano', icon: '🌋' }
    ]
  },
  food: {
    name: 'Food & Drinks',
    icon: '🍎',
    shapes: [
      { type: 'apple', name: 'Apple', icon: '🍎' },
      { type: 'banana', name: 'Banana', icon: '🍌' },
      { type: 'orange', name: 'Orange', icon: '🍊' },
      { type: 'grapes', name: 'Grapes', icon: '🍇' },
      { type: 'strawberry', name: 'Strawberry', icon: '🍓' },
      { type: 'watermelon', name: 'Watermelon', icon: '🍉' },
      { type: 'pineapple', name: 'Pineapple', icon: '🍍' },
      { type: 'carrot', name: 'Carrot', icon: '🥕' },
      { type: 'corn', name: 'Corn', icon: '🌽' },
      { type: 'bread', name: 'Bread', icon: '🍞' },
      { type: 'cake', name: 'Cake', icon: '🎂' },
      { type: 'cookie', name: 'Cookie', icon: '🍪' },
      { type: 'ice_cream', name: 'Ice Cream', icon: '🍦' },
      { type: 'pizza', name: 'Pizza', icon: '🍕' },
      { type: 'hamburger', name: 'Hamburger', icon: '🍔' },
      { type: 'milk', name: 'Milk', icon: '🥛' }
    ]
  },
  toys: {
    name: 'Toys & Games',
    icon: '🧸',
    shapes: [
      { type: 'teddy_bear', name: 'Teddy Bear', icon: '🧸' },
      { type: 'ball', name: 'Ball', icon: '⚽' },
      { type: 'basketball', name: 'Basketball', icon: '🏀' },
      { type: 'football', name: 'Football', icon: '🏈' },
      { type: 'tennis', name: 'Tennis Ball', icon: '🎾' },
      { type: 'kite', name: 'Kite', icon: '🪁' },
      { type: 'puzzle', name: 'Puzzle', icon: '🧩' },
      { type: 'blocks', name: 'Blocks', icon: '🧱' },
      { type: 'doll', name: 'Doll', icon: '🪆' },
      { type: 'robot', name: 'Robot', icon: '🤖' }
    ]
  },
  objects: {
    name: 'Everyday Objects',
    icon: '📱',
    shapes: [
      { type: 'phone', name: 'Phone', icon: '📱' },
      { type: 'computer', name: 'Computer', icon: '💻' },
      { type: 'book', name: 'Book', icon: '📚' },
      { type: 'pencil', name: 'Pencil', icon: '✏️' },
      { type: 'scissors', name: 'Scissors', icon: '✂️' },
      { type: 'clock', name: 'Clock', icon: '🕐' },
      { type: 'key', name: 'Key', icon: '🔑' },
      { type: 'umbrella', name: 'Umbrella', icon: '☂️' },
      { type: 'chair', name: 'Chair', icon: '🪑' },
      { type: 'table', name: 'Table', icon: '🪑' },
      { type: 'bed', name: 'Bed', icon: '🛏️' },
      { type: 'lamp', name: 'Lamp', icon: '💡' },
      { type: 'door', name: 'Door', icon: '🚪' },
      { type: 'window', name: 'Window', icon: '🪟' }
    ]
  },
  symbols: {
    name: 'Symbols & Shapes',
    icon: '❤️',
    shapes: [
      { type: 'heart', name: 'Heart', icon: '❤️' },
      { type: 'diamond_shape', name: 'Diamond', icon: '💎' },
      { type: 'crown', name: 'Crown', icon: '👑' },
      { type: 'gift', name: 'Gift', icon: '🎁' },
      { type: 'balloon', name: 'Balloon', icon: '🎈' },
      { type: 'flag', name: 'Flag', icon: '🏁' },
      { type: 'trophy', name: 'Trophy', icon: '🏆' },
      { type: 'medal', name: 'Medal', icon: '🏅' },
      { type: 'music_note', name: 'Music Note', icon: '🎵' },
      { type: 'peace', name: 'Peace Sign', icon: '☮️' }
    ]
  },
  text: {
    name: 'Text & Labels',
    icon: '📝',
    shapes: [
      { type: 'text_normal', name: 'Normal Text', icon: 'Aa' },
      { type: 'text_bold', name: 'Bold Text', icon: '𝐀𝐚' },
      { type: 'text_large', name: 'Large Text', icon: '𝓐𝓪' },
      { type: 'text_title', name: 'Title Text', icon: '𝕬𝖆' }
    ]
  }
};

// Simple SVG paths that work with Fabric.js
const SVG_PATHS = {
  house: 'M 10 30 L 10 10 L 20 0 L 30 10 L 30 30 Z M 15 30 L 15 20 L 25 20 L 25 30 Z',
  tree: 'M 18 30 L 18 15 L 22 15 L 22 30 Z M 20 15 C 10 15 10 0 20 0 C 30 0 30 15 20 15 Z',
  car: 'M 5 20 L 8 15 L 32 15 L 35 20 L 35 25 L 30 25 L 30 22 L 10 22 L 10 25 L 5 25 Z M 12 25 C 12 27 10 29 8 29 C 6 29 4 27 4 25 C 4 23 6 21 8 21 C 10 21 12 23 12 25 Z M 36 25 C 36 27 34 29 32 29 C 30 29 28 27 28 25 C 28 23 30 21 32 21 C 34 21 36 23 36 25 Z',
  sun: 'M 20 20 C 20 15 15 10 10 10 C 5 10 0 15 0 20 C 0 25 5 30 10 30 C 15 30 20 25 20 20 Z M 10 0 L 10 5 M 10 35 L 10 40 M 0 20 L 5 20 M 35 20 L 40 20 M 5 5 L 8 8 M 32 32 L 35 35 M 35 5 L 32 8 M 8 32 L 5 35',
  person: 'M 20 10 C 20 5 15 0 10 0 C 5 0 0 5 0 10 C 0 15 5 20 10 20 C 15 20 20 15 20 10 Z M 10 20 L 10 40 M 0 30 L 20 30 M 10 40 L 5 50 M 10 40 L 15 50',
  heart: 'M 20 15 C 20 10 15 5 10 5 C 5 5 0 10 0 15 C 0 20 10 30 10 30 C 10 30 20 20 20 15 Z',
  flower: 'M 15 15 C 15 10 10 5 5 5 C 0 5 -5 10 -5 15 C -5 20 0 25 5 25 C 10 25 15 20 15 15 Z M 25 15 C 25 10 20 5 15 5 C 10 5 5 10 5 15 C 5 20 10 25 15 25 C 20 25 25 20 25 15 Z'
};

const FabricTemplateDesigner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [outlineMode, setOutlineMode] = useState(false);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 1200,
        height: 800,
        backgroundColor: '#ffffff',
        uniformScaling: false,
        uniScaleTransform: false,
        centeredScaling: false
      });
      
      setCanvas(fabricCanvas);

      // Listen for object selection
      fabricCanvas.on('selection:created', (e) => {
        setSelectedObject(e.selected[0]);
      });
      
      fabricCanvas.on('selection:updated', (e) => {
        setSelectedObject(e.selected[0]);
      });
      
      fabricCanvas.on('selection:cleared', () => {
        setSelectedObject(null);
      });

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  const addShape = (shapeType: string) => {
    if (!canvas) return;

    const x = Math.random() * 400 + 100;
    const y = Math.random() * 300 + 100;

    switch (shapeType) {
      case 'rect':
        const rect = new fabric.Rect({
          left: x,
          top: y,
          width: 100,
          height: 60,
          fill: 'transparent',
          stroke: '#2563eb',
          strokeWidth: 2
        });
        canvas.add(rect);
        break;

      case 'circle':
        const circle = new fabric.Circle({
          left: x,
          top: y,
          radius: 40,
          fill: 'transparent',
          stroke: '#2563eb',
          strokeWidth: 2
        });
        canvas.add(circle);
        break;

      case 'triangle':
        const triangle = new fabric.Triangle({
          left: x,
          top: y,
          width: 80,
          height: 80,
          fill: 'transparent',
          stroke: '#2563eb',
          strokeWidth: 2
        });
        canvas.add(triangle);
        break;

      case 'line':
        const line = new fabric.Line([0, 0, 100, 0], {
          left: x,
          top: y,
          stroke: '#2563eb',
          strokeWidth: 2
        });
        canvas.add(line);
        break;

      // Text tools
      case 'text_normal':
        const normalText = new fabric.IText('Click to edit text', {
          left: x,
          top: y,
          fontSize: 24,
          fontFamily: 'Arial',
          fill: '#000000'
        });
        canvas.add(normalText);
        break;
        
      case 'text_bold':
        const boldText = new fabric.IText('Bold Text', {
          left: x,
          top: y,
          fontSize: 24,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fill: '#000000'
        });
        canvas.add(boldText);
        break;
        
      case 'text_large':
        const largeText = new fabric.IText('Large Text', {
          left: x,
          top: y,
          fontSize: 48,
          fontFamily: 'Georgia',
          fill: '#000000'
        });
        canvas.add(largeText);
        break;
        
      case 'text_title':
        const titleText = new fabric.IText('TITLE', {
          left: x,
          top: y,
          fontSize: 36,
          fontFamily: 'Impact',
          fontWeight: 'bold',
          fill: '#000000',
          textAlign: 'center'
        });
        canvas.add(titleText);
        break;

      default:
        // Use actual emoji/text characters for realistic shapes
        const emojiMap: { [key: string]: string } = {
          // Basic shapes
          square: '⬜', oval: '⭕', diamond: '💎', hexagon: '⬡',
          // Animals
          dog: '🐶', cat: '🐱', elephant: '🐘', lion: '🦁', tiger: '🐅', bear: '🐻',
          rabbit: '🐰', fox: '🦊', cow: '🐄', pig: '🐷', sheep: '🐑', horse: '🐴',
          chicken: '🐔', duck: '🦆', bird: '🐦', fish: '🐟', butterfly: '🦋',
          bee: '🐝', ladybug: '🐞', spider: '🕷️',
          // People
          person: '👤', boy: '👦', girl: '👧', man: '👨', woman: '👩', baby: '👶',
          family: '👨‍👩‍👧‍👦', teacher: '👩‍🏫', doctor: '👨‍⚕️', police: '👮',
          firefighter: '👨‍🚒', farmer: '👨‍🌾',
          // Buildings
          house: '🏠', school: '🏫', hospital: '🏥', church: '⛪', castle: '🏰',
          office: '🏢', factory: '🏭', bank: '🏦', store: '🏪', tent: '⛺', lighthouse: '🗼',
          // Transport
          car: '🚗', bus: '🚌', truck: '🚚', bicycle: '🚲', motorcycle: '🏍️',
          train: '🚂', airplane: '✈️', helicopter: '🚁', boat: '⛵', ship: '🚢',
          rocket: '🚀', ambulance: '🚑', firetruck: '🚒', police_car: '🚓',
          // Nature
          tree: '🌳', flower: '🌸', rose: '🌹', sunflower: '🌻', tulip: '🌷',
          cactus: '🌵', palm_tree: '🌴', sun: '☀️', moon: '🌙', star: '⭐',
          cloud: '☁️', rainbow: '🌈', lightning: '⚡', snowflake: '❄️',
          mountain: '⛰️', volcano: '🌋',
          // Food
          apple: '🍎', banana: '🍌', orange: '🍊', grapes: '🍇', strawberry: '🍓',
          watermelon: '🍉', pineapple: '🍍', carrot: '🥕', corn: '🌽', bread: '🍞',
          cake: '🎂', cookie: '🍪', ice_cream: '🍦', pizza: '🍕', hamburger: '🍔', milk: '🥛',
          // Toys
          teddy_bear: '🧸', ball: '⚽', basketball: '🏀', football: '🏈', tennis: '🎾',
          kite: '🪁', puzzle: '🧩', blocks: '🧱', doll: '🪆', robot: '🤖',
          // Objects
          phone: '📱', computer: '💻', book: '📚', pencil: '✏️', scissors: '✂️',
          clock: '🕐', key: '🔑', umbrella: '☂️', chair: '🪑', table: '🪑',
          bed: '🛏️', lamp: '💡', door: '🚪', window: '🪟',
          // Symbols
          heart: '❤️', diamond_shape: '💎', crown: '👑', gift: '🎁', balloon: '🎈',
          flag: '🏁', trophy: '🏆', medal: '🏅', music_note: '🎵', peace: '☮️'
        };
        
        // Create fillable shapes instead of emojis
        const shapeMap: { [key: string]: () => fabric.Object } = {
          house: () => {
            const group = new fabric.Group([
              new fabric.Rect({ left: -30, top: -10, width: 60, height: 40, fill: '#8B4513' }),
              new fabric.Polygon([{x: -40, y: -10}, {x: 0, y: -40}, {x: 40, y: -10}], { fill: '#DC143C' }),
              new fabric.Rect({ left: -10, top: 10, width: 20, height: 20, fill: '#654321' })
            ], { left: x, top: y });
            return group;
          },
          tree: () => {
            const group = new fabric.Group([
              new fabric.Rect({ left: -5, top: 5, width: 10, height: 25, fill: '#8B4513' }),
              new fabric.Circle({ left: 0, top: -20, radius: 25, fill: '#228B22' })
            ], { left: x, top: y });
            return group;
          },
          car: () => {
            const group = new fabric.Group([
              new fabric.Rect({ left: -40, top: -10, width: 80, height: 20, fill: '#FF0000' }),
              new fabric.Circle({ left: -25, top: 10, radius: 8, fill: '#000000' }),
              new fabric.Circle({ left: 25, top: 10, radius: 8, fill: '#000000' }),
              new fabric.Rect({ left: -15, top: -20, width: 30, height: 10, fill: '#87CEEB' })
            ], { left: x, top: y });
            return group;
          },
          sun: () => {
            const group = new fabric.Group([
              new fabric.Circle({ left: 0, top: 0, radius: 20, fill: '#FFD700' }),
              ...Array.from({length: 8}, (_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const x1 = Math.cos(angle) * 25;
                const y1 = Math.sin(angle) * 25;
                const x2 = Math.cos(angle) * 35;
                const y2 = Math.sin(angle) * 35;
                return new fabric.Line([x1, y1, x2, y2], { stroke: '#FFD700', strokeWidth: 3 });
              })
            ], { left: x, top: y });
            return group;
          },
          heart: () => {
            const heartPath = 'M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z';
            return new fabric.Path(heartPath, { left: x, top: y, fill: '#FF69B4', scaleX: 2, scaleY: 2 });
          },
          star: () => {
            return new fabric.Star({ left: x, top: y, points: 5, radius: 30, innerRadius: 15, fill: '#FFD700' });
          }
        };
        
        if (shapeMap[shapeType]) {
          const shape = shapeMap[shapeType]();
          shape.set({
            cornerStyle: 'circle',
            cornerSize: 12,
            transparentCorners: false,
            borderColor: '#2563eb',
            cornerColor: '#2563eb'
          });
          canvas.add(shape);
        } else if (emojiMap[shapeType]) {
          // Fallback to emoji for shapes we haven't converted yet
          const text = new fabric.Text(emojiMap[shapeType], {
            left: x,
            top: y,
            fontSize: 60,
            fontFamily: 'Arial, sans-serif',
            cornerStyle: 'circle',
            cornerSize: 12,
            transparentCorners: false,
            borderColor: '#2563eb',
            cornerColor: '#2563eb'
          });
          canvas.add(text);
        }
        break;
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    if (canvas) {
      const activeObjects = canvas.getActiveObjects();
      canvas.discardActiveObject();
      canvas.remove(...activeObjects);
    }
  };

  const removeFill = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        // Handle groups (like house, car, etc.)
        if (activeObject.type === 'group') {
          (activeObject as fabric.Group).forEachObject((obj) => {
            obj.set({
              fill: '',
              stroke: '#000000',
              strokeWidth: 2,
              strokeUniform: true,
              paintFirst: 'stroke'
            });
          });
        } else {
          // Handle individual objects
          activeObject.set({
            fill: '',
            stroke: '#000000',
            strokeWidth: 2,
            strokeUniform: true,
            paintFirst: 'stroke'
          });
        }
        canvas.renderAll();
      }
    }
  };

  const addFill = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        // Handle groups - restore original colors
        if (activeObject.type === 'group') {
          (activeObject as fabric.Group).forEachObject((obj, index) => {
            const colors = ['#8B4513', '#DC143C', '#654321', '#228B22', '#FF0000', '#000000', '#87CEEB', '#FFD700', '#FF69B4'];
            obj.set({
              fill: colors[index % colors.length],
              stroke: null,
              strokeWidth: 0
            });
          });
        } else {
          activeObject.set({
            fill: '#2563eb',
            stroke: null,
            strokeWidth: 0
          });
        }
        canvas.renderAll();
      }
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="text-xl font-bold text-white">Template Designer</h2>
          <p className="text-blue-100 mt-1">Create learning materials</p>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto">
          {Object.entries(SHAPE_CATEGORIES).map(([key, category]) => (
            <div key={key} className="border-b border-gray-100">
              <button
                onClick={() => setSelectedCategory(selectedCategory === key ? '' : key)}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-blue-50 transition-all duration-200 ${
                  selectedCategory === key ? 'bg-blue-100 border-r-4 border-blue-500 shadow-sm' : ''
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-gray-900">{category.name}</span>
                <span className="ml-auto text-gray-400">{selectedCategory === key ? '▼' : '▶'}</span>
              </button>
              
              {selectedCategory === key && (
                <div className="bg-gray-50 px-4 py-2">
                  <div className="grid grid-cols-2 gap-2">
                    {category.shapes.map((shape) => (
                      <button
                        key={shape.type}
                        onClick={() => addShape(shape.type)}
                        className="p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md transition-all duration-200 text-center transform hover:scale-105"
                      >
                        <div className="text-lg mb-1">{shape.icon}</div>
                        <div className="text-xs text-gray-600">{shape.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Coloring Mode Toggle */}
        <div className="p-4 border-t border-gray-200">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={outlineMode}
              onChange={(e) => setOutlineMode(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              🎨 Coloring Mode (Outlines Only)
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <button
            onClick={clearCanvas}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            🗑️ Clear Canvas
          </button>
          <button
            onClick={deleteSelected}
            className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium"
          >
            ❌ Delete Selected
          </button>
          
          {selectedObject && (
            <>
              <button
                onClick={removeFill}
                className="w-full px-4 py-3 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 transition-all duration-200 font-medium"
              >
                🎨 Remove Fill (Outline Only)
              </button>
              <button
                onClick={addFill}
                className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all duration-200 font-medium"
              >
                🖌️ Add Fill
              </button>
            </>
          )}
          <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg">
            💾 Save Template
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">
            🎨 Fabric.js Canvas - Click shapes to add, drag to move, select and delete
          </div>
        </div>

        {/* Drawing Area */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg p-4 inline-block">
            <canvas ref={canvasRef} className="border border-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FabricTemplateDesigner;
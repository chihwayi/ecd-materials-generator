import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Text, Star, RegularPolygon, Group } from 'react-konva';

interface ShapeObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: number[];
  text?: string;
  fill?: string;
  stroke: string;
  strokeWidth: number;
  rotation?: number;
}

// Professional SVG Icons (similar to unDraw/SVG Repo style)
const SVG_ICONS = {
  house: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 80V45L50 20L80 45V80H65V60H35V80H20Z" fill="none" stroke="#2563eb" stroke-width="3"/>
    <rect x="40" y="65" width="8" height="15" fill="none" stroke="#2563eb" stroke-width="2"/>
    <rect x="55" y="50" width="8" height="8" fill="none" stroke="#2563eb" stroke-width="2"/>
  </svg>`,
  
  tree: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <rect x="45" y="60" width="10" height="25" fill="none" stroke="#2563eb" stroke-width="3"/>
    <circle cx="50" cy="45" r="20" fill="none" stroke="#2563eb" stroke-width="3"/>
    <circle cx="35" cy="35" r="12" fill="none" stroke="#2563eb" stroke-width="2"/>
    <circle cx="65" cy="35" r="12" fill="none" stroke="#2563eb" stroke-width="2"/>
  </svg>`,
  
  car: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 65H20C20 70 25 75 30 75S40 70 40 65H60C60 70 65 75 70 75S80 70 80 65H85V55L80 40H20L15 55V65Z" fill="none" stroke="#2563eb" stroke-width="3"/>
    <circle cx="30" cy="65" r="5" fill="none" stroke="#2563eb" stroke-width="2"/>
    <circle cx="70" cy="65" r="5" fill="none" stroke="#2563eb" stroke-width="2"/>
    <rect x="25" y="35" width="50" height="15" rx="3" fill="none" stroke="#2563eb" stroke-width="2"/>
  </svg>`,
  
  sun: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="15" fill="none" stroke="#2563eb" stroke-width="3"/>
    <line x1="50" y1="15" x2="50" y2="25" stroke="#2563eb" stroke-width="3"/>
    <line x1="50" y1="75" x2="50" y2="85" stroke="#2563eb" stroke-width="3"/>
    <line x1="15" y1="50" x2="25" y2="50" stroke="#2563eb" stroke-width="3"/>
    <line x1="75" y1="50" x2="85" y2="50" stroke="#2563eb" stroke-width="3"/>
    <line x1="25.86" y1="25.86" x2="32.93" y2="32.93" stroke="#2563eb" stroke-width="3"/>
    <line x1="67.07" y1="67.07" x2="74.14" y2="74.14" stroke="#2563eb" stroke-width="3"/>
    <line x1="74.14" y1="25.86" x2="67.07" y2="32.93" stroke="#2563eb" stroke-width="3"/>
    <line x1="32.93" y1="67.07" x2="25.86" y2="74.14" stroke="#2563eb" stroke-width="3"/>
  </svg>`,
  
  person: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="25" r="12" fill="none" stroke="#2563eb" stroke-width="3"/>
    <path d="M50 40V70M35 55H65M50 70L40 85M50 70L60 85" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
  </svg>`,
  
  heart: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 75C50 75 20 55 20 35C20 25 30 15 40 15C45 15 50 20 50 25C50 20 55 15 60 15C70 15 80 25 80 35C80 55 50 75 50 75Z" fill="none" stroke="#2563eb" stroke-width="3"/>
  </svg>`,
  
  flower: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="8" fill="none" stroke="#2563eb" stroke-width="3"/>
    <ellipse cx="50" cy="30" rx="8" ry="12" fill="none" stroke="#2563eb" stroke-width="2"/>
    <ellipse cx="70" cy="50" rx="12" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
    <ellipse cx="50" cy="70" rx="8" ry="12" fill="none" stroke="#2563eb" stroke-width="2"/>
    <ellipse cx="30" cy="50" rx="12" ry="8" fill="none" stroke="#2563eb" stroke-width="2"/>
  </svg>`,
  
  butterfly: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="20" x2="50" y2="80" stroke="#2563eb" stroke-width="3"/>
    <path d="M50 35C40 25 25 25 25 40C25 50 35 55 50 50" fill="none" stroke="#2563eb" stroke-width="2"/>
    <path d="M50 35C60 25 75 25 75 40C75 50 65 55 50 50" fill="none" stroke="#2563eb" stroke-width="2"/>
    <path d="M50 65C40 75 25 75 25 60C25 50 35 45 50 50" fill="none" stroke="#2563eb" stroke-width="2"/>
    <path d="M50 65C60 75 75 75 75 60C75 50 65 45 50 50" fill="none" stroke="#2563eb" stroke-width="2"/>
    <circle cx="48" cy="25" r="2" fill="#2563eb"/>
    <circle cx="52" cy="25" r="2" fill="#2563eb"/>
  </svg>`
};

const SHAPE_CATEGORIES = {
  basic: {
    name: 'Basic',
    icon: '⬜',
    shapes: [
      { type: 'rect', name: 'Rectangle', icon: '▭' },
      { type: 'circle', name: 'Circle', icon: '○' },
      { type: 'line', name: 'Line', icon: '─' },
      { type: 'arrow', name: 'Arrow', icon: '→' },
    ]
  },
  geometry: {
    name: 'Geometry',
    icon: '△',
    shapes: [
      { type: 'triangle', name: 'Triangle', icon: '△' },
      { type: 'pentagon', name: 'Pentagon', icon: '⬟' },
      { type: 'hexagon', name: 'Hexagon', icon: '⬡' },
      { type: 'star', name: 'Star', icon: '★' },
    ]
  },
  objects: {
    name: 'Objects',
    icon: '🏠',
    shapes: [
      { type: 'house', name: 'House', icon: '🏠' },
      { type: 'tree', name: 'Tree', icon: '🌳' },
      { type: 'car', name: 'Car', icon: '🚗' },
      { type: 'sun', name: 'Sun', icon: '☀️' },
    ]
  },
  people: {
    name: 'People',
    icon: '👤',
    shapes: [
      { type: 'person', name: 'Person', icon: '👤' },
    ]
  },
  ornaments: {
    name: 'Ornaments',
    icon: '✨',
    shapes: [
      { type: 'flower', name: 'Flower', icon: '🌸' },
      { type: 'heart', name: 'Heart', icon: '💖' },
      { type: 'butterfly', name: 'Butterfly', icon: '🦋' },
    ]
  }
};

const TemplateDesigner: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [shapes, setShapes] = useState<ShapeObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<any>(null);

  const SVGIcon: React.FC<any> = ({ ...props }) => {
    // For now, render as a simple circle placeholder
    // Will be replaced with proper SVG rendering later
    return <Circle {...props} radius={30} />;
  };

  const addShape = (shapeType: string) => {
    const newShape: ShapeObject = {
      id: `${shapeType}_${Date.now()}`,
      type: shapeType,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      stroke: '#2563eb',
      strokeWidth: 2,
      fill: 'transparent',
    };

    // Set specific properties based on shape type
    switch (shapeType) {
      case 'rect':
        newShape.width = 100;
        newShape.height = 60;
        break;
      case 'circle':
        newShape.radius = 40;
        break;
      case 'triangle':
        newShape.points = [0, -40, -35, 30, 35, 30];
        break;
      case 'star':
        newShape.radius = 40;
        break;
      case 'pentagon':
      case 'hexagon':
        newShape.radius = 40;
        break;
      case 'line':
        newShape.points = [0, 0, 100, 0];
        break;
      case 'arrow':
        newShape.points = [0, 0, 80, 0, 70, -10, 80, 0, 70, 10];
        break;
      default:
        newShape.width = 60;
        newShape.height = 60;
        break;
    }

    setShapes([...shapes, newShape]);
  };

  const renderShape = (shape: ShapeObject) => {
    const commonProps = {
      id: shape.id,
      x: shape.x,
      y: shape.y,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      fill: shape.fill || 'transparent',
      draggable: true,
      onClick: () => setSelectedId(shape.id),
      onDragEnd: (e: any) => {
        const updatedShapes = shapes.map(s =>
          s.id === shape.id ? { ...s, x: e.target.x(), y: e.target.y() } : s
        );
        setShapes(updatedShapes);
      },
    };

    switch (shape.type) {
      case 'rect':
        return <Rect key={shape.id} {...commonProps} width={shape.width} height={shape.height} />;
      case 'circle':
        return <Circle key={shape.id} {...commonProps} radius={shape.radius} />;
      case 'triangle':
        return <Line key={shape.id} {...commonProps} points={shape.points} closed />;
      case 'star':
        return <Star key={shape.id} {...commonProps} numPoints={5} innerRadius={20} outerRadius={shape.radius} />;
      case 'pentagon':
        return <RegularPolygon key={shape.id} {...commonProps} sides={5} radius={shape.radius} />;
      case 'hexagon':
        return <RegularPolygon key={shape.id} {...commonProps} sides={6} radius={shape.radius} />;
      case 'line':
        return <Line key={shape.id} {...commonProps} points={shape.points} />;
      case 'arrow':
        return <Line key={shape.id} {...commonProps} points={shape.points} />;
      case 'house':
      case 'tree':
      case 'car':
      case 'sun':
      case 'person':
      case 'heart':
      case 'flower':
      case 'butterfly':
        return <SVGIcon key={shape.id} {...commonProps} iconType={shape.type} />;
      default:
        return <Circle key={shape.id} {...commonProps} radius={20} />;
    }
  };

  const clearCanvas = () => {
    setShapes([]);
    setSelectedId(null);
  };

  const deleteSelected = () => {
    if (selectedId) {
      setShapes(shapes.filter(s => s.id !== selectedId));
      setSelectedId(null);
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
                onClick={() => setSelectedCategory(key)}
                className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-blue-50 transition-all duration-200 ${
                  selectedCategory === key ? 'bg-blue-100 border-r-4 border-blue-500 shadow-sm' : ''
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-gray-900">{category.name}</span>
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

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          <button
            onClick={clearCanvas}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            🗑️ Clear Canvas
          </button>
          {selectedId && (
            <button
              onClick={deleteSelected}
              className="w-full px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-all duration-200 font-medium"
            >
              ❌ Delete Selected
            </button>
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
          <div className="flex items-center space-x-6">
            <div className="text-sm font-medium text-gray-700">
              📐 Shapes: <span className="text-blue-600">{shapes.length}</span>
            </div>
            <div className="text-sm font-medium text-gray-700">
              🎯 Selected: <span className="text-blue-600">{selectedId ? '1' : '0'}</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Click shapes to add • Drag to move • Click empty space to deselect
          </div>
        </div>

        {/* Drawing Area */}
        <div className="flex-1 overflow-hidden bg-white shadow-inner" style={{backgroundImage: 'radial-gradient(circle, #f1f5f9 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
          <Stage
            ref={stageRef}
            width={window.innerWidth - 320}
            height={window.innerHeight - 60}
            onClick={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedId(null);
              }
            }}
          >
            <Layer>
              {shapes.map(renderShape)}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default TemplateDesigner;
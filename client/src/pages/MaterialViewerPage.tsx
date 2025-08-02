import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { materialsService } from '../services/materials.service.ts';

interface MaterialElement {
  id: string;
  type: 'text' | 'image' | 'audio' | 'question' | 'cultural-content' | 'drawing-canvas' | 'drawing-task' | 'audio-task' | 'image-task' | 'puzzle-matching' | 'puzzle-sequencing' | 'puzzle-pattern' | 'puzzle-memory' | 'puzzle-math' | 'puzzle-word';
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface Material {
  id?: string;
  title: string;
  description: string;
  type: 'worksheet' | 'activity' | 'assessment' | 'story';
  subject: 'math' | 'language' | 'science' | 'art' | 'cultural';
  language: 'en' | 'sn' | 'nd';
  ageGroup: string;
  status: 'draft' | 'published';
  elements: MaterialElement[];
  createdBy?: { name: string };
  createdAt?: string;
}

const MaterialViewerPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMaterial();
    }
  }, [id]);

  const fetchMaterial = async () => {
    try {
      setLoading(true);
      const fetchedMaterial = await materialsService.getMaterialById(id!);
      setMaterial(fetchedMaterial);
    } catch (error: any) {
      console.error('Fetch material error:', error);
      toast.error('Failed to load material');
    } finally {
      setLoading(false);
    }
  };

  // Function to render coloring outline on canvas
  const renderColoringCanvas = (canvas: HTMLCanvasElement, element: MaterialElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 800;
      canvas.height = 600;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Center the drawing on the canvas with proper margins
      const margin = 50;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxWidth = canvas.width - 2 * margin;
      const maxHeight = canvas.height - 2 * margin;
      
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'transparent';
      
      if (element.content.instructions.includes('flag')) {
        // Draw proper Zimbabwean flag
        const flagWidth = Math.min(400, maxWidth);
        const flagHeight = Math.min(250, maxHeight);
        const x = centerX - flagWidth / 2;
        const y = centerY - flagHeight / 2;
        
        // Main flag rectangle
        ctx.strokeRect(x, y, flagWidth, flagHeight);
        
        // Horizontal stripes (green, yellow, red, black, red, yellow, green)
        const stripeHeight = flagHeight / 7;
        for (let i = 0; i < 7; i++) {
          ctx.strokeRect(x, y + i * stripeHeight, flagWidth, stripeHeight);
        }
        
        // Triangle on the left side
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + flagHeight);
        ctx.lineTo(x + flagWidth * 0.3, y + flagHeight / 2);
        ctx.closePath();
        ctx.stroke();
        
        // Star in the triangle
        const starX = x + flagWidth * 0.15;
        const starY = y + flagHeight / 2;
        const starSize = 20;
        drawStar(ctx, starX, starY, starSize);
        
      } else if (element.content.instructions.includes('lion')) {
        // Draw realistic lion
        const lionWidth = Math.min(300, maxWidth);
        const lionHeight = Math.min(250, maxHeight);
        const x = centerX - lionWidth / 2;
        const y = centerY - lionHeight / 2;
        
        // Lion's head
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 20, lionWidth / 3, lionHeight / 3, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Mane
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 20, lionWidth / 2.5, lionHeight / 2.5, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Eyes
        ctx.beginPath();
        ctx.arc(centerX - 30, centerY - 40, 12, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 30, centerY - 40, 12, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Nose
        ctx.beginPath();
        ctx.ellipse(centerX, centerY - 10, 8, 5, 0, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Mouth
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + 10, 15, 8, 0, 0, Math.PI);
        ctx.stroke();
        
        // Ears
        ctx.beginPath();
        ctx.arc(centerX - 40, centerY - 60, 8, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 40, centerY - 60, 8, 0, 2 * Math.PI);
        ctx.stroke();
        
      } else if (element.content.instructions.includes('house')) {
        // Draw realistic house
        const houseWidth = Math.min(350, maxWidth);
        const houseHeight = Math.min(280, maxHeight);
        const x = centerX - houseWidth / 2;
        const y = centerY - houseHeight / 2;
        
        // House body
        ctx.strokeRect(x, y + houseHeight * 0.3, houseWidth, houseHeight * 0.7);
        
        // Roof
        ctx.beginPath();
        ctx.moveTo(x - 20, y + houseHeight * 0.3);
        ctx.lineTo(centerX, y);
        ctx.lineTo(x + houseWidth + 20, y + houseHeight * 0.3);
        ctx.stroke();
        
        // Door
        const doorWidth = 60;
        const doorHeight = 100;
        ctx.strokeRect(centerX - doorWidth / 2, y + houseHeight * 0.5, doorWidth, doorHeight);
        
        // Door handle
        ctx.beginPath();
        ctx.arc(centerX + 15, y + houseHeight * 0.7, 3, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Windows
        const windowSize = 50;
        ctx.strokeRect(x + 40, y + houseHeight * 0.4, windowSize, windowSize);
        ctx.strokeRect(x + houseWidth - 90, y + houseHeight * 0.4, windowSize, windowSize);
        
        // Window panes
        ctx.beginPath();
        ctx.moveTo(x + 40 + windowSize / 2, y + houseHeight * 0.4);
        ctx.lineTo(x + 40 + windowSize / 2, y + houseHeight * 0.4 + windowSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 40, y + houseHeight * 0.4 + windowSize / 2);
        ctx.lineTo(x + 40 + windowSize, y + houseHeight * 0.4 + windowSize / 2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + houseWidth - 90 + windowSize / 2, y + houseHeight * 0.4);
        ctx.lineTo(x + houseWidth - 90 + windowSize / 2, y + houseHeight * 0.4 + windowSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + houseWidth - 90, y + houseHeight * 0.4 + windowSize / 2);
        ctx.lineTo(x + houseWidth - 90 + windowSize, y + houseHeight * 0.4 + windowSize / 2);
        ctx.stroke();
        
        // Chimney
        ctx.strokeRect(x + houseWidth - 40, y + houseHeight * 0.1, 25, 60);
        
      } else if (element.content.instructions.includes('tree')) {
        // Draw realistic tree
        const treeWidth = Math.min(300, maxWidth);
        const treeHeight = Math.min(350, maxHeight);
        const x = centerX - treeWidth / 2;
        const y = centerY - treeHeight / 2;
        
        // Trunk
        ctx.strokeRect(centerX - 15, y + treeHeight * 0.6, 30, treeHeight * 0.4);
        
        // Tree crown (multiple circles for realistic look)
        const crownRadius = 80;
        ctx.beginPath();
        ctx.arc(centerX, y + treeHeight * 0.3, crownRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX - 30, y + treeHeight * 0.2, crownRadius * 0.7, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + 30, y + treeHeight * 0.2, crownRadius * 0.7, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Apples
        for (let i = 0; i < 5; i++) {
          const appleX = centerX - 60 + i * 30;
          const appleY = y + treeHeight * 0.3 + (i % 2) * 20;
          ctx.beginPath();
          ctx.arc(appleX, appleY, 8, 0, 2 * Math.PI);
          ctx.stroke();
        }
        
        // Tree branches
        ctx.beginPath();
        ctx.moveTo(centerX - 10, y + treeHeight * 0.5);
        ctx.lineTo(centerX - 40, y + treeHeight * 0.4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX + 10, y + treeHeight * 0.5);
        ctx.lineTo(centerX + 40, y + treeHeight * 0.4);
        ctx.stroke();
        
      } else if (element.content.instructions.includes('car')) {
        // Draw realistic car
        const carWidth = Math.min(400, maxWidth);
        const carHeight = Math.min(180, maxHeight);
        const x = centerX - carWidth / 2;
        const y = centerY - carHeight / 2;
        
        // Car body (rounded rectangle effect)
        ctx.beginPath();
        ctx.moveTo(x + 20, y);
        ctx.lineTo(x + carWidth - 20, y);
        ctx.quadraticCurveTo(x + carWidth, y, x + carWidth, y + 20);
        ctx.lineTo(x + carWidth, y + carHeight - 40);
        ctx.quadraticCurveTo(x + carWidth, y + carHeight, x + carWidth - 20, y + carHeight);
        ctx.lineTo(x + 20, y + carHeight);
        ctx.quadraticCurveTo(x, y + carHeight, x, y + carHeight - 40);
        ctx.lineTo(x, y + 20);
        ctx.quadraticCurveTo(x, y, x + 20, y);
        ctx.stroke();
        
        // Windows
        const windowWidth = 100;
        const windowHeight = 60;
        ctx.strokeRect(x + 50, y + 20, windowWidth, windowHeight);
        ctx.strokeRect(x + 250, y + 20, windowWidth, windowHeight);
        
        // Window frames
        ctx.beginPath();
        ctx.moveTo(x + 50 + windowWidth / 2, y + 20);
        ctx.lineTo(x + 50 + windowWidth / 2, y + 20 + windowHeight);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 250 + windowWidth / 2, y + 20);
        ctx.lineTo(x + 250 + windowWidth / 2, y + 20 + windowHeight);
        ctx.stroke();
        
        // Wheels
        const wheelRadius = 35;
        ctx.beginPath();
        ctx.arc(x + 80, y + carHeight + 10, wheelRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + 320, y + carHeight + 10, wheelRadius, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Wheel details
        ctx.beginPath();
        ctx.arc(x + 80, y + carHeight + 10, wheelRadius * 0.6, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + 320, y + carHeight + 10, wheelRadius * 0.6, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Headlights
        ctx.beginPath();
        ctx.arc(x + 20, y + 30, 12, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + 20, y + carHeight - 30, 12, 0, 2 * Math.PI);
        ctx.stroke();
        
        // Bumpers
        ctx.strokeRect(x + 10, y + 10, 20, 10);
        ctx.strokeRect(x + carWidth - 30, y + 10, 20, 10);
        
      } else {
        // Generic outline - bigger and centered
        const rectWidth = Math.min(300, maxWidth);
        const rectHeight = Math.min(200, maxHeight);
        const x = centerX - rectWidth / 2;
        const y = centerY - rectHeight / 2;
        ctx.strokeRect(x, y, rectWidth, rectHeight);
      }
    }
  };

  // Helper function to draw a star
  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.stroke();
  };

  const renderElement = (element: MaterialElement) => {
    const style = {
      position: 'absolute' as const,
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={style}
            className="flex items-center justify-center p-2 bg-white border border-gray-200 rounded shadow-sm"
          >
            <span
              style={{
                fontSize: element.content.fontSize || 16,
                color: element.content.color || '#000000',
              }}
            >
              {element.content.text}
            </span>
          </div>
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm"
          >
            {element.content.src ? (
              <img
                src={element.content.src}
                alt={element.content.alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>No image</span>
              </div>
            )}
          </div>
        );

      case 'audio':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white border border-gray-200 rounded p-3 shadow-sm"
          >
            <div className="text-sm font-medium mb-2">🎵 Audio Element</div>
            {element.content.src ? (
              <audio controls className="w-full">
                <source src={element.content.src} />
                Your browser does not support audio.
              </audio>
            ) : element.content.recordedAudio ? (
              <audio controls className="w-full">
                <source src={element.content.recordedAudio} />
                Your browser does not support audio.
              </audio>
            ) : (
              <div className="text-gray-400 text-sm">No audio available</div>
            )}
            {element.content.transcript && (
              <div className="mt-2 text-xs text-gray-600">
                Transcript: {element.content.transcript}
              </div>
            )}
          </div>
        );

      case 'question':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white border border-gray-200 rounded p-3 shadow-sm"
          >
            <div className="font-medium mb-2">❓ {element.content.question}</div>
            <div className="space-y-1">
              {element.content.options.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    index === element.content.correct
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {option}
                  {index === element.content.correct && (
                    <span className="ml-2 text-xs">✓ Correct</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'cultural-content':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-amber-50 border border-amber-200 rounded p-3 shadow-sm"
          >
            <div className="text-xs text-amber-600 uppercase font-medium mb-1">
              🎭 {element.content.type}
            </div>
            <div className="text-sm font-medium mb-1">{element.content.content}</div>
            {element.content.translation && (
              <div className="text-xs text-gray-600 italic">
                {element.content.translation}
              </div>
            )}
          </div>
        );

      case 'drawing-canvas':
        // For art subject, show full canvas
        if (material?.subject === 'art') {
          return (
            <div
              key={element.id}
              className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 flex flex-col"
            >
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-6 text-center border-b border-blue-400 flex-shrink-0 shadow-lg">
                <div className="text-2xl font-bold mb-2 flex items-center justify-center">
                  <span className="mr-3 text-3xl">🎨</span>
                  Coloring Template
                </div>
                <div className="text-blue-100 text-sm">Click and drag to color the image below</div>
              </div>
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-white border-opacity-20 overflow-hidden backdrop-blur-sm">
                  <canvas
                    ref={(canvas) => {
                      if (canvas) {
                        renderColoringCanvas(canvas, element);
                      }
                    }}
                    width={800}
                    height={600}
                    className="max-w-full max-h-full object-contain"
                    style={{ maxHeight: 'calc(100vh - 300px)' }}
                  />
                </div>
              </div>
            </div>
          );
        }
        
        // For other subjects, show as regular element
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white border border-gray-300 rounded overflow-hidden shadow-sm"
          >
            <div className="bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 border-b">
              🎨 {element.content.instructions}
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              {element.content.canvasData ? (
                <img 
                  src={element.content.canvasData} 
                  alt="Drawing" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-sm text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <p>Drawing canvas</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'drawing-task':
        return (
          <div
            key={element.id}
            className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col"
          >
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white px-8 py-6 text-center border-b border-green-400 flex-shrink-0 shadow-lg">
              <div className="text-2xl font-bold mb-2 flex items-center justify-center">
                <span className="mr-3 text-3xl">✏️</span>
                {element.content.task}
              </div>
              <div className="text-green-100 text-sm">{element.content.instructions}</div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              {element.content.canvasData ? (
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-white border-opacity-20 overflow-hidden backdrop-blur-sm">
                  <img 
                    src={element.content.canvasData} 
                    alt="Student drawing" 
                    className="max-w-full max-h-full object-contain"
                    style={{ maxHeight: 'calc(100vh - 300px)' }}
                  />
                </div>
              ) : (
                <div className="text-center bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white border-opacity-20 p-12">
                  <div className="text-8xl mb-6 opacity-60">✏️</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Drawing Task</h3>
                  <p className="text-gray-600 text-lg">Students will draw here when they complete the task</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'audio-task':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 shadow-sm"
          >
            <div className="text-sm text-purple-600 uppercase font-medium mb-2">🎤 Audio Task</div>
            <div className="text-sm font-medium mb-2">{element.content.task}</div>
            <div className="text-xs text-gray-600 mb-3">{element.content.instructions}</div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[80px]">
              {element.content.recordedAudio ? (
                <audio controls className="w-full">
                  <source src={element.content.recordedAudio} />
                  Your browser does not support audio.
                </audio>
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-3xl mb-2">🎤</div>
                  <div className="text-sm">Student recording will appear here</div>
                </div>
              )}
            </div>
          </div>
        );

      case 'image-task':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 shadow-sm"
          >
            <div className="text-sm text-orange-600 uppercase font-medium mb-2">📸 Image Task</div>
            <div className="text-sm font-medium mb-2">{element.content.task}</div>
            <div className="text-xs text-gray-600 mb-3">{element.content.instructions}</div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[120px] flex items-center justify-center">
              {element.content.uploadedImage ? (
                <img src={element.content.uploadedImage} alt="Student upload" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-3xl mb-2">📸</div>
                  <div className="text-sm">Student image will appear here</div>
                </div>
              )}
            </div>
          </div>
        );

      case 'puzzle-matching':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm"
          >
            <div className="text-sm font-medium text-blue-800 mb-3">🔗 {element.content.title}</div>
            <div className="text-xs text-blue-600 mb-3">{element.content.instructions}</div>
            <div className="space-y-2">
              {element.content.pairs.map((pair: any, index: number) => (
                <div key={index} className="flex items-center justify-between bg-white rounded p-2">
                  <span className="text-lg">{pair.left.text}</span>
                  <span className="text-blue-500">→</span>
                  <span className="text-lg">{pair.right.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'puzzle-sequencing':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm"
          >
            <div className="text-sm font-medium text-green-800 mb-3">📋 {element.content.title}</div>
            <div className="text-xs text-green-600 mb-3">{element.content.instructions}</div>
            <div className="flex space-x-2">
              {element.content.items.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded p-2 text-center min-w-[40px]">
                  <div className="text-lg">{item.text}</div>
                  <div className="text-xs text-gray-500">{item.order}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'puzzle-pattern':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 shadow-sm"
          >
            <div className="text-sm font-medium text-purple-800 mb-3">🔄 {element.content.title}</div>
            <div className="text-xs text-purple-600 mb-3">{element.content.instructions}</div>
            <div className="flex space-x-2 mb-3">
              {element.content.pattern.map((item: string, index: number) => (
                <div key={index} className="bg-white rounded p-2 text-center min-w-[40px]">
                  <div className="text-lg">{item}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-600">Options: {element.content.options.join(' ')}</div>
          </div>
        );

      case 'puzzle-memory':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 shadow-sm"
          >
            <div className="text-sm font-medium text-orange-800 mb-3">🧠 {element.content.title}</div>
            <div className="text-xs text-orange-600 mb-3">{element.content.instructions}</div>
            <div className="grid grid-cols-2 gap-2">
              {element.content.cards.map((card: any, index: number) => (
                <div key={index} className="bg-white rounded p-2 text-center">
                  <div className="text-lg">❓</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'puzzle-math':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 shadow-sm"
          >
            <div className="text-sm font-medium text-yellow-800 mb-3">🔢 {element.content.title}</div>
            <div className="text-xs text-yellow-600 mb-3">{element.content.instructions}</div>
            <div className="bg-white rounded p-3 mb-2">
              <div className="text-lg font-medium">{element.content.question}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {element.content.options.map((option: string, index: number) => (
                <div key={index} className="bg-white rounded p-2 text-center text-sm">
                  {option}
                </div>
              ))}
            </div>
          </div>
        );

      case 'puzzle-word':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4 shadow-sm"
          >
            <div className="text-sm font-medium text-teal-800 mb-3">📝 {element.content.title}</div>
            <div className="text-xs text-teal-600 mb-3">{element.content.instructions}</div>
            <div className="bg-white rounded p-3 mb-2">
              <div className="text-lg font-medium">{element.content.scrambled}</div>
            </div>
            <div className="text-xs text-gray-600">Hint: {element.content.hint}</div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading material...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h1>
          <p className="text-gray-600 mb-6">The material you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/materials')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
          >
            ← Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => navigate('/materials')}
                className="text-white hover:text-blue-100 transition-all duration-200 flex items-center bg-white bg-opacity-10 hover:bg-opacity-20 px-4 py-2 rounded-lg"
              >
                <span className="text-xl mr-2">←</span>
                Back to Materials
              </button>
              <div className="h-10 w-px bg-white bg-opacity-30"></div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{material.title}</h1>
                <p className="text-blue-100 text-lg">{material.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
                material.status === 'published' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {material.status}
              </span>
              <button
                onClick={() => navigate(`/materials/${material.id}/edit`)}
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                ✏️ Edit Material
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Material Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-8">
          <div className="text-center p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-20">
            <div className="text-2xl mb-2">📄</div>
            <div className="font-medium text-gray-700">Type</div>
            <div className="text-blue-600 capitalize">{material.type}</div>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-20">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-gray-700">Subject</div>
            <div className="text-green-600 capitalize">{material.subject}</div>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-20">
            <div className="text-2xl mb-2">🌍</div>
            <div className="font-medium text-gray-700">Language</div>
            <div className="text-purple-600 uppercase">{material.language}</div>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-20">
            <div className="text-2xl mb-2">👶</div>
            <div className="font-medium text-gray-700">Age Group</div>
            <div className="text-orange-600">{material.ageGroup}</div>
          </div>
        </div>
        {material.createdBy && (
          <div className="text-center text-sm text-gray-600 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg border border-white border-opacity-20 p-4 mb-8">
            Created by <span className="font-medium">{material.createdBy.name}</span>
            {material.createdAt && (
              <span> on {new Date(material.createdAt).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>

        {/* Canvas */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 border-b border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="mr-3 text-3xl">🎨</span>
                  Material Preview
                </h2>
                <p className="text-blue-100 text-sm mt-2">Interactive preview of your learning material</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {material.elements.length} Elements
                </span>
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {material.status}
                </span>
              </div>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden" style={{ minHeight: '700px', height: '700px' }}>
            {material.elements.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-white border-opacity-20 p-12">
                  <div className="text-8xl mb-6 opacity-60">📄</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No Elements</h3>
                  <p className="text-gray-600 text-lg">This material has no elements to display</p>
                </div>
              </div>
            ) : (
              material.elements.map(renderElement)
            )}
          </div>
        </div>
    </div>
  );
};

export default MaterialViewerPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { materialsService } from '../services/materials.service.ts';
import { getTemplateById, coloringTemplates } from '../utils/coloringTemplates.ts';

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

  // Function to render SVG coloring template
  const renderColoringTemplate = (element: MaterialElement) => {
    // Try to find matching template based on instructions
    const instructions = element.content.instructions.toLowerCase();
    let template = null;
    
    if (instructions.includes('flag')) {
      template = getTemplateById('zimbabwe-flag');
    } else if (instructions.includes('lion')) {
      template = getTemplateById('african-lion');
    } else if (instructions.includes('house') || instructions.includes('hut')) {
      template = getTemplateById('traditional-hut');
    } else if (instructions.includes('tree') || instructions.includes('baobab')) {
      template = getTemplateById('baobab-tree');
    } else if (instructions.includes('elephant')) {
      template = getTemplateById('elephant');
    }
    
    if (template) {
      return (
        <div 
          className="w-full h-full flex items-center justify-center p-8"
          dangerouslySetInnerHTML={{ __html: template.content }}
        />
      );
    }
    
    // Fallback to simple outline
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="border-4 border-black rounded-lg w-80 h-60 flex items-center justify-center">
          <span className="text-gray-400 text-lg">Coloring Template</span>
        </div>
      </div>
    );
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
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-white border-opacity-20 overflow-hidden backdrop-blur-sm" style={{ maxHeight: 'calc(100vh - 300px)', width: '800px', height: '600px' }}>
                  {renderColoringTemplate(element)}
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
    </div>
  );
};

export default MaterialViewerPage;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { materialsService } from '../services/materials.service.ts';

interface MaterialElement {
  id: string;
  type: 'text' | 'image' | 'audio' | 'question' | 'cultural-content' | 'drawing-canvas' | 'drawing-task' | 'audio-task' | 'image-task';
  content: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface Material {
  id: string;
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
            className="flex items-center justify-center p-2 bg-white border border-gray-200 rounded"
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
            className="bg-white border border-gray-200 rounded overflow-hidden"
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
            className="bg-white border border-gray-200 rounded p-3"
          >
            <div className="text-sm font-medium mb-2">Audio Element</div>
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
            className="bg-white border border-gray-200 rounded p-3"
          >
            <div className="font-medium mb-2">{element.content.question}</div>
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
            className="bg-amber-50 border border-amber-200 rounded p-3"
          >
            <div className="text-xs text-amber-600 uppercase font-medium mb-1">
              {element.content.type}
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
        if (material.subject === 'art') {
          return (
            <div
              key={element.id}
              className="absolute inset-0 bg-white flex flex-col"
            >
              <div className="bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 border-b border-blue-200 flex-shrink-0">
                🎨 {element.content.instructions}
              </div>
              <div className="flex-1 flex items-center justify-center bg-white">
                {element.content.canvasData ? (
                  <img 
                    src={element.content.canvasData} 
                    alt="Drawing" 
                    className="max-w-full max-h-full object-contain"
                    style={{ maxHeight: 'calc(100% - 20px)' }}
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-4xl mb-2">🎨</div>
                    <p>No drawing available</p>
                  </div>
                )}
              </div>
            </div>
          );
        }
        
        // For other subjects, show as regular element
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white border border-gray-300 rounded overflow-hidden"
          >
            <div className="bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 border-b">
              {element.content.instructions}
            </div>
            <div className="flex-1 flex items-center justify-center p-2">
              {element.content.canvasData ? (
                <img 
                  src={element.content.canvasData} 
                  alt="Drawing" 
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-xs">No drawing</div>
              )}
            </div>
          </div>
        );

      case 'drawing-task':
        return (
          <div
            key={element.id}
            className="absolute inset-0 bg-white flex flex-col"
          >
            <div className="bg-green-100 px-4 py-3 text-center border-b border-green-200 flex-shrink-0">
              <div className="text-lg font-medium text-green-800">✏️ {element.content.task}</div>
              <div className="text-sm text-green-600 mt-1">{element.content.instructions}</div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-white">
              {element.content.canvasData ? (
                <img 
                  src={element.content.canvasData} 
                  alt="Student drawing" 
                  className="max-w-full max-h-full object-contain"
                  style={{ maxHeight: 'calc(100% - 20px)' }}
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <div className="text-4xl mb-2">✏️</div>
                  <p>Student drawing will appear here</p>
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
            className="bg-purple-50 border border-purple-200 rounded p-3"
          >
            <div className="text-xs text-purple-600 uppercase font-medium mb-1">🎤 Audio Task</div>
            <div className="text-sm font-medium mb-2">{element.content.task}</div>
            <div className="text-xs text-gray-600 mb-2">{element.content.instructions}</div>
            <div className="bg-white border border-gray-200 rounded p-3 flex items-center justify-center min-h-[60px]">
              {element.content.recordedAudio ? (
                <audio controls className="w-full">
                  <source src={element.content.recordedAudio} />
                  Your browser does not support audio.
                </audio>
              ) : (
                <div className="text-gray-400 text-xs text-center">
                  <div className="text-2xl mb-1">🎤</div>
                  <div>Student recording will appear here</div>
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
            className="bg-orange-50 border border-orange-200 rounded p-3"
          >
            <div className="text-xs text-orange-600 uppercase font-medium mb-1">📸 Image Task</div>
            <div className="text-sm font-medium mb-2">{element.content.task}</div>
            <div className="text-xs text-gray-600 mb-2">{element.content.instructions}</div>
            <div className="bg-white border border-gray-200 rounded p-2 min-h-[100px] flex items-center justify-center">
              {element.content.uploadedImage ? (
                <img src={element.content.uploadedImage} alt="Student upload" className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-gray-400 text-xs text-center">
                  <div className="text-2xl mb-1">📸</div>
                  <div>Student image will appear here</div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading material...</p>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Material Not Found</h1>
          <p className="text-gray-600 mb-4">The material you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/materials')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Materials
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/materials')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Materials
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{material.title}</h1>
                <p className="text-sm text-gray-500">{material.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                material.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {material.status}
              </span>
              <button
                onClick={() => navigate(`/materials/${material.id}/edit`)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Edit Material
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Material Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <span className="ml-2 capitalize">{material.type}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Subject:</span>
              <span className="ml-2 capitalize">{material.subject}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Language:</span>
              <span className="ml-2 uppercase">{material.language}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Age Group:</span>
              <span className="ml-2">{material.ageGroup}</span>
            </div>
          </div>
          {material.createdBy && (
            <div className="mt-2 text-sm text-gray-600">
              Created by {material.createdBy.name} {material.createdAt && `on ${new Date(material.createdAt).toLocaleDateString()}`}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Material Preview</h2>
          </div>
          <div className="relative bg-gray-50 overflow-hidden" style={{ minHeight: '600px', height: '600px' }}>
            {material.elements.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                This material has no elements to display
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
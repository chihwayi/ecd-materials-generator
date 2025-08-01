import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { materialsService } from '../services/materials.service.ts';

interface MaterialElement {
  id: string;
  type: 'text' | 'image' | 'audio' | 'question' | 'cultural-content' | 'drawing-canvas' | 'drawing-task' | 'audio-task' | 'image-task';
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
}

const MaterialEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const isEditing = Boolean(id);

  const [material, setMaterial] = useState<Material>({
    title: '',
    description: '',
    type: 'worksheet',
    subject: 'math',
    language: 'en',
    ageGroup: '3-5',
    status: 'draft',
    elements: []
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    elementId: string | null;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
  }>({ isDragging: false, elementId: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
  
  const [resizeState, setResizeState] = useState<{
    isResizing: boolean;
    elementId: string | null;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  }>({ isResizing: false, elementId: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 });

  const [audioRecording, setAudioRecording] = useState<{
    isRecording: boolean;
    elementId: string | null;
    mediaRecorder: MediaRecorder | null;
    audioChunks: Blob[];
  }>({ isRecording: false, elementId: null, mediaRecorder: null, audioChunks: [] });

  const [drawingState, setDrawingState] = useState<{
    isDrawing: boolean;
    elementId: string | null;
    currentColor: string;
    brushSize: number;
    isEraser: boolean;
  }>({ isDrawing: false, elementId: null, currentColor: '#FF0000', brushSize: 8, isEraser: false });

  const crayonColors = [
    '#FF0000', // Red
    '#00AA00', // Green  
    '#0066FF', // Blue
    '#FFD700', // Yellow
    '#FF8000', // Orange
    '#8B008B', // Purple
    '#FF69B4', // Pink
    '#8B4513', // Brown
    '#000000', // Black
    '#FFFFFF'  // White
  ];

  useEffect(() => {
    if (isEditing) {
      fetchMaterial();
    }
  }, [id]);

  const fetchMaterial = async () => {
    try {
      if (id) {
        const fetchedMaterial = await materialsService.getMaterialById(id);
        setMaterial(fetchedMaterial);
      }
    } catch (error: any) {
      console.error('Fetch material error:', error);
      toast.error('Failed to load material');
    }
  };

  const handleSave = async () => {
    try {
      if (!material.title.trim()) {
        toast.error('Please enter a title');
        return;
      }

      let savedMaterial;
      if (isEditing && material.id) {
        savedMaterial = await materialsService.updateMaterial(material.id, material);
        toast.success('Material updated!');
      } else {
        savedMaterial = await materialsService.createMaterial(material);
        toast.success('Material created!');
      }
      
      navigate('/materials');
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save material');
    }
  };

  const handlePublish = async () => {
    try {
      if (!material.title.trim()) {
        toast.error('Please enter a title');
        return;
      }

      let savedMaterial;
      if (isEditing && material.id) {
        savedMaterial = await materialsService.updateMaterial(material.id, { ...material, status: 'published' });
      } else {
        savedMaterial = await materialsService.createMaterial({ ...material, status: 'published' });
      }
      
      if (savedMaterial.id) {
        await materialsService.publishMaterial(savedMaterial.id);
      }
      
      toast.success('Material published successfully!');
      navigate('/materials');
    } catch (error: any) {
      console.error('Publish error:', error);
      toast.error(error.response?.data?.message || 'Failed to publish material');
    }
  };

  const addElement = (type: MaterialElement['type']) => {
    // For drawing canvas in art subject, make it full canvas size
    if (type === 'drawing-canvas' && material.subject === 'art') {
      const newElement: MaterialElement = {
        id: Date.now().toString(),
        type,
        content: getDefaultContent(type),
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 } // Will be set to full canvas size
      };

      setMaterial(prev => ({
        ...prev,
        elements: [...prev.elements, newElement]
      }));
      setSelectedElement(newElement.id);
      return;
    }

    // For drawing-task, make it full canvas size
    if (type === 'drawing-task') {
      const newElement: MaterialElement = {
        id: Date.now().toString(),
        type,
        content: getDefaultContent(type),
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 } // Will be set to full canvas size
      };

      setMaterial(prev => ({
        ...prev,
        elements: [...prev.elements, newElement]
      }));
      setSelectedElement(newElement.id);
      return;
    }

    // Calculate position to avoid overlap for other elements
    const canvasWidth = 800; // Approximate canvas width
    const canvasHeight = 600; // Approximate canvas height
    const elementWidth = type === 'audio' ? 250 : 200;
    const elementHeight = type === 'audio' ? 120 : 60;
    
    // Try to place elements in a grid pattern
    const cols = Math.floor(canvasWidth / (elementWidth + 20));
    const elementIndex = material.elements.length;
    const row = Math.floor(elementIndex / cols);
    const col = elementIndex % cols;
    
    const x = 20 + col * (elementWidth + 20);
    const y = 20 + row * (elementHeight + 20);

    const newElement: MaterialElement = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
      position: { x, y },
      size: { width: elementWidth, height: elementHeight }
    };

    setMaterial(prev => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
    setSelectedElement(newElement.id);
  };

  const getDefaultContent = (type: MaterialElement['type']) => {
    switch (type) {
      case 'text':
        return { text: 'Enter text here', fontSize: 16, color: '#000000' };
      case 'image':
        return { src: '', alt: 'Image description' };
      case 'audio':
        return { src: '', transcript: '', recordedAudio: '', isRecorded: false };
      case 'question':
        return { question: 'Enter question', options: ['Option 1', 'Option 2'], correct: 0 };
      case 'cultural-content':
        return { type: 'proverb', content: 'Traditional saying', translation: '' };
      case 'drawing-canvas':
        return { drawings: [], instructions: 'Color the objects below' };
      case 'drawing-task':
        return { task: 'Draw your name', instructions: 'Use your finger or stylus to write', canvasData: '', isCompleted: false };
      case 'audio-task':
        return { task: 'Record your answer', instructions: 'Click the microphone to start recording', recordedAudio: '', isCompleted: false };
      case 'image-task':
        return { task: 'Upload an image', instructions: 'Take a photo or upload from gallery', uploadedImage: '', isCompleted: false };
      default:
        return {};
    }
  };

  const startRecording = async (elementId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        
        // Convert blob to base64 for storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          updateElement(elementId, {
            content: { 
              ...material.elements.find(el => el.id === elementId)?.content, 
              recordedAudio: base64data,
              isRecorded: true 
            }
          });
        };
        reader.readAsDataURL(blob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setAudioRecording({ isRecording: true, elementId, mediaRecorder, audioChunks: chunks });
    } catch (error) {
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (audioRecording.mediaRecorder) {
      audioRecording.mediaRecorder.stop();
      setAudioRecording({ isRecording: false, elementId: null, mediaRecorder: null, audioChunks: [] });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const element = material.elements.find(el => el.id === elementId);
    if (!element) return;

    setSelectedElement(elementId);
    setDragState({
      isDragging: true,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - element.position.x,
      offsetY: e.clientY - element.position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragState.isDragging && dragState.elementId) {
      const newX = Math.max(0, e.clientX - dragState.offsetX);
      const newY = Math.max(0, e.clientY - dragState.offsetY);
      
      updateElement(dragState.elementId, {
        position: { x: newX, y: newY }
      });
    }
  };

  const handleMouseUp = () => {
    setDragState({ isDragging: false, elementId: null, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
  };

  const handleResizeMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const element = material.elements.find(el => el.id === elementId);
    if (!element) return;

    setResizeState({
      isResizing: true,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: element.size.width,
      startHeight: element.size.height
    });
  };

  const handleResizeMouseMove = (e: React.MouseEvent) => {
    if (resizeState.isResizing && resizeState.elementId) {
      const deltaX = e.clientX - resizeState.startX;
      const deltaY = e.clientY - resizeState.startY;
      
      const newWidth = Math.max(50, resizeState.startWidth + deltaX);
      const newHeight = Math.max(30, resizeState.startHeight + deltaY);
      
      updateElement(resizeState.elementId, {
        size: { width: newWidth, height: newHeight }
      });
    }
  };

  const handleResizeMouseUp = () => {
    setResizeState({ isResizing: false, elementId: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 });
  };

  const updateElement = (elementId: string, updates: Partial<MaterialElement>) => {
    setMaterial(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    }));
  };

  const deleteElement = (elementId: string) => {
    setMaterial(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId)
    }));
    setSelectedElement(null);
  };

  const renderElement = (element: MaterialElement) => {
    const isSelected = selectedElement === element.id;
    const style = {
      position: 'absolute' as const,
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      border: isSelected ? '2px solid #3b82f6' : '1px solid #d1d5db',
      cursor: dragState.isDragging ? 'grabbing' : 'grab',
      zIndex: isSelected ? 10 : 1
    };

    switch (element.type) {
      case 'text':
        return (
          <div 
            key={element.id} 
            style={style} 
            className="bg-white p-2 rounded shadow-sm" 
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <span style={{ fontSize: element.content.fontSize, color: element.content.color }}>
              {element.content.text}
            </span>
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'image':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {element.content.src ? (
              <img
                src={element.content.src}
                alt={element.content.alt}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>📷 Click to add image</span>
              </div>
            )}
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'audio':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white border border-gray-200 rounded p-3 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'question':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white p-3 rounded shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <div className="font-medium mb-2">{element.content.question}</div>
            <div className="space-y-1">
              {element.content.options.map((option: string, index: number) => (
                <div key={index} className={`p-1 rounded text-sm ${
                  index === element.content.correct ? 'bg-green-100 text-green-800' : 'bg-gray-50'
                }`}>
                  {option} {index === element.content.correct && '✓'}
                </div>
              ))}
            </div>
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'cultural-content':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-amber-50 border border-amber-200 rounded p-3 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'drawing-canvas':
        // For art subject, make drawing canvas cover entire canvas area
        if (material.subject === 'art') {
          return (
            <div
              key={element.id}
              className="absolute inset-0 bg-white flex flex-col"
              style={{ zIndex: 5 }}
            >
              <div className="bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 border-b border-blue-200 flex-shrink-0">
                🎨 {element.content.instructions}
              </div>
              <canvas
                ref={(canvas) => {
                  if (canvas && !canvas.dataset.initialized) {
                    canvas.dataset.initialized = 'true';
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      canvas.width = 800;
                      canvas.height = 600;
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      
                      // Restore saved canvas data if it exists
                      if (element.content.canvasData) {
                        const img = new Image();
                        img.onload = () => {
                          ctx.drawImage(img, 0, 0);
                        };
                        img.src = element.content.canvasData;
                      }
                    }
                  }
                }}
                width={800}
                height={600}
                className="w-full h-full cursor-crosshair touch-none"
                style={{ touchAction: 'none' }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const canvas = e.currentTarget;
                  const rect = canvas.getBoundingClientRect();
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                    
                    if (drawingState.isEraser) {
                      // Eraser mode - use destination-out composite operation
                      ctx.globalCompositeOperation = 'destination-out';
                      ctx.strokeStyle = 'rgba(0,0,0,1)';
                    } else {
                      // Drawing mode - use normal composite operation
                      ctx.globalCompositeOperation = 'source-over';
                      ctx.strokeStyle = drawingState.currentColor;
                    }
                    
                    ctx.lineWidth = drawingState.brushSize;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    setDrawingState(prev => ({ ...prev, isDrawing: true, elementId: element.id }));
                  }
                }}
                onMouseMove={(e) => {
                  if (drawingState.isDrawing && drawingState.elementId === element.id) {
                    e.preventDefault();
                    const canvas = e.currentTarget;
                    const rect = canvas.getBoundingClientRect();
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                      ctx.lineTo(x, y);
                      ctx.stroke();
                    }
                  }
                }}
                onMouseUp={(e) => {
                  if (drawingState.isDrawing) {
                    e.preventDefault();
                    setDrawingState(prev => ({ ...prev, isDrawing: false, elementId: null }));
                    const canvas = e.currentTarget as HTMLCanvasElement;
                    if (canvas) {
                      const dataURL = canvas.toDataURL();
                      updateElement(element.id, {
                        content: { ...element.content, canvasData: dataURL }
                      });
                    }
                  }
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const canvas = e.currentTarget;
                  const rect = canvas.getBoundingClientRect();
                  const ctx = canvas.getContext('2d');
                  const touch = e.touches[0];
                  if (ctx && touch) {
                    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
                    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
                    
                    if (drawingState.isEraser) {
                      // Eraser mode - use destination-out composite operation
                      ctx.globalCompositeOperation = 'destination-out';
                      ctx.strokeStyle = 'rgba(0,0,0,1)';
                    } else {
                      // Drawing mode - use normal composite operation
                      ctx.globalCompositeOperation = 'source-over';
                      ctx.strokeStyle = drawingState.currentColor;
                    }
                    
                    ctx.lineWidth = drawingState.brushSize;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    setDrawingState(prev => ({ ...prev, isDrawing: true, elementId: element.id }));
                  }
                }}
                onTouchMove={(e) => {
                  if (drawingState.isDrawing && drawingState.elementId === element.id) {
                    e.preventDefault();
                    const canvas = e.currentTarget;
                    const rect = canvas.getBoundingClientRect();
                    const ctx = canvas.getContext('2d');
                    const touch = e.touches[0];
                    if (ctx && touch) {
                      const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
                      const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
                      ctx.lineTo(x, y);
                      ctx.stroke();
                    }
                  }
                }}
                onTouchEnd={(e) => {
                  if (drawingState.isDrawing) {
                    e.preventDefault();
                    setDrawingState(prev => ({ ...prev, isDrawing: false, elementId: null }));
                    const canvas = e.currentTarget as HTMLCanvasElement;
                    if (canvas) {
                      const dataURL = canvas.toDataURL();
                      updateElement(element.id, {
                        content: { ...element.content, canvasData: dataURL }
                      });
                    }
                  }
                }}
                data-element-id={element.id}
              />
            </div>
          );
        }
        
        // For non-art subjects, render as regular element
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white border border-gray-300 rounded shadow-sm overflow-hidden"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <div className="bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 border-b">
              {element.content.instructions}
            </div>
            <canvas
              ref={(canvas) => {
                if (canvas && !canvas.dataset.initialized) {
                  canvas.dataset.initialized = 'true';
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    canvas.width = element.size.width - 4;
                    canvas.height = element.size.height - 25;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                  }
                }
              }}
              className="block"
              data-element-id={element.id}
            />
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'drawing-task':
        return (
          <div
            key={element.id}
            className="absolute inset-0 bg-white flex flex-col"
            style={{ zIndex: 5 }}
          >
            <div className="bg-green-100 px-4 py-3 text-center border-b border-green-200 flex-shrink-0">
              <div className="text-lg font-medium text-green-800">✏️ {element.content.task}</div>
              <div className="text-sm text-green-600 mt-1">{element.content.instructions}</div>
            </div>
            <canvas
              ref={(canvas) => {
                if (canvas && !canvas.dataset.initialized) {
                  canvas.dataset.initialized = 'true';
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    canvas.width = 800;
                    canvas.height = 550;
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    // Restore saved canvas data if it exists
                    if (element.content.canvasData) {
                      const img = new Image();
                      img.onload = () => {
                        ctx.drawImage(img, 0, 0);
                      };
                      img.src = element.content.canvasData;
                    }
                  }
                }
              }}
              width={800}
              height={550}
              className="flex-1 w-full cursor-crosshair touch-none"
              style={{ touchAction: 'none' }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const canvas = e.currentTarget;
                const rect = canvas.getBoundingClientRect();
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                  
                  if (drawingState.isEraser) {
                    // Eraser mode - use destination-out composite operation
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.strokeStyle = 'rgba(0,0,0,1)';
                  } else {
                    // Drawing mode - use normal composite operation
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = drawingState.currentColor;
                  }
                  
                  ctx.lineWidth = drawingState.brushSize;
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  ctx.beginPath();
                  ctx.moveTo(x, y);
                  setDrawingState(prev => ({ ...prev, isDrawing: true, elementId: element.id }));
                }
              }}
              onMouseMove={(e) => {
                if (drawingState.isDrawing && drawingState.elementId === element.id) {
                  e.preventDefault();
                  const canvas = e.currentTarget;
                  const rect = canvas.getBoundingClientRect();
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
                    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                  }
                }
              }}
              onMouseUp={(e) => {
                if (drawingState.isDrawing) {
                  e.preventDefault();
                  setDrawingState(prev => ({ ...prev, isDrawing: false, elementId: null }));
                  const canvas = e.currentTarget as HTMLCanvasElement;
                  if (canvas) {
                    const dataURL = canvas.toDataURL();
                    updateElement(element.id, {
                      content: { ...element.content, canvasData: dataURL }
                    });
                  }
                }
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                const canvas = e.currentTarget;
                const rect = canvas.getBoundingClientRect();
                const ctx = canvas.getContext('2d');
                const touch = e.touches[0];
                if (ctx && touch) {
                  const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
                  const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
                  
                  if (drawingState.isEraser) {
                    // Eraser mode - use destination-out composite operation
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.strokeStyle = 'rgba(0,0,0,1)';
                  } else {
                    // Drawing mode - use normal composite operation
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.strokeStyle = drawingState.currentColor;
                  }
                  
                  ctx.lineWidth = drawingState.brushSize;
                  ctx.lineCap = 'round';
                  ctx.lineJoin = 'round';
                  ctx.beginPath();
                  ctx.moveTo(x, y);
                  setDrawingState(prev => ({ ...prev, isDrawing: true, elementId: element.id }));
                }
              }}
              onTouchMove={(e) => {
                if (drawingState.isDrawing && drawingState.elementId === element.id) {
                  e.preventDefault();
                  const canvas = e.currentTarget;
                  const rect = canvas.getBoundingClientRect();
                  const ctx = canvas.getContext('2d');
                  const touch = e.touches[0];
                  if (ctx && touch) {
                    const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
                    const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                  }
                }
              }}
              onTouchEnd={(e) => {
                if (drawingState.isDrawing) {
                  e.preventDefault();
                  setDrawingState(prev => ({ ...prev, isDrawing: false, elementId: null }));
                  const canvas = e.currentTarget as HTMLCanvasElement;
                  if (canvas) {
                    const dataURL = canvas.toDataURL();
                    updateElement(element.id, {
                      content: { ...element.content, canvasData: dataURL }
                    });
                  }
                }
              }}
              data-element-id={element.id}
            />
          </div>
        );

      case 'audio-task':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-purple-50 border border-purple-200 rounded p-3 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
                  <div>Student will record here</div>
                </div>
              )}
            </div>
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'image-task':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-orange-50 border border-orange-200 rounded p-3 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
                  <div>Student will upload image here</div>
                </div>
              )}
            </div>
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      default:
        return (
          <div
            key={element.id}
            style={style}
            className="bg-white p-2 rounded shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            {element.type}
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );
    }
  };

  const renderElementEditor = () => {
    if (!selectedElement) return null;
    
    const element = material.elements.find(el => el.id === selectedElement);
    if (!element) return null;

    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Edit {element.type}</h3>
          <button onClick={() => deleteElement(element.id)} className="text-red-600 hover:text-red-800">
            Delete
          </button>
        </div>

        {element.type === 'text' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Text</label>
              <input
                type="text"
                value={element.content.text}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, text: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Font Size</label>
                <input
                  type="number"
                  value={element.content.fontSize}
                  onChange={(e) => updateElement(element.id, { content: { ...element.content, fontSize: parseInt(e.target.value) } })}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">Color</label>
                <input
                  type="color"
                  value={element.content.color}
                  onChange={(e) => updateElement(element.id, { content: { ...element.content, color: e.target.value } })}
                  className="w-full border border-gray-300 rounded px-1 py-1 h-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {element.type === 'image' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={element.content.src}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, src: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Alt Text</label>
              <input
                type="text"
                value={element.content.alt}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, alt: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        )}

        {element.type === 'audio' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Audio URL</label>
              <input
                type="url"
                value={element.content.src}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, src: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="https://example.com/audio.mp3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Record Audio</label>
              {audioRecording.isRecording && audioRecording.elementId === element.id ? (
                <button
                  onClick={stopRecording}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  ⏹️ Stop Recording
                </button>
              ) : (
                <button
                  onClick={() => startRecording(element.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  🎤 Start Recording
                </button>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transcript</label>
              <textarea
                value={element.content.transcript}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, transcript: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
          </div>
        )}

        {element.type === 'question' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                value={element.content.question}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, question: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Options</label>
              {element.content.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...element.content.options];
                      newOptions[index] = e.target.value;
                      updateElement(element.id, { content: { ...element.content, options: newOptions } });
                    }}
                    className="w-48 border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder={`Option ${index + 1}`}
                  />
                  <div className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={`correct-${element.id}`}
                      checked={element.content.correct === index}
                      onChange={() => updateElement(element.id, { content: { ...element.content, correct: index } })}
                      className="text-green-600"
                    />
                    <label className="text-sm text-gray-600">Correct</label>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...element.content.options, 'New Option'];
                  updateElement(element.id, { content: { ...element.content, options: newOptions } });
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add Option
              </button>
            </div>
          </div>
        )}

        {element.type === 'cultural-content' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={element.content.type}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, type: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="proverb">Proverb</option>
                <option value="story">Story</option>
                <option value="tradition">Tradition</option>
                <option value="song">Song</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={element.content.content}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, content: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Translation</label>
              <textarea
                value={element.content.translation}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, translation: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={2}
              />
            </div>
          </div>
        )}

        {element.type === 'drawing-canvas' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Instructions</label>
              <input
                type="text"
                value={element.content.instructions || 'Color the objects below'}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, instructions: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Color the objects below"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Current Color: {drawingState.currentColor}</label>
              <div className="grid grid-cols-5 gap-2 mb-2">
                {crayonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      console.log('Color selected:', color);
                      setDrawingState(prev => ({ ...prev, currentColor: color }));
                    }}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-105 ${
                      drawingState.currentColor === color 
                        ? 'border-gray-800 scale-110 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color, border: color === '#FFFFFF' ? '2px solid #ccc' : undefined }}
                    title={`Select ${color}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Brush Size: {drawingState.brushSize}px</label>
              <input
                type="range"
                min="2"
                max="20"
                value={drawingState.brushSize}
                onChange={(e) => setDrawingState(prev => ({ ...prev, brushSize: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setDrawingState(prev => ({ ...prev, isEraser: !prev.isEraser }))}
                className={`flex-1 px-3 py-1 rounded text-sm transition-colors ${
                  drawingState.isEraser 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {drawingState.isEraser ? '✏️ Drawing' : '🧽 Eraser'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const canvas = document.querySelector(`canvas[data-element-id="${element.id}"]`) as HTMLCanvasElement;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      const dataURL = canvas.toDataURL();
                      updateElement(element.id, { content: { ...element.content, canvasData: dataURL } });
                      console.log('Canvas cleared and saved');
                    }
                  }
                }}
                className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Clear Canvas
              </button>
            </div>
            {material.subject === 'art' && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                ✨ This drawing canvas covers the entire canvas area for the best drawing experience!
              </div>
            )}
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              🎨 {drawingState.isEraser ? 'Eraser' : `Color: ${drawingState.currentColor}`} | Brush: {drawingState.brushSize}px
            </div>
          </div>
        )}

        {element.type === 'drawing-task' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Task</label>
              <input
                type="text"
                value={element.content.task}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, task: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Draw your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Instructions</label>
              <textarea
                value={element.content.instructions}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, instructions: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Use your finger or stylus to write"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Drawing Colors</label>
              <div className="grid grid-cols-5 gap-2">
                {crayonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setDrawingState(prev => ({ ...prev, currentColor: color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-105 ${
                      drawingState.currentColor === color 
                        ? 'border-gray-800 scale-110 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color, border: color === '#FFFFFF' ? '2px solid #ccc' : undefined }}
                    title={`Select ${color}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Brush Size: {drawingState.brushSize}px</label>
              <input
                type="range"
                min="4"
                max="20"
                value={drawingState.brushSize}
                onChange={(e) => setDrawingState(prev => ({ ...prev, brushSize: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setDrawingState(prev => ({ ...prev, isEraser: !prev.isEraser }))}
                className={`flex-1 px-3 py-1 rounded text-sm transition-colors ${
                  drawingState.isEraser 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {drawingState.isEraser ? '✏️ Drawing' : '🧽 Eraser'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const canvas = document.querySelector(`canvas[data-element-id="${element.id}"]`) as HTMLCanvasElement;
                  if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.fillStyle = 'white';
                      ctx.fillRect(0, 0, canvas.width, canvas.height);
                      const dataURL = canvas.toDataURL();
                      updateElement(element.id, { content: { ...element.content, canvasData: dataURL } });
                      console.log('Canvas cleared and saved');
                    }
                  }
                }}
                className="flex-1 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              >
                Clear Canvas
              </button>
            </div>
            <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              ✏️ This drawing task covers the entire canvas area - students draw directly with touch or stylus!
            </div>
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              🎨 {drawingState.isEraser ? 'Eraser' : `Color: ${drawingState.currentColor}`} | Brush: {drawingState.brushSize}px
            </div>
          </div>
        )}

        {element.type === 'audio-task' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Task</label>
              <input
                type="text"
                value={element.content.task}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, task: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Record your answer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Instructions</label>
              <textarea
                value={element.content.instructions}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, instructions: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Click the microphone to start recording"
              />
            </div>
            <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
              🎤 Students will be able to record audio directly by clicking the microphone icon
            </div>
          </div>
        )}

        {element.type === 'image-task' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Task</label>
              <input
                type="text"
                value={element.content.task}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, task: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Upload an image"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Instructions</label>
              <textarea
                value={element.content.instructions}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, instructions: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Take a photo or upload from gallery"
              />
            </div>
            <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              📸 Students will be able to upload images by clicking the camera icon
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/materials')} className="text-gray-600 hover:text-gray-900">
                ← Back
              </button>
              <h1 className="text-xl font-semibold">{isEditing ? 'Edit Material' : 'Create Material'}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={handleSave} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Save Draft
              </button>
              <button onClick={handlePublish} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Material Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-3 text-gray-900">Material Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
                  <input
                    type="text"
                    value={material.title}
                    onChange={(e) => setMaterial(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                  <textarea
                    value={material.description}
                    onChange={(e) => setMaterial(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Type</label>
                    <select
                      value={material.type}
                      onChange={(e) => setMaterial(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="worksheet">Worksheet</option>
                      <option value="activity">Activity</option>
                      <option value="assessment">Assessment</option>
                      <option value="story">Story</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Subject</label>
                    <select
                      value={material.subject}
                      onChange={(e) => setMaterial(prev => ({ ...prev, subject: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="math">Math</option>
                      <option value="language">Language</option>
                      <option value="science">Science</option>
                      <option value="art">Art</option>
                      <option value="cultural">Cultural</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Language</label>
                    <select
                      value={material.language}
                      onChange={(e) => setMaterial(prev => ({ ...prev, language: e.target.value as any }))}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="sn">Shona</option>
                      <option value="nd">Ndebele</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">Age Group</label>
                    <select
                      value={material.ageGroup}
                      onChange={(e) => setMaterial(prev => ({ ...prev, ageGroup: e.target.value }))}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="3-5">3-5 years</option>
                      <option value="4-6">4-6 years</option>
                      <option value="5-7">5-7 years</option>
                      <option value="6-8">6-8 years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Element Tools */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium mb-3 text-blue-900">Add Elements</h3>
              {material.subject === 'art' && !material.elements.some(el => el.type === 'drawing-canvas') && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800 font-medium">💡 For art materials, add a Drawing Canvas first for the best experience!</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                {material.subject === 'art' && (
                  <button 
                    onClick={() => addElement('drawing-canvas')} 
                    disabled={material.elements.some(el => el.type === 'drawing-canvas')}
                    className={`p-3 text-left rounded border transition-colors ${
                      material.elements.some(el => el.type === 'drawing-canvas')
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'hover:bg-blue-100 border-blue-200 bg-blue-200'
                    }`}
                  >
                    <div className="text-lg mb-1">🎨</div>
                    <div className="text-xs font-medium text-blue-800">Drawing</div>
                  </button>
                )}
                <button onClick={() => addElement('text')} className="p-3 text-left hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                  <div className="text-lg mb-1">📝</div>
                  <div className="text-xs font-medium text-blue-800">Text</div>
                </button>
                <button onClick={() => addElement('image')} className="p-3 text-left hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                  <div className="text-lg mb-1">📷</div>
                  <div className="text-xs font-medium text-blue-800">Image</div>
                </button>
                <button onClick={() => addElement('audio')} className="p-3 text-left hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                  <div className="text-lg mb-1">🎵</div>
                  <div className="text-xs font-medium text-blue-800">Audio</div>
                </button>
                <button onClick={() => addElement('question')} className="p-3 text-left hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                  <div className="text-lg mb-1">❓</div>
                  <div className="text-xs font-medium text-blue-800">Question</div>
                </button>
                <button onClick={() => addElement('cultural-content')} className="p-3 text-left hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                  <div className="text-lg mb-1">🎭</div>
                  <div className="text-xs font-medium text-blue-800">Cultural</div>
                </button>
                <button 
                  onClick={() => addElement('drawing-task')} 
                  disabled={material.elements.some(el => el.type === 'drawing-task')}
                  className={`p-3 text-left rounded border transition-colors ${
                    material.elements.some(el => el.type === 'drawing-task')
                      ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-blue-100 border-blue-200'
                  }`}
                >
                  <div className="text-lg mb-1">✏️</div>
                  <div className="text-xs font-medium text-blue-800">Draw Task</div>
                </button>
                <button onClick={() => addElement('audio-task')} className="p-3 text-left hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                  <div className="text-lg mb-1">🎤</div>
                  <div className="text-xs font-medium text-blue-800">Audio Task</div>
                </button>
                <button onClick={() => addElement('image-task')} className="p-3 text-left hover:bg-blue-100 rounded border border-blue-200 transition-colors">
                  <div className="text-lg mb-1">📸</div>
                  <div className="text-xs font-medium text-blue-800">Image Task</div>
                </button>
              </div>
            </div>

            {/* Element Editor */}
            {renderElementEditor()}
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
            <h2 className="text-lg font-medium text-gray-900">Canvas</h2>
            {material.elements.some(el => ['drawing-task', 'audio-task', 'image-task'].includes(el.type)) && (
              <p className="text-sm text-blue-600 mt-1">✨ Interactive elements added - students can draw, record, and upload!</p>
            )}
          </div>
          <div className="flex-1 p-6">
            <div className="h-full bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
              <div 
                className="relative w-full h-full bg-gradient-to-br from-gray-50 to-white" 
                onMouseMove={(e) => {
                  if (!drawingState.isDrawing) {
                    handleMouseMove(e);
                    handleResizeMouseMove(e);
                  }
                }}
                onMouseUp={() => {
                  if (!drawingState.isDrawing) {
                    handleMouseUp();
                    handleResizeMouseUp();
                  }
                }}
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '20px 20px' }}
              >
                {material.elements.map(renderElement)}
                {material.elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="text-8xl mb-6 opacity-50">🎨</div>
                      <p className="text-lg font-medium mb-2">Your Creative Canvas</p>
                      <p className="text-sm">Click on elements in the sidebar to add them</p>
                      <p className="text-xs mt-1 opacity-75">
                        {material.subject === 'art' 
                          ? 'Add a Drawing Canvas for full-screen drawing'
                          : 'Drag elements to move them around'
                        }
                      </p>
                    </div>
                  </div>
                )}
                {material.subject === 'art' && material.elements.some(el => el.type === 'drawing-canvas') && (
                  <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium z-10">
                    🎨 Drawing Mode Active
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialEditorPage;
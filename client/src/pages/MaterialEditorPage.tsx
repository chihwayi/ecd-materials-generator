import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { materialsService } from '../services/materials.service.ts';
import api from '../services/api';

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
}

const MaterialEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const isEditing = Boolean(id);
  const templateId = searchParams.get('template');

  const [material, setMaterial] = useState<Material>({
    title: '',
    description: '',
    type: 'worksheet',
    subject: 'art',
    language: 'en',
    ageGroup: '3-6',
    status: 'draft',
    elements: []
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);
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
  }>({ isDrawing: false, elementId: null, currentColor: '#000000', brushSize: 5, isEraser: false });

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
    } else if (templateId) {
      loadTemplate();
    }
  }, [id, templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/templates/${templateId}`);
      const template = response.data.template;
      
      // Convert template content to material format with proper defaults
      const templateElements = (template.content?.elements || []).map((element: any, index: number) => ({
        ...element,
        id: element.id || `template-element-${index}`,
        position: element.position || { x: 50 + (index * 100), y: 50 + (index * 50) },
        size: element.size || { width: 200, height: 100 }
      }));
      
      setMaterial({
        title: template.name,
        description: template.description,
        type: 'worksheet',
        subject: template.category,
        language: template.languages?.[0] || 'en',
        ageGroup: `${template.ageGroupMin}-${template.ageGroupMax}`,
        status: 'draft',
        elements: templateElements
      });
      
      setTemplateLoaded(true);
      toast.success(`Template "${template.name}" loaded successfully!`);
      
      // Hide the success banner after 5 seconds
      setTimeout(() => setTemplateLoaded(false), 5000);
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

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
      case 'puzzle-matching':
        return { 
          title: 'Match the Items', 
          instructions: 'Drag items to their correct matches',
          pairs: [
            { left: { text: '🐕', id: 'dog' }, right: { text: 'Dog', id: 'dog' } },
            { left: { text: '🐱', id: 'cat' }, right: { text: 'Cat', id: 'cat' } },
            { left: { text: '🐦', id: 'bird' }, right: { text: 'Bird', id: 'bird' } }
          ],
          completed: false
        };
      case 'puzzle-sequencing':
        return { 
          title: 'Put in Order', 
          instructions: 'Arrange items in the correct sequence',
          items: [
            { text: '🌱', id: 'seed', order: 1 },
            { text: '🌿', id: 'sprout', order: 2 },
            { text: '🌳', id: 'tree', order: 3 },
            { text: '🍎', id: 'fruit', order: 4 }
          ],
          completed: false
        };
      case 'puzzle-pattern':
        return { 
          title: 'Complete the Pattern', 
          instructions: 'Find the next item in the pattern',
          pattern: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
          options: ['🔴', '🔵', '🟡', '🟢'],
          correct: '🔵',
          completed: false
        };
      case 'puzzle-memory':
        return { 
          title: 'Memory Game', 
          instructions: 'Find matching pairs by remembering their positions',
          cards: [
            { id: 1, emoji: '🐶', isFlipped: false, isMatched: false },
            { id: 2, emoji: '🐱', isFlipped: false, isMatched: false },
            { id: 3, emoji: '🐰', isFlipped: false, isMatched: false },
            { id: 4, emoji: '🐼', isFlipped: false, isMatched: false }
          ],
          completed: false
        };
      case 'puzzle-math':
        return { 
          title: 'Math Puzzle', 
          instructions: 'Solve the math problem',
          question: '2 + 3 = ?',
          options: ['3', '4', '5', '6'],
          correct: '5',
          completed: false
        };
      case 'puzzle-word':
        return { 
          title: 'Word Puzzle', 
          instructions: 'Unscramble the letters to form a word',
          scrambled: 'T A C',
          answer: 'CAT',
          hint: 'A furry pet that says meow',
          completed: false
        };
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
    if (!element || !element.position) return;
    
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
    e.stopPropagation();
    const element = material.elements.find(el => el.id === elementId);
    if (!element || !element.size) return;
    
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
    
    // Safety checks for position and size
    const position = element.position || { x: 0, y: 0 };
    const size = element.size || { width: 200, height: 100 };
    
    const style = {
      position: 'absolute' as const,
      left: position.x,
      top: position.y,
      width: size.width,
      height: size.height,
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
                data-element-id={element.id}
                ref={(canvas) => {
                  if (canvas && !canvas.dataset.initialized) {
                    canvas.dataset.initialized = 'true';
                    initializeCanvas(canvas, element);
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

      case 'puzzle-matching':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'puzzle-sequencing':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'puzzle-pattern':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'puzzle-memory':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'puzzle-math':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
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
            {isSelected && (
              <div 
                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-600 cursor-se-resize"
                onMouseDown={(e) => handleResizeMouseDown(e, element.id)}
                style={{ transform: 'translate(50%, 50%)' }}
              />
            )}
          </div>
        );

      case 'puzzle-word':
        return (
          <div
            key={element.id}
            style={style}
            className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-4 shadow-sm"
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          >
            <div className="text-sm font-medium text-teal-800 mb-3">📝 {element.content.title}</div>
            <div className="text-xs text-teal-600 mb-3">{element.content.instructions}</div>
            <div className="bg-white rounded p-3 mb-2">
              <div className="text-lg font-medium">{element.content.scrambled}</div>
            </div>
            <div className="text-xs text-gray-600">Hint: {element.content.hint}</div>
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

        {element.type === 'puzzle-matching' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <input
                type="text"
                value={element.content.title}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, title: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Match the Items"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Instructions</label>
              <textarea
                value={element.content.instructions}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, instructions: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Drag items to their correct matches"
              />
            </div>
            <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
              🔗 Students will drag and drop items to match them correctly
            </div>
          </div>
        )}

        {element.type === 'puzzle-sequencing' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <input
                type="text"
                value={element.content.title}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, title: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Put in Order"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Instructions</label>
              <textarea
                value={element.content.instructions}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, instructions: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Arrange items in the correct sequence"
              />
            </div>
            <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
              📋 Students will arrange items in the correct order
            </div>
          </div>
        )}

        {element.type === 'puzzle-pattern' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <input
                type="text"
                value={element.content.title}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, title: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Complete the Pattern"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Instructions</label>
              <textarea
                value={element.content.instructions}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, instructions: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Find the next item in the pattern"
              />
            </div>
            <div className="p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-700">
              🔄 Students will identify and complete patterns
            </div>
          </div>
        )}

        {element.type === 'puzzle-memory' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <input
                type="text"
                value={element.content.title}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, title: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Memory Game"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Instructions</label>
              <textarea
                value={element.content.instructions}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, instructions: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
                placeholder="Find matching pairs by remembering their positions"
              />
            </div>
            <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              🧠 Students will play a memory card matching game
            </div>
          </div>
        )}

        {element.type === 'puzzle-math' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <input
                type="text"
                value={element.content.title}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, title: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Math Puzzle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Question</label>
              <input
                type="text"
                value={element.content.question}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, question: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="2 + 3 = ?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Correct Answer</label>
              <input
                type="text"
                value={element.content.correct}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, correct: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5"
              />
            </div>
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
              🔢 Students will solve math problems with multiple choice answers
            </div>
          </div>
        )}

        {element.type === 'puzzle-word' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
              <input
                type="text"
                value={element.content.title}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, title: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Word Puzzle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Scrambled Letters</label>
              <input
                type="text"
                value={element.content.scrambled}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, scrambled: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="T A C"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Answer</label>
              <input
                type="text"
                value={element.content.answer}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, answer: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="CAT"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Hint</label>
              <input
                type="text"
                value={element.content.hint}
                onChange={(e) => updateElement(element.id, { content: { ...element.content, hint: e.target.value } })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="A furry pet that says meow"
              />
            </div>
            <div className="p-2 bg-teal-50 border border-teal-200 rounded text-xs text-teal-700">
              📝 Students will unscramble letters to form words
            </div>
          </div>
        )}
      </div>
    );
  };

  // Add useEffect to initialize canvas elements
  useEffect(() => {
    material.elements.forEach(element => {
      if (element.type === 'drawing-canvas') {
        const canvas = document.querySelector(`canvas[data-element-id="${element.id}"]`) as HTMLCanvasElement;
        if (canvas) {
          initializeCanvas(canvas, element);
        }
      }
    });
  }, [material.elements]);

  const initializeCanvas = (canvas: HTMLCanvasElement, element: MaterialElement) => {
    console.log('Initializing canvas for element:', element.id);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = 800;
      canvas.height = 600;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      console.log('Canvas instructions:', element.content.instructions);
      console.log('Canvas data exists:', !!element.content.canvasData);
      
      // Restore saved canvas data if it exists
      if (element.content.canvasData) {
        const img = new Image();
        img.onload = () => {
          console.log('Image loaded successfully');
          ctx.drawImage(img, 0, 0);
        };
        img.onerror = () => {
          console.log('Image failed to load, drawing outline instead');
          drawColoringOutline(ctx, canvas, element);
        };
        img.src = element.content.canvasData;
      } else if (element.content.instructions && element.content.instructions.includes('Color')) {
        console.log('Drawing coloring outline for:', element.content.instructions);
        drawColoringOutline(ctx, canvas, element);
      }
    }
  };

  const drawColoringOutline = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, element: MaterialElement) => {
    console.log('Drawing coloring outline for:', element.content.instructions);
    // This is a coloring template - draw a simple outline
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'transparent';
    
    // Center the drawing on the canvas with proper margins
    const margin = 50;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxWidth = canvas.width - 2 * margin;
    const maxHeight = canvas.height - 2 * margin;
    
    if (element.content.instructions.includes('flag')) {
      console.log('Drawing Zimbabwean flag outline');
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
      console.log('Drawing realistic lion outline');
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
      console.log('Drawing realistic house outline');
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
      console.log('Drawing realistic tree outline');
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
      console.log('Drawing realistic car outline');
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
      console.log('Drawing generic outline');
      // Generic outline - bigger and centered
      const rectWidth = Math.min(300, maxWidth);
      const rectHeight = Math.min(200, maxHeight);
      const x = centerX - rectWidth / 2;
      const y = centerY - rectHeight / 2;
      ctx.strokeRect(x, y, rectWidth, rectHeight);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/materials')} 
                className="text-white hover:text-blue-100 transition-colors duration-200 flex items-center"
              >
                <span className="text-xl mr-2">←</span>
                Back to Materials
              </button>
              <div className="h-6 w-px bg-white bg-opacity-30"></div>
              <h1 className="text-xl font-bold text-white">
                {isEditing ? '✏️ Edit Material' : templateId ? '🎨 Create from Template' : '🎨 Create New Material'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleSave} 
                disabled={loading}
                className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-medium disabled:opacity-50"
              >
                {loading ? '⏳ Loading...' : '💾 Save Draft'}
              </button>
              <button 
                onClick={handlePublish} 
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50"
              >
                {loading ? '⏳ Loading...' : '🚀 Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {templateLoaded && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-semibold">Template Loaded Successfully!</p>
                <p className="text-green-100 text-sm">You can now customize the material as needed.</p>
              </div>
            </div>
            <button 
              onClick={() => setTemplateLoaded(false)}
              className="text-white hover:text-green-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading template...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex h-[calc(100vh-200px)]">
              {/* Fixed Sidebar */}
              <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Material Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm">
                    <h3 className="font-bold mb-4 text-blue-900 flex items-center">
                      <span className="mr-2">📋</span>
                      Material Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-blue-800">Title</label>
                        <input
                          type="text"
                          value={material.title}
                          onChange={(e) => setMaterial(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full border border-blue-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          placeholder="Enter material title..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-blue-800">Description</label>
                        <textarea
                          value={material.description}
                          onChange={(e) => setMaterial(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full border border-blue-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          rows={3}
                          placeholder="Describe your material..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-2 text-blue-800">Type</label>
                          <select
                            value={material.type}
                            onChange={(e) => setMaterial(prev => ({ ...prev, type: e.target.value as any }))}
                            className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="worksheet">📄 Worksheet</option>
                            <option value="activity">🎯 Activity</option>
                            <option value="assessment">📊 Assessment</option>
                            <option value="story">📖 Story</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-2 text-blue-800">Subject</label>
                          <select
                            value={material.subject}
                            onChange={(e) => setMaterial(prev => ({ ...prev, subject: e.target.value as any }))}
                            className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="math">🔢 Math</option>
                            <option value="language">📚 Language</option>
                            <option value="science">🔬 Science</option>
                            <option value="art">🎨 Art</option>
                            <option value="cultural">🏛️ Cultural</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-2 text-blue-800">Language</label>
                          <select
                            value={material.language}
                            onChange={(e) => setMaterial(prev => ({ ...prev, language: e.target.value as any }))}
                            className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="en">🇺🇸 English</option>
                            <option value="sn">🇿🇼 Shona</option>
                            <option value="nd">🇿🇼 Ndebele</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-2 text-blue-800">Age Group</label>
                          <select
                            value={material.ageGroup}
                            onChange={(e) => setMaterial(prev => ({ ...prev, ageGroup: e.target.value }))}
                            className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                          >
                            <option value="3-5">👶 3-5 years</option>
                            <option value="4-6">🧒 4-6 years</option>
                            <option value="5-7">👧 5-7 years</option>
                            <option value="6-8">👦 6-8 years</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Element Tools */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200 shadow-sm">
                    <h3 className="font-bold mb-4 text-green-900 flex items-center">
                      <span className="mr-2">🛠️</span>
                      Add Elements
                    </h3>
                    {material.subject === 'art' && !material.elements.some(el => el.type === 'drawing-canvas') && (
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 font-medium flex items-center">
                          <span className="mr-2">💡</span>
                          For art materials, add a Drawing Canvas first for the best experience!
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {material.subject === 'art' && (
                        <button 
                          onClick={() => addElement('drawing-canvas')} 
                          disabled={material.elements.some(el => el.type === 'drawing-canvas')}
                          className={`p-4 text-left rounded-lg border transition-all duration-200 ${
                            material.elements.some(el => el.type === 'drawing-canvas')
                              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'hover:bg-green-100 border-green-200 bg-green-200 hover:shadow-md'
                          }`}
                        >
                          <div className="text-2xl mb-2">🎨</div>
                          <div className="text-xs font-medium text-green-800">Drawing</div>
                        </button>
                      )}
                      <button onClick={() => addElement('text')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                        <div className="text-2xl mb-2">📝</div>
                        <div className="text-xs font-medium text-green-800">Text</div>
                      </button>
                      <button onClick={() => addElement('image')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                        <div className="text-2xl mb-2">📷</div>
                        <div className="text-xs font-medium text-green-800">Image</div>
                      </button>
                      <button onClick={() => addElement('audio')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                        <div className="text-2xl mb-2">🎵</div>
                        <div className="text-xs font-medium text-green-800">Audio</div>
                      </button>
                      <button onClick={() => addElement('question')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                        <div className="text-2xl mb-2">❓</div>
                        <div className="text-xs font-medium text-green-800">Question</div>
                      </button>
                      <button onClick={() => addElement('cultural-content')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                        <div className="text-2xl mb-2">🎭</div>
                        <div className="text-xs font-medium text-green-800">Cultural</div>
                      </button>
                      <button 
                        onClick={() => addElement('drawing-task')} 
                        disabled={material.elements.some(el => el.type === 'drawing-task')}
                        className={`p-4 text-left rounded-lg border transition-all duration-200 ${
                          material.elements.some(el => el.type === 'drawing-task')
                            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'hover:bg-green-100 border-green-200 hover:shadow-md'
                        }`}
                      >
                        <div className="text-2xl mb-2">✏️</div>
                        <div className="text-xs font-medium text-green-800">Draw Task</div>
                      </button>
                      <button onClick={() => addElement('audio-task')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                        <div className="text-2xl mb-2">🎤</div>
                        <div className="text-xs font-medium text-green-800">Audio Task</div>
                      </button>
                      <button onClick={() => addElement('image-task')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                        <div className="text-2xl mb-2">📸</div>
                        <div className="text-xs font-medium text-green-800">Image Task</div>
                      </button>
                    </div>
                    
                    {/* Puzzle Elements */}
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-green-900 mb-3 flex items-center">
                        <span className="mr-2">🧩</span>
                        Educational Puzzles
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => addElement('puzzle-matching')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                          <div className="text-2xl mb-2">🔗</div>
                          <div className="text-xs font-medium text-green-800">Matching</div>
                        </button>
                        <button onClick={() => addElement('puzzle-sequencing')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                          <div className="text-2xl mb-2">📋</div>
                          <div className="text-xs font-medium text-green-800">Sequencing</div>
                        </button>
                        <button onClick={() => addElement('puzzle-pattern')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                          <div className="text-2xl mb-2">🔄</div>
                          <div className="text-xs font-medium text-green-800">Pattern</div>
                        </button>
                        <button onClick={() => addElement('puzzle-memory')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                          <div className="text-2xl mb-2">🧠</div>
                          <div className="text-xs font-medium text-green-800">Memory</div>
                        </button>
                        <button onClick={() => addElement('puzzle-math')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                          <div className="text-2xl mb-2">🔢</div>
                          <div className="text-xs font-medium text-green-800">Math</div>
                        </button>
                        <button onClick={() => addElement('puzzle-word')} className="p-4 text-left hover:bg-green-100 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md">
                          <div className="text-2xl mb-2">📝</div>
                          <div className="text-xs font-medium text-green-800">Word</div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Element Editor */}
                  {renderElementEditor()}
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 px-8 py-4 flex-shrink-0">
                  <h2 className="text-xl font-bold text-purple-900 flex items-center">
                    <span className="mr-3">🎨</span>
                    Creative Canvas
                  </h2>
                  {material.elements.some(el => ['drawing-task', 'audio-task', 'image-task'].includes(el.type)) && (
                    <p className="text-sm text-purple-600 mt-2 flex items-center">
                      <span className="mr-2">✨</span>
                      Interactive elements added - students can draw, record, and upload!
                    </p>
                  )}
                </div>
                <div className="flex-1 p-8">
                  <div className="h-full bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
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
                            <p className="text-xl font-bold mb-3 text-gray-600">Your Creative Canvas</p>
                            <p className="text-lg mb-2">Click on elements in the sidebar to add them</p>
                            <p className="text-sm opacity-75">
                              {material.subject === 'art' 
                                ? 'Add a Drawing Canvas for full-screen drawing'
                                : 'Drag elements to move them around'
                              }
                            </p>
                          </div>
                        </div>
                      )}
                      {material.subject === 'art' && material.elements.some(el => el.type === 'drawing-canvas') && (
                        <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold z-10 shadow-lg">
                          🎨 Drawing Mode Active
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialEditorPage;
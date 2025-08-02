import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const StudentAssignmentCompletionPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [studentSubmission, setStudentSubmission] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Drawing state
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    elementId: null,
    currentColor: '#FF0000',
    brushSize: 8,
    isEraser: false
  });

  // Audio recording state
  const [audioRecording, setAudioRecording] = useState({
    isRecording: false,
    elementId: null,
    mediaRecorder: null,
    audioChunks: []
  });

  // Color palette
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
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    try {
      // Get studentId from URL or localStorage
      const studentId = localStorage.getItem('currentStudentId') || new URLSearchParams(window.location.search).get('studentId');
      
      if (!studentId) {
        toast.error('Student ID not found');
        return;
      }

      const response = await api.get(`/assignments/${assignmentId}/student?studentId=${studentId}`);
      console.log('Assignment response:', response.data);
      console.log('Assignment type:', response.data.assignment.type);
      console.log('Assignment materials:', response.data.assignment.materials);
      
      if (response.data.assignment.materials) {
        response.data.assignment.materials.forEach((material, index) => {
          console.log(`Material ${index + 1}:`, material);
          console.log(`Material ${index + 1} elements:`, material.elements);
        });
      }
      
      setAssignment(response.data.assignment);
      setStudentSubmission(response.data.studentSubmission || {});
    } catch (error) {
      console.error('Failed to fetch assignment:', error);
      toast.error('Failed to load assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCompletion = (taskId, data) => {
    setStudentSubmission(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        ...data,
        completedAt: new Date().toISOString()
      }
    }));
  };

  // Drawing functions
  const handleCanvasMouseDown = (e, elementId) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      
      // Set drawing mode based on current state
      if (drawingState.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = drawingState.currentColor;
      }
      
      ctx.lineWidth = drawingState.brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      setDrawingState(prev => ({ ...prev, isDrawing: true, elementId }));
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (drawingState.isDrawing && drawingState.elementId) {
      e.preventDefault();
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        // Continue drawing with current settings
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const handleCanvasMouseUp = (e) => {
    if (drawingState.isDrawing) {
      e.preventDefault();
      setDrawingState(prev => ({ ...prev, isDrawing: false, elementId: null }));
      const canvas = e.currentTarget;
      if (canvas) {
        const dataURL = canvas.toDataURL();
        handleTaskCompletion(drawingState.elementId, { canvasData: dataURL });
      }
    }
  };

  const clearCanvas = (elementId) => {
    const canvas = document.querySelector(`canvas[data-element-id="${elementId}"]`);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear to white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Find the element to get teacher's pre-drawn content
        const material = assignment.materials?.find(m => 
          m.elements?.some(el => el.id === elementId)
        );
        const element = material?.elements?.find(el => el.id === elementId);
        
        // Restore teacher's pre-drawn content if it exists
        if (element?.content?.canvasData) {
          const teacherImg = new Image();
          teacherImg.onload = () => {
            ctx.drawImage(teacherImg, 0, 0);
            const dataURL = canvas.toDataURL();
            handleTaskCompletion(elementId, { canvasData: dataURL });
            toast.success('Canvas cleared!');
          };
          teacherImg.src = element.content.canvasData;
        } else {
          const dataURL = canvas.toDataURL();
          handleTaskCompletion(elementId, { canvasData: dataURL });
          toast.success('Canvas cleared!');
        }
      }
    }
  };

  // Audio recording functions
  const startRecording = async (elementId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        handleTaskCompletion(elementId, { audioData: audioUrl, audioBlob });
        toast.success('Audio recorded successfully!');
      };

      mediaRecorder.start();
      setAudioRecording({ isRecording: true, elementId, mediaRecorder, audioChunks });
      toast.success('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (audioRecording.mediaRecorder && audioRecording.isRecording) {
      audioRecording.mediaRecorder.stop();
      audioRecording.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setAudioRecording({ isRecording: false, elementId: null, mediaRecorder: null, audioChunks: [] });
    }
  };

  // Image upload function
  const handleImageUpload = (elementId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        handleTaskCompletion(elementId, { imageData, fileName: file.name });
        toast.success('Image uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinishAssignment = async () => {
    setSubmitting(true);
    try {
      const studentId = localStorage.getItem('currentStudentId') || new URLSearchParams(window.location.search).get('studentId');
      
      await api.post(`/assignments/${assignmentId}/complete`, {
        studentId,
        submissions: studentSubmission
      });
      toast.success('Assignment completed successfully!');
      navigate(`/student-assignments/${studentId}`);
    } catch (error) {
      console.error('Failed to complete assignment:', error);
      toast.error('Failed to complete assignment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderMaterialTask = (material) => {
    console.log('Rendering material:', material);
    console.log('Material elements:', material.elements);
    
    return (
      <div key={material.id} className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-3">{material.title}</h3>
        <p className="text-gray-600 mb-4">{material.description}</p>
        
        {/* Render material content based on elements */}
        {material.elements?.map((element, index) => {
          console.log(`Rendering element ${index}:`, element);
          console.log(`Element ${index} content:`, element.content);
          console.log(`Element ${index} canvasData:`, element.content?.canvasData);
          return (
            <div key={index} className="mb-6">
              {element.type === 'drawing-task' && (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="bg-green-100 px-4 py-3 text-center border-b border-green-200 mb-4">
                    <div className="text-lg font-medium text-green-800">✏️ {element.content.task}</div>
                    <div className="text-sm text-green-600 mt-1">{element.content.instructions}</div>
                  </div>
                  
                  {/* Drawing Tools */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Drawing Tools</h4>
                      <div className="text-sm text-gray-600">
                        {drawingState.isEraser ? '🧽 Eraser' : `🎨 Color: ${drawingState.currentColor}`} | Brush: {drawingState.brushSize}px
                      </div>
                    </div>
                    
                    {/* Color Palette */}
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      {crayonColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setDrawingState(prev => ({ ...prev, currentColor: color, isEraser: false }))}
                          className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-105 ${
                            drawingState.currentColor === color && !drawingState.isEraser
                              ? 'border-gray-800 scale-110 shadow-lg' 
                              : 'border-gray-300 hover:border-gray-500'
                          }`}
                          style={{ backgroundColor: color, border: color === '#FFFFFF' ? '2px solid #ccc' : undefined }}
                          title={`Select ${color}`}
                        />
                      ))}
                    </div>
                    
                    {/* Brush Size */}
                    <div className="mb-3">
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
                    
                    {/* Tools */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setDrawingState(prev => ({ ...prev, isEraser: !prev.isEraser }))}
                        className={`flex-1 px-3 py-2 rounded text-sm transition-colors ${
                          drawingState.isEraser 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {drawingState.isEraser ? '✏️ Drawing' : '🧽 Eraser'}
                      </button>
                      <button
                        onClick={() => clearCanvas(element.id)}
                        className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                      >
                        Clear Canvas
                      </button>
                    </div>
                  </div>
                  
                  {/* Canvas */}
                  <canvas
                    ref={(canvas) => {
                      if (canvas && !canvas.dataset.initialized) {
                        canvas.dataset.initialized = 'true';
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          canvas.width = 800;
                          canvas.height = 500;
                          ctx.fillStyle = 'white';
                          ctx.fillRect(0, 0, canvas.width, canvas.height);
                          
                          // First, load teacher's pre-drawn content
                          if (element.content.canvasData) {
                            const teacherImg = new Image();
                            teacherImg.onload = () => {
                              ctx.drawImage(teacherImg, 0, 0);
                              
                              // Then overlay student's work if it exists
                              if (studentSubmission[element.id]?.canvasData) {
                                const studentImg = new Image();
                                studentImg.onload = () => {
                                  ctx.drawImage(studentImg, 0, 0);
                                };
                                studentImg.src = studentSubmission[element.id].canvasData;
                              }
                            };
                            teacherImg.src = element.content.canvasData;
                          } else if (studentSubmission[element.id]?.canvasData) {
                            // If no teacher content, just load student's work
                            const img = new Image();
                            img.onload = () => {
                              ctx.drawImage(img, 0, 0);
                            };
                            img.src = studentSubmission[element.id].canvasData;
                          }
                        }
                      }
                    }}
                    width={800}
                    height={500}
                    className="w-full border border-gray-300 rounded cursor-crosshair touch-none"
                    style={{ maxWidth: '100%', height: 'auto', touchAction: 'none' }}
                    onMouseDown={(e) => handleCanvasMouseDown(e, element.id)}
                    onMouseMove={(e) => {
                      // Only handle mouse move if we're actually drawing
                      if (drawingState.isDrawing && drawingState.elementId === element.id) {
                        handleCanvasMouseMove(e);
                      }
                    }}
                    onMouseUp={(e) => {
                      // Only handle mouse up if we're actually drawing
                      if (drawingState.isDrawing && drawingState.elementId === element.id) {
                        handleCanvasMouseUp(e);
                      }
                    }}
                    onMouseLeave={(e) => {
                      // Stop drawing if mouse leaves canvas
                      if (drawingState.isDrawing && drawingState.elementId === element.id) {
                        handleCanvasMouseUp(e);
                      }
                    }}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const mouseEvent = new MouseEvent('mousedown', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                      });
                      handleCanvasMouseDown(mouseEvent, element.id);
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      if (drawingState.isDrawing && drawingState.elementId === element.id) {
                        const touch = e.touches[0];
                        const mouseEvent = new MouseEvent('mousemove', {
                          clientX: touch.clientX,
                          clientY: touch.clientY
                        });
                        handleCanvasMouseMove(mouseEvent);
                      }
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      if (drawingState.isDrawing && drawingState.elementId === element.id) {
                        const mouseEvent = new MouseEvent('mouseup');
                        handleCanvasMouseUp(mouseEvent);
                      }
                    }}
                    data-element-id={element.id}
                  />
                </div>
              )}
              
              {element.type === 'question' && (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="bg-blue-100 px-4 py-3 text-center border-b border-blue-200 mb-4">
                    <div className="text-lg font-medium text-blue-800">❓ {element.content.question}</div>
                  </div>
                  
                  <div className="space-y-3">
                    {element.content.options?.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${element.id}`}
                          value={optionIndex}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleTaskCompletion(element.id, { 
                                selectedAnswer: optionIndex,
                                answer: option 
                              });
                            }
                          }}
                          checked={studentSubmission[element.id]?.selectedAnswer === optionIndex}
                          className="text-blue-600"
                        />
                        <span className="text-gray-700">{option}</span>
                        {studentSubmission[element.id]?.selectedAnswer === optionIndex && (
                          <span className="text-green-600 text-sm">✓ Selected</span>
                        )}
                      </label>
                    ))}
                  </div>
                  
                  {studentSubmission[element.id]?.selectedAnswer !== undefined && (
                    <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                      ✓ Answer selected: {element.content.options[studentSubmission[element.id].selectedAnswer]}
                    </div>
                  )}
                </div>
              )}
              
              {element.type === 'audio-task' && (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="bg-purple-100 px-4 py-3 text-center border-b border-purple-200 mb-4">
                    <div className="text-lg font-medium text-purple-800">🎤 {element.content.task}</div>
                    <div className="text-sm text-purple-600 mt-1">{element.content.instructions}</div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4">
                    {audioRecording.isRecording && audioRecording.elementId === element.id ? (
                      <button
                        onClick={stopRecording}
                        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 font-medium"
                      >
                        ⏹️ Stop Recording
                      </button>
                    ) : (
                      <button
                        onClick={() => startRecording(element.id)}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
                      >
                        🎙️ Start Recording
                      </button>
                    )}
                    
                    {studentSubmission[element.id]?.audioData && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Recording:</span>
                        <audio controls className="h-8">
                          <source src={studentSubmission[element.id].audioData} />
                          Your browser does not support audio.
                        </audio>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {element.type === 'image-task' && (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="bg-orange-100 px-4 py-3 text-center border-b border-orange-200 mb-4">
                    <div className="text-lg font-medium text-orange-800">📸 {element.content.task}</div>
                    <div className="text-sm text-orange-600 mt-1">{element.content.instructions}</div>
                  </div>
                  
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(element.id, e)}
                      className="hidden"
                      id={`image-upload-${element.id}`}
                    />
                    <label
                      htmlFor={`image-upload-${element.id}`}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      {studentSubmission[element.id]?.imageData ? (
                        <div>
                          <img 
                            src={studentSubmission[element.id].imageData} 
                            alt="Uploaded" 
                            className="max-w-full h-64 object-contain mx-auto mb-2"
                          />
                          <p className="text-sm text-gray-600">{studentSubmission[element.id].fileName}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="text-4xl mb-2">📷</div>
                          <p className="text-gray-500">Click to upload image</p>
                          <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCustomTask = (task) => (
    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{task.title}</h3>
      <p className="text-gray-600 mb-4">{task.instructions}</p>
      
      {task.type === 'draw' && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium mb-2">✏️ Drawing Task</h4>
          <canvas
            width={800}
            height={400}
            className="border border-gray-300 rounded w-full"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="mt-2 flex space-x-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
              🧽 Eraser
            </button>
            <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm">
              Clear Canvas
            </button>
          </div>
        </div>
      )}
      
      {task.type === 'audio' && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium mb-2">🎤 Audio Task</h4>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              🎙️ Start Recording
            </button>
            <span className="text-sm text-gray-500">00:00</span>
          </div>
        </div>
      )}
      
      {task.type === 'image' && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h4 className="font-medium mb-2">📸 Image Task</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-gray-500">Click to upload image</p>
            <input type="file" accept="image/*" className="hidden" />
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Assignment Not Found</h2>
          <p className="text-gray-600 mb-4">The assignment you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/student-assignments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Assignments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{assignment.title}</h1>
              <p className="text-gray-600 mt-2">{assignment.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Due Date</div>
              <div className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {assignment.instructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-900 mb-2">📋 Instructions</h3>
            <p className="text-blue-800">{assignment.instructions}</p>
          </div>
        )}

        <div className="space-y-6">
          {assignment.type === 'material' && assignment.materials?.map(renderMaterialTask)}
          {assignment.type === 'custom' && assignment.customTasks?.map(renderCustomTask)}
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Ready to Submit?</h3>
              <p className="text-gray-600 mt-1">Click the button below when you've completed all tasks.</p>
            </div>
            <button
              onClick={handleFinishAssignment}
              disabled={submitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {submitting ? 'Submitting...' : '✅ Finish Assignment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignmentCompletionPage; 
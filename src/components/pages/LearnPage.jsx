import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, PlayCircle, BookOpen, Award, Camera, Square, RotateCcw, Activity, Info, Wifi, WifiOff, Video, ChevronDown, X, ArrowRight, ArrowLeft, Target, CheckCheck } from 'lucide-react';
import apiService from './services/api.js';

const InteractiveLearnPage = () => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const [fps, setFps] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(null);
  const [completedSigns, setCompletedSigns] = useState(new Set());
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const fpsRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastProcessTimeRef = useRef(0);
  const frameCountRef = useRef(0);

  const API_BASE_URL = 'http://localhost:5000';

  // Load lessons from backend
  const loadLessons = async () => {
    try {
      setLoading(true);
      const response = await apiService.getLessons();
      if (response.success) {
        // Transform backend data to match frontend expectations
        const transformedLessons = response.lessons.map(lesson => ({
          id: lesson._id,
          title: lesson.learnName,
          signs: lesson.signs,
          difficulty: lesson.difficulty,
          completed: lesson.completed || false,
          progress: lesson.progress || 0,
          description: lesson.description,
          currentSignIndex: lesson.currentSignIndex || 0,
          completedSigns: lesson.completedSigns || [],
        }));
        setLessons(transformedLessons);
      } else {
        setError('Failed to load lessons');
      }
    } catch (err) {
      console.error('Error loading lessons:', err);
      setError('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  // Initialize connection, cameras, and load lessons
  useEffect(() => {
    checkConnection();
    loadCameras();
    loadLessons();
  }, []);

  // Auto-hide feedback after 3 seconds
  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => {
        setShowFeedback(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback]);

  const checkConnection = async () => {
    try {
      const response = await fetch('http://localhost:5001/health');
      if (response.ok) {
        setIsConnected(true);
        setError('');
      } else {
        setIsConnected(false);
        setError('Backend not responding');
      }
    } catch (err) {
      setIsConnected(false);
      setError('Cannot connect to backend', err);
    }
  };

  const loadCameras = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      setCameras(videoDevices);
      
      if (videoDevices.length > 0 && !selectedCameraId) {
        setSelectedCameraId(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Error loading cameras:', err);
      setError('Error loading cameras');
    }
  };

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      };

      if (selectedCameraId) {
        constraints.video.deviceId = { exact: selectedCameraId };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError('');
        
        intervalRef.current = setInterval(captureAndPredict, 500);
      }
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
  };

  const switchCamera = async (cameraId) => {
    setSelectedCameraId(cameraId);
    setShowCameraMenu(false);
    
    if (isStreaming) {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  const captureAndPredict = async () => {
    if (!videoRef.current || !canvasRef.current || !isConnected || isProcessing || !currentLesson) return;

    if (videoRef.current.readyState !== 4) return;

    const currentTime = Date.now();
    if (lastProcessTimeRef.current && currentTime - lastProcessTimeRef.current < 400) {
      return;
    }

    setIsProcessing(true);
    lastProcessTimeRef.current = currentTime;

    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      
      if (canvas.width === 0 || canvas.height === 0) {
        setIsProcessing(false);
        return;
      }
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.6);
      
      // Calculate FPS
      frameCountRef.current++;
      if (lastTimeRef.current) {
        const timeDiff = currentTime - lastTimeRef.current;
        if (timeDiff >= 1000) {
          fpsRef.current = Math.round((frameCountRef.current * 1000) / timeDiff);
          setFps(fpsRef.current);
          frameCountRef.current = 0;
          lastTimeRef.current = currentTime;
        }
      } else {
        lastTimeRef.current = currentTime;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: imageData,
          timestamp: currentTime
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPrediction(result.prediction);
          setConfidence(result.confidence);
          setError('');
          
          // Check if prediction matches current target sign
          checkSignMatch(result.prediction, result.confidence);
        } else {
          setError(result.error || 'Prediction failed');
        }
      } else {
        setError('Network error');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout');
      } else {
        setError('Prediction error: ' + err.message);
        console.error('Prediction error:', err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const checkSignMatch = async (predictedSign, conf) => {
    if (!currentLesson) return;
    
    const targetSign = currentLesson.signs[currentSignIndex];
    const isCorrect = predictedSign === targetSign && conf >= 0.7; // 70% confidence threshold
    
    if (isCorrect) {
      setShowFeedback({ type: 'success', message: 'Correct! Well done!' });
      setCompletedSigns(prev => new Set([...prev, targetSign]));
      
      // Send progress update to backend
      try {
        const timeSpent = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
        const response = await apiService.updateLessonProgress(currentLesson.id, {
          sign: predictedSign,
          accuracy: conf * 100,
          timeSpent
        });
        
        if (response.success && response.validationPassed) {
          console.log('Progress updated successfully');
          // Update local lesson progress if provided
          if (response.progress) {
            setCurrentLesson(prev => ({
              ...prev,
              progress: response.progress.progressPercentage,
              completed: response.progress.isCompleted,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to update progress:', error);
      }
      
      // Auto-advance after a short delay
      setTimeout(() => {
        if (currentSignIndex < currentLesson.signs.length - 1) {
          setCurrentSignIndex(prev => prev + 1);
        }
        setShowFeedback(null);
      }, 2000);
    } else if (predictedSign && conf >= 0.5) {
      setShowFeedback({ 
        type: 'error', 
        message: `Wrong sign detected: "${predictedSign}". Try again with "${targetSign}"` 
      });
    }
  };

  const startLesson = (lesson) => {
    setCurrentLesson(lesson);
    setCurrentSignIndex(lesson.currentSignIndex || 0);
    // Initialize completed signs from backend data
    const completedSignsFromBackend = lesson.completedSigns?.map(cs => cs.sign) || [];
    setCompletedSigns(new Set(completedSignsFromBackend));
    setShowFeedback(null);
    setStartTime(Date.now());
  };

  const exitLesson = () => {
    setCurrentLesson(null);
    setCurrentSignIndex(0);
    setCompletedSigns(new Set());
    setShowFeedback(null);
    stopCamera();
  };

  const nextSign = () => {
    if (currentSignIndex < currentLesson.signs.length - 1) {
      setCurrentSignIndex(prev => prev + 1);
      setShowFeedback(null);
    }
  };

  const prevSign = () => {
    if (currentSignIndex > 0) {
      setCurrentSignIndex(prev => prev - 1);
      setShowFeedback(null);
    }
  };

  const getCameraLabel = (camera) => {
    return camera.label || `Camera ${cameras.indexOf(camera) + 1}`;
  };

  const selectedCamera = cameras.find(cam => cam.deviceId === selectedCameraId);

  // If a lesson is selected, show the learning interface
  if (currentLesson) {
    const currentSign = currentLesson.signs[currentSignIndex];
    const isSignCompleted = completedSigns.has(currentSign);
    const lessonProgress = (completedSigns.size / currentLesson.signs.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Learning: {currentLesson.title}
              </h1>
              <p className="text-gray-600">{currentLesson.description}</p>
            </div>
            <Button
              onClick={exitLesson}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white"
            >
              <X size={16} />
              Exit Lesson
            </Button>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6 border border-gray-200 bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">Lesson Progress</span>
                <span className="text-sm text-gray-600">{completedSigns.size}/{currentLesson.signs.length} signs completed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    lessonProgress === 100 
                      ? 'bg-green-500' 
                      : 'bg-gradient-to-r from-blue-800 to-blue-400'
                  }`}
                  style={{ width: `${lessonProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Camera Section */}
            <div className="lg:col-span-2">
              <Card className="border border-gray-200 bg-white shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Practice Camera
                    </CardTitle>
                    <div className="flex gap-2 items-center">
                      <span className="text-sm text-gray-600">FPS: {fps}</span>
                      {isProcessing && (
                        <div className="flex items-center gap-1 text-gray-800">
                          <Activity size={16} className="animate-pulse" />
                          <span className="text-xs">Processing</span>
                        </div>
                      )}
                      {/* Camera Selector */}
                      {cameras.length > 1 && (
                        <div className="relative">
                          <Button
                            onClick={() => setShowCameraMenu(!showCameraMenu)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-gray-300 hover:border-gray-900"
                          >
                            <Video size={16} />
                            {selectedCamera ? getCameraLabel(selectedCamera) : 'Select Camera'}
                            <ChevronDown size={16} />
                          </Button>
                          
                          {showCameraMenu && (
                            <div className="absolute top-full right-0 mt-2 bg-white backdrop-blur-lg rounded-lg shadow-xl border border-gray-200 min-w-48 z-10">
                              {cameras.map((camera) => (
                                <button
                                  key={camera.deviceId}
                                  onClick={() => switchCamera(camera.deviceId)}
                                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                                    selectedCameraId === camera.deviceId ? 'bg-gray-200' : ''
                                  } first:rounded-t-lg last:rounded-b-lg`}
                                >
                                  <div className="text-sm font-medium text-gray-800">
                                    {getCameraLabel(camera)}
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Connection Status */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Video Container */}
                  <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-auto max-h-96 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Overlay Info */}
                    {isStreaming && (
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg">
                        Recording...
                      </div>
                    )}
                    
                    {/* Target Sign Overlay */}
                    <div className="absolute top-4 right-4 bg-gray-900/90 text-white px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target size={16} />
                        <span className="font-medium">Target: {currentSign}</span>
                      </div>
                    </div>

                    {/* Feedback Overlay */}
                    {showFeedback && (
                      <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg font-medium ${
                        showFeedback.type === 'success' 
                          ? 'bg-green-600/90 text-white' 
                          : 'bg-red-600/90 text-white'
                      }`}>
                        <div className="flex items-center gap-2">
                          {showFeedback.type === 'success' ? (
                            <CheckCheck size={16} />
                          ) : (
                            <X size={16} />
                          )}
                          {showFeedback.message}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={isStreaming ? stopCamera : startCamera}
                      disabled={!isConnected}
                      className={`flex items-center gap-2 ${
                        isStreaming
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-gray-900 hover:bg-black'
                      }`}
                    >
                      {isStreaming ? <Square size={20} /> : <Camera size={20} />}
                      {isStreaming ? 'Stop' : 'Start'} Camera
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Panel */}
            <div className="space-y-6">
              {/* Current Sign */}
              <Card className="border border-gray-200 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Current Sign
                    {isSignCompleted && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-4">
                      {currentSign}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Sign {currentSignIndex + 1} of {currentLesson.signs.length}
                    </div>
                    
                    {prediction && (
                      <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                        <div className="text-sm font-medium text-gray-700">Detected:</div>
                        <div className={`text-lg font-semibold ${
                          prediction === currentSign && confidence >= 0.7 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {prediction}
                        </div>
                        <div className="text-sm text-gray-600">
                          {(confidence * 100).toFixed(1)}% confident
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex justify-between mt-4">
                    <Button
                      onClick={prevSign}
                      disabled={currentSignIndex === 0}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 hover:border-gray-900"
                    >
                      <ArrowLeft size={16} />
                      Previous
                    </Button>
                    <Button
                      onClick={nextSign}
                      disabled={currentSignIndex === currentLesson.signs.length - 1}
                      variant="outline"
                      size="sm"
                      className="border-gray-300 hover:border-gray-900"
                    >
                      Next
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* All Signs Progress */}
              <Card className="border border-gray-200 bg-white shadow-md">
                <CardHeader>
                  <CardTitle>All Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {currentLesson.signs.map((sign, index) => (
                      <Button
                        key={index}
                        onClick={() => setCurrentSignIndex(index)}
                        variant={index === currentSignIndex ? "default" : "outline"}
                        size="sm"
                        className={`relative ${
                          index === currentSignIndex 
                            ? 'bg-gray-900 hover:bg-black text-white' 
                            : 'border-gray-300 hover:border-gray-900'
                        } ${
                          completedSigns.has(sign) 
                            ? 'ring-2 ring-green-500 bg-green-50 hover:bg-green-100' 
                            : ''
                        }`}
                      >
                        {sign}
                        {completedSigns.has(sign) && (
                          <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-600 bg-white rounded-full" />
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main lesson selection view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      <div className="max-w-10xl mx-auto space-y-6">
        <Card className="border border-gray-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-gray-900" />
              <span>Interactive Learning Path</span>
              <Badge variant="secondary" className="ml-auto bg-gray-900 text-white hover:bg-black">
                <Award className="w-4 h-4 mr-1" />
                Practice with Camera
              </Badge>
            </CardTitle>
            <CardDescription>
              Select a lesson to start practicing with real-time sign detection and feedback
            </CardDescription>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 animate-spin" />
              <span className="text-lg">Loading lessons...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
            <Card 
              key={lesson.id} 
              className={`hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white shadow-md hover:border-gray-900 hover:scale-105 ${
                lesson.completed ? 'ring-2 ring-green-500/20' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-gray-900" />
                    )}
                    {lesson.title}
                  </CardTitle>
                  <Badge 
                    variant={lesson.difficulty === 'Advanced' ? 'destructive' : 
                            lesson.difficulty === 'Intermediate' ? 'warning' : 'default'}
                    className={`text-xs ${
                      lesson.difficulty === 'Beginner' ? 'bg-gray-900 text-white hover:bg-black' : ''
                    }`}
                  >
                    {lesson.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {lesson.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {lesson.signs.slice(0, 5).map((sign, index) => (
                    <Badge 
                      key={index} 
                      variant={lesson.completed ? "default" : "outline"}
                      className={`text-xs ${
                        lesson.completed 
                          ? 'bg-gray-900 text-white hover:bg-black' 
                          : 'border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      {sign}
                    </Badge>
                  ))}
                  {lesson.signs.length > 5 && (
                    <Badge variant="outline" className="text-xs border-gray-300 hover:border-gray-900">
                      +{lesson.signs.length - 5} more
                    </Badge>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{lesson.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        lesson.completed 
                          ? 'bg-green-500' 
                          : 'bg-gradient-to-r from-blue-800 to-blue-400'
                      }`}
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>
                
                <Button 
                  className={`w-full flex items-center gap-2 ${
                    lesson.completed 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-900 hover:bg-black'
                  }`}
                  onClick={() => startLesson(lesson)}
                >
                  <Camera size={16} />
                  {lesson.completed ? 'Practice Again' : lesson.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveLearnPage;
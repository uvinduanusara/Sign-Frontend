import React, { useState, useRef, useEffect } from 'react';
import { Camera, Square, RotateCcw, Activity, Info, Wifi, WifiOff, Video, ChevronDown } from 'lucide-react';

const SignLanguageRecognition = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [allPredictions, setAllPredictions] = useState({});
  const [sequenceLength, setSequenceLength] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [modelInfo, setModelInfo] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [error, setError] = useState('');
  const [fps, setFps] = useState(0);
  const [cameras, setCameras] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const [showCameraMenu, setShowCameraMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const fpsRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastProcessTimeRef = useRef(0);
  const frameCountRef = useRef(0);

  const API_BASE_URL = 'http://localhost:5000';

  // Check connection status
  useEffect(() => {
    checkConnection();
    fetchModelInfo();
    loadCameras();
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        setIsConnected(true);
        setError('');
      } else {
        setIsConnected(false);
        setError('Backend not responding');
      }
    } catch (err) {
      setIsConnected(false);
      setError('Cannot connect to backend', err.message);
    }
  };

  const fetchModelInfo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/model-info`);
      if (response.ok) {
        const data = await response.json();
        setModelInfo(data);
      }
    } catch (err) {
      console.error('Error fetching model info:', err);
    }
  };

  const loadCameras = async () => {
    try {
      // Request camera permissions first
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Get list of video input devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      setCameras(videoDevices);
      
      // Set default camera if none selected
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

      // Use specific camera if selected
      if (selectedCameraId) {
        constraints.video.deviceId = { exact: selectedCameraId };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
        setError('');
        
        // Start prediction loop with more conservative timing
        intervalRef.current = setInterval(captureAndPredict, 500); // Reduced to 2 FPS for stability
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
    resetSequence();
  };

  const switchCamera = async (cameraId) => {
    setSelectedCameraId(cameraId);
    setShowCameraMenu(false);
    
    // If currently streaming, restart with new camera
    if (isStreaming) {
      stopCamera();
      // Small delay to ensure cleanup
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  const captureAndPredict = async () => {
    if (!videoRef.current || !canvasRef.current || !isConnected || isProcessing) return;

    // Skip if video is not ready
    if (videoRef.current.readyState !== 4) return;

    // Throttle requests to prevent timestamp issues
    const currentTime = Date.now();
    if (lastProcessTimeRef.current && currentTime - lastProcessTimeRef.current < 400) {
      return;
    }

    setIsProcessing(true);
    lastProcessTimeRef.current = currentTime;

    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas size
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      
      // Skip if video dimensions are not ready
      if (canvas.width === 0 || canvas.height === 0) {
        setIsProcessing(false);
        return;
      }
      
      // Draw video frame to canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64 with lower quality for faster processing
      const imageData = canvas.toDataURL('image/jpeg', 0.6);
      
      // Calculate FPS
      frameCountRef.current++;
      if (lastTimeRef.current) {
        const timeDiff = currentTime - lastTimeRef.current;
        if (timeDiff >= 1000) { // Update FPS every second
          fpsRef.current = Math.round((frameCountRef.current * 1000) / timeDiff);
          setFps(fpsRef.current);
          frameCountRef.current = 0;
          lastTimeRef.current = currentTime;
        }
      } else {
        lastTimeRef.current = currentTime;
      }

      // Send to backend with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: imageData,
          timestamp: currentTime // Add timestamp for backend processing
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPrediction(result.prediction);
          setConfidence(result.confidence);
          setAllPredictions(result.all_predictions || {});
          setSequenceLength(result.sequence_length || 0);
          setError('');
        } else {
          setError(result.error || 'Prediction failed');
        }
      } else {
        setError('Network error');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout - reducing processing rate');
      } else {
        setError('Prediction error: ' + err.message);
        console.error('Prediction error:', err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetSequence = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reset_sequence`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setSequenceLength(0);
        setPrediction(null);
        setConfidence(0);
        setAllPredictions({});
      }
    } catch (err) {
      console.error('Error resetting sequence:', err);
    }
  };

  const debugFrame = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    // Skip if video is not ready
    if (videoRef.current.readyState !== 4) return;

    setIsProcessing(true);

    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      
      // Skip if video dimensions are not ready
      if (canvas.width === 0 || canvas.height === 0) {
        setIsProcessing(false);
        return;
      }
      
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.6);
      
      const response = await fetch(`${API_BASE_URL}/debug_frame`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image: imageData,
          timestamp: Date.now()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setDebugInfo(result);
      }
    } catch (err) {
      console.error('Debug error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'text-gray-800';
    if (conf >= 0.6) return 'text-gray-600';
    return 'text-gray-400';
  };

  const getSequenceProgress = () => {
    if (!modelInfo || !modelInfo.sequence_length) return 0;
    return (sequenceLength / modelInfo.sequence_length) * 100;
  };

  const getCameraLabel = (camera) => {
    return camera.label || `Camera ${cameras.indexOf(camera) + 1}`;
  };

  const selectedCamera = cameras.find(cam => cam.deviceId === selectedCameraId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sign Language Recognition
          </h1>
          <p className="text-gray-600">Real-time LSTM-based sign language detection</p>
        </div>

        {/* Connection Status */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            isConnected ? 'bg-gray-800' : 'bg-gray-600'
          } text-white`}>
            {isConnected ? <Wifi size={20} /> : <WifiOff size={20} />}
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Live Camera</h2>
                <div className="flex gap-2 items-center">
                  <span className="text-sm text-gray-600">FPS: {fps}</span>
                  {isProcessing && (
                    <div className="flex items-center gap-1 text-gray-700">
                      <Activity size={16} className="animate-pulse" />
                      <span className="text-xs">Processing</span>
                    </div>
                  )}
                  {/* Camera Selector */}
                  {cameras.length > 1 && (
                    <div className="relative">
                      <button
                        onClick={() => setShowCameraMenu(!showCameraMenu)}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-black text-white rounded-lg text-sm transition-all"
                      >
                        <Video size={16} />
                        {selectedCamera ? getCameraLabel(selectedCamera) : 'Select Camera'}
                        <ChevronDown size={16} />
                      </button>
                      
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
                              {camera.label && (
                                <div className="text-xs text-gray-600 truncate">
                                  {camera.deviceId.substring(0, 20)}...
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Video Container */}
              <div className="relative bg-black rounded-xl overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-auto max-h-96 object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* Overlay Info */}
                {isStreaming && (
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg">
                    Recording...
                  </div>
                )}
                
                {/* Camera Info Overlay */}
                {selectedCamera && isStreaming && (
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                    {getCameraLabel(selectedCamera)}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={isStreaming ? stopCamera : startCamera}
                  disabled={!isConnected}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    isStreaming
                      ? 'bg-gray-600 hover:bg-gray-700 text-white'
                      : 'bg-gray-800 hover:bg-black text-white'
                  } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isStreaming ? <Square size={20} /> : <Camera size={20} />}
                  {isStreaming ? 'Stop' : 'Start'} Camera
                </button>

                <button
                  onClick={resetSequence}
                  disabled={!isConnected}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>

                <button
                  onClick={debugFrame}
                  disabled={!isConnected || !isStreaming || isProcessing}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  <Info size={20} />
                  Debug
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Prediction Result */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Prediction</h3>
              
              {prediction ? (
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {prediction}
                  </div>
                  <div className={`text-lg font-medium ${getConfidenceColor(confidence)}`}>
                    {(confidence * 100).toFixed(1)}% confident
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No prediction yet
                </div>
              )}

              {/* Sequence Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Sequence Progress</span>
                  <span>{sequenceLength}/{modelInfo?.sequence_length || 30}</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div 
                    className="bg-gray-800 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getSequenceProgress()}%` }}
                  />
                </div>
              </div>
            </div>

            {/* All Predictions */}
            {Object.keys(allPredictions).length > 0 && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">All Predictions</h3>
                <div className="space-y-2">
                  {Object.entries(allPredictions)
                    .sort(([,a], [,b]) => b - a)
                    .map(([className, conf]) => (
                      <div key={className} className="flex justify-between items-center">
                        <span className="text-gray-900">{className}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-300 rounded-full h-2">
                            <div 
                              className="bg-gray-800 h-2 rounded-full"
                              style={{ width: `${conf * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12">
                            {(conf * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Model Info */}
            {modelInfo && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Model Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sequence Length:</span>
                    <span className="text-gray-900">{modelInfo.sequence_length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Features:</span>
                    <span className="text-gray-900">{modelInfo.feature_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Classes:</span>
                    <span className="text-gray-900">{modelInfo.num_classes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">LSTM Layers:</span>
                    <span className="text-gray-900">{modelInfo.lstm_layers?.length || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Debug Info */}
            {debugInfo && (
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200 shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Debug Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pose Detected:</span>
                    <span className={debugInfo.detection_info?.pose_detected ? 'text-gray-800' : 'text-gray-500'}>
                      {debugInfo.detection_info?.pose_detected ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Left Hand:</span>
                    <span className={debugInfo.detection_info?.left_hand_detected ? 'text-gray-800' : 'text-gray-500'}>
                      {debugInfo.detection_info?.left_hand_detected ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Right Hand:</span>
                    <span className={debugInfo.detection_info?.right_hand_detected ? 'text-gray-800' : 'text-gray-500'}>
                      {debugInfo.detection_info?.right_hand_detected ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Non-zero Features:</span>
                    <span className="text-gray-900">{debugInfo.features_non_zero}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SignLanguageRecognition;
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Play, Pause, RotateCcw, CheckCircle, Zap } from 'lucide-react';

const DetectPage = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSign, setDetectedSign] = useState('');
  const [confidence, setConfidence] = useState(0);

  const startDetection = async () => {
    setIsDetecting(true);
    setTimeout(() => {
      setDetectedSign("Hello");
      setConfidence(94);
    }, 2000);
  };

  const stopDetection = () => {
    setIsDetecting(false);
    setDetectedSign('');
    setConfidence(0);
  };

  const resetDetection = () => {
    setDetectedSign('');
    setConfidence(0);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Real-Time Sign Detection
          </CardTitle>
          <CardDescription className="text-blue-100">
            Show your sign to the camera for instant recognition
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden mb-4 relative">
            {/* Video placeholder */}
            <div className="w-full h-full flex items-center justify-center">
              {isDetecting ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Detecting signs...</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <Camera className="w-16 h-16 mx-auto mb-4" />
                  <p>Camera will appear here</p>
                </div>
              )}
            </div>
            
            {/* Detection Result Overlay */}
            {detectedSign && (
              <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg">
                <div className="text-lg font-bold">{detectedSign}</div>
                <div className="text-sm text-green-400">{confidence}% confidence</div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {!isDetecting ? (
              <Button onClick={startDetection} size="lg" className="bg-gradient-to-r from-green-600 to-green-700">
                <Play className="w-4 h-4 mr-2" />
                Start Detection
              </Button>
            ) : (
              <Button onClick={stopDetection} variant="destructive" size="lg">
                <Pause className="w-4 h-4 mr-2" />
                Stop Detection
              </Button>
            )}
            <Button onClick={resetDetection} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {detectedSign && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Great! You successfully signed "<strong>{detectedSign}</strong>" with {confidence}% accuracy!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Additional detection tips section */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Detection Tips</CardTitle>
          <CardDescription>Get the best results from the sign detector</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">1</Badge>
                Lighting
              </h3>
              <p className="text-sm text-gray-600">
                Ensure good lighting on your hands. Avoid backlighting or shadows.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">2</Badge>
                Hand Position
              </h3>
              <p className="text-sm text-gray-600">
                Keep your hands within the camera frame and make clear, distinct signs.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">3</Badge>
                Background
              </h3>
              <p className="text-sm text-gray-600">
                Use a plain background for better detection accuracy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectPage;
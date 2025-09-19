import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { FileText, Send, Clipboard, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface TextInputProps {
  onTextSubmit: (text: string) => void;
}

export function TextInput({ onTextSubmit }: TextInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('Please enter your medical report text');
      return;
    }
    
    if (text.trim().length < 50) {
      setError('Please enter more detailed medical report information (at least 50 characters)');
      return;
    }

    setError('');
    onTextSubmit(text.trim());
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      setError('');
    } catch (err) {
      setError('Unable to access clipboard. Please paste manually.');
    }
  };

  const handleExampleText = () => {
    const exampleText = `LABORATORY TEST RESULTS
Patient: John Doe
Date: ${new Date().toLocaleDateString()}

COMPLETE BLOOD COUNT (CBC):
- Hemoglobin: 10.2 g/dL (Reference Range: 12.0-16.0) [LOW]
- Hematocrit: 31% (Reference Range: 36-46%) [LOW]
- White Blood Cell Count: 8.5 ×10³/μL (Reference Range: 4.0-11.0) [NORMAL]
- Red Blood Cell Count: 4.1 ×10⁶/μL (Reference Range: 4.2-5.4) [LOW]
- Platelets: 250 ×10³/μL (Reference Range: 150-450) [NORMAL]

LIPID PROFILE:
- Total Cholesterol: 240 mg/dL (Reference Range: <200) [HIGH]
- HDL Cholesterol: 45 mg/dL (Reference Range: >40) [NORMAL]
- LDL Cholesterol: 160 mg/dL (Reference Range: <100) [HIGH]
- Triglycerides: 180 mg/dL (Reference Range: <150) [HIGH]

BASIC METABOLIC PANEL:
- Glucose: 95 mg/dL (Reference Range: 70-100) [NORMAL]
- Sodium: 140 mEq/L (Reference Range: 136-145) [NORMAL]
- Potassium: 4.0 mEq/L (Reference Range: 3.5-5.0) [NORMAL]
- Creatinine: 1.0 mg/dL (Reference Range: 0.6-1.2) [NORMAL]`;
    
    setText(exampleText);
    setError('');
  };

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-800">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          Enter Medical Report Text
        </CardTitle>
        <p className="text-gray-600 mt-2">
          Copy and paste your medical report or lab results
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Text Input Area */}
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              placeholder="Paste your medical report here... Include test names, values, reference ranges, and any other relevant information from your lab results."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError('');
              }}
              className="min-h-[300px] resize-none border-2 border-gray-200 focus:border-blue-400 rounded-xl text-sm leading-relaxed"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {text.length} characters
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Button
            onClick={handlePaste}
            variant="outline"
            className="w-full sm:w-auto bg-white/60 hover:bg-white border-gray-300"
          >
            <Clipboard className="w-4 h-4 mr-2" />
            Paste from Clipboard
          </Button>
          
          <Button
            onClick={handleExampleText}
            variant="outline"
            className="w-full sm:w-auto bg-white/60 hover:bg-white border-gray-300"
          >
            <FileText className="w-4 h-4 mr-2" />
            Use Example
          </Button>

          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={!text.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5 mr-2" />
            Analyze Report
          </Button>
        </div>

        {/* Helper Text */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-3">💡 Tips for better analysis:</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Include test names, values, units, and reference ranges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Copy the complete lab report for comprehensive analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Include any flags like [HIGH], [LOW], or [CRITICAL] if present</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-1">•</span>
              <span>Patient information and dates help provide context</span>
            </li>
          </ul>
        </div>

        {/* Additional Info */}
        <div className="text-center pt-4 border-t border-gray-200">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <span>• Supports all lab report formats</span>
            <span>• Processing time: ~15 seconds</span>
            <span>• Text is processed securely</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
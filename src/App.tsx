import { useState, useRef } from 'react';
import { InputSelector } from './components/InputSelector';
import { ProcessingFlow } from './components/ProcessingFlow';
import { MedicalResults } from './components/MedicalResults';
import { EnhancedHero } from './components/EnhancedHero';
import { FloatingAssistant } from './components/FloatingAssistant';
import { SDGBadges } from './components/SDGBadges';
import { analyzeWithGemini, parseImageContent, parsePDFContent, GeminiAnalysisResult } from './utils/geminiApi';
import { toast } from 'sonner@2.0.3';

interface ProcessingState {
  step: 'input' | 'parse' | 'analyze' | 'complete';
  file: File | null;
  inputType: 'file' | 'text' | null;
  fileType: 'pdf' | 'image' | null;
  textContent: string | null;
  analysis: GeminiAnalysisResult | null;
}

export default function App() {
  const [processing, setProcessing] = useState<ProcessingState>({
    step: 'input',
    file: null,
    inputType: null,
    fileType: null,
    textContent: null,
    analysis: null
  });
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = async (file: File, fileType: 'pdf' | 'image') => {
    setProcessing({
      step: fileType === 'pdf' ? 'parse' : 'analyze',
      file,
      inputType: 'file',
      fileType,
      textContent: null,
      analysis: null
    });

    try {
      let content: string;

      if (fileType === 'pdf') {
        toast.info('Extracting medical data from PDF...');
        content = await parsePDFContent(file);
        
        setProcessing(prev => ({ ...prev, step: 'analyze' }));
        toast.info('Creating patient-friendly analysis...');
      } else {
        toast.info('Processing medical report image and creating patient-friendly analysis...');
        content = await parseImageContent(file);
      }

      const analysis = await analyzeWithGemini(content, fileType === 'image');
      
      setProcessing(prev => ({
        ...prev,
        step: 'complete',
        analysis
      }));

      toast.success('Patient-friendly report ready!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Processing failed. Please try again.');
      handleReset();
    }
  };

  const handleTextSubmit = async (text: string) => {
    setProcessing({
      step: 'analyze',
      file: null,
      inputType: 'text',
      fileType: null,
      textContent: text,
      analysis: null
    });

    try {
      toast.info('Analyzing your medical report text...');
      
      const analysis = await analyzeWithGemini(text, false);
      
      setProcessing(prev => ({
        ...prev,
        step: 'complete',
        analysis
      }));

      toast.success('Patient-friendly report ready!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Processing failed. Please try again.');
      handleReset();
    }
  };

  const handleReset = () => {
    setProcessing({
      step: 'input',
      file: null,
      inputType: null,
      fileType: null,
      textContent: null,
      analysis: null
    });
  };

  const getDisplayName = () => {
    if (processing.inputType === 'file' && processing.file) {
      return processing.file.name;
    } else if (processing.inputType === 'text') {
      return 'Medical Report Text';
    }
    return '';
  };

  const getDisplayType = () => {
    if (processing.inputType === 'file' && processing.fileType) {
      return processing.fileType;
    } else if (processing.inputType === 'text') {
      return 'text' as const;
    }
    return 'text' as const;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Hero Section */}
        {processing.step === 'input' && (
          <EnhancedHero onScrollToFeatures={scrollToFeatures} />
        )}

        {/* Main Content */}
        <div ref={featuresRef} className="space-y-8">
          {processing.step === 'input' && (
            <InputSelector 
              onFileSelect={handleFileSelect} 
              onTextSubmit={handleTextSubmit}
            />
          )}

          {processing.step !== 'input' && processing.step !== 'complete' && (
            <ProcessingFlow 
              fileType={getDisplayType()} 
              currentStep={processing.step} 
            />
          )}

          {processing.step === 'complete' && processing.analysis && (
            <MedicalResults
              fileName={getDisplayName()}
              fileType={getDisplayType()}
              analysis={processing.analysis}
              onReset={handleReset}
            />
          )}
        </div>

        {/* SDG Information Section - only show on input step */}
        {processing.step === 'input' && (
          <div className="mt-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                Making Healthcare Accessible for All
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our mission aligns with the UN Sustainable Development Goals to ensure 
                equal access to healthcare information and reduce health inequalities.
              </p>
            </div>
            <SDGBadges variant="compact" />
          </div>
        )}
      </div>

      {/* Floating Healthcare Assistant */}
      <FloatingAssistant />
    </div>
  );
}
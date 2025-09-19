import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { CheckCircle, Clock, FileText, Image, Brain, Loader2 } from 'lucide-react';

interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  icon: React.ComponentType<{ className?: string }>;
}

interface ProcessingFlowProps {
  fileType: 'pdf' | 'image' | 'text';
  currentStep: string;
}

export function ProcessingFlow({ fileType, currentStep }: ProcessingFlowProps) {
  const pdfSteps: ProcessingStep[] = [
    { 
      id: 'upload', 
      name: 'Medical Report Upload', 
      description: 'File received and validated',
      status: 'completed', 
      icon: FileText 
    },
    { 
      id: 'parse', 
      name: 'Extract Medical Data', 
      description: 'Reading and parsing medical information',
      status: currentStep === 'upload' ? 'pending' : currentStep === 'parse' ? 'processing' : 'completed', 
      icon: Brain 
    },
    { 
      id: 'analyze', 
      name: 'AI Medical Analysis', 
      description: 'Creating patient-friendly explanations',
      status: currentStep === 'analyze' ? 'processing' : currentStep === 'complete' ? 'completed' : 'pending', 
      icon: Brain 
    },
    { 
      id: 'complete', 
      name: 'Report Ready', 
      description: 'Your simplified report is ready to view',
      status: currentStep === 'complete' ? 'completed' : 'pending', 
      icon: CheckCircle 
    },
  ];

  const imageSteps: ProcessingStep[] = [
    { 
      id: 'upload', 
      name: 'Medical Report Upload', 
      description: 'Image received and validated',
      status: 'completed', 
      icon: Image 
    },
    { 
      id: 'analyze', 
      name: 'AI Medical Analysis', 
      description: 'Processing image and creating explanations',
      status: currentStep === 'analyze' ? 'processing' : currentStep === 'complete' ? 'completed' : 'pending', 
      icon: Brain 
    },
    { 
      id: 'complete', 
      name: 'Report Ready', 
      description: 'Your simplified report is ready to view',
      status: currentStep === 'complete' ? 'completed' : 'pending', 
      icon: CheckCircle 
    },
  ];

  const textSteps: ProcessingStep[] = [
    { 
      id: 'input', 
      name: 'Text Input Received', 
      description: 'Medical report text received and validated',
      status: 'completed', 
      icon: FileText 
    },
    { 
      id: 'analyze', 
      name: 'AI Medical Analysis', 
      description: 'Processing text and creating patient-friendly explanations',
      status: currentStep === 'analyze' ? 'processing' : currentStep === 'complete' ? 'completed' : 'pending', 
      icon: Brain 
    },
    { 
      id: 'complete', 
      name: 'Report Ready', 
      description: 'Your simplified report is ready to view',
      status: currentStep === 'complete' ? 'completed' : 'pending', 
      icon: CheckCircle 
    },
  ];

  const steps = fileType === 'pdf' ? pdfSteps : fileType === 'image' ? imageSteps : textSteps;
  const progress = (steps.filter(step => step.status === 'completed').length / steps.length) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-800">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
            Processing Your {fileType === 'text' ? 'TEXT' : fileType.toUpperCase()} Report
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Please wait while we analyze your medical report
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-gray-100" 
            />
          </div>

          {/* Processing steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-8 bg-gray-200"></div>
                )}
                
                <div className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-500 ${
                  step.status === 'processing' ? 'bg-blue-50 border-2 border-blue-200 shadow-sm' :
                  step.status === 'completed' ? 'bg-green-50 border-2 border-green-200' :
                  'bg-gray-50 border-2 border-gray-100'
                }`}>
                  {/* Step icon */}
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                    step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                    step.status === 'processing' ? 'bg-blue-500 border-blue-500 text-white' :
                    'bg-gray-100 border-gray-300 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : step.status === 'processing' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        step.status === 'completed' ? 'text-green-700' :
                        step.status === 'processing' ? 'text-blue-700' :
                        'text-gray-500'
                      }`}>
                        {step.name}
                      </h3>
                      
                      {/* Status badge */}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        step.status === 'completed' ? 'bg-green-100 text-green-700' :
                        step.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {step.status === 'completed' ? '✓ Done' :
                         step.status === 'processing' ? '● Processing' :
                         '○ Pending'}
                      </span>
                    </div>
                    
                    <p className={`text-sm ${
                      step.status === 'processing' ? 'text-blue-600' :
                      step.status === 'completed' ? 'text-green-600' :
                      'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Estimated time */}
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-600">
              <Clock className="w-4 h-4 inline mr-1" />
              Estimated time remaining: {progress < 50 ? '20-30' : progress < 80 ? '10-15' : '5-10'} seconds
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
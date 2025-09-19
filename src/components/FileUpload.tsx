import { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Upload, File, Image, FileText, Camera, Plus } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, fileType: 'pdf' | 'image') => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const fileType = file.type;
    
    if (fileType === 'application/pdf') {
      onFileSelect(file, 'pdf');
    } else if (fileType.startsWith('image/')) {
      onFileSelect(file, 'image');
    } else {
      alert('Please select a PDF or image file');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold text-gray-800">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            Upload Your Medical Report
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Drag & drop your files or click to browse
          </p>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-400 bg-blue-50/50 scale-[1.02] shadow-lg' 
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Animated upload icon */}
            <div className="flex justify-center mb-6">
              <div className={`transition-transform duration-300 ${dragActive ? 'scale-110' : ''}`}>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                    <Plus className={`w-10 h-10 text-blue-600 transition-transform duration-300 ${dragActive ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {dragActive ? 'Drop your file here!' : 'Choose your medical report'}
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  We support lab reports, blood tests, CBC, lipid profiles, and more
                </p>
              </div>

              {/* File type examples */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-200">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">PDF Reports</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 rounded-full px-4 py-2 border border-green-200">
                  <Camera className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Photo/Scan</span>
                </div>
              </div>

              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  Browse Files
                </label>
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileInput}
              />
            </div>

            {/* Additional info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                <span>• Max file size: 10MB</span>
                <span>• Supports: PDF, JPG, PNG</span>
                <span>• Processing time: ~30 seconds</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
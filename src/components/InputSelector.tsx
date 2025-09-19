import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileUpload } from './FileUpload';
import { TextInput } from './TextInput';

interface InputSelectorProps {
  onFileSelect: (file: File, fileType: 'pdf' | 'image') => void;
  onTextSubmit: (text: string) => void;
}

export function InputSelector({ onFileSelect, onTextSubmit }: InputSelectorProps) {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white/60 backdrop-blur-sm border border-gray-200 shadow-sm">
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium"
          >
            📁 Upload File
          </TabsTrigger>
          <TabsTrigger 
            value="text" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white font-medium"
          >
            ✏️ Enter Text
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-0">
          <FileUpload onFileSelect={onFileSelect} />
        </TabsContent>
        
        <TabsContent value="text" className="mt-0">
          <TextInput onTextSubmit={onTextSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
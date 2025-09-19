import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { FileText, Download, RefreshCw } from 'lucide-react';

interface AnalysisResultsProps {
  fileName: string;
  fileType: 'pdf' | 'image';
  analysis: {
    summary: string;
    keyPoints: string[];
    sentiment: string;
    confidence: number;
    categories: string[];
  };
  onReset: () => void;
}

export function AnalysisResults({ fileName, fileType, analysis, onReset }: AnalysisResultsProps) {
  const downloadReport = () => {
    const reportContent = `
Document Analysis Report
=======================

File: ${fileName}
Type: ${fileType.toUpperCase()}
Analysis Date: ${new Date().toLocaleDateString()}

Summary:
${analysis.summary}

Key Points:
${analysis.keyPoints.map(point => `• ${point}`).join('\n')}

Sentiment: ${analysis.sentiment}
Confidence: ${(analysis.confidence * 100).toFixed(1)}%

Categories: ${analysis.categories.join(', ')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${fileName.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Analysis Results
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadReport}>
                <Download className="size-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" onClick={onReset}>
                <RefreshCw className="size-4 mr-2" />
                Analyze New File
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{fileType.toUpperCase()}</Badge>
            <span className="text-muted-foreground">{fileName}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-3">Summary</h3>
            <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3">Key Points</h3>
            <ul className="space-y-2">
              {analysis.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="mb-2">Sentiment</h4>
              <Badge variant={
                analysis.sentiment.toLowerCase() === 'positive' ? 'default' :
                analysis.sentiment.toLowerCase() === 'negative' ? 'destructive' :
                'secondary'
              }>
                {analysis.sentiment}
              </Badge>
            </div>

            <div>
              <h4 className="mb-2">Confidence</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {(analysis.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div>
              <h4 className="mb-2">Categories</h4>
              <div className="flex flex-wrap gap-1">
                {analysis.categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
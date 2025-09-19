import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { SDGBadges } from './SDGBadges';
import { Heart, Download, RefreshCw, AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown, Minus, Award, Target } from 'lucide-react';

interface MedicalTest {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  explanation: string;
  recommendation?: string;
}

interface MedicalResultsProps {
  fileName: string;
  fileType: 'pdf' | 'image' | 'text';
  analysis: {
    overallHealth: string;
    testResults: MedicalTest[];
    keyFindings: string[];
    recommendations: string[];
    urgentIssues: string[];
    confidence: number;
  };
  onReset: () => void;
}

export function MedicalResults({ fileName, fileType, analysis, onReset }: MedicalResultsProps) {
  const downloadReport = () => {
    const reportContent = `
Patient-Friendly Medical Report
==============================

File: ${fileName}
Analysis Date: ${new Date().toLocaleDateString()}

OVERALL HEALTH STATUS:
${analysis.overallHealth}

TEST RESULTS:
${analysis.testResults.map(test => `
${test.name}: ${test.value} ${test.unit} (Normal: ${test.normalRange})
Status: ${test.status.toUpperCase()}
What this means: ${test.explanation}
${test.recommendation ? `Recommendation: ${test.recommendation}` : ''}
`).join('\n')}

KEY FINDINGS:
${analysis.keyFindings.map(finding => `• ${finding}`).join('\n')}

RECOMMENDATIONS:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

${analysis.urgentIssues.length > 0 ? `
URGENT ISSUES REQUIRING ATTENTION:
${analysis.urgentIssues.map(issue => `• ${issue}`).join('\n')}
` : ''}

Note: This AI analysis is for educational purposes only. Always consult with your healthcare provider for medical advice.
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical_report_${fileName.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'high': return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'low': return <TrendingDown className="w-5 h-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Minus className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-50 text-green-700 border-green-200';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'low': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'critical': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getTestCardBorder = (status: string) => {
    switch (status) {
      case 'normal': return 'border-l-green-400';
      case 'high': return 'border-l-orange-400';
      case 'low': return 'border-l-yellow-400';
      case 'critical': return 'border-l-red-400';
      default: return 'border-l-blue-400';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800">
                <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                Your Medical Report - Simplified
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/60">{fileType.toUpperCase()}</Badge>
                <span className="text-gray-600 text-sm">{fileName}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={downloadReport} className="bg-white/60 hover:bg-white">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" onClick={onReset} className="bg-white/60 hover:bg-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Urgent Issues Alert */}
      {analysis.urgentIssues.length > 0 && (
        <Alert className="border-red-200 bg-red-50 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertDescription>
            <div className="space-y-3">
              <h4 className="font-semibold text-red-800 text-lg">⚠️ Urgent Issues Requiring Attention</h4>
              <ul className="space-y-2">
                {analysis.urgentIssues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
              <div className="p-3 bg-red-100 rounded-lg border border-red-200 mt-4">
                <p className="text-red-800 font-medium">
                  📞 Please contact your healthcare provider as soon as possible to discuss these results.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Overall Health Summary */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            Overall Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <p className="text-gray-700 leading-relaxed text-lg">{analysis.overallHealth}</p>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
            Your Test Results Explained
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {analysis.testResults.map((test, index) => (
              <div key={index} className={`bg-white border-2 border-l-4 ${getTestCardBorder(test.status)} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <h4 className="text-lg font-semibold text-gray-800">{test.name}</h4>
                  </div>
                  <Badge className={`${getStatusColor(test.status)} border font-medium px-3 py-1`}>
                    {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Your Value</p>
                    <p className="text-xl font-bold text-gray-800">{test.value} <span className="text-base font-normal text-gray-600">{test.unit}</span></p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Normal Range</p>
                    <p className="text-lg font-semibold text-gray-700">{test.normalRange}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h5 className="font-medium text-gray-800 mb-2">What this means:</h5>
                    <p className="text-gray-700">{test.explanation}</p>
                  </div>
                  
                  {test.recommendation && (
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <h5 className="font-medium text-blue-800 mb-2">💡 Recommendation:</h5>
                      <p className="text-blue-700">{test.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Findings & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-2 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full"></div>
              Key Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.keyFindings.map((finding, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{finding}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-teal-500 rounded-full"></div>
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
        <Info className="w-5 h-5 text-blue-600" />
        <AlertDescription>
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800">Important Medical Disclaimer</h4>
            <p className="text-blue-700">
              This AI analysis is for educational purposes only and should not replace professional medical advice. 
              Always consult with your healthcare provider for proper medical interpretation, diagnosis, and treatment decisions.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
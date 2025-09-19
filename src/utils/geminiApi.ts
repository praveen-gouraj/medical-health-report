// Gemini API integration
const GEMINI_API_KEY = 'AIzaSyDgKjiPYTklh4gAQDx72AaSP9ccA1qMhc0';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface MedicalTest {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  explanation: string;
  recommendation?: string;
}

export interface GeminiAnalysisResult {
  overallHealth: string;
  testResults: MedicalTest[];
  keyFindings: string[];
  recommendations: string[];
  urgentIssues: string[];
  confidence: number;
}

export async function analyzeWithGemini(content: string, isImage: boolean = false): Promise<GeminiAnalysisResult> {
  try {
    const prompt = `
You are a medical AI assistant that helps patients understand their medical test reports in simple, non-technical language. 

Analyze the following ${isImage ? 'medical report image' : 'medical report text'} and provide:

1. Overall health summary in patient-friendly language
2. Individual test results with explanations (extract actual values, units, and normal ranges if available)
3. Key findings in simple terms
4. Actionable recommendations
5. Any urgent issues that need immediate medical attention
6. Your confidence level (0-1) in this analysis

For each test result, provide a CONCISE explanation in this exact format:
"Your [test name] is [value] [unit] (normal: [range]) => [status in caps] => [brief medical implication]"

Examples:
- "Your hemoglobin is 10.2 g/dL (normal: 12-16) => LOW => possible anemia"
- "Your cholesterol is 240 mg/dL (normal: <200) => HIGH => increased heart disease risk"
- "Your glucose is 95 mg/dL (normal: 70-100) => NORMAL => good blood sugar control"

Keep explanations under 10 words after the "=>" arrow.

Content to analyze:
${content}

Please respond in JSON format with the following structure:
{
  "overallHealth": "Brief overall health summary in patient-friendly language",
  "testResults": [
    {
      "name": "Test Name",
      "value": "Test Value",
      "unit": "Unit",
      "normalRange": "Normal Range",
      "status": "normal/high/low/critical",
      "explanation": "Concise explanation in the format specified above",
      "recommendation": "Optional specific recommendation"
    }
  ],
  "keyFindings": ["Finding 1", "Finding 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "urgentIssues": ["Urgent issue if any"],
  "confidence": 0.85
}

Make sure all explanations follow the exact format: "Your [test] is [value] [unit] (normal: [range]) => [STATUS] => [brief implication]"
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Try to parse the JSON response
    try {
      const analysisResult = JSON.parse(generatedText);
      return {
        overallHealth: analysisResult.overallHealth || 'Medical report analysis completed.',
        testResults: Array.isArray(analysisResult.testResults) ? analysisResult.testResults : [],
        keyFindings: Array.isArray(analysisResult.keyFindings) ? analysisResult.keyFindings : [],
        recommendations: Array.isArray(analysisResult.recommendations) ? analysisResult.recommendations : [],
        urgentIssues: Array.isArray(analysisResult.urgentIssues) ? analysisResult.urgentIssues : [],
        confidence: typeof analysisResult.confidence === 'number' ? analysisResult.confidence : 0.75
      };
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      return createMockMedicalAnalysis();
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    return createMockMedicalAnalysis();
  }
}

function createMockMedicalAnalysis(): GeminiAnalysisResult {
  return {
    overallHealth: "This is a demonstration with sample medical data. Your report shows a mix of normal and slightly abnormal values that would typically require follow-up with your healthcare provider.",
    testResults: [
      {
        name: "Hemoglobin",
        value: "10.2",
        unit: "g/dL",
        normalRange: "12.0-16.0",
        status: "low",
        explanation: "Your hemoglobin is 10.2 g/dL (normal: 12.0-16.0) => LOW => possible anemia",
        recommendation: "Eat iron-rich foods like spinach, red meat, and beans. Consider an iron supplement after consulting your doctor."
      },
      {
        name: "Total Cholesterol",
        value: "240",
        unit: "mg/dL",
        normalRange: "<200",
        status: "high",
        explanation: "Your cholesterol is 240 mg/dL (normal: <200) => HIGH => increased heart disease risk",
        recommendation: "Reduce saturated fats, exercise regularly, and consider discussing cholesterol medication with your doctor."
      },
      {
        name: "Blood Glucose",
        value: "95",
        unit: "mg/dL",
        normalRange: "70-100",
        status: "normal",
        explanation: "Your glucose is 95 mg/dL (normal: 70-100) => NORMAL => good blood sugar control",
      },
      {
        name: "White Blood Cell Count",
        value: "8.5",
        unit: "×10³/μL",
        normalRange: "4.0-11.0",
        status: "normal",
        explanation: "Your WBC count is 8.5 ×10³/μL (normal: 4.0-11.0) => NORMAL => healthy immune system",
      }
    ],
    keyFindings: [
      "Hemoglobin levels are below normal range, suggesting possible anemia",
      "Cholesterol levels are elevated, increasing cardiovascular risk",
      "Blood sugar and immune markers appear healthy",
      "Overall results suggest need for dietary changes and follow-up"
    ],
    recommendations: [
      "Schedule a follow-up appointment with your doctor to discuss the low hemoglobin",
      "Start a heart-healthy diet to address high cholesterol",
      "Consider adding iron-rich foods to your diet",
      "Maintain regular exercise routine",
      "Monitor blood pressure regularly"
    ],
    urgentIssues: [],
    confidence: 0.5
  };
}

export async function parseImageContent(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // For demo purposes, return a mock medical report
      resolve(`Medical Report Image: ${file.name} - CBC Test Results

Complete Blood Count (CBC):
- Hemoglobin: 10.2 g/dL (Normal: 12.0-16.0)
- White Blood Cell Count: 8.5 ×10³/μL (Normal: 4.0-11.0)
- Red Blood Cell Count: 4.1 ×10⁶/μL (Normal: 4.2-5.4)
- Platelets: 250 ×10³/μL (Normal: 150-450)

Lipid Profile:
- Total Cholesterol: 240 mg/dL (Normal: <200)
- HDL Cholesterol: 45 mg/dL (Normal: >40)
- LDL Cholesterol: 160 mg/dL (Normal: <100)
- Triglycerides: 180 mg/dL (Normal: <150)

Basic Metabolic Panel:
- Glucose: 95 mg/dL (Normal: 70-100)
- Sodium: 140 mEq/L (Normal: 136-145)
- Potassium: 4.0 mEq/L (Normal: 3.5-5.0)

This would normally contain extracted text from medical report images using OCR or vision AI.`);
    };
    reader.readAsDataURL(file);
  });
}

export async function parsePDFContent(file: File): Promise<string> {
  return new Promise((resolve) => {
    // Mock PDF parsing with medical content
    setTimeout(() => {
      resolve(`Medical Report PDF: ${file.name}

LABORATORY TEST RESULTS
Patient: [Demo Patient]
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
- Creatinine: 1.0 mg/dL (Reference Range: 0.6-1.2) [NORMAL]

ADDITIONAL TESTS:
- Vitamin D: 18 ng/mL (Reference Range: 30-100) [LOW]
- B12: 200 pg/mL (Reference Range: 300-900) [LOW]

In a real implementation, this would use LlamaParse or another PDF parsing service to extract actual medical report content.`);
    }, 2000);
  });
}

export async function analyzeHealthcareQuestion(question: string): Promise<string> {
  try {
    const prompt = `
You are a knowledgeable healthcare assistant focused on patient education and general health information. 
Your role is to provide helpful, accurate, and understandable health information while always emphasizing 
that you cannot replace professional medical advice.

IMPORTANT GUIDELINES:
- Provide educational information only
- Always remind users to consult healthcare professionals for medical advice
- Focus on general health knowledge and medical terminology explanations
- Be empathetic and supportive
- Use simple, patient-friendly language
- Include relevant health tips when appropriate
- Mention when something requires immediate medical attention
- Support SDG 3 (Good Health and Well-being) by promoting health literacy

Question: ${question}

Please provide a helpful, informative response that educates the user while maintaining appropriate medical disclaimers.
Keep the response conversational, empathetic, and under 200 words.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    return generatedText;
  } catch (error) {
    console.error('Healthcare question analysis error:', error);
    return "I apologize, but I'm having trouble processing your question right now. For any health concerns, please consult with your healthcare provider who can give you personalized medical advice based on your specific situation and medical history.";
  }
}
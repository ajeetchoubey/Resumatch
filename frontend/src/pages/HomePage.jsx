import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import JDInput from '../components/JDInput';

export default function HomePage() {
    const [resumeFile, setResumeFile] = useState(null);
    const [jdText, setJdText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleAnalyze = async () => {
        if (!resumeFile || !jdText.trim()) {
            alert('Please upload a resume and paste a job description');
            return;
        }

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('file', resumeFile);
            formData.append('jdText', jdText);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setAnalysisResult(data.analysis);
            } else {
                alert(data.error || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Failed to analyze resume');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            {/* Header */}
            <header className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-5xl font-bold gradient-text mb-4">
                    Resumatch
                </h1>
                <p className="text-gray-400 text-lg">
                    AI-powered resume optimization for your dream job
                </p>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto">
                {!analysisResult ? (
                    <div className="glass rounded-2xl p-8 space-y-8">
                        {/* Upload Section */}
                        <FileUpload file={resumeFile} onFileChange={setResumeFile} />

                        {/* JD Input Section */}
                        <JDInput value={jdText} onChange={setJdText} />

                        {/* Analyze Button */}
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !resumeFile || !jdText.trim()}
                            className="w-full py-4 px-6 rounded-xl font-semibold text-white
                bg-gradient-to-r from-purple-600 to-pink-600
                hover:from-purple-500 hover:to-pink-500
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 transform hover:scale-[1.02]
                shadow-lg shadow-purple-500/25"
                        >
                            {isAnalyzing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : (
                                'Analyze & Optimize'
                            )}
                        </button>
                    </div>
                ) : (
                    /* Results Section */
                    <div className="glass rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Analysis Results</h2>
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                ← Start Over
                            </button>
                        </div>

                        {/* Match Score */}
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600">
                                <span className="text-4xl font-bold">{analysisResult.matchScore}%</span>
                            </div>
                            <p className="mt-4 text-gray-300">{analysisResult.summary}</p>
                        </div>

                        {/* Keywords */}
                        {analysisResult.keywordAnalysis && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-3">Keyword Analysis</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                        <h4 className="text-green-400 font-medium mb-2">✓ Matched Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.keywordAnalysis.matched?.map((kw, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-500/20 rounded text-sm">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                        <h4 className="text-red-400 font-medium mb-2">✗ Missing Keywords</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.keywordAnalysis.missing?.map((kw, i) => (
                                                <span key={i} className="px-2 py-1 bg-red-500/20 rounded text-sm">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Top Priorities */}
                        {analysisResult.topPriorities && (
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Top Priorities</h3>
                                <ul className="space-y-2">
                                    {analysisResult.topPriorities.map((priority, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-300">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-sm">
                                                {i + 1}
                                            </span>
                                            {priority}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

import { useRef } from 'react';

export default function FileUpload({ file, onFileChange }) {
    const fileInputRef = useRef(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && isValidFile(droppedFile)) {
            onFileChange(droppedFile);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && isValidFile(selectedFile)) {
            onFileChange(selectedFile);
        }
    };

    const isValidFile = (file) => {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a PDF or DOCX file');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return false;
        }
        return true;
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Your Resume
            </label>
            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-300
          ${file
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'
                    }
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {file ? (
                    <div className="flex items-center justify-center gap-3">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-left">
                            <p className="text-white font-medium">{file.name}</p>
                            <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onFileChange(null);
                            }}
                            className="ml-4 text-gray-400 hover:text-red-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <>
                        <svg className="mx-auto w-12 h-12 text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-300 mb-1">Drag & drop your resume here</p>
                        <p className="text-sm text-gray-500">or click to browse (PDF, DOCX, max 5MB)</p>
                    </>
                )}
            </div>
        </div>
    );
}

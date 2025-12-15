export default function JDInput({ value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Paste Job Description
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste the job description here..."
                rows={8}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700
          text-gray-100 placeholder-gray-500
          focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
          transition-all duration-300 resize-none"
            />
            <p className="mt-2 text-sm text-gray-500">
                {value.length > 0 ? `${value.split(/\s+/).filter(Boolean).length} words` : 'Paste the full job posting for best results'}
            </p>
        </div>
    );
}

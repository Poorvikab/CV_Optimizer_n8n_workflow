import { useCallback, useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface UploadFormProps {
  onSubmit: (file: File, role: string, location: string, workPref: string) => void;
}

const WORK_PREFS = ['Remote', 'Hybrid', 'On-site'] as const;

const UploadForm = ({ onSubmit }: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [workPref, setWorkPref] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isValid = file && role.trim() && location.trim() && workPref;

  const validateFile = (f: File): boolean => {
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are accepted');
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB');
      return false;
    }
    setError('');
    return true;
  };

  const handleFile = (f: File) => {
    if (validateFile(f)) setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragActive(false), []);

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-3 tracking-tight">
          AI CV <span className="text-primary">Optimizer</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload your resume and let AI tailor it for your dream role
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-6">
        {/* Drop Zone */}
        <div
          className={`drop-zone ${dragActive ? 'drop-zone-active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div className="text-left">
                <p className="text-foreground font-medium">{file.name}</p>
                <p className="text-muted-foreground text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="ml-2 p-1 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-1">
                Drop your CV here or <span className="text-primary">browse</span>
              </p>
              <p className="text-muted-foreground text-sm">PDF only, max 10MB</p>
            </>
          )}
        </div>

        {error && (
          <p className="text-destructive text-sm text-center">{error}</p>
        )}

        {/* Role Input */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Target Job Role
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Senior Frontend Developer"
            className="glass-input w-full px-4 py-3"
            maxLength={100}
          />
        </div>

        {/* Location Input */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Preferred Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. San Francisco, CA"
            className="glass-input w-full px-4 py-3"
            maxLength={100}
          />
        </div>

        {/* Work Preference Pills */}
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">
            Work Preference
          </label>
          <div className="flex gap-3">
            {WORK_PREFS.map((pref) => (
              <button
                key={pref}
                onClick={() => setWorkPref(pref)}
                className={`pill-selector flex-1 ${workPref === pref ? 'pill-selector-active' : ''}`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          disabled={!isValid}
          onClick={() => isValid && onSubmit(file, role.trim(), location.trim(), workPref)}
          className="btn-primary w-full text-lg py-4"
        >
          Optimize My CV
        </button>
      </div>
    </div>
  );
};

export default UploadForm;

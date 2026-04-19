import { CheckCircle2, Download, RotateCcw } from 'lucide-react';

interface SuccessPageProps {
  pdfUrl: string;
  onReset: () => void;
}

const SuccessPage = ({ pdfUrl, onReset }: SuccessPageProps) => {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'Optimized_CV.pdf';
    a.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up text-center">
      <div className="mb-8">
        <CheckCircle2 className="w-24 h-24 text-success mx-auto mb-6 animate-success-bounce" />
        <h2 className="font-heading text-4xl font-bold mb-3">
          Your Optimized CV is Ready!
        </h2>
        <p className="text-muted-foreground text-lg">
          Your CV has been tailored and enhanced by AI
        </p>
      </div>

      <div className="glass-card p-8 space-y-4">
        <button onClick={handleDownload} className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-3">
          <Download className="w-5 h-5" />
          Download CV
        </button>

        <button onClick={onReset} className="btn-secondary w-full flex items-center justify-center gap-3">
          <RotateCcw className="w-4 h-4" />
          Optimize Another CV
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;

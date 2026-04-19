import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorPageProps {
  onRetry: () => void;
}

const ErrorPage = ({ onRetry }: ErrorPageProps) => {
  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up text-center">
      <div className="mb-8">
        <AlertTriangle className="w-20 h-20 text-destructive mx-auto mb-6" />
        <h2 className="font-heading text-3xl font-bold mb-3">
          Something went wrong
        </h2>
        <p className="text-muted-foreground text-lg">
          We couldn't optimize your CV. Please try again.
        </p>
      </div>

      <div className="glass-card p-8">
        <button onClick={onRetry} className="btn-primary w-full flex items-center justify-center gap-3">
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;

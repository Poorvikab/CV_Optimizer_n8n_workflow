import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface LoadingStepsProps {
  isDone: boolean;
}

const STEPS = [
  { emoji: '📄', label: 'Extracting resume...', duration: 4000 },
  { emoji: '🔍', label: 'Parsing content...', duration: 5000 },
  { emoji: '💼', label: 'Searching LinkedIn jobs...', duration: 8000 },
  { emoji: '🤖', label: 'Analyzing 10 job descriptions...', duration: 12000 },
  { emoji: '⏳', label: 'Optimizing with AI...', duration: 10000 },
  { emoji: '✨', label: 'Finalizing your CV...', duration: Infinity },
];

const LoadingSteps = ({ isDone }: LoadingStepsProps) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isDone) {
      setCompletedSteps(STEPS.length);
      setProgress(100);
      return;
    }

    let currentStep = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const advanceStep = () => {
      if (currentStep < STEPS.length - 1) {
        currentStep++;
        setCompletedSteps(currentStep);
        if (currentStep < STEPS.length - 1) {
          timers.push(setTimeout(advanceStep, STEPS[currentStep].duration));
        }
      }
    };

    timers.push(setTimeout(advanceStep, STEPS[0].duration));

    return () => timers.forEach(clearTimeout);
  }, [isDone]);

  // Progress bar animation
  useEffect(() => {
    if (isDone) { setProgress(100); return; }
    const totalDuration = 45000;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min((elapsed / totalDuration) * 90, 90));
    }, 200);
    return () => clearInterval(interval);
  }, [isDone]);

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-in-up">
      <div className="text-center mb-10">
        <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
        <h2 className="font-heading text-3xl font-bold mb-2">Optimizing Your CV</h2>
        <p className="text-muted-foreground">This takes about 45 seconds</p>
      </div>

      <div className="glass-card p-6 md:p-8 space-y-4">
        {STEPS.map((step, i) => {
          const isCompleted = i < completedSteps;
          const isActive = i === completedSteps && !isDone;
          const isPending = i > completedSteps && !isDone;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 py-2 transition-all duration-500 ${
                isPending ? 'opacity-30' : 'opacity-100'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                {isCompleted || (isDone && i === STEPS.length - 1) ? (
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center animate-check">
                    <Check className="w-4 h-4 text-success-foreground" />
                  </div>
                ) : isActive ? (
                  <div className="w-6 h-6 rounded-full border-2 border-primary animate-pulse-slow" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-muted" />
                )}
              </div>
              <span className="text-lg">{step.emoji}</span>
              <span className={`font-medium ${isActive ? 'text-foreground' : isCompleted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          );
        })}

        {/* Progress bar */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-muted-foreground text-sm text-center mt-2">
            {Math.round(progress)}% complete
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSteps;

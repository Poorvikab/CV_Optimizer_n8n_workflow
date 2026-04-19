import { useState, useRef } from 'react';
import BackgroundOrbs from '@/components/BackgroundOrbs';
import UploadForm from '@/components/UploadForm';
import LoadingSteps from '@/components/LoadingSteps';
import SuccessPage from '@/components/SuccessPage';
import ErrorPage from '@/components/ErrorPage';

type AppState = 'form' | 'loading' | 'success' | 'error';

const WEBHOOK_URL = 'https://grover-poorvika.app.n8n.cloud/webhook-test/optimize-cv';

const Index = () => {
  const [state, setState] = useState<AppState>('form');
  const [pdfUrl, setPdfUrl] = useState('');
  const [fetchDone, setFetchDone] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (file: File, role: string, location: string, workPref: string) => {
    setState('loading');
    setFetchDone(false);

    const formData = new FormData();
    formData.append('data', file);
    formData.append('role', role);
    formData.append('location', location);
    formData.append('work_preference', workPref);

    try {
      abortRef.current = new AbortController();
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error('Request failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setFetchDone(true);

      // Small delay so last loading step shows checkmark
      setTimeout(() => setState('success'), 800);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setState('error');
      }
    }
  };

  const handleReset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl('');
    setFetchDone(false);
    setState('form');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <BackgroundOrbs />
      <main className="relative z-10 w-full">
        {state === 'form' && <UploadForm onSubmit={handleSubmit} />}
        {state === 'loading' && <LoadingSteps isDone={fetchDone} />}
        {state === 'success' && <SuccessPage pdfUrl={pdfUrl} onReset={handleReset} />}
        {state === 'error' && <ErrorPage onRetry={handleReset} />}
      </main>
    </div>
  );
};

export default Index;

import { useEffect, useRef, useState } from 'react';

type Line = { stream: string; text: string };

export function useLogs(sessionId: string | null) {
  const [lines, setLines] = useState<Line[]>([]);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    setLines([]);
    setFinished(false);
    setError(null);

    const url = `http://localhost:4000/api/logs/${sessionId}`;
    const es = new EventSource(url);
    esRef.current = es;

    const onLog = (ev: MessageEvent) => {
      try {
        const payload = JSON.parse(ev.data);
        setLines((prev) => [...prev, payload]);
      } catch (e) {
        setLines((prev) => [...prev, { stream: 'stdout', text: String(ev.data) }]);
      }
    };

    const onEnd = (ev: MessageEvent) => {
      try {
        const info = JSON.parse(ev.data);
        setLines((prev) => [...prev, { stream: 'meta', text: `Finished: ${JSON.stringify(info)}` }]);
      } catch {
        setLines((prev) => [...prev, { stream: 'meta', text: String(ev.data) }]);
      }
      setFinished(true);
      es.close();
    };

    es.addEventListener('log', onLog as EventListener);
    es.addEventListener('end', onEnd as EventListener);

    es.onerror = (err) => {
      console.error('SSE error', err);
      setError('Connection error');
    };

    return () => {
      es.removeEventListener('log', onLog as EventListener);
      es.removeEventListener('end', onEnd as EventListener);
      es.close();
      esRef.current = null;
    };
  }, [sessionId]);

  return { lines, finished, error } as const;
}

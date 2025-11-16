'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useUserData } from '@/store/userData.store';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRIT';
  message: string;
}

/* ------------------------------------------------- *
 *  Thresholds & timing
 * ------------------------------------------------- */
const THRESHOLDS = {
  rpm: { warn: 11000, crit: 11200 },
  speedKmh: { warn: 300, crit: 320 },
  throttlePct: { warn: 90, crit: 100 },
} as const;

const LOG_DEBOUNCE_MS = 1500;          // one log per metric per 1.5 s
const CRIT_PERSIST_MS = 10_000;        // critical toast stays 10 s

/* ------------------------------------------------- *
 *  Component
 * ------------------------------------------------- */
export default function VibrationLogMonitor() {
  const { Data } = useUserData();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef(0);

  /* ---- keep last time we logged *any* metric ---- */
  const lastLogRef = useRef<Record<'rpm' | 'speed' | 'throttle', number>>({
    rpm: 0,
    speed: 0,
    throttle: 0,
  });

  /* ---- keep track of active critical toasts ---- */
  const activeCritToast = useRef<Record<'rpm' | 'speed' | 'throttle', string | null>>({
    rpm: null,
    speed: null,
    throttle: null,
  });

  /* ------------------------------------------------- *
   *  Auto-scroll
   * ------------------------------------------------- */
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  /* ------------------------------------------------- *
   *  Helper: add a log line (debounced per metric)
   * ------------------------------------------------- */
  const addLog = useCallback(
    (level: LogEntry['level'], message: string, metric: keyof typeof lastLogRef.current) => {
      const now = Date.now();
      if (now - (lastLogRef.current[metric] ?? 0) < LOG_DEBOUNCE_MS) return;

      lastLogRef.current[metric] = now;

      const timestamp = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      setLogs((prev) => [
        ...prev.slice(-100),
        { id: seqRef.current++, timestamp, level, message },
      ]);
    },
    []
  );

  /* ------------------------------------------------- *
   *  Helper: show / update a persistent critical toast
   * ------------------------------------------------- */
  const handleCritical = useCallback(
    (metric: keyof typeof activeCritToast.current, message: string) => {
      const existingId = activeCritToast.current[metric];

      if (existingId) {
        // just update the text – toast stays alive
        toast.loading(message, { id: existingId });
      } else {
        // first time → create a toast that lives 10 s
        const id = toast.error(message, {
          duration: CRIT_PERSIST_MS,
          style: {
            background: '#7f1d1d',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          },
          icon: 'CRITICAL',
        });
        activeCritToast.current[metric] = id;
      }
    },
    []
  );

  /* ------------------------------------------------- *
   *  Clear critical toast when the condition is gone
   * ------------------------------------------------- */
  const clearCritical = useCallback((metric: keyof typeof activeCritToast.current) => {
    const id = activeCritToast.current[metric];
    if (id) {
      toast.dismiss(id);
      activeCritToast.current[metric] = null;
    }
  }, []);

  /* ------------------------------------------------- *
   *  Main processing effect – runs on every Data change
   * ------------------------------------------------- */
  useEffect(() => {
    const { RPM = 0, Speed = 0, Throttle = 0 } = Data ?? {};
    const now = Date.now();

    /* ---- RPM ---- */
    if (RPM > THRESHOLDS.rpm.warn) {
      addLog('WARN', `High RPM: ${RPM} > ${THRESHOLDS.rpm.warn}`, 'rpm');
    }
    if (RPM >= THRESHOLDS.rpm.crit) {
      handleCritical('rpm', `CRITICAL RPM: ${RPM} ≥ ${THRESHOLDS.rpm.crit} (sustained)`);
    } else {
      clearCritical('rpm');
    }

    /* ---- Speed ---- */
    if (Speed > THRESHOLDS.speedKmh.warn) {
      addLog('WARN', `High Speed: ${Speed} km/h > ${THRESHOLDS.speedKmh.warn}`, 'speed');
    }
    if (Speed >= THRESHOLDS.speedKmh.crit) {
      handleCritical('speed', `DANGER: Speed ${Speed} km/h ≥ ${THRESHOLDS.speedKmh.crit} (sustained)`);
    } else {
      clearCritical('speed');
    }

    /* ---- Throttle ---- */
    if (Throttle > THRESHOLDS.throttlePct.warn) {
      addLog('WARN', `High Throttle: ${Throttle}% > ${THRESHOLDS.throttlePct.warn}%`, 'throttle');
    }
    if (Throttle >= THRESHOLDS.throttlePct.crit) {
      handleCritical('throttle', `FULL THROTTLE: ${Throttle}% (sustained)`);
    } else {
      clearCritical('throttle');
    }
  }, [Data, addLog, handleCritical, clearCritical]);

  /* ------------------------------------------------- *
   *  Startup logs (once)
   * ------------------------------------------------- */
  useEffect(() => {
    addLog('INFO', 'Engine Safety Monitor Activated', 'rpm');
    addLog('INFO', 'User: @nags0x (IN)', 'rpm');
    addLog('INFO', `Time: ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`, 'rpm');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------- *
   *  Render
   * ------------------------------------------------- */
  return (
    <>
      <div className="flex flex-col h-96 bg-gray-900 text-gray-100 font-mono text-sm rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
          <h2 className="text-xl font-bold text-cyan-400">Engine Monitor Log</h2>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full font-bold">@nags0x</span>
            <span className="px-3 py-1 bg-green-600 text-white rounded-full font-bold">IN</span>
            <span className="text-gray-300 font-medium">
              {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })} IST
            </span>
          </div>
        </div>

        {/* Log Output */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black/40">
          {logs.length === 0 ? (
            <p className="text-gray-500 italic text-center">Initializing monitor...</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`animate-fade-in ${
                  log.level === 'CRIT'
                    ? 'text-red-400 animate-pulse'
                    : log.level === 'WARN'
                    ? 'text-orange-400'
                    : 'text-gray-300'
                }`}
              >
                <span className="font-bold text-gray-500">[ {log.timestamp} ]</span>{' '}
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                    log.level === 'CRIT'
                      ? 'bg-red-900/80 text-red-200'
                      : log.level === 'WARN'
                      ? 'bg-orange-900/80 text-orange-200'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {log.level}
                </span>{' '}
                <span className="text-gray-100">{log.message}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>

        {/* Footer */}
        <div className="p-3 text-center text-xs text-gray-500 border-t border-gray-700 bg-gray-800">
          {logs.length} events • November 16, 2025
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------- *
 *  Tiny fade-in animation (Tailwind)
 * ------------------------------------------------- */
const style = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fadeIn 0.25s ease-out forwards; }
`;
if (typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.textContent = style;
  document.head.appendChild(s);
}
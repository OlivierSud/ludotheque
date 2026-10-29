import { useCallback, useEffect, useRef, useState } from 'react';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: () => void;
      theme?: 'light' | 'dark' | 'auto';
    },
  ) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('turnstile')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('turnstile')), { once: true });
    document.head.append(script);
  });

  return scriptPromise;
}

export interface TurnstileState {
  readonly setContainer: (element: HTMLDivElement | null) => void;
  readonly configured: boolean;
  readonly ready: boolean;
  readonly failed: boolean;
  readonly reset: () => void;
}

export function useTurnstile(onToken: (token: string) => void): TurnstileState {
  const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '').trim();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (siteKey.length === 0 || container === null) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || window.turnstile === undefined) return;
        widgetId.current = window.turnstile.render(container, {
          sitekey: siteKey,
          callback: onToken,
          'expired-callback': () => onToken(''),
          'error-callback': () => setFailed(true),
          theme: 'light',
        });
        setReady(true);
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      if (widgetId.current !== null && window.turnstile !== undefined) {
        window.turnstile.remove(widgetId.current);
      }
      widgetId.current = null;
    };
  }, [siteKey, container, onToken]);

  const reset = useCallback(() => {
    if (widgetId.current !== null && window.turnstile !== undefined) {
      window.turnstile.reset(widgetId.current);
    }
  }, []);

  return {
    setContainer,
    configured: siteKey.length > 0,
    ready,
    failed,
    reset,
  };
}

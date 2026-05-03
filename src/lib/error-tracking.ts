type ErrorLevel = 'error' | 'warn' | 'info';

interface ErrorContext {
  level: ErrorLevel;
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

// Simple error tracking — replace with Sentry or similar in production.
// Logs to console in development, could POST to an endpoint in production.

export function captureError(error: Error | string, metadata?: Record<string, unknown>): void {
  const ctx: ErrorContext = {
    level: 'error',
    message: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    metadata,
  };

  if (process.env.NODE_ENV === 'production') {
    // In production: send to error tracking service
    // fetch('/api/errors', { method: 'POST', body: JSON.stringify(ctx) }).catch(() => {});
    console.error('[track]', ctx);
  } else {
    console.error('[track]', ctx);
  }
}

export function captureWarning(message: string, metadata?: Record<string, unknown>): void {
  const ctx: ErrorContext = { level: 'warn', message, metadata };
  if (process.env.NODE_ENV === 'production') {
    console.warn('[track]', ctx);
  } else {
    console.warn('[track]', ctx);
  }
}

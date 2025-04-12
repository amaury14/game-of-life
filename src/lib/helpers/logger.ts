/**
 * For monitoring in real-world apps we can consider tools like:
 * Sentry (error tracking + logs)
 * LogRocket, Datadog, New Relic (full logging + user session replay)
 * Browser’s built-in dev tools with sourcemaps
 */
// Handles logging features
export const log = {
    info: (...args: unknown[]) => {
        if (process.env.NODE_ENV === 'development') console.info('[INFO]', ...args);
    },
    warn: (...args: unknown[]) => {
        console.warn('[WARN]', ...args);
    },
    error: (...args: unknown[]) => {
        console.error('[ERROR]', ...args);
    }
};

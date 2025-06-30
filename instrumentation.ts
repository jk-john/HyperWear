import * as Sentry from '@sentry/nextjs';
import { assertEnvVars } from './lib/utils';

export async function register() {
  assertEnvVars();

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;

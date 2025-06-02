import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from '../../../backend/src/utils/auth';
export const authClient = createAuthClient({
  baseURL: 'http://localhost:5000',
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type User = typeof authClient.$Infer.Session.user;

import { createAuthClient } from 'better-auth/react';
import { inferAdditionalFields } from 'better-auth/client/plugins';
export const authClient = createAuthClient({
  baseURL: 'http://localhost:5000',
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: 'string',
          required: true,
        },
      },
    }),
  ],
});

export type User = typeof authClient.$Infer.Session.user;

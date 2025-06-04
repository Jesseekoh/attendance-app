export interface ITokenPayload {
  id: string;
  role: Role;
}

export type Role = 'student' | 'teacher' | 'admin';

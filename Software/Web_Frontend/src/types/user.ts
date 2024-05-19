export interface User {
  id: string | null;
  name?: string;
  avatar?: string | null;
  email?: string;

  [key: string]: unknown;
}

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  PAGE_URL: string;
  EVENT_NAME: string;
  EVENT_LOCATION: string;
  MAIL_FROM: string;
  REVIEWERS?: string;
  HOLD_DAYS: string;
  RESEND_API_KEY?: string;
  SESSION_SECRET?: string;
}

export type Status = 'pending' | 'approved' | 'denied' | 'expired' | 'cancelled';

export interface Slot {
  id: string;
  label: string;
  starts_at: string;
  ends_at: string;
}

export interface Application {
  id: string;
  created_at: string;
  slot_id: string;
  status: Status;
  company: string;
  name: string;
  role: string | null;
  email: string;
  phone: string | null;
  building: string;
  deck: string | null;
  decided_at: string | null;
  decided_by: string | null;
  cancel_token: string;
}

export const reviewers = (env: Env) =>
  (env.REVIEWERS ?? '').split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

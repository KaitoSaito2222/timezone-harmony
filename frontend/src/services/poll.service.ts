import axios from 'axios';
import api from '@/services/api';
import { createClient } from '@/lib/supabase/client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Polls are public (the link is the secret), so this client deliberately skips the
// authenticated `api` instance: its 401 handler would sign users out.
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export interface PollOption {
  id: string;
  startsAt: string;
  voters: string[];
}

export interface MeetingPoll {
  id: string;
  title: string;
  timezones: string[];
  durationMinutes: number;
  createdAt: string;
  expiresAt: string;
  options: PollOption[];
}

export interface OwnedPoll {
  id: string;
  title: string;
  createdAt: string;
}

export interface CreatePollInput {
  title: string;
  timezones: string[];
  durationMinutes: number;
  options: string[];
}

export const pollService = {
  // Anonymous users can create polls too. When signed in, the token is attached
  // so the server records the owner; any failure to read the session falls back to anonymous.
  async create(input: CreatePollInput): Promise<MeetingPoll> {
    let token: string | undefined;
    try {
      const { data: auth } = await createClient().auth.getSession();
      token = auth.session?.access_token;
    } catch {
      token = undefined;
    }
    const { data } = await publicApi.post<MeetingPoll>('/polls', input, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return data;
  },
  /** Signed-in only: polls owned by the current user. */
  async listMine(): Promise<OwnedPoll[]> {
    const { data } = await api.get<OwnedPoll[]>('/polls/mine');
    return data;
  },
  /** Signed-in only: attach anonymously created polls to the current user. */
  async claim(pollIds: string[]): Promise<void> {
    await api.post('/polls/claim', { pollIds });
  },
  async get(id: string): Promise<MeetingPoll> {
    const { data } = await publicApi.get<MeetingPoll>(`/polls/${id}`);
    return data;
  },
  async vote(id: string, voterName: string, optionIds: string[]): Promise<MeetingPoll> {
    const { data } = await publicApi.post<MeetingPoll>(`/polls/${id}/votes`, { voterName, optionIds });
    return data;
  },
};

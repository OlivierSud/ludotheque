import type { ColorKey, JeuDraft, LudothequeData, Option } from '@/types';
import { parseData } from '@/lib/parse';

const API_URL = (import.meta.env.VITE_API_URL ?? '').trim();
const TIMEOUT_MS = 15000;

export const apiConfigured = API_URL.length > 0;

export type ApiErrorCode =
  | 'not_configured'
  | 'network'
  | 'captcha'
  | 'validation'
  | 'rate_limited'
  | 'not_found'
  | 'server'
  | 'invalid_response';

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'ApiError';
    this.code = code;
  }
}

export interface WriteMeta {
  readonly token: string;
  readonly startedAt: number;
  readonly website: string;
}

function toErrorCode(value: unknown): ApiErrorCode {
  switch (value) {
    case 'captcha':
    case 'validation':
    case 'rate_limited':
    case 'not_found':
    case 'server':
      return value;
    default:
      return 'server';
  }
}

async function request(body?: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (!apiConfigured) throw new ApiError('not_configured');

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = body
      ? await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(body),
          signal: controller.signal,
        })
      : await fetch(`${API_URL}?action=data`, { signal: controller.signal });

    const json: unknown = await response.json();
    if (typeof json !== 'object' || json === null) throw new ApiError('invalid_response');
    return json as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('network');
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchData(): Promise<LudothequeData> {
  const raw = await request();
  const data = parseData(raw);
  if (data === null) throw new ApiError('invalid_response');
  return data;
}

function writeBody(
  action: string,
  meta: WriteMeta,
  extra: Record<string, unknown>,
): Record<string, unknown> {
  return {
    action,
    token: meta.token,
    startedAt: meta.startedAt,
    website: meta.website,
    ...extra,
  };
}

function assertOk(raw: Record<string, unknown>): string {
  if (raw['ok'] === true) {
    const id = raw['id'];
    return typeof id === 'string' ? id : '';
  }
  throw new ApiError(toErrorCode(raw['error']));
}

export async function createGame(jeu: JeuDraft, meta: WriteMeta): Promise<string> {
  const raw = await request(writeBody('createGame', meta, { jeu }));
  return assertOk(raw);
}

export async function updateGame(id: string, jeu: JeuDraft, meta: WriteMeta): Promise<void> {
  const raw = await request(writeBody('updateGame', meta, { id, jeu }));
  assertOk(raw);
}

export async function createOption(
  critereId: string,
  libelle: string,
  couleur: ColorKey,
  meta: WriteMeta,
): Promise<Option> {
  const raw = await request(writeBody('createOption', meta, { critereId, libelle, couleur }));
  const id = assertOk(raw);
  const ordre = typeof raw['ordre'] === 'number' ? raw['ordre'] : 0;
  return { id, libelle, couleur, ordre };
}

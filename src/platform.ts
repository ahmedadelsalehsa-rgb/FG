/**
 * Optional claude.ai Artifact runtime.
 *
 * When the app is published as a claude.ai Artifact, `window.claude.use()`
 * gives access to a shared database (so everyone the page is shared with sees
 * the same player list) and to file downloads. Opened anywhere else
 * (`npm run dev`, a static host, a saved file) these resolve to null and the
 * app falls back to browser localStorage and normal download links.
 */

export interface DbError {
  code: string;
  message: string;
}

export interface DocSnapshot {
  id: string;
  exists: boolean;
  data(): Record<string, unknown> | undefined;
}

export interface QuerySnapshot {
  docs: DocSnapshot[];
  metadata: { fromCache: boolean; hasPendingWrites: boolean };
}

export interface DocRef {
  set(data: Record<string, unknown>): Promise<void>;
  update(data: Record<string, unknown>): Promise<void>;
  delete(): Promise<void>;
}

export interface CollectionRef {
  doc(id?: string): DocRef;
  get(): Promise<QuerySnapshot>;
  onSnapshot(next: (snap: QuerySnapshot) => void, error?: (e: DbError) => void): () => void;
}

export interface SharedDb {
  collection(path: string): CollectionRef;
}

export interface Downloads {
  save(req: { filename: string; data: string | Blob }): Promise<unknown>;
}

interface UserApi {
  can(capability: string): Promise<boolean | null>;
}

interface ClaudeRuntime {
  use(name: string): Promise<unknown>;
}

function runtime(): ClaudeRuntime | null {
  const c = (window as unknown as { claude?: ClaudeRuntime }).claude;
  return c && typeof c.use === 'function' ? c : null;
}

async function use<T>(name: string): Promise<T | null> {
  try {
    return ((await runtime()?.use(name)) as T | null | undefined) ?? null;
  } catch {
    return null;
  }
}

export const getSharedDb = () => use<SharedDb>('db');
export const getDownloads = () => use<Downloads>('downloads');

/** true/false when the platform says whether this viewer may change shared data; null when unknown. */
export async function canWriteShared(): Promise<boolean | null> {
  const user = await use<UserApi>('user');
  if (!user) return null;
  try {
    return await user.can('data.write');
  } catch {
    return null;
  }
}

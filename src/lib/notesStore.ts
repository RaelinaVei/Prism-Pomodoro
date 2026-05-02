// Local-storage backed notes store.
// For "teachers" section we store an array of teacher entries; otherwise a flat list of note entries.

export interface NoteEntry {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
  pinned?: boolean;
}

export interface TeacherEntry {
  id: string;
  teacher: string;
  subjectTopic?: string;
  body: string;
  updatedAt: number;
  pinned?: boolean;
}

type AnyEntry = NoteEntry | TeacherEntry;

const key = (subject: string, section: string) => `prismic-notes:${subject}:${section}`;

export function loadEntries<T extends AnyEntry = NoteEntry>(subject: string, section: string): T[] {
  try {
    const raw = localStorage.getItem(key(subject, section));
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function saveEntries<T extends AnyEntry = NoteEntry>(
  subject: string,
  section: string,
  entries: T[],
) {
  localStorage.setItem(key(subject, section), JSON.stringify(entries));
}

export const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

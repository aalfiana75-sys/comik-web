export type MangaStatus = 'ongoing' | 'completed' | 'hiatus';

export interface Manga {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  status: MangaStatus;
  author: string | null;
  genres: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMangaInput {
  title: string;
  slug: string;
  description?: string;
  cover_url?: string;
  status: MangaStatus;
  author?: string;
  genres?: string[];
}

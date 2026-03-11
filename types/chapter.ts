export interface Chapter {
  id: string;
  manga_id: string;
  chapter_number: number;
  title: string | null;
  created_at: string;
}

export interface CreateChapterInput {
  manga_id: string;
  chapter_number: number;
  title?: string;
}

export interface Page {
  id: string;
  chapter_id: string;
  page_number: number;
  image_url: string;
  created_at: string;
}

export interface CreatePageInput {
  chapter_id: string;
  page_number: number;
  image_url: string;
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { CreatePageInput } from '@/types/page'

export async function addPagesToChapter(chapterId: string, pages: CreatePageInput[]) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pages')
    .insert(pages)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/manga/[id]/chapters/${chapterId}/pages`)
}

export async function deletePage(id: string, chapterId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/manga/[id]/chapters/${chapterId}/pages`)
}

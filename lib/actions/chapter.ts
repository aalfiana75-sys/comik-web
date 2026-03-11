'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { CreateChapterInput } from '@/types/chapter'

export async function createChapter(data: CreateChapterInput) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('chapters')
    .insert([data])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/manga/${data.manga_id}/chapters`)
  redirect(`/admin/manga/${data.manga_id}/chapters`)
}

export async function updateChapter(id: string, mangaId: string, data: Partial<CreateChapterInput>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('chapters')
    .update(data)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/manga/${mangaId}/chapters`)
  redirect(`/admin/manga/${mangaId}/chapters`)
}

export async function deleteChapter(id: string, mangaId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('chapters')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/manga/${mangaId}/chapters`)
}

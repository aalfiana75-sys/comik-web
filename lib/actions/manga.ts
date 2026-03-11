'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { CreateMangaInput } from '@/types/manga'

export async function createManga(data: CreateMangaInput) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('manga')
    .insert([data])

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/manga')
  redirect('/admin/manga')
}

export async function updateManga(id: string, data: Partial<CreateMangaInput>) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('manga')
    .update(data)
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/manga')
  revalidatePath(`/manga/${data.slug}`)
  redirect('/admin/manga')
}

export async function deleteManga(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('manga')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/manga')
}

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MangaForm from '@/components/admin/MangaForm'

export default async function EditMangaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: manga, error } = await supabase
    .from('manga')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !manga) {
    notFound()
  }

  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/manga" className="text-neutral-400 hover:text-white mb-6 inline-block transition">
          &larr; Back to Manager
        </Link>
        <h1 className="text-3xl font-bold mb-8">Edit Manga: {manga.title}</h1>
        <MangaForm manga={manga} />
      </div>
    </div>
  )
}

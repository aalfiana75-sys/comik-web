import Link from 'next/link'
import MangaForm from '@/components/admin/MangaForm'

export default function NewMangaPage() {
  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/manga" className="text-neutral-400 hover:text-white mb-6 inline-block transition">
          &larr; Back to Manager
        </Link>
        <h1 className="text-3xl font-bold mb-8">Add New Manga</h1>
        <MangaForm />
      </div>
    </div>
  )
}

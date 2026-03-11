import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { deleteManga } from '@/lib/actions/manga'
import type { Manga } from '@/types/manga'

export default async function AdminMangaPage() {
  const supabase = createClient()
  
  const { data: mangaList, error } = await supabase
    .from('manga')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="bg-neutral-900 min-h-screen p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manga Manager</h1>
            <p className="text-neutral-400">Manage your manga collection</p>
          </div>
          <Link 
            href="/admin/manga/new" 
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
          >
            Add New Manga
          </Link>
        </header>

        <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-xl border border-neutral-700">
          <table className="w-full text-left">
            <thead className="bg-neutral-700/50 text-neutral-300 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Manga</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {mangaList?.map((manga: Manga) => (
                <tr key={manga.id} className="hover:bg-neutral-700/30 transition">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-14 bg-neutral-700 rounded overflow-hidden">
                      {manga.cover_url && <img src={manga.cover_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <div className="font-bold">{manga.title}</div>
                      <div className="text-xs text-neutral-500">{manga.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      manga.status === 'ongoing' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {manga.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-400">
                    {new Date(manga.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link 
                      href={`/admin/manga/${manga.id}/edit`} 
                      className="text-neutral-300 hover:text-white transition underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteManga.bind(null, manga.id)} className="inline">
                      <button className="text-red-500 hover:text-red-400 transition underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!mangaList || mangaList.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                    No manga found. Click "Add New Manga" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createManga, updateManga } from '@/lib/actions/manga'
import type { Manga, CreateMangaInput, MangaStatus } from '@/types/manga'

interface Props {
  manga?: Manga;
}

export default function MangaForm({ manga }: Props) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateMangaInput>({
    title: manga?.title || '',
    slug: manga?.slug || '',
    description: manga?.description || '',
    cover_url: manga?.cover_url || '',
    status: manga?.status || 'ongoing',
    author: manga?.author || '',
    genres: manga?.genres || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (manga) {
        await updateManga(manga.id, formData)
      } else {
        await createManga(formData)
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const genres = e.target.value.split(',').map(g => g.trim()).filter(g => g !== '')
    setFormData(prev => ({ ...prev, genres }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-800 p-8 rounded-xl border border-neutral-700 max-w-2xl mx-auto shadow-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-neutral-300 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition"
            required
            placeholder="e.g. One Piece"
          />
        </div>
        
        <div>
          <label className="block text-sm font-bold text-neutral-300 mb-1">Slug (URL identifier)</label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
            className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition"
            required
            placeholder="e.g. one-piece"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-300 mb-1">Cover URL</label>
          <input
            type="text"
            value={formData.cover_url}
            onChange={(e) => setFormData(prev => ({ ...prev, cover_url: e.target.value }))}
            className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition"
            placeholder="https://..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-neutral-300 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as MangaStatus }))}
              className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="hiatus">Hiatus</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-neutral-300 mb-1">Author</label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
              className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition"
              placeholder="e.g. Eiichiro Oda"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-300 mb-1">Genres (comma separated)</label>
          <input
            type="text"
            defaultValue={formData.genres?.join(', ')}
            onBlur={handleGenreChange}
            className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition"
            placeholder="Action, Adventure, Fantasy"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-neutral-300 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-neutral-700 rounded-lg p-3 text-white border border-neutral-600 focus:border-red-500 focus:outline-none transition min-h-[120px]"
            placeholder="Enter manga description..."
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          manga ? 'Update Manga' : 'Create Manga'
        )}
      </button>
    </form>
  )
}

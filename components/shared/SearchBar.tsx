'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Psychological', 'Romance', 
  'Sci-Fi', 'Slice of Life', 'Supernatural', 'Thriller'
]

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [genre, setGenre] = useState(searchParams.get('genre') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'latest')

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (genre) params.set('genre', genre)
    if (sort) params.set('sort', sort)
    
    router.push(`/search?${params.toString()}`)
  }

  // Update search when filters change
  useEffect(() => {
    if (searchParams.get('genre') !== genre || searchParams.get('sort') !== sort) {
      handleSearch()
    }
  }, [genre, sort])

  return (
    <div className="w-full max-w-4xl mx-auto bg-neutral-800 p-4 rounded-2xl border border-neutral-700 shadow-xl">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
        {/* Title Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search manga title..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 px-11 text-white focus:ring-2 focus:ring-red-600 focus:outline-none transition"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
        </div>

        {/* Genre Filter */}
        <div className="w-full md:w-48">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition appearance-none"
          >
            <option value="">All Genres</option>
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="w-full md:w-48">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition appearance-none"
          >
            <option value="latest">Latest Update</option>
            <option value="az">A-Z Title</option>
            <option value="new">Newest Added</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg"
        >
          Search
        </button>
      </form>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { 
  BookOpen, 
  Layers, 
  Users as UserIcon, 
  Activity,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Fetch basic stats
  const [
    { count: mangaCount },
    { count: chaptersCount },
    { count: profilesCount }
  ] = await Promise.all([
    supabase.from('manga').select('*', { count: 'exact', head: true }),
    supabase.from('chapters').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    { label: 'Total Manga', value: mangaCount || 0, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Chapters', value: chaptersCount || 0, icon: Layers, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Total Users', value: profilesCount || 0, icon: UserIcon, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Active Sessions', value: '---', icon: Activity, color: 'text-red-500', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-neutral-400">Welcome back, Administrator. Here is a summary of your website.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/admin/manga/new" 
              className="flex items-center gap-3 p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition font-medium border border-neutral-700"
            >
              <div className="bg-red-600/10 p-2 rounded text-red-500"><BookOpen size={18} /></div>
              Add New Manga
            </Link>
            <Link 
              href="/admin/manga" 
              className="flex items-center gap-3 p-4 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition font-medium border border-neutral-700"
            >
              <div className="bg-blue-600/10 p-2 rounded text-blue-500"><Layers size={18} /></div>
              Manage Chapters
            </Link>
          </div>
        </div>

        {/* Latest Activity placeholder */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Updates</h2>
            <Link href="/admin/manga" className="text-sm text-red-500 hover:underline flex items-center gap-1 font-medium">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            <p className="text-center py-10 text-neutral-500 italic">No recent activity detected.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

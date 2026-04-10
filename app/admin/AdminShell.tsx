'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, BarChart3,
  LogOut, ChevronRight, Menu, X,
} from 'lucide-react'
import { useState } from 'react'
import { AdminModalProvider } from '@/components/admin/AdminModal'

const NAV = [
  { href: '/admin',           label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/pages',     label: 'Pages',      icon: FileText },
  { href: '/admin/analytics', label: 'Analytics',  icon: BarChart3 },
]

export default function AdminShell({ children, userEmail }: { children: React.ReactNode; userEmail: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <AdminModalProvider>
    <div className="min-h-screen flex bg-[#080c14]">

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-white/[0.06] bg-[#0c1120]">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-emerald-500/20">
              M
            </div>
            <div>
              <span className="text-[15px] font-bold text-white tracking-tight">Admin</span>
              <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Menu</p>
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                isActive(href)
                  ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-emerald-400 shadow-sm shadow-emerald-500/5'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-[18px] h-[18px]" />
              {label}
              {isActive(href) && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center text-emerald-400 text-xs font-bold ring-1 ring-emerald-500/20">
              {userEmail[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-white truncate">{userEmail}</p>
              <p className="text-[10px] text-slate-500 font-medium">Administrator</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Back to site
          </Link>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0c1120]/95 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">M</div>
          <span className="text-sm font-bold text-white">Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-slate-400 p-1">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 pt-14 bg-[#0c1120]/98 backdrop-blur-xl">
          <nav className="px-4 py-4 space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(href) ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 lg:pl-0 pt-14 lg:pt-0 overflow-auto">
        <div className="p-5 lg:p-8 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
    </AdminModalProvider>
  )
}

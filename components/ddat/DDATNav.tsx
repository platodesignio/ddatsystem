'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/ddat-system', label: 'Dashboard' },
  { href: '/ddat-system/cases', label: 'Cases' },
  { href: '/ddat-system/new', label: 'New Case' },
  { href: '/ddat-system/compare', label: 'Compare' },
  { href: '/ddat-system/reports', label: 'Reports' },
]

export function DDATNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-white/10 bg-[#0a1628]">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 h-14">
        <Link
          href="/"
          className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 mr-2 shrink-0"
        >
          ← DDAT System
        </Link>
        <div className="h-4 w-px bg-white/20" />
        {navLinks.map((link) => {
          const isActive =
            link.href === '/ddat-system'
              ? pathname === '/ddat-system'
              : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive ? 'text-white border-b-2 border-white pb-0.5' : 'text-gray-400 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

import { Search } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router'

import { Logo } from './Logo'
import { NAV_ITEMS } from './navItems'
import { ThemeToggle } from './ThemeToggle'

function TopBar() {
  return (
    <header className="bg-surface border-border sticky top-0 z-30 border-b">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 md:px-10 md:py-4">
        <Logo />
        <nav aria-label="Main" className="bg-background hidden gap-1 rounded-xl p-1 md:flex">
          {NAV_ITEMS.filter((i) => i.to !== '/you').map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface text-foreground shadow-sm'
                    : 'text-muted hover:text-foreground'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/explore"
          className="bg-background text-muted hover:text-foreground ml-auto hidden max-w-md flex-1 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm md:flex"
        >
          <Search className="size-4" aria-hidden />
          Search news
        </Link>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          <NavLink
            to="/you"
            aria-label="Your preferences"
            className="bg-foreground text-background hidden size-9 place-items-center rounded-full text-xs font-semibold md:grid"
          >
            You
          </NavLink>
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="bg-surface border-border fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t pt-2 pb-[max(env(safe-area-inset-bottom),0.75rem)] md:hidden"
    >
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `grid justify-items-center gap-1 text-[11px] ${isActive ? 'text-accent font-semibold' : 'text-muted'}`
          }
        >
          <Icon className="size-[22px]" aria-hidden />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppShell() {
  return (
    <>
      <a
        href="#main"
        className="bg-accent text-accent-foreground sr-only z-50 rounded-lg px-4 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <TopBar />
      <main id="main" className="mx-auto max-w-7xl px-4 pt-6 pb-28 md:px-10 md:pt-9 md:pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </>
  )
}

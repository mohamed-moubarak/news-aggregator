import { CircleUserRound, Newspaper, Search, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'For you', icon: Newspaper },
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/you', label: 'You', icon: CircleUserRound },
]

import { Link } from 'react-router'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Briefly home"
      className={`font-serif text-[26px] leading-none font-semibold tracking-tight ${className}`}
    >
      Briefly
      <span aria-hidden className="bg-accent ml-0.5 inline-block size-2 rounded-full" />
    </Link>
  )
}

import type { ReactNode } from 'react'

export function PageHeader({ title, aside }: { title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 md:mb-6">
      <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.02em] md:text-[40px]">
        {title}
      </h1>
      {aside && <p className="text-muted text-sm">{aside}</p>}
    </div>
  )
}

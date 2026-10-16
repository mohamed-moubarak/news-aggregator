import { Button, Skeleton } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'

import { Logo } from '@/components/layout/Logo'
import { OutletPicker } from '@/components/pickers/OutletPicker'
import { ToggleChip } from '@/components/ui/ToggleChip'
import { CATEGORIES, type CategoryId } from '@/domain'
import { usePreferences } from '@/features/preferences/preferencesStore'
import { useOutlets } from '@/hooks/useOutlets'
import { outletStyle } from '@/lib/outletColor'
import { DEFAULT_NEWSAPI_OUTLETS } from '@/providers/newsapi/newsApiProvider'
import { aggregator } from '@/services'

import { suggestAuthors } from './suggestAuthors'

const FEATURED_OUTLETS = ['the-guardian', 'the-new-york-times', ...DEFAULT_NEWSAPI_OUTLETS]

const toggle = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item]

const STEPS = [
  {
    title: 'What do you want to read about?',
    hint: 'Pick a few topics, or skip to see everything.',
  },
  { title: 'Pick the outlets you trust', hint: 'Your briefing mixes their latest stories.' },
  { title: 'Follow some writers', hint: 'Suggested from today’s stories in your picks.' },
] as const

function TopicsStep({
  value,
  onChange,
}: {
  value: CategoryId[]
  onChange: (v: CategoryId[]) => void
}) {
  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Topics">
      {CATEGORIES.map((c) => (
        <ToggleChip
          key={c.id}
          size="lg"
          selected={value.includes(c.id)}
          onToggle={() => onChange(toggle(value, c.id))}
        >
          {c.label}
        </ToggleChip>
      ))}
    </div>
  )
}

function OutletsStep({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const { data, isPending } = useOutlets()
  const [browseAll, setBrowseAll] = useState(false)
  const byId = new Map(data?.outlets.map((o) => [o.id, o]))
  const featured = FEATURED_OUTLETS.map((id) => byId.get(id)).filter((o) => o !== undefined)

  if (browseAll)
    return <OutletPicker label="All outlets" value={value} onChange={(v) => onChange(v ?? [])} />

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" role="group" aria-label="Outlets">
        {isPending
          ? Array.from({ length: 9 }, (_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)
          : featured.map((o) => {
              const selected = value.includes(o.id)
              return (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange(toggle(value, o.id))}
                  style={outletStyle(o.id)}
                  className={`flex min-h-12 items-center gap-2.5 rounded-xl border-[1.5px] px-3 text-left text-sm font-medium transition-colors ${
                    selected
                      ? 'border-accent bg-accent-soft'
                      : 'border-border bg-surface hover:bg-default'
                  }`}
                >
                  <span aria-hidden className="bg-spine h-6 w-2 shrink-0 rounded-sm" />
                  <span className="truncate">{o.name}</span>
                </button>
              )
            })}
      </div>
      <button
        type="button"
        onClick={() => setBrowseAll(true)}
        className="text-accent justify-self-start text-sm font-medium underline-offset-4 hover:underline"
      >
        Browse all {data?.outlets.length ?? ''} outlets
      </button>
    </div>
  )
}

function AuthorsStep({
  outletIds,
  categories,
  value,
  onChange,
}: {
  outletIds: string[]
  categories: CategoryId[]
  value: string[]
  onChange: (v: string[]) => void
}) {
  const query = {
    outletIds: outletIds.length ? outletIds : undefined,
    categories: categories.length ? categories : undefined,
  }
  const { data, isPending } = useQuery({
    queryKey: ['author-suggestions', query],
    queryFn: ({ signal }) => aggregator.search(query, signal),
    select: (r) => suggestAuthors(r.articles),
  })

  if (isPending) {
    return (
      <div className="flex flex-wrap gap-2.5" aria-busy="true" aria-label="Loading suggestions">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-32 rounded-full" />
        ))}
      </div>
    )
  }
  if (!data?.length) {
    return (
      <p className="text-muted text-sm">
        No suggestions right now. You can follow writers from any article.
      </p>
    )
  }
  return (
    <div className="flex flex-wrap gap-2.5" role="group" aria-label="Writers">
      {data.map((name) => (
        <ToggleChip
          key={name}
          size="lg"
          selected={value.includes(name)}
          onToggle={() => onChange(toggle(value, name))}
        >
          {name}
        </ToggleChip>
      ))}
    </div>
  )
}

const PICK_NOUNS = [
  ['topic', 'topics'],
  ['outlet', 'outlets'],
] as const

function continueLabel(step: number, picks: number): ReactNode {
  if (step === STEPS.length - 1) return 'Show my briefing'
  if (picks === 0) return step === 1 ? 'Use our picks' : 'Continue'
  const [one, many] = PICK_NOUNS[step]!
  return `Continue with ${picks} ${picks === 1 ? one : many}`
}

/** First-visit picker: topics → outlets → writers. Everything is optional. */
export function OnboardingPage() {
  const navigate = useNavigate()
  const completeOnboarding = usePreferences((s) => s.completeOnboarding)
  const [step, setStep] = useState(0)
  const [categories, setCategories] = useState<CategoryId[]>([])
  const [outletIds, setOutletIds] = useState<string[]>([])
  const [authors, setAuthors] = useState<string[]>([])

  const finish = (save: boolean) => {
    completeOnboarding(save ? { categories, outletIds, authors } : {})
    navigate('/', { replace: true, viewTransition: true })
  }
  const next = () => (step === STEPS.length - 1 ? finish(true) : setStep(step + 1))
  const { title, hint } = STEPS[step]!
  const picks = [categories, outletIds, authors][step]!.length

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5 pt-6 pb-[max(env(safe-area-inset-bottom),1.25rem)] md:pt-12">
      <header className="flex items-center justify-between">
        <Logo />
        <Button variant="ghost" onPress={() => finish(false)}>
          Skip
        </Button>
      </header>

      <div className="mt-8 flex gap-1.5" aria-hidden>
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-accent' : 'bg-border'}`}
          />
        ))}
      </div>

      <main className="mt-8 flex-1">
        <p className="text-muted text-sm">
          Step {step + 1} of {STEPS.length}
        </p>
        <h1 className="mt-1 font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.02em] md:text-[40px]">
          {title}
        </h1>
        <p className="text-muted mt-2 text-[15px]">{hint}</p>
        <div className="mt-7">
          {step === 0 && <TopicsStep value={categories} onChange={setCategories} />}
          {step === 1 && <OutletsStep value={outletIds} onChange={setOutletIds} />}
          {step === 2 && (
            <AuthorsStep
              outletIds={outletIds}
              categories={categories}
              value={authors}
              onChange={setAuthors}
            />
          )}
        </div>
      </main>

      <footer className="bg-background sticky bottom-0 mt-8 flex gap-2.5 py-3">
        {step > 0 && (
          <Button
            variant="secondary"
            className="h-12 rounded-xl px-5"
            onPress={() => setStep(step - 1)}
          >
            Back
          </Button>
        )}
        <Button className="h-12 flex-1 rounded-xl text-[15px]" onPress={next}>
          {continueLabel(step, picks)}
        </Button>
      </footer>
    </div>
  )
}

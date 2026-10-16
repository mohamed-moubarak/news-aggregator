import { Button } from '@heroui/react'
import type { ReactNode } from 'react'

import { CategoryPicker } from '@/components/pickers/CategoryPicker'
import { OutletPicker } from '@/components/pickers/OutletPicker'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Notice } from '@/components/ui/Notice'
import { PageHeader } from '@/components/ui/PageHeader'
import { AuthorsEditor } from '@/features/preferences/AuthorsEditor'
import { usePreferences } from '@/features/preferences/preferencesStore'
import { useOutlets } from '@/hooks/useOutlets'
import { MAX_SOURCES_PER_REQUEST } from '@/providers/newsapi/newsApiProvider'

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="bg-surface grid gap-4 rounded-xl p-5 md:p-6">
      <div>
        <h2 className="font-serif text-xl font-medium">{title}</h2>
        <p className="text-muted mt-1 text-sm">{hint}</p>
      </div>
      {children}
    </section>
  )
}

function ResetPreferences({ onReset }: { onReset: () => void }) {
  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" className="text-danger">
          Reset all preferences
        </Button>
      }
      title="Reset your preferences?"
      confirmLabel="Reset"
      cancelLabel="Keep them"
      onConfirm={onReset}
    >
      Your followed outlets, topics and authors will be cleared on this device, and your briefing
      goes back to our picks.
    </ConfirmDialog>
  )
}

export function ProfilePage() {
  const { outletIds, categories, setOutlets, setCategories, reset } = usePreferences()
  const { data } = useOutlets()
  const newsApiSelected =
    data?.outlets.filter((o) => o.provider === 'newsapi' && outletIds.includes(o.id)).length ?? 0

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Your feed" aside="Changes save automatically on this device" />
      <div className="grid gap-4">
        <Section
          title="Outlets"
          hint="Your briefing mixes stories from these outlets. Leave empty to use our picks."
        >
          {newsApiSelected > MAX_SOURCES_PER_REQUEST && (
            <Notice>
              You've picked {newsApiSelected} outlets served by NewsAPI. Only the first{' '}
              {MAX_SOURCES_PER_REQUEST} are searched at a time.
            </Notice>
          )}
          <OutletPicker
            label="Followed outlets"
            value={outletIds}
            onChange={(ids) => setOutlets(ids ?? [])}
          />
        </Section>
        <Section title="Topics" hint="Leave empty to see every topic.">
          <CategoryPicker
            label="Followed topics"
            value={categories}
            onChange={(ids) => setCategories(ids ?? [])}
          />
        </Section>
        <Section
          title="Authors"
          hint="Follow writers to see their latest stories in your briefing."
        >
          <AuthorsEditor />
        </Section>
        <div>
          <ResetPreferences onReset={reset} />
        </div>
      </div>
    </div>
  )
}

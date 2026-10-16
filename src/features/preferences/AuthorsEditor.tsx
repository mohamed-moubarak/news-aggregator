import { Button, Input, Label, TextField } from '@heroui/react'
import { X } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { usePreferences } from './preferencesStore'

/** Followed authors: add by name, remove individually. */
export function AuthorsEditor() {
  const authors = usePreferences((s) => s.authors)
  const followAuthor = usePreferences((s) => s.followAuthor)
  const unfollowAuthor = usePreferences((s) => s.unfollowAuthor)
  const [name, setName] = useState('')

  const add = (e: FormEvent) => {
    e.preventDefault()
    followAuthor(name)
    setName('')
  }

  return (
    <div className="grid gap-3">
      <form onSubmit={add} className="flex items-end gap-2">
        <TextField value={name} onChange={setName} className="flex-1">
          <Label className="text-sm font-semibold">Add an author</Label>
          <Input placeholder="e.g. Jane Doe" className="h-11" />
        </TextField>
        <Button type="submit" variant="secondary" className="h-11" isDisabled={!name.trim()}>
          Follow
        </Button>
      </form>
      {authors.length === 0 ? (
        <p className="text-muted text-sm">
          You're not following anyone yet. Use Follow on any article, or add a name above.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2" aria-label="Followed authors">
          {authors.map((a) => (
            <li key={a}>
              <button
                type="button"
                onClick={() => unfollowAuthor(a)}
                aria-label={`Unfollow ${a}`}
                className="bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium"
              >
                {a}
                <X className="size-3.5 opacity-70" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

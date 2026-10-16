import { Button } from '@heroui/react'
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/hooks/useTheme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  return (
    <Button isIconOnly variant="ghost" aria-label={label} onPress={toggle}>
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  )
}

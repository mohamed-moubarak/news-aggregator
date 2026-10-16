import { AlertDialog, Button } from '@heroui/react'
import type { ReactNode } from 'react'

interface ConfirmDialogProps {
  /** Element that opens the dialog (usually a Button). */
  trigger: ReactNode
  title: string
  children: ReactNode
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  tone?: 'danger' | 'accent'
}

/**
 * Confirmation for consequential actions. `placement="auto"` docks it to the
 * bottom as a sheet on phones and centres it as a modal on larger screens.
 */
export function ConfirmDialog({
  trigger,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  tone = 'danger',
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      {trigger}
      <AlertDialog.Backdrop isDismissable isKeyboardDismissDisabled={false}>
        <AlertDialog.Container placement="auto" size="sm">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status={tone} />
              <AlertDialog.Heading className="font-serif text-xl font-medium">
                {title}
              </AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <div className="text-muted text-sm leading-relaxed">{children}</div>
            </AlertDialog.Body>
            <AlertDialog.Footer className="grid grid-cols-2 gap-2.5 sm:flex">
              <Button slot="close" variant="tertiary" className="h-11 w-full sm:h-10 sm:w-auto">
                {cancelLabel}
              </Button>
              <Button
                slot="close"
                variant={tone === 'danger' ? 'danger' : 'primary'}
                onPress={onConfirm}
                className="h-11 w-full sm:h-10 sm:w-auto"
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  )
}

const MQ = '(max-width: 767px)'

function initOnce(root: HTMLElement): void {
  if (root.dataset.menuBound === '1') return
  root.dataset.menuBound = '1'

  const openBtn = root.querySelector<HTMLButtonElement>(
    '[data-mobile-nav-open]'
  )
  const dialog = root.querySelector<HTMLDialogElement>('#mobile-nav-dialog')
  const closeBtn = root.querySelector<HTMLButtonElement>(
    '[data-mobile-nav-close]'
  )

  if (!openBtn || !dialog) return

  const setOpen = (open: boolean) => {
    openBtn.setAttribute('aria-expanded', open ? 'true' : 'false')
    if (open) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }

  openBtn.addEventListener('click', () => {
    const next = !dialog.open
    setOpen(next)
  })

  closeBtn?.addEventListener('click', () => setOpen(false))

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) setOpen(false)
  })

  dialog.addEventListener('close', () => setOpen(false))

  dialog.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    a.addEventListener('click', () => setOpen(false))
  })
}

export function setupMobileMenu(): void {
  const root = document.getElementById('mobile-nav-root')
  if (!root) return

  const run = () => {
    if (!window.matchMedia(MQ).matches) return
    initOnce(root)
  }

  run()
  window.matchMedia(MQ).addEventListener('change', run)
}

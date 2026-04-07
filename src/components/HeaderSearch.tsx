/** @jsxImportSource solid-js */
import { createSignal, onCleanup, onMount, Show } from 'solid-js'
import { formatDate } from '@/utils/format-date'
import type { SearchPayload } from '@/lib/sanity/search-types'

function PopoverResults(props: { data: SearchPayload; onPick: () => void }) {
  const total = () => props.data.posts.length + props.data.projects.length
  return (
    <>
      <Show when={total() === 0}>
        <p class="px-2 py-6 text-center text-sm text-muted-foreground">
          No results for &ldquo;{props.data.query}&rdquo;.
        </p>
      </Show>
      <Show when={props.data.posts.length > 0}>
        <p class="px-2 pb-1 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Blog
        </p>
        <ul class="flex flex-col gap-0.5">
          {props.data.posts.map((post) => (
            <li>
              <a
                href={`/blog/${post.slug}`}
                data-astro-prefetch="hover"
                class="block rounded-md px-2 py-2 text-sm transition-colors hover:bg-secondary"
                onClick={() => props.onPick()}
              >
                <span class="font-medium">{post.title}</span>
                <span class="block text-xs text-muted-foreground">
                  {formatDate(post.date)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Show>
      <Show when={props.data.projects.length > 0}>
        <p class="px-2 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Projects
        </p>
        <ul class="flex flex-col gap-0.5">
          {props.data.projects.map((project) => {
            const href = project.url ?? project.github ?? '/projects'
            const external = Boolean(project.url ?? project.github)
            return (
              <li>
                <a
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  class="block rounded-md px-2 py-2 text-sm transition-colors hover:bg-secondary"
                  onClick={() => props.onPick()}
                >
                  <span class="font-medium">{project.title}</span>
                  {external && (
                    <span class="ml-1 text-xs text-muted-foreground">↗</span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </Show>
    </>
  )
}

async function fetchSearchJson(
  trimmed: string,
  signal: AbortSignal
): Promise<{ ok: true; data: SearchPayload } | { ok: false; message: string }> {
  const res = await fetch(
    `/api/search?q=${encodeURIComponent(trimmed.slice(0, 100))}`,
    { signal }
  )
  const body = (await res.json()) as SearchPayload | { error?: string }
  if (!res.ok) {
    const message =
      'error' in body && typeof body.error === 'string'
        ? body.error
        : 'Search failed.'
    return { ok: false, message }
  }
  if ('query' in body && 'posts' in body && 'projects' in body) {
    return { ok: true, data: body }
  }
  return { ok: false, message: 'Search failed.' }
}

export default function HeaderSearch() {
  const [open, setOpen] = createSignal(false)
  const [query, setQuery] = createSignal('')
  const [results, setResults] = createSignal<SearchPayload | null>(null)
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  let rootEl: HTMLDivElement | undefined
  let inputEl: HTMLInputElement | undefined
  let abortController: AbortController | undefined

  function clearInFlight() {
    abortController?.abort()
    abortController = undefined
  }

  async function runSearch(trimmed: string) {
    clearInFlight()
    abortController = new AbortController()
    const ac = abortController
    setLoading(true)
    try {
      const out = await fetchSearchJson(trimmed, ac.signal)
      if (abortController !== ac) return
      if (!out.ok) {
        setError(out.message)
        setResults(null)
        return
      }
      setError(null)
      setResults(out.data)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
      setError('Search temporarily unavailable.')
      setResults(null)
    } finally {
      if (abortController === ac) {
        setLoading(false)
        abortController = undefined
      }
    }
  }

  function submitSearch() {
    const trimmed = query().trim()
    if (trimmed.length < 2) {
      setError('Use at least 2 characters.')
      setResults(null)
      return
    }
    setError(null)
    void runSearch(trimmed)
  }

  function toggle() {
    const next = !open()
    setOpen(next)
    if (next) {
      requestAnimationFrame(() => inputEl?.focus())
    } else {
      clearInFlight()
      setLoading(false)
    }
  }

  function close() {
    if (!open()) return
    setOpen(false)
    clearInFlight()
    setLoading(false)
  }

  onMount(() => {
    const onDocPointerDown = (e: PointerEvent) => {
      if (!open()) return
      const t = e.target
      if (t instanceof Node && rootEl?.contains(t)) return
      close()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open()) {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('pointerdown', onDocPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    onCleanup(() => {
      document.removeEventListener('pointerdown', onDocPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
      clearInFlight()
    })
  })

  return (
    <div class="relative" ref={(el) => (rootEl = el)}>
      <button
        type="button"
        class="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
        aria-expanded={open()}
        aria-controls="header-search-popover"
        aria-label="Open search"
        onClick={() => toggle()}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      <Show when={open()}>
        <div
          id="header-search-popover"
          class="absolute right-0 top-full z-60 mt-2 w-[min(calc(100vw-2rem),22rem)] rounded-lg border bg-background text-foreground shadow-lg outline-none"
          role="dialog"
          aria-label="Search site"
        >
          <form
            class="p-3"
            onSubmit={(e) => {
              e.preventDefault()
              submitSearch()
            }}
          >
            <div class="flex gap-2">
              <input
                id="header-search-input"
                ref={(el) => (inputEl = el)}
                type="search"
                name="q"
                value={query()}
                maxlength={100}
                placeholder="Search posts & projects…"
                aria-label="Search posts and projects"
                class="h-10 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autocomplete="off"
                onInput={(e) => {
                  setQuery(e.currentTarget.value)
                  setResults(null)
                  setError(null)
                }}
              />
              <button
                type="submit"
                class="h-10 shrink-0 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Search
              </button>
            </div>
          </form>

          <div class="max-h-[min(60vh,20rem)] overflow-y-auto p-2">
            <Show when={loading()}>
              <p class="px-2 py-6 text-center text-sm text-muted-foreground">
                Searching…
              </p>
            </Show>
            <Show when={!loading() && error()}>
              <p class="px-2 py-4 text-center text-sm text-destructive">
                {error()}
              </p>
            </Show>
            <Show when={!loading() && !error() && results()}>
              <PopoverResults data={results()!} onPick={close} />
            </Show>
          </div>
        </div>
      </Show>
    </div>
  )
}

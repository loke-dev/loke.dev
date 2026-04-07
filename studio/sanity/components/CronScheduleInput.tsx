import cronstrue from 'cronstrue'
import type { StringInputProps } from 'sanity'

export function CronScheduleInput(props: StringInputProps) {
  const raw = typeof props.value === 'string' ? props.value.trim() : ''
  let readable: string | null = null
  if (raw) {
    try {
      readable = cronstrue.toString(raw, { use24HourTimeFormat: false })
    } catch {
      readable =
        'Could not parse this cron. Use five fields: minute hour day-of-month month weekday (UTC).'
    }
  }

  return (
    <div>
      {props.renderDefault(props)}
      {readable ? (
        <p
          style={{
            marginTop: '0.65rem',
            marginBottom: 0,
            fontSize: '0.8125rem',
            lineHeight: 1.45,
            color: 'var(--card-muted-fg-color)',
          }}
        >
          {readable} · UTC
        </p>
      ) : null}
    </div>
  )
}

import { Studio } from 'sanity'
import config from 'sanity.config'
import { Hydrated } from '@/components/hydrated'

export default function StudioPage() {
  return (
    <Hydrated>
      <Studio config={config} />
    </Hydrated>
  )
}

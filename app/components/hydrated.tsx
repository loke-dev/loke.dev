// https://remix.run/docs/en/main/guides/migrating-react-router-app
import { useEffect, useState, type PropsWithChildren } from 'react'

let isHydrating = true

export function Hydrated(props: PropsWithChildren) {
  const [isHydrated, setIsHydrated] = useState(!isHydrating)

  useEffect(() => {
    isHydrating = false
    setIsHydrated(true)
  }, [])

  return isHydrated && props.children ? props.children : null
}

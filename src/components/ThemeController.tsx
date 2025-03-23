'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function ThemeController() {
  const [isdark, setIsdark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedValue = localStorage.getItem('isdark')
    if (storedValue !== null) {
      setIsdark(JSON.parse(storedValue))
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('isdark', JSON.stringify(isdark))
    }
  }, [isdark, mounted])

  return (
    <div className="">
      <label className="toggle text-base-content">
        <input
          onChange={() => setIsdark(!isdark)}
          checked={isdark}
          type="checkbox"
          value="lokelight"
          className="theme-controller"
        />
        <Sun />
        <Moon />
      </label>
    </div>
  )
}

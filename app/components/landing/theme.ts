export type GradientTheme = {
  from: string
  to: string
  accent?: string
  text: {
    primary: string
    secondary: string
  }
}

export type ThemeOptions = {
  hero: GradientTheme
  code: GradientTheme
  frameworks: GradientTheme
  responsive: GradientTheme
  particles: GradientTheme
}

export const defaultTheme: ThemeOptions = {
  hero: {
    from: 'from-black',
    to: 'to-indigo-950',
    accent: 'blue-500',
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300',
    },
  },
  code: {
    from: 'from-indigo-950',
    to: 'to-slate-900',
    accent: 'blue-500',
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300',
    },
  },
  frameworks: {
    from: 'from-slate-900',
    to: 'to-violet-950',
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300',
    },
  },
  responsive: {
    from: 'from-violet-950',
    to: 'to-blue-950',
    text: {
      primary: 'text-white',
      secondary: 'text-slate-300',
    },
  },
  particles: {
    from: 'from-blue-950',
    to: 'to-black',
    accent: 'blue-500',
    text: {
      primary: 'text-white',
      secondary: 'text-blue-200',
    },
  },
}

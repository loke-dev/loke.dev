function getEnvVar(name: string, fallback: string): string {
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[name] || process.env[`VITE_${name}`]
    if (value) return value
  }
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const env = import.meta.env as Record<string, string | undefined>
    const value = env[name] || env[`VITE_${name}`]
    if (value) return value
  }
  return fallback
}

export const projectId = getEnvVar('SANITY_PROJECT_ID', 'l25uat4p')
export const dataset = getEnvVar('SANITY_DATASET', 'production')
export const apiVersion = '2024-01-01'

export const useCdn =
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') ||
  (typeof import.meta !== 'undefined' &&
    (import.meta.env as { PROD?: boolean })?.PROD === true) ||
  false

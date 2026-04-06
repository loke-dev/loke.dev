import { GoogleGenAI } from '@google/genai'

export const FLASH_MODEL = 'gemini-3.1-flash-lite-preview'
export const PRO_MODEL = 'gemini-3.1-pro-preview'
export const IMAGE_MODEL = 'imagen-4.0-generate-001'

let _client: GoogleGenAI | null = null

export function getGenAI(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set')
    _client = new GoogleGenAI({ apiKey })
  }
  return _client
}

export function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateKey(): string {
  return Math.random().toString(36).substring(2, 15)
}

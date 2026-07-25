/**
 * Serializes JSON for an inline `application/ld+json` script without allowing
 * JSON string values to terminate the script element.
 */
export function serializeJsonLd(value: unknown): string {
  return (JSON.stringify(value) ?? '')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

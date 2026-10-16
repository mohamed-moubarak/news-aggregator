/** "2026-10-01" → "20261001" (NYT format). */
export const toCompactDate = (iso?: string) => iso?.replaceAll('-', '')

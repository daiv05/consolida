/**
 * Extracts a human-readable message from a failed $fetch call.
 *
 * @param {unknown} error Error thrown by $fetch.
 * @returns {string} Message to show to the user.
 */
export function apiErrorMessage(error: unknown): string {
  const e = error as { data?: { statusMessage?: string, message?: string }, statusMessage?: string, statusCode?: number }
  if (e?.statusCode === undefined && !e?.data) return 'No hay conexión con el servidor. Revisa tu internet.'
  return e.data?.message || e.data?.statusMessage || e.statusMessage || 'Algo salió mal. Vuelve a intentarlo.'
}

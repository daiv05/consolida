/**
 * Signs the user out, clears cached data and returns to the home page.
 *
 * @returns {() => Promise<void>} Sign-out action.
 */
export function useSignOut() {
  const { clear } = useUserSession()
  const tracker = useTracker()
  return async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
    tracker.reset()
    await navigateTo('/')
  }
}

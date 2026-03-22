/**
 * Client-side routes that should resolve to the SPA (index.html) when served by Express.
 * Keep in sync with React Router in frontend/src/App.jsx.
 */
export const SPA_EXACT_ROUTES = new Set([
  "/",
  "/calendar",
  "/login",
  "/signup",
])

const OPTION_DETAIL = /^\/options\/[^/]+$/

export function isSpaRoute(pathname) {
  if (SPA_EXACT_ROUTES.has(pathname)) return true
  if (OPTION_DETAIL.test(pathname)) return true
  return false
}

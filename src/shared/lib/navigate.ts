/**
 * Programmatic navigation utility.
 *
 * Inside React components prefer `useNavigate()` from react-router-dom.
 * This helper exists for the rare cases where navigation is needed
 * outside the React tree (e.g. httpClient 401 handler, auth context).
 */

type NavigateFn = (to: string) => void | Promise<void>;

let _navigate: NavigateFn | null = null;

export function registerNavigate(fn: NavigateFn) {
  _navigate = fn;
}

export function appNavigate(to: string) {
  if (_navigate) {
    void _navigate(to);
  } else {
    window.location.href = to;
  }
}

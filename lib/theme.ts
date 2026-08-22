export type Theme = "light" | "dark";

export const THEME_COOKIE_NAME = "tsj-theme";
export const DEFAULT_THEME: Theme = "light";

export function parseTheme(value?: string | null): Theme {
  return value === "dark" ? "dark" : DEFAULT_THEME;
}

/**
 * Runs before React hydrates (inlined as a blocking <script> in the root
 * layout) so the correct theme class is on <html> before first paint —
 * no light-flash-then-dark flicker. Falls back to the cookie set by the
 * server, then to the OS preference for a first-ever visit.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var m = document.cookie.match(/(?:^|; )${THEME_COOKIE_NAME}=([^;]*)/);
    var stored = m ? decodeURIComponent(m[1]) : null;
    var theme = stored === "dark" || stored === "light"
      ? stored
      : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;
/**
 * Generates a <style> CSS string that overrides the site's theme CSS variables
 * with admin-set values from site_settings. Unset values fall back to whatever
 * is defined in app/globals.css.
 *
 * Keys consumed (all optional, all empty by default):
 *   - theme_accent_dark / theme_accent_light
 *   - theme_btn_dark    / theme_btn_light
 *   - theme_bg_dark     / theme_bg_light    (accepts solid color OR gradient)
 */

const THEME_KEYS = [
  'theme_accent_dark',
  'theme_btn_dark',
  'theme_bg_dark',
  'theme_accent_light',
  'theme_btn_light',
  'theme_bg_light',
] as const

export function hasThemeOverrides(settings: Record<string, string> | undefined): boolean {
  if (!settings) return false
  return THEME_KEYS.some((k) => typeof settings[k] === 'string' && settings[k].trim().length > 0)
}

/**
 * Minimal safety: strip `</style>` and `<script` tokens so a malformed value
 * can't break out of the <style> tag. Colors / gradients never legitimately
 * contain these tokens.
 */
function sanitize(value: string): string {
  return value.replace(/<\/?style[^>]*>/gi, '').replace(/<script/gi, '')
}

function line(varName: string, value: string | undefined): string {
  if (!value || !value.trim()) return ''
  return `  --${varName}: ${sanitize(value.trim())};\n`
}

export function buildThemeCSS(settings: Record<string, string> | undefined): string {
  if (!hasThemeOverrides(settings)) return ''
  const s = settings!

  const darkRules =
    line('accent',     s.theme_accent_dark) +
    line('btn-primary', s.theme_btn_dark) +
    line('body-bg',    s.theme_bg_dark)

  const lightRules =
    line('accent',     s.theme_accent_light) +
    line('btn-primary', s.theme_btn_light) +
    line('body-bg',    s.theme_bg_light)

  let css = ''
  if (darkRules.trim()) {
    css += `:root, [data-theme="dark"] {\n${darkRules}}\n`
  }
  if (lightRules.trim()) {
    css += `[data-theme="light"] {\n${lightRules}}\n`
  }
  return css
}

/**
 * Ezoic standalone ads: queue commands until sa.min.js has loaded.
 * Spots are plain `.ezoicad` elements (see components/adify/EzoicSlot.tsx).
 */
declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>
      showAds: (...args: any[]) => void
      destroyAll: () => void
    }
  }
}

export const EZOIC_SLOT_SELECTOR = '.ezoicad'

export function runEzoic(fn: () => void) {
  if (typeof window === 'undefined') return
  window.ezstandalone = window.ezstandalone || ({ cmd: [] } as any)
  window.ezstandalone!.cmd = window.ezstandalone!.cmd || []
  window.ezstandalone!.cmd.push(fn)
}

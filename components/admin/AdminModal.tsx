'use client'
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { AlertTriangle, CheckCircle, X, Info, Trash2, ImageIcon, Link2, TableIcon, Type } from 'lucide-react'

// ── Types ──
type ModalType = 'confirm' | 'alert' | 'prompt'

interface ModalConfig {
  type: ModalType
  title: string
  message: string
  icon?: 'danger' | 'warning' | 'success' | 'info' | 'image' | 'link' | 'table' | 'text'
  confirmText?: string
  cancelText?: string
  placeholder?: string
  defaultValue?: string
  inputType?: string
}

interface ModalContextType {
  showConfirm: (title: string, message: string, icon?: ModalConfig['icon']) => Promise<boolean>
  showAlert: (title: string, message: string, icon?: ModalConfig['icon']) => Promise<void>
  showPrompt: (title: string, message: string, opts?: { placeholder?: string; defaultValue?: string; icon?: ModalConfig['icon'] }) => Promise<string | null>
}

const ModalContext = createContext<ModalContextType | null>(null)

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used within AdminModalProvider')
  return ctx
}

// ── Icon mapping ──
function ModalIcon({ icon }: { icon: ModalConfig['icon'] }) {
  const base = 'w-6 h-6'
  switch (icon) {
    case 'danger':
      return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)' }}>
          <Trash2 className={`${base} text-red-400`} />
        </div>
      )
    case 'warning':
      return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)' }}>
          <AlertTriangle className={`${base} text-amber-400`} />
        </div>
      )
    case 'success':
      return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)' }}>
          <CheckCircle className={`${base} text-emerald-400`} />
        </div>
      )
    case 'image':
      return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)' }}>
          <ImageIcon className={`${base} text-emerald-400`} />
        </div>
      )
    case 'link':
      return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.12)' }}>
          <Link2 className={`${base} text-blue-400`} />
        </div>
      )
    case 'table':
      return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.12)' }}>
          <TableIcon className={`${base} text-purple-400`} />
        </div>
      )
    case 'text':
      return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.12)' }}>
          <Type className={`${base} text-emerald-400`} />
        </div>
      )
    default:
      return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.12)' }}>
          <Info className={`${base} text-blue-400`} />
        </div>
      )
  }
}

// ── Provider ──
export function AdminModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<(ModalConfig & { id: number }) | null>(null)
  const resolveRef = useRef<((val: any) => void) | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [closing, setClosing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(0)

  const close = useCallback((result: any) => {
    setClosing(true)
    setTimeout(() => {
      resolveRef.current?.(result)
      resolveRef.current = null
      setModal(null)
      setClosing(false)
      setInputValue('')
    }, 150)
  }, [])

  // Focus input on prompt open
  useEffect(() => {
    if (modal?.type === 'prompt' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [modal])

  // ESC key
  useEffect(() => {
    if (!modal) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close(modal.type === 'confirm' ? false : modal.type === 'prompt' ? null : undefined)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [modal, close])

  const showConfirm = useCallback((title: string, message: string, icon: ModalConfig['icon'] = 'danger') => {
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
      setModal({ type: 'confirm', title, message, icon, id: ++idRef.current })
    })
  }, [])

  const showAlert = useCallback((title: string, message: string, icon: ModalConfig['icon'] = 'warning') => {
    return new Promise<void>((resolve) => {
      resolveRef.current = resolve
      setModal({ type: 'alert', title, message, icon, id: ++idRef.current })
    })
  }, [])

  const showPrompt = useCallback((title: string, message: string, opts?: { placeholder?: string; defaultValue?: string; icon?: ModalConfig['icon'] }) => {
    return new Promise<string | null>((resolve) => {
      resolveRef.current = resolve
      setInputValue(opts?.defaultValue || '')
      setModal({
        type: 'prompt',
        title,
        message,
        icon: opts?.icon || 'text',
        placeholder: opts?.placeholder || '',
        defaultValue: opts?.defaultValue || '',
        id: ++idRef.current,
      })
    })
  }, [])

  const handleConfirm = () => {
    if (modal?.type === 'confirm') close(true)
    else if (modal?.type === 'alert') close(undefined)
    else if (modal?.type === 'prompt') close(inputValue || null)
  }

  const handleCancel = () => {
    if (modal?.type === 'confirm') close(false)
    else if (modal?.type === 'prompt') close(null)
  }

  return (
    <ModalContext.Provider value={{ showConfirm, showAlert, showPrompt }}>
      {children}

      {/* ── Modal overlay ── */}
      {modal && (
        <div
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-150 ${closing ? 'opacity-0' : 'opacity-100'}`}
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={handleCancel}
        >
          <div
            className={`w-full max-w-md rounded-2xl shadow-2xl transition-all duration-150 ${closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
            style={{
              background: 'linear-gradient(145deg, #1a2636 0%, #162032 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start gap-3.5 px-5 pt-5 pb-0">
              <ModalIcon icon={modal.icon} />
              <div className="flex-1 min-w-0 pt-1">
                <h3 className="text-[15px] font-bold text-white leading-tight">{modal.title}</h3>
                <p className="text-[13px] text-slate-400 mt-1 leading-relaxed">{modal.message}</p>
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors -mt-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt input */}
            {modal.type === 'prompt' && (
              <div className="px-5 pt-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
                  placeholder={modal.placeholder || 'Type here…'}
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-800/80 border border-slate-700 text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder-slate-500"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 px-5 pt-5 pb-5">
              {modal.type !== 'alert' && (
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06] transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleConfirm}
                className={`px-5 py-2 rounded-xl text-[13px] font-semibold text-white transition-all ${
                  modal.icon === 'danger'
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                }`}
              >
                {modal.type === 'confirm'
                  ? (modal.icon === 'danger' ? 'Delete' : 'Confirm')
                  : modal.type === 'alert'
                  ? 'OK'
                  : 'Submit'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

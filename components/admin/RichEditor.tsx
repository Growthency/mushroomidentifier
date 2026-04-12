'use client'
import { useRef, useCallback, useState, useEffect } from 'react'
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Heading1, Heading2, Heading3, Link, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Quote, Code, Minus,
  Upload, Undo2, Redo2, Type, Pilcrow, Table,
  Trash2, X, GripVertical,
} from 'lucide-react'
import { useModal } from '@/components/admin/AdminModal'
import { useTheme } from '@/components/providers/ThemeProvider'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const { theme } = useTheme()
  const dark = theme === 'dark'
  const { showPrompt, showAlert } = useModal()
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const onChangeRef = useRef(onChange)
  const initializedRef = useRef(false)
  const savedSelectionRef = useRef<Range | null>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

  // Image selection state
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null)
  const [imgAlt, setImgAlt] = useState('')
  const [imgToolbarPos, setImgToolbarPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const [resizing, setResizing] = useState(false)
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null)

  // Keep callback ref fresh without re-renders
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && value && !initializedRef.current) {
      editorRef.current.innerHTML = value
      initializedRef.current = true
    }
  }, [value])

  // MutationObserver to catch ALL DOM changes and sync to parent
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const observer = new MutationObserver(() => {
      onChangeRef.current(editor.innerHTML)
    })

    observer.observe(editor, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    })

    return () => observer.disconnect()
  }, [])

  const syncContent = useCallback(() => {
    if (editorRef.current) {
      onChangeRef.current(editorRef.current.innerHTML)
    }
  }, [])

  // Save current cursor position
  const saveSelection = useCallback(() => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange()
    }
  }, [])

  // Restore saved cursor position
  const restoreSelection = useCallback(() => {
    const sel = window.getSelection()
    if (sel && savedSelectionRef.current) {
      sel.removeAllRanges()
      sel.addRange(savedSelectionRef.current)
    }
  }, [])

  // Detect active formatting at cursor position
  const detectFormats = useCallback(() => {
    const formats = new Set<string>()

    if (document.queryCommandState('bold')) formats.add('bold')
    if (document.queryCommandState('italic')) formats.add('italic')
    if (document.queryCommandState('underline')) formats.add('underline')
    if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough')
    if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList')
    if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList')

    const block = document.queryCommandValue('formatBlock')
    if (block) formats.add(block.toLowerCase())

    setActiveFormats(formats)
  }, [])

  const exec = useCallback((command: string, val?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, val)
    syncContent()
    detectFormats()
  }, [syncContent, detectFormats])

  const handleInput = useCallback(() => {
    syncContent()
    detectFormats()
  }, [syncContent, detectFormats])

  const handleKeyUp = useCallback(() => {
    detectFormats()
  }, [detectFormats])

  const handleMouseUp = useCallback(() => {
    detectFormats()
  }, [detectFormats])

  // ── Image selection & management ──

  const selectImage = useCallback((img: HTMLImageElement) => {
    setSelectedImg(img)
    setImgAlt(img.getAttribute('alt') || '')

    // Position toolbar relative to the editor container
    const editorRect = editorRef.current?.getBoundingClientRect()
    const imgRect = img.getBoundingClientRect()
    if (editorRect) {
      setImgToolbarPos({
        top: imgRect.top - editorRect.top + editorRef.current!.scrollTop,
        left: imgRect.left - editorRect.left,
        width: imgRect.width,
      })
    }

    // Visual selection
    img.style.outline = '3px solid #34d399'
    img.style.outlineOffset = '2px'
    img.style.cursor = 'move'
  }, [])

  const deselectImage = useCallback(() => {
    if (selectedImg) {
      selectedImg.style.outline = ''
      selectedImg.style.outlineOffset = ''
      selectedImg.style.cursor = ''
    }
    setSelectedImg(null)
    setImgToolbarPos(null)
  }, [selectedImg])

  const deleteSelectedImage = useCallback(() => {
    if (!selectedImg) return
    selectedImg.remove()
    deselectImage()
    syncContent()
  }, [selectedImg, deselectImage, syncContent])

  const updateImgAlt = useCallback((newAlt: string) => {
    setImgAlt(newAlt)
    if (selectedImg) {
      selectedImg.setAttribute('alt', newAlt)
      syncContent()
    }
  }, [selectedImg, syncContent])

  // Handle click inside editor — select image or deselect
  const handleEditorClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      e.preventDefault()
      e.stopPropagation()
      deselectImage()
      selectImage(target as HTMLImageElement)
    } else {
      deselectImage()
    }
    detectFormats()
  }, [selectImage, deselectImage, detectFormats])

  // Handle keyboard: Delete/Backspace removes selected image
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (selectedImg && (e.key === 'Backspace' || e.key === 'Delete')) {
      e.preventDefault()
      deleteSelectedImage()
      return
    }
    if (selectedImg && e.key === 'Escape') {
      deselectImage()
      return
    }
  }, [selectedImg, deleteSelectedImage, deselectImage])

  // Resize drag handlers
  const startResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedImg) return
    setResizing(true)
    resizeStartRef.current = { x: e.clientX, width: selectedImg.offsetWidth }

    const onMouseMove = (ev: MouseEvent) => {
      if (!resizeStartRef.current || !selectedImg) return
      const diff = ev.clientX - resizeStartRef.current.x
      const newWidth = Math.max(100, resizeStartRef.current.width + diff)
      selectedImg.style.width = `${newWidth}px`
      selectedImg.style.height = 'auto'

      // Update toolbar position
      const editorRect = editorRef.current?.getBoundingClientRect()
      const imgRect = selectedImg.getBoundingClientRect()
      if (editorRect) {
        setImgToolbarPos({
          top: imgRect.top - editorRect.top + editorRef.current!.scrollTop,
          left: imgRect.left - editorRect.left,
          width: imgRect.width,
        })
      }
    }

    const onMouseUp = () => {
      setResizing(false)
      resizeStartRef.current = null
      syncContent()
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [selectedImg, syncContent])

  // Click outside editor to deselect image
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
        // Don't deselect if clicking on the image toolbar
        const toolbar = document.getElementById('img-toolbar')
        if (toolbar && toolbar.contains(e.target as Node)) return
        deselectImage()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [deselectImage])

  // Toggle heading
  const toggleHeading = (level: number) => {
    const tag = `h${level}`
    const currentBlock = document.queryCommandValue('formatBlock').toLowerCase()
    if (currentBlock === tag) {
      exec('formatBlock', 'p')
    } else {
      exec('formatBlock', tag)
    }
  }

  const toggleBlock = (tag: string) => {
    const currentBlock = document.queryCommandValue('formatBlock').toLowerCase()
    if (currentBlock === tag) {
      exec('formatBlock', 'p')
    } else {
      exec('formatBlock', tag)
    }
  }

  const insertLink = async () => {
    const url = await showPrompt('Insert Link', 'Enter the URL for the link:', { placeholder: 'https://example.com', icon: 'link' })
    if (url) { editorRef.current?.focus(); restoreSelection(); exec('createLink', url) }
  }

  const insertImageUrl = async () => {
    const url = await showPrompt('Insert Image URL', 'Enter the image URL:', { placeholder: 'https://example.com/image.webp', icon: 'image' })
    if (!url) return
    const alt = await showPrompt('Alt Text', 'Enter alt text for SEO & accessibility:', { placeholder: 'Describe the image…', icon: 'text' }) || 'Article image'
    editorRef.current?.focus(); restoreSelection()
    exec('insertHTML', `<img src="${url}" alt="${alt.replace(/"/g, '&quot;')}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;" />`)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const alt = await showPrompt('Image Alt Text', 'Enter alt text for this image (for SEO & accessibility):', { defaultValue: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '), icon: 'image' }) || file.name

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      const imgHtml = `<img src="${data.url}" alt="${alt.replace(/"/g, '&quot;')}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;" /><p><br></p>`

      editorRef.current?.focus()
      restoreSelection()

      const success = document.execCommand('insertHTML', false, imgHtml)

      if (!success && editorRef.current) {
        editorRef.current.innerHTML += imgHtml
      }

      syncContent()
    } catch (err: any) {
      showAlert('Upload Failed', err.message, 'danger')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const insertHR = () => exec('insertHTML', '<hr style="border:none;border-top:1px solid #334155;margin:24px 0;" />')

  const insertTable = async () => {
    const rows = await showPrompt('Insert Table', 'Number of rows:', { defaultValue: '3', icon: 'table' })
    if (!rows) return
    const cols = await showPrompt('Insert Table', 'Number of columns:', { defaultValue: '3', icon: 'table' })
    if (!cols) return
    const r = parseInt(rows, 10) || 3
    const c = parseInt(cols, 10) || 3

    let html = '<table style="width:100%;border-collapse:collapse;margin:16px 0;"><thead><tr>'
    for (let j = 0; j < c; j++) html += '<th style="border:1px solid #334155;padding:8px 12px;text-align:left;background:#1e293b;color:#e2e8f0;font-weight:600;">Header</th>'
    html += '</tr></thead><tbody>'
    for (let i = 0; i < r - 1; i++) {
      html += '<tr>'
      for (let j = 0; j < c; j++) html += '<td style="border:1px solid #334155;padding:8px 12px;color:#cbd5e1;">Cell</td>'
      html += '</tr>'
    }
    html += '</tbody></table><p><br></p>'
    editorRef.current?.focus()
    restoreSelection()
    exec('insertHTML', html)
  }

  const isActive = (fmt: string) => activeFormats.has(fmt)

  const ToolBtn = ({ onClick, title, children, active }: {
    onClick: () => void; title: string; children: React.ReactNode; active?: boolean
  }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); saveSelection(); onClick() }}
      title={title}
      className={`p-1.5 rounded hover:bg-white/10 transition-colors ${active ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : dark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
    >
      {children}
    </button>
  )

  const Divider = () => <div className={`w-px h-6 mx-1 ${dark ? 'bg-slate-700' : 'bg-slate-300'}`} />

  return (
    <div className="rounded-xl border max-h-[75vh] overflow-y-auto relative" style={{ background: dark ? '#1e293b' : '#f8fafc', borderColor: dark ? '#334155' : '#e2e8f0' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b sticky top-0 z-20" style={{ borderColor: dark ? '#334155' : '#e2e8f0', background: dark ? '#162032' : '#f1f5f9' }}>
        <ToolBtn onClick={() => exec('undo')} title="Undo"><Undo2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('redo')} title="Redo"><Redo2 className="w-4 h-4" /></ToolBtn>

        <Divider />

        <ToolBtn onClick={() => toggleHeading(1)} title="Heading 1" active={isActive('h1')}><Heading1 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => toggleHeading(2)} title="Heading 2" active={isActive('h2')}><Heading2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => toggleHeading(3)} title="Heading 3" active={isActive('h3')}><Heading3 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph" active={isActive('p')}><Pilcrow className="w-4 h-4" /></ToolBtn>

        <Divider />

        <ToolBtn onClick={() => exec('bold')} title="Bold" active={isActive('bold')}><Bold className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('italic')} title="Italic" active={isActive('italic')}><Italic className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('underline')} title="Underline" active={isActive('underline')}><Underline className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('strikeThrough')} title="Strikethrough" active={isActive('strikeThrough')}><Strikethrough className="w-4 h-4" /></ToolBtn>

        <Divider />

        <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet List" active={isActive('insertUnorderedList')}><List className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered List" active={isActive('insertOrderedList')}><ListOrdered className="w-4 h-4" /></ToolBtn>

        <Divider />

        <ToolBtn onClick={() => exec('justifyLeft')} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyCenter')} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyRight')} title="Align Right"><AlignRight className="w-4 h-4" /></ToolBtn>

        <Divider />

        <ToolBtn onClick={() => toggleBlock('blockquote')} title="Quote" active={isActive('blockquote')}><Quote className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => toggleBlock('pre')} title="Code Block" active={isActive('pre')}><Code className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={insertHR} title="Horizontal Line"><Minus className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={insertTable} title="Insert Table"><Table className="w-4 h-4" /></ToolBtn>

        <Divider />

        <ToolBtn onClick={insertLink} title="Insert Link"><Link className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={insertImageUrl} title="Image URL"><ImageIcon className="w-4 h-4" /></ToolBtn>
        <ToolBtn
          onClick={() => { saveSelection(); fileInputRef.current?.click() }}
          title="Upload Image"
        >
          {uploading
            ? <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            : <Upload className="w-4 h-4" />
          }
        </ToolBtn>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={() => { saveSelection(); syncContent() }}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        onMouseUp={handleMouseUp}
        onClick={handleEditorClick}
        suppressContentEditableWarning
        className={`min-h-[500px] px-6 py-5 text-sm leading-relaxed outline-none prose prose-sm max-w-none
          ${dark ? 'prose-invert text-white' : 'text-slate-900'}
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
          ${dark ? '[&_h1]:text-white [&_h2]:text-white [&_h3]:text-white' : '[&_h1]:text-slate-900 [&_h2]:text-slate-900 [&_h3]:text-slate-900'}
          [&_p]:mb-3 [&_p]:leading-relaxed
          ${dark ? '[&_p]:text-slate-300' : '[&_p]:text-slate-800'}
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
          ${dark ? '[&_ul]:text-slate-300 [&_ol]:text-slate-300' : '[&_ul]:text-slate-800 [&_ol]:text-slate-800'}
          [&_li]:mb-1
          [&_a]:text-emerald-400 [&_a]:underline
          [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
          ${dark ? '[&_blockquote]:text-slate-400' : '[&_blockquote]:text-slate-600'}
          [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:my-4
          ${dark ? '[&_pre]:bg-slate-800 [&_pre]:text-emerald-300' : '[&_pre]:bg-slate-100 [&_pre]:text-emerald-700'}
          [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs
          ${dark ? '[&_code]:bg-slate-800 [&_code]:text-emerald-300' : '[&_code]:bg-slate-100 [&_code]:text-emerald-700'}
          [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4 [&_img]:cursor-pointer
          ${dark ? '[&_hr]:border-slate-700' : '[&_hr]:border-slate-300'} [&_hr]:my-6
          [&_strong]:font-semibold
          ${dark ? '[&_strong]:text-white' : '[&_strong]:text-slate-900'}
          [&_em]:italic
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
          ${dark ? '[&_th]:border-slate-600 [&_th]:bg-slate-800 [&_th]:text-slate-200' : '[&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:text-slate-900'}
          [&_th]:border [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold
          ${dark ? '[&_td]:border-slate-600 [&_td]:text-slate-300' : '[&_td]:border-slate-300 [&_td]:text-slate-800'}
          [&_td]:border [&_td]:p-2
        `}
        style={{ background: dark ? '#0f172a' : '#ffffff' }}
      />

      {/* ── Image toolbar (shows when an image is selected) ── */}
      {selectedImg && imgToolbarPos && (
        <div
          id="img-toolbar"
          className="absolute z-30 flex flex-col gap-2"
          style={{
            top: imgToolbarPos.top + 44, // below sticky toolbar
            left: imgToolbarPos.left,
            width: Math.max(imgToolbarPos.width, 280),
          }}
          contentEditable={false}
        >
          {/* Top controls — positioned at bottom of image */}
          <div
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg"
            style={{
              background: dark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(241, 245, 249, 0.95)',
              border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
              backdropFilter: 'blur(8px)',
              marginTop: (selectedImg?.offsetHeight || 0) - 6,
            }}
          >
            {/* Alt text input */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[10px] font-bold text-emerald-400 shrink-0 uppercase">Alt</span>
              <input
                type="text"
                value={imgAlt}
                onChange={e => updateImgAlt(e.target.value)}
                placeholder="Enter alt text for SEO…"
                className={`flex-1 min-w-0 px-2 py-1 rounded text-xs outline-none focus:border-emerald-500 ${dark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} border`}
                onClick={e => e.stopPropagation()}
              />
            </div>

            {/* Resize handle */}
            <button
              onMouseDown={startResize}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 cursor-ew-resize"
              title="Drag to resize"
            >
              <GripVertical className="w-3.5 h-3.5" />
            </button>

            {/* Delete button */}
            <button
              onClick={e => { e.stopPropagation(); deleteSelectedImage() }}
              className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/15"
              title="Delete image (Backspace)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Close selection */}
            <button
              onClick={e => { e.stopPropagation(); deselectImage() }}
              className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/10"
              title="Deselect (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'
import { useRef, useCallback, useState, useEffect } from 'react'
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Heading1, Heading2, Heading3, Link, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Quote, Code, Minus,
  Upload, Undo2, Redo2, Type, Pilcrow, Table,
} from 'lucide-react'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
}

export default function RichEditor({ value, onChange }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const onChangeRef = useRef(onChange)
  const initializedRef = useRef(false)
  const savedSelectionRef = useRef<Range | null>(null)
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set())

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

    // Detect current block format (h1, h2, h3, p, blockquote, pre)
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

  // Toggle heading: if already that heading, switch to paragraph
  const toggleHeading = (level: number) => {
    const tag = `h${level}`
    const currentBlock = document.queryCommandValue('formatBlock').toLowerCase()
    if (currentBlock === tag) {
      exec('formatBlock', 'p')
    } else {
      exec('formatBlock', tag)
    }
  }

  // Toggle block format (blockquote, pre): if active, switch to paragraph
  const toggleBlock = (tag: string) => {
    const currentBlock = document.queryCommandValue('formatBlock').toLowerCase()
    if (currentBlock === tag) {
      exec('formatBlock', 'p')
    } else {
      exec('formatBlock', tag)
    }
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) exec('createLink', url)
  }

  const insertImageUrl = () => {
    const url = prompt('Enter image URL:')
    if (!url) return
    const alt = prompt('Enter alt text (for SEO & accessibility):', '') || 'Article image'
    exec('insertHTML', `<img src="${url}" alt="${alt.replace(/"/g, '&quot;')}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;" />`)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Ask for alt text before uploading
    const alt = prompt('Enter alt text for this image (for SEO & accessibility):', file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')) || file.name

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

      // Focus the editor and restore cursor position before inserting
      editorRef.current?.focus()
      restoreSelection()

      // Try execCommand first
      const success = document.execCommand('insertHTML', false, imgHtml)

      // Fallback: if execCommand fails, append directly to editor
      if (!success && editorRef.current) {
        editorRef.current.innerHTML += imgHtml
      }

      // Force sync content to parent state
      syncContent()
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const insertHR = () => exec('insertHTML', '<hr style="border:none;border-top:1px solid #334155;margin:24px 0;" />')

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3')
    const cols = prompt('Number of columns:', '3')
    if (!rows || !cols) return
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
    exec('insertHTML', html)
  }

  // Check if a format is active
  const isActive = (fmt: string) => activeFormats.has(fmt)

  const ToolBtn = ({ onClick, title, children, active }: {
    onClick: () => void; title: string; children: React.ReactNode; active?: boolean
  }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); saveSelection(); onClick() }}
      title={title}
      className={`p-1.5 rounded hover:bg-white/10 transition-colors ${active ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'text-slate-400 hover:text-white'}`}
    >
      {children}
    </button>
  )

  const Divider = () => <div className="w-px h-6 bg-slate-700 mx-1" />

  return (
    <div className="rounded-xl border max-h-[75vh] overflow-y-auto" style={{ background: '#1e293b', borderColor: '#334155' }}>
      {/* Toolbar — sticky inside scrollable container */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b sticky top-0 z-10" style={{ borderColor: '#334155', background: '#162032' }}>
        {/* Undo / Redo */}
        <ToolBtn onClick={() => exec('undo')} title="Undo"><Undo2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('redo')} title="Redo"><Redo2 className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Headings — toggle behavior */}
        <ToolBtn onClick={() => toggleHeading(1)} title="Heading 1" active={isActive('h1')}><Heading1 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => toggleHeading(2)} title="Heading 2" active={isActive('h2')}><Heading2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => toggleHeading(3)} title="Heading 3" active={isActive('h3')}><Heading3 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph" active={isActive('p')}><Pilcrow className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Text formatting — active states */}
        <ToolBtn onClick={() => exec('bold')} title="Bold" active={isActive('bold')}><Bold className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('italic')} title="Italic" active={isActive('italic')}><Italic className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('underline')} title="Underline" active={isActive('underline')}><Underline className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('strikeThrough')} title="Strikethrough" active={isActive('strikeThrough')}><Strikethrough className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Lists — active states */}
        <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet List" active={isActive('insertUnorderedList')}><List className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered List" active={isActive('insertOrderedList')}><ListOrdered className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn onClick={() => exec('justifyLeft')} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyCenter')} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyRight')} title="Align Right"><AlignRight className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Block elements — toggle behavior */}
        <ToolBtn onClick={() => toggleBlock('blockquote')} title="Quote" active={isActive('blockquote')}><Quote className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => toggleBlock('pre')} title="Code Block" active={isActive('pre')}><Code className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={insertHR} title="Horizontal Line"><Minus className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={insertTable} title="Insert Table"><Table className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Links & Images */}
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
        onMouseUp={handleMouseUp}
        suppressContentEditableWarning
        className="min-h-[500px] px-6 py-5 text-sm text-white leading-relaxed outline-none prose prose-invert prose-sm max-w-none
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mt-6 [&_h1]:mb-3
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-5 [&_h2]:mb-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2
          [&_p]:text-slate-300 [&_p]:mb-3 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:text-slate-300
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:text-slate-300
          [&_li]:mb-1
          [&_a]:text-emerald-400 [&_a]:underline
          [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-4
          [&_pre]:bg-slate-800 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-sm [&_pre]:font-mono [&_pre]:text-emerald-300 [&_pre]:my-4
          [&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-emerald-300 [&_code]:text-xs
          [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4
          [&_hr]:border-slate-700 [&_hr]:my-6
          [&_strong]:text-white [&_strong]:font-semibold
          [&_em]:italic
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
          [&_th]:border [&_th]:border-slate-600 [&_th]:p-2 [&_th]:text-left [&_th]:bg-slate-800 [&_th]:text-slate-200 [&_th]:font-semibold
          [&_td]:border [&_td]:border-slate-600 [&_td]:p-2 [&_td]:text-slate-300
        "
        style={{ background: '#0f172a' }}
      />
    </div>
  )
}

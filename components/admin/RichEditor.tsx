'use client'
import { useRef, useCallback, useState, useEffect } from 'react'
import {
  Bold, Italic, Underline, Strikethrough, List, ListOrdered,
  Heading1, Heading2, Heading3, Link, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Quote, Code, Minus,
  Upload, Undo2, Redo2, Type, Pilcrow,
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

  // Keep callback ref fresh without re-renders
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  // Set initial content only once
  useEffect(() => {
    if (editorRef.current && value && !initializedRef.current) {
      editorRef.current.innerHTML = value
      initializedRef.current = true
    }
  }, [value])

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val)
    if (editorRef.current) {
      onChangeRef.current(editorRef.current.innerHTML)
    }
  }, [])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChangeRef.current(editorRef.current.innerHTML)
    }
  }, [])

  const insertHeading = (level: number) => {
    exec('formatBlock', `h${level}`)
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) exec('createLink', url)
  }

  const insertImageUrl = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      exec('insertHTML', `<img src="${url}" alt="Article image" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;" />`)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

      exec('insertHTML', `<img src="${data.url}" alt="${file.name}" style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;" />`)
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const insertHR = () => exec('insertHTML', '<hr style="border:none;border-top:1px solid #334155;margin:24px 0;" />')

  const ToolBtn = ({ onClick, title, children, active }: {
    onClick: () => void; title: string; children: React.ReactNode; active?: boolean
  }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      title={title}
      className={`p-1.5 rounded hover:bg-white/10 transition-colors ${active ? 'bg-white/10 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
    >
      {children}
    </button>
  )

  const Divider = () => <div className="w-px h-6 bg-slate-700 mx-1" />

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: '#1e293b', borderColor: '#334155' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b sticky top-0 z-10" style={{ borderColor: '#334155', background: '#162032' }}>
        {/* Undo / Redo */}
        <ToolBtn onClick={() => exec('undo')} title="Undo"><Undo2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('redo')} title="Redo"><Redo2 className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn onClick={() => insertHeading(1)} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => insertHeading(2)} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => insertHeading(3)} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('formatBlock', 'p')} title="Paragraph"><Pilcrow className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Text formatting */}
        <ToolBtn onClick={() => exec('bold')} title="Bold"><Bold className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('italic')} title="Italic"><Italic className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('underline')} title="Underline"><Underline className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('strikeThrough')} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn onClick={() => exec('insertUnorderedList')} title="Bullet List"><List className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('insertOrderedList')} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn onClick={() => exec('justifyLeft')} title="Align Left"><AlignLeft className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyCenter')} title="Align Center"><AlignCenter className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('justifyRight')} title="Align Right"><AlignRight className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Block elements */}
        <ToolBtn onClick={() => exec('formatBlock', 'blockquote')} title="Quote"><Quote className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={() => exec('formatBlock', 'pre')} title="Code Block"><Code className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={insertHR} title="Horizontal Line"><Minus className="w-4 h-4" /></ToolBtn>

        <Divider />

        {/* Links & Images */}
        <ToolBtn onClick={insertLink} title="Insert Link"><Link className="w-4 h-4" /></ToolBtn>
        <ToolBtn onClick={insertImageUrl} title="Image URL"><ImageIcon className="w-4 h-4" /></ToolBtn>
        <ToolBtn
          onClick={() => fileInputRef.current?.click()}
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
        onBlur={handleInput}
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
        "
        style={{ background: '#0f172a' }}
      />
    </div>
  )
}

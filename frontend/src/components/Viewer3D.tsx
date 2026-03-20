import '@google/model-viewer'
import { fileUrl, downloadFile } from '../api/client'
import { Download } from 'lucide-react'

interface Props {
  label?: string
  filePath?: string | null
  downloadName?: string
  /** Hide the header bar — use when embedding in a fixed-height container */
  compact?: boolean
}

export function Viewer3D({ label, filePath, downloadName, compact = false }: Props) {
  return (
    <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden h-full">
      {!compact && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
          {filePath && downloadName && (
            <button
              onClick={() => downloadFile(filePath, downloadName)}
              className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
            >
              <Download size={12} /> Download
            </button>
          )}
        </div>
      )}
      {filePath ? (
        // @ts-expect-error model-viewer is a custom element
        <model-viewer
          src={fileUrl(filePath)}
          camera-controls
          auto-rotate
          shadow-intensity="0.5"
          style={{
            width: '100%',
            flexGrow: 1,
            background: '#0b1a2e',
            minHeight: compact ? '0' : '320px',
          }}
        />
      ) : (
        <div
          className="flex-1 flex items-center justify-center text-dim text-xs"
          style={{ minHeight: compact ? '0' : '320px', background: '#0b1a2e' }}
        >
          No model loaded
        </div>
      )}
    </div>
  )
}

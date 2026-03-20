import { useState } from 'react'
import { Field, TextInput, Select, SliderField, CheckField, Btn, StatusBadge } from '../ui/Field'
import { Accordion } from '../ui/Accordion'
import { useJob } from '../../hooks/useJob'
import { fileUrl, downloadFile } from '../../api/client'
import { ArrowRight, Download } from 'lucide-react'

const CANONICAL_VIEWS = ['front', 'back', 'left', 'right', 'top', 'bottom'] as const
type View = typeof CANONICAL_VIEWS[number]

interface GuidanceResult { image_path: string; description: unknown }

interface Props {
  glbPath?: string | null
  onUseAsGuidance?: (path: string) => void
}

export function GuidanceTab({ glbPath, onUseAsGuidance }: Props) {
  const [glbOverride,    setGlbOverride]    = useState('')
  const [transforms,     setTransforms]     = useState('data_toolkit/transforms.json')
  const [apiKey,         setApiKey]         = useState('')
  const [resolution,     setResolution]     = useState(512)
  const [mode,           setMode]           = useState<'single' | 'grid'>('single')
  const [views,          setViews]          = useState<Record<View, boolean>>({
    front: true, back: true, left: true, right: true, top: false, bottom: false,
  })
  const [gridCols,       setGridCols]       = useState(2)
  const [analyzeModel,   setAnalyzeModel]   = useState('gemini-2.5-flash')
  const [generateModel,  setGenerateModel]  = useState('gemini-3-pro-image-preview')

  const job = useJob<GuidanceResult>()

  function toggleView(v: View) {
    setViews(prev => ({ ...prev, [v]: !prev[v] }))
  }

  async function handleRun() {
    const glb = glbOverride.trim() || glbPath || ''
    if (!glb) return alert('Upload a model or enter a GLB path.')
    if (!apiKey.trim()) return alert('Enter a Gemini API key.')
    const selectedViews = CANONICAL_VIEWS.filter(v => views[v])
    if (mode === 'grid' && selectedViews.length === 0) return alert('Select at least one view.')

    await job.run('/api/jobs/guidance', {
      glb_path:       glb,
      transforms_path: transforms,
      gemini_api_key: apiKey,
      analyze_model:  analyzeModel,
      generate_model: generateModel,
      resolution,
      mode,
      grid_views:     selectedViews,
      grid_cols:      gridCols,
    })
  }

  const result = job.result

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold mb-1">Prepare 2D Guidance Map</h2>
        <p className="text-sm text-muted">
          Generates a flat-color segmented PNG from your model.
          Use the output as the guidance map in the <em>Full + 2D Map</em> tab.
        </p>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 self-start">
        <span className="text-xs font-semibold text-accent">Method: Pixmesh 2D Render</span>
      </div>
      <p className="text-xs text-muted -mt-3">
        Renders view(s) → VLM describes parts → assigns Kelly palette → image-gen flood-fills → outputs flat-color PNG.
      </p>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Field label="GLB path override (optional)">
          <TextInput value={glbOverride} onChange={e => setGlbOverride(e.target.value)}
            placeholder="Leave empty to use uploaded model" />
        </Field>
        <Field label="Transforms JSON">
          <TextInput value={transforms} onChange={e => setTransforms(e.target.value)} />
        </Field>
        <Field label="Gemini API key">
          <TextInput type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="AIza…" />
        </Field>
        <Field label="Render resolution (px)">
          <SliderField label="" min={256} max={1024} step={128} value={resolution} onChange={setResolution} />
        </Field>
      </div>

      {/* View mode */}
      <div className="flex items-center gap-6">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">View mode</span>
        {(['single', 'grid'] as const).map(m => (
          <label key={m} className="flex items-center gap-2 cursor-pointer text-sm">
            <input type="radio" name="g-mode" value={m} checked={mode === m}
              onChange={() => setMode(m)} className="accent-accent" />
            {m === 'single' ? 'Single view' : 'Multi-view grid'}
          </label>
        ))}
      </div>

      {/* Grid controls */}
      {mode === 'grid' && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 animate-fade-in">
          <p className="text-xs text-muted">
            front/back/left/right are always rendered for the VLM describe step.
            The final output is a single clean view from transforms.json.
          </p>
          <div className="flex gap-4 flex-wrap">
            {CANONICAL_VIEWS.map(v => (
              <CheckField key={v} label={v.charAt(0).toUpperCase() + v.slice(1)}
                checked={views[v]} onChange={() => toggleView(v)} />
            ))}
          </div>
          <SliderField label="Grid columns" min={1} max={3} step={1} value={gridCols} onChange={setGridCols} />
        </div>
      )}

      {/* Model selection */}
      <Accordion title="Model Selection">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Analyze model (describe step)">
            <Select value={analyzeModel} onChange={e => setAnalyzeModel(e.target.value)}>
              {['gemini-2.5-flash','gemini-2.5-pro','gemini-3-flash-preview','gemini-3-pro-preview',
                'gemini-3.1-pro-preview','claude-sonnet-4-6','claude-opus-4-6','claude-haiku-4-5',
                'gpt-4o','gpt-5-mini','gpt-5.2'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </Field>
          <Field label="Generate model (segmentation step)">
            <Select value={generateModel} onChange={e => setGenerateModel(e.target.value)}>
              {['gemini-3-pro-image-preview','gemini-3-pro-preview'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </Field>
        </div>
      </Accordion>

      {/* Run */}
      <div className="flex items-center gap-3">
        <Btn onClick={handleRun} disabled={job.status === 'running'}>Generate 2D Guidance Map</Btn>
        <StatusBadge status={job.status} error={job.error} />
      </div>

      {/* Output */}
      {result && (
        <div className="grid grid-cols-2 gap-4 animate-fade-in">
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted">
              Generated Guidance Map
            </div>
            <img
              src={fileUrl(result.image_path)}
              alt="guidance map"
              className="w-full object-contain bg-input"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="px-3 py-2 border-t border-border flex gap-2 justify-end flex-wrap">
              <button
                onClick={() => downloadFile(result.image_path, 'guidance_map.png')}
                className="flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors"
              >
                <Download size={12} /> Download PNG
              </button>
              {onUseAsGuidance && (
                <Btn variant="secondary" onClick={() => onUseAsGuidance(result.image_path)}>
                  <ArrowRight size={13} /> Use in Full + 2D Map tab
                </Btn>
              )}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
            <div className="px-3 py-2 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted">
              Assembly Tree (identified parts)
            </div>
            <pre className="flex-1 p-3 text-[11px] font-mono text-muted overflow-auto bg-input whitespace-pre-wrap break-words">
              {JSON.stringify(result.description, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

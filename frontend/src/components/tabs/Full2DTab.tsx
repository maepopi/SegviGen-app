import { useRef } from 'react'
import { Field, TextInput } from '../ui/Field'
import { SegTab } from './SegTab'
import { uploadFile } from '../../api/client'
import type { SamplerParams } from '../SamplerFields'

const DEFAULT_CKPT = 'ckpt/full_seg_w_2d_map.ckpt'

interface Props {
  glbPath?: string | null
  initialGuidancePath?: string | null
}

// Shared mutable ref so SegTab's buildParams can read the latest value
let _guidancePath: string | null = null

export function Full2DTab({ glbPath, initialGuidancePath }: Props) {
  _guidancePath = initialGuidancePath ?? null

  return (
    <SegTab
      title="Full Segmentation + 2D Guidance Map"
      description="Upload a flat-color 2D map (unique solid color per part) to steer segmentation boundaries."
      runEndpoint="/api/jobs/full_2d"
      runLabel="Run 2D-Guided Segmentation"
      buildParams={(sampler: SamplerParams) => ({
        glb_path:    (document.getElementById('t-glb')  as HTMLInputElement)?.value || glbPath || '',
        ckpt_path:   (document.getElementById('t-ckpt') as HTMLInputElement)?.value || DEFAULT_CKPT,
        guidance_img: _guidancePath ?? '',
        ...sampler,
      })}
      extraInputs={<Full2DInputs glbPath={glbPath} initialGuidancePath={initialGuidancePath} />}
    />
  )
}

function Full2DInputs({ glbPath, initialGuidancePath }: Props) {
  const previewRef = useRef<HTMLImageElement>(null)
  const pathRef    = useRef<HTMLInputElement>(null)

  async function pickGuidance() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.png,.jpg'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const serverPath = await uploadFile(file)
      _guidancePath = serverPath
      if (pathRef.current) pathRef.current.value = serverPath
      if (previewRef.current) previewRef.current.src = URL.createObjectURL(file)
    }
    input.click()
  }

  return (
    <>
      <Field label="GLB path">
        <TextInput id="t-glb" placeholder="Leave empty to use uploaded model" defaultValue={glbPath ?? ''} />
      </Field>
      <Field label="Checkpoint (.ckpt)">
        <TextInput id="t-ckpt" defaultValue={DEFAULT_CKPT} />
      </Field>
      <Field label="2D Guidance Map (PNG)">
        <div className="flex gap-2">
          <TextInput
            ref={pathRef}
            id="t-guidance-path"
            placeholder="path/to/guidance_map.png"
            defaultValue={initialGuidancePath ?? ''}
            readOnly
          />
          <button
            onClick={pickGuidance}
            className="px-3 py-2 bg-hover border border-border rounded-lg text-xs text-muted hover:text-white hover:border-accent transition-all whitespace-nowrap"
          >
            Browse
          </button>
        </div>
        {(initialGuidancePath) && (
          <img
            ref={previewRef}
            src={`/api/files?path=${encodeURIComponent(initialGuidancePath)}`}
            className="mt-2 rounded-lg border border-border max-h-20 object-contain bg-input"
            alt="guidance preview"
          />
        )}
      </Field>
    </>
  )
}

import { Field, TextInput } from '../ui/Field'
import { SegTab } from './SegTab'
import type { SamplerParams } from '../SamplerFields'

const DEFAULT_TRANSFORMS = 'data_toolkit/transforms.json'
const DEFAULT_CKPT       = 'ckpt/interactive_seg.ckpt'

interface Props { glbPath?: string | null }

export function InteractiveTab({ glbPath }: Props) {
  return (
    <SegTab
      title="Interactive Part Segmentation"
      description="Specify a 3D voxel coordinate (0–511 grid) to isolate a specific part."
      runEndpoint="/api/jobs/interactive"
      runLabel="Run Interactive Segmentation"
      buildParams={(sampler: SamplerParams) => ({
        glb_path:       (document.getElementById('i-glb')        as HTMLInputElement)?.value || glbPath || '',
        ckpt_path:      (document.getElementById('i-ckpt')       as HTMLInputElement)?.value || DEFAULT_CKPT,
        transforms_path:(document.getElementById('i-transforms') as HTMLInputElement)?.value || DEFAULT_TRANSFORMS,
        rendered_img:   (document.getElementById('i-img')        as HTMLInputElement)?.value || null,
        points_str:     (document.getElementById('i-points')     as HTMLInputElement)?.value || '388 448 392',
        ...sampler,
      })}
      extraInputs={<InteractiveInputs glbPath={glbPath} />}
    />
  )
}

function InteractiveInputs({ glbPath }: Props) {
  return (
    <>
      <Field label="GLB path">
        <TextInput id="i-glb" placeholder="Leave empty to use uploaded model" defaultValue={glbPath ?? ''} />
      </Field>
      <Field label="Checkpoint (.ckpt)">
        <TextInput id="i-ckpt" defaultValue={DEFAULT_CKPT} />
      </Field>
      <Field label="Transforms JSON">
        <TextInput id="i-transforms" defaultValue={DEFAULT_TRANSFORMS} />
      </Field>
      <Field label="Override rendered image (optional)">
        <TextInput id="i-img" placeholder="path/to/image.png" />
      </Field>
      <Field label="Voxel click points (x y z, up to 10)">
        <TextInput id="i-points" defaultValue="388 448 392" placeholder="388 448 392   256 256 256" />
      </Field>
    </>
  )
}

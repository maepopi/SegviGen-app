import { Field, TextInput } from '../ui/Field'
import { SegTab } from './SegTab'
import type { SamplerParams } from '../SamplerFields'

const DEFAULT_TRANSFORMS = 'data_toolkit/transforms.json'
const DEFAULT_CKPT       = 'ckpt/full_seg.ckpt'

interface Props { glbPath?: string | null }

export function FullTab({ glbPath }: Props) {
  return (
    <SegTab
      title="Full Segmentation"
      description="Automatically segments all parts simultaneously, conditioned on a rendered view of the model."
      runEndpoint="/api/jobs/full"
      runLabel="Run Full Segmentation"
      buildParams={(sampler: SamplerParams) => ({
        glb_path:        (document.getElementById('f-glb')        as HTMLInputElement)?.value || glbPath || '',
        ckpt_path:       (document.getElementById('f-ckpt')       as HTMLInputElement)?.value || DEFAULT_CKPT,
        transforms_path: (document.getElementById('f-transforms') as HTMLInputElement)?.value || DEFAULT_TRANSFORMS,
        rendered_img:    (document.getElementById('f-img')        as HTMLInputElement)?.value || null,
        ...sampler,
      })}
      extraInputs={<FullInputs glbPath={glbPath} />}
    />
  )
}

function FullInputs({ glbPath }: Props) {
  return (
    <>
      <Field label="GLB path">
        <TextInput id="f-glb" placeholder="Leave empty to use uploaded model" defaultValue={glbPath ?? ''} />
      </Field>
      <Field label="Checkpoint (.ckpt)">
        <TextInput id="f-ckpt" defaultValue={DEFAULT_CKPT} />
      </Field>
      <Field label="Transforms JSON">
        <TextInput id="f-transforms" defaultValue={DEFAULT_TRANSFORMS} />
      </Field>
      <Field label="Override rendered image (optional)">
        <TextInput id="f-img" placeholder="path/to/image.png" />
      </Field>
    </>
  )
}

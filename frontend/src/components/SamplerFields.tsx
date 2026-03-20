import { SliderField, NumberField, CheckField, SectionTitle, PresetBar, Select, Field } from './ui/Field'
import type { SamplerPreset } from '../hooks/usePresets'

export type SamplerParams = SamplerPreset

const DEFAULTS: SamplerParams = {
  steps: 25, rescale_t: 1.0, guidance_strength: 7.5, guidance_rescale: 0.0,
  guidance_interval_start: 0.0, guidance_interval_end: 1.0,
  decimation_target: 100_000, texture_size: 1024,
  remesh: true, remesh_band: 1, remesh_project: 0,
}

export function useSamplerDefaults(): SamplerParams { return { ...DEFAULTS } }

interface Props {
  value: SamplerParams
  onChange: (v: SamplerParams) => void
  presets?: Record<string, SamplerPreset>
}

function set<K extends keyof SamplerParams>(
  prev: SamplerParams, k: K, v: SamplerParams[K]
): SamplerParams { return { ...prev, [k]: v } }

export function SamplerFields({ value, onChange, presets }: Props) {
  const p = (k: keyof SamplerParams) => (v: SamplerParams[typeof k]) => onChange(set(value, k, v))

  return (
    <div className="space-y-2">
      {presets && (
        <PresetBar
          onPreset={name => onChange({ ...DEFAULTS, ...presets[name] })}
          options={[
            { name: 'fast',     label: '⚡ Fast' },
            { name: 'balanced', label: '⚖ Balanced', primary: true },
            { name: 'quality',  label: '✨ Quality' },
          ]}
        />
      )}
      <SectionTitle>Sampler</SectionTitle>
      <SliderField label="Steps"                    min={1}   max={100} step={1}    value={value.steps}                   onChange={p('steps')} />
      <SliderField label="Rescale T"                min={0.1} max={5}   step={0.05} value={value.rescale_t}               onChange={p('rescale_t')} />
      <SliderField label="Guidance strength (CFG)"  min={0}   max={10}  step={0.1}  value={value.guidance_strength}       onChange={p('guidance_strength')} />
      <SliderField label="Guidance rescale"         min={0}   max={1}   step={0.05} value={value.guidance_rescale}        onChange={p('guidance_rescale')} />
      <SliderField label="Guidance interval — start" min={0}  max={1}   step={0.01} value={value.guidance_interval_start} onChange={p('guidance_interval_start')} />
      <SliderField label="Guidance interval — end"   min={0}  max={1}   step={0.01} value={value.guidance_interval_end}   onChange={p('guidance_interval_end')} />
      <SectionTitle>Export</SectionTitle>
      <NumberField label="Decimation target (faces)" value={value.decimation_target} onChange={p('decimation_target')} min={0} />
      <Field label="Texture size (px)">
        <Select value={value.texture_size} onChange={e => p('texture_size')(Number(e.target.value))}>
          {[512, 1024, 2048, 4096].map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      </Field>
      <CheckField label="Remesh"                    checked={value.remesh}       onChange={p('remesh')} />
      <SliderField label="Remesh band"              min={0} max={4} step={1}     value={value.remesh_band}    onChange={p('remesh_band')} />
      <SliderField label="Remesh project"           min={0} max={4} step={1}     value={value.remesh_project} onChange={p('remesh_project')} />
    </div>
  )
}

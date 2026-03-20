import { SliderField, NumberField, CheckField, SectionTitle, PresetBar, Select, Field } from './ui/Field'
import type { SplitPreset } from '../hooks/usePresets'

export type SplitParams = SplitPreset

const DEFAULTS: SplitParams = {
  color_quant_step: 16, palette_sample_pixels: 2_000_000, palette_min_pixels: 500,
  palette_max_colors: 256, palette_merge_dist: 32, samples_per_face: 4,
  flip_v: true, uv_wrap_repeat: true, transition_conf_thresh: 1.0,
  transition_prop_iters: 6, transition_neighbor_min: 1,
  small_component_action: 'reassign', small_component_min_faces: 50,
  postprocess_iters: 3, min_faces_per_part: 1, bake_transforms: true,
}

export function useSplitDefaults(): SplitParams { return { ...DEFAULTS } }

interface Props {
  value: SplitParams
  onChange: (v: SplitParams) => void
  presets?: Record<string, SplitPreset>
}

function set<K extends keyof SplitParams>(prev: SplitParams, k: K, v: SplitParams[K]): SplitParams {
  return { ...prev, [k]: v }
}

export function SplitFields({ value, onChange, presets }: Props) {
  const p = (k: keyof SplitParams) => (v: SplitParams[typeof k]) => onChange(set(value, k, v))

  return (
    <div className="space-y-2">
      {presets && (
        <PresetBar
          onPreset={name => onChange({ ...DEFAULTS, ...presets[name] })}
          options={[
            { name: 'max_parts', label: '🔪 Max Parts' },
            { name: 'balanced',  label: '⚖ Balanced', primary: true },
            { name: 'cleanest',  label: '✨ Cleanest' },
          ]}
        />
      )}
      <SectionTitle>Color palette</SectionTitle>
      <SliderField label="Color quant step"    min={1} max={64} step={1} value={value.color_quant_step}    onChange={p('color_quant_step')} />
      <NumberField label="Palette sample pixels" value={value.palette_sample_pixels} onChange={p('palette_sample_pixels')} min={0} />
      <NumberField label="Palette min pixels"    value={value.palette_min_pixels}    onChange={p('palette_min_pixels')} min={0} />
      <NumberField label="Palette max colors"    value={value.palette_max_colors}    onChange={p('palette_max_colors')} min={1} />
      <NumberField label="Palette merge dist"    value={value.palette_merge_dist}    onChange={p('palette_merge_dist')} min={0} />
      <SectionTitle>Face sampling</SectionTitle>
      <Field label="Samples per face">
        <Select value={value.samples_per_face} onChange={e => p('samples_per_face')(Number(e.target.value))}>
          {[1, 4].map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      </Field>
      <CheckField label="Flip V (glTF convention)" checked={value.flip_v}        onChange={p('flip_v')} />
      <CheckField label="UV wrap repeat"           checked={value.uv_wrap_repeat} onChange={p('uv_wrap_repeat')} />
      <SectionTitle>Boundary refinement</SectionTitle>
      <SliderField label="Transition confidence threshold" min={0.25} max={1} step={0.25} value={value.transition_conf_thresh}  onChange={p('transition_conf_thresh')} />
      <NumberField label="Transition propagation iterations" value={value.transition_prop_iters}   onChange={p('transition_prop_iters')} min={0} />
      <NumberField label="Transition neighbor minimum"       value={value.transition_neighbor_min} onChange={p('transition_neighbor_min')} min={0} />
      <SectionTitle>Small component cleanup</SectionTitle>
      <Field label="Small component action">
        <Select value={value.small_component_action} onChange={e => p('small_component_action')(e.target.value)}>
          {['reassign', 'drop'].map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      </Field>
      <NumberField label="Small component min faces" value={value.small_component_min_faces} onChange={p('small_component_min_faces')} min={0} />
      <NumberField label="Post-process iterations"   value={value.postprocess_iters}         onChange={p('postprocess_iters')} min={0} />
      <SectionTitle>Output</SectionTitle>
      <NumberField label="Min faces per part" value={value.min_faces_per_part} onChange={p('min_faces_per_part')} min={0} />
      <CheckField  label="Bake transforms"   checked={value.bake_transforms}  onChange={p('bake_transforms')} />
    </div>
  )
}

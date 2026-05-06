import { useQuery } from '@tanstack/react-query'
import { fetchPresets } from '../api/client'

export interface SamplerPreset {
  steps: number
  rescale_t: number
  guidance_strength: number
  guidance_rescale: number
  guidance_interval_start: number
  guidance_interval_end: number
  decimation_target: number
  texture_size: number
  remesh: boolean
  remesh_band: number
  remesh_project: number
  remesh_method: 'pymeshlab' | 'ovoxel'
}

export interface SplitPreset {
  color_quant_step: number
  palette_sample_pixels: number
  palette_min_pixels: number
  palette_max_colors: number
  palette_merge_dist: number
  samples_per_face: number
  flip_v: boolean
  uv_wrap_repeat: boolean
  transition_conf_thresh: number
  transition_prop_iters: number
  transition_neighbor_min: number
  small_component_action: string
  small_component_min_faces: number
  postprocess_iters: number
  min_faces_per_part: number
  bake_transforms: boolean
}

export function usePresets() {
  return useQuery({
    queryKey: ['presets'],
    queryFn: fetchPresets,
    staleTime: Infinity,
  })
}

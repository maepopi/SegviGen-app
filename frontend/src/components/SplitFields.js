import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SliderField, NumberField, CheckField, SectionTitle, PresetBar, Select, Field } from './ui/Field';
const DEFAULTS = {
    color_quant_step: 16, palette_sample_pixels: 2000000, palette_min_pixels: 500,
    palette_max_colors: 256, palette_merge_dist: 32, samples_per_face: 4,
    flip_v: true, uv_wrap_repeat: true, transition_conf_thresh: 1.0,
    transition_prop_iters: 6, transition_neighbor_min: 1,
    small_component_action: 'reassign', small_component_min_faces: 50,
    postprocess_iters: 3, min_faces_per_part: 1, bake_transforms: true,
};
export function useSplitDefaults() { return { ...DEFAULTS }; }
function set(prev, k, v) {
    return { ...prev, [k]: v };
}
export function SplitFields({ value, onChange, presets }) {
    const p = (k) => (v) => onChange(set(value, k, v));
    return (_jsxs("div", { className: "space-y-2", children: [presets && (_jsx(PresetBar, { onPreset: name => onChange({ ...DEFAULTS, ...presets[name] }), options: [
                    { name: 'max_parts', label: '🔪 Max Parts' },
                    { name: 'balanced', label: '⚖ Balanced', primary: true },
                    { name: 'cleanest', label: '✨ Cleanest' },
                ] })), _jsx(SectionTitle, { children: "Color palette" }), _jsx(SliderField, { label: "Color quant step", min: 1, max: 64, step: 1, value: value.color_quant_step, onChange: p('color_quant_step') }), _jsx(NumberField, { label: "Palette sample pixels", value: value.palette_sample_pixels, onChange: p('palette_sample_pixels'), min: 0 }), _jsx(NumberField, { label: "Palette min pixels", value: value.palette_min_pixels, onChange: p('palette_min_pixels'), min: 0 }), _jsx(NumberField, { label: "Palette max colors", value: value.palette_max_colors, onChange: p('palette_max_colors'), min: 1 }), _jsx(NumberField, { label: "Palette merge dist", value: value.palette_merge_dist, onChange: p('palette_merge_dist'), min: 0 }), _jsx(SectionTitle, { children: "Face sampling" }), _jsx(Field, { label: "Samples per face", children: _jsx(Select, { value: value.samples_per_face, onChange: e => p('samples_per_face')(Number(e.target.value)), children: [1, 4].map(s => _jsx("option", { value: s, children: s }, s)) }) }), _jsx(CheckField, { label: "Flip V (glTF convention)", checked: value.flip_v, onChange: p('flip_v') }), _jsx(CheckField, { label: "UV wrap repeat", checked: value.uv_wrap_repeat, onChange: p('uv_wrap_repeat') }), _jsx(SectionTitle, { children: "Boundary refinement" }), _jsx(SliderField, { label: "Transition confidence threshold", min: 0.25, max: 1, step: 0.25, value: value.transition_conf_thresh, onChange: p('transition_conf_thresh') }), _jsx(NumberField, { label: "Transition propagation iterations", value: value.transition_prop_iters, onChange: p('transition_prop_iters'), min: 0 }), _jsx(NumberField, { label: "Transition neighbor minimum", value: value.transition_neighbor_min, onChange: p('transition_neighbor_min'), min: 0 }), _jsx(SectionTitle, { children: "Small component cleanup" }), _jsx(Field, { label: "Small component action", children: _jsx(Select, { value: value.small_component_action, onChange: e => p('small_component_action')(e.target.value), children: ['reassign', 'drop'].map(s => _jsx("option", { value: s, children: s }, s)) }) }), _jsx(NumberField, { label: "Small component min faces", value: value.small_component_min_faces, onChange: p('small_component_min_faces'), min: 0 }), _jsx(NumberField, { label: "Post-process iterations", value: value.postprocess_iters, onChange: p('postprocess_iters'), min: 0 }), _jsx(SectionTitle, { children: "Output" }), _jsx(NumberField, { label: "Min faces per part", value: value.min_faces_per_part, onChange: p('min_faces_per_part'), min: 0 }), _jsx(CheckField, { label: "Bake transforms", checked: value.bake_transforms, onChange: p('bake_transforms') })] }));
}

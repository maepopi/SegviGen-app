import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { SliderField, NumberField, CheckField, SectionTitle, PresetBar, Select, Field } from './ui/Field';
const DEFAULTS = {
    steps: 25, rescale_t: 1.0, guidance_strength: 7.5, guidance_rescale: 0.0,
    guidance_interval_start: 0.0, guidance_interval_end: 1.0,
    decimation_target: 100000, texture_size: 1024,
    remesh: true, remesh_band: 1, remesh_project: 0, remesh_method: 'pymeshlab',
};
export function useSamplerDefaults() { return { ...DEFAULTS }; }
function set(prev, k, v) { return { ...prev, [k]: v }; }
export function SamplerFields({ value, onChange, presets }) {
    const p = (k) => (v) => onChange(set(value, k, v));
    return (_jsxs("div", { className: "space-y-2", children: [presets && (_jsx(PresetBar, { onPreset: name => onChange({ ...DEFAULTS, ...presets[name] }), options: [
                    { name: 'fast', label: '⚡ Fast' },
                    { name: 'balanced', label: '⚖ Balanced', primary: true },
                    { name: 'quality', label: '✨ Quality' },
                    { name: 'quality_ovoxel', label: '✨ Quality (ovoxel)' },
                ] })), _jsx(SectionTitle, { children: "Sampler" }), _jsx(SliderField, { label: "Steps", min: 1, max: 100, step: 1, value: value.steps, onChange: p('steps') }), _jsx(SliderField, { label: "Rescale T", min: 0.1, max: 5, step: 0.05, value: value.rescale_t, onChange: p('rescale_t') }), _jsx(SliderField, { label: "Guidance strength (CFG)", min: 0, max: 10, step: 0.1, value: value.guidance_strength, onChange: p('guidance_strength') }), _jsx(SliderField, { label: "Guidance rescale", min: 0, max: 1, step: 0.05, value: value.guidance_rescale, onChange: p('guidance_rescale') }), _jsx(SliderField, { label: "Guidance interval \u2014 start", min: 0, max: 1, step: 0.01, value: value.guidance_interval_start, onChange: p('guidance_interval_start') }), _jsx(SliderField, { label: "Guidance interval \u2014 end", min: 0, max: 1, step: 0.01, value: value.guidance_interval_end, onChange: p('guidance_interval_end') }), _jsx(SectionTitle, { children: "Export" }), _jsx(NumberField, { label: "Decimation target (faces)", value: value.decimation_target, onChange: p('decimation_target'), min: 0 }), _jsx(Field, { label: "Texture size (px)", children: _jsx(Select, { value: value.texture_size, onChange: e => p('texture_size')(Number(e.target.value)), children: [512, 1024, 2048, 4096].map(s => _jsx("option", { value: s, children: s }, s)) }) }), _jsx(Field, { label: "Remesh method", children: _jsxs(Select, { value: value.remesh_method, onChange: e => p('remesh_method')(e.target.value), children: [_jsx("option", { value: "pymeshlab", children: "pymeshlab" }), _jsx("option", { value: "ovoxel", children: "ovoxel" })] }) }), _jsx(CheckField, { label: "Remesh", checked: value.remesh, onChange: p('remesh') }), value.remesh_method === 'ovoxel' && _jsxs(_Fragment, { children: [_jsx(SliderField, { label: "Remesh band", min: 0, max: 4, step: 1, value: value.remesh_band, onChange: p('remesh_band') }), _jsx(SliderField, { label: "Remesh project", min: 0, max: 4, step: 1, value: value.remesh_project, onChange: p('remesh_project') })] })] }));
}

import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Field, TextInput } from '../ui/Field';
import { SegTab } from './SegTab';
const DEFAULT_TRANSFORMS = 'data_toolkit/transforms.json';
const DEFAULT_CKPT = 'ckpt/full_seg.ckpt';
export function FullTab({ glbPath }) {
    return (_jsx(SegTab, { title: "Full Segmentation", description: "Automatically segments all parts simultaneously, conditioned on a rendered view of the model.", runEndpoint: "/api/jobs/full", runLabel: "Run Full Segmentation", buildParams: (sampler) => ({
            glb_path: document.getElementById('f-glb')?.value || glbPath || '',
            ckpt_path: document.getElementById('f-ckpt')?.value || DEFAULT_CKPT,
            transforms_path: document.getElementById('f-transforms')?.value || DEFAULT_TRANSFORMS,
            rendered_img: document.getElementById('f-img')?.value || null,
            ...sampler,
        }), extraInputs: _jsx(FullInputs, { glbPath: glbPath }) }));
}
function FullInputs({ glbPath }) {
    return (_jsxs(_Fragment, { children: [_jsx(Field, { label: "GLB path", children: _jsx(TextInput, { id: "f-glb", placeholder: "Leave empty to use uploaded model", defaultValue: glbPath ?? '' }) }), _jsx(Field, { label: "Checkpoint (.ckpt)", children: _jsx(TextInput, { id: "f-ckpt", defaultValue: DEFAULT_CKPT }) }), _jsx(Field, { label: "Transforms JSON", children: _jsx(TextInput, { id: "f-transforms", defaultValue: DEFAULT_TRANSFORMS }) }), _jsx(Field, { label: "Override rendered image (optional)", children: _jsx(TextInput, { id: "f-img", placeholder: "path/to/image.png" }) })] }));
}

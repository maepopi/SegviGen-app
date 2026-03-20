import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Field, TextInput } from '../ui/Field';
import { SegTab } from './SegTab';
const DEFAULT_TRANSFORMS = 'data_toolkit/transforms.json';
const DEFAULT_CKPT = 'ckpt/interactive_seg.ckpt';
export function InteractiveTab({ glbPath }) {
    return (_jsx(SegTab, { title: "Interactive Part Segmentation", description: "Specify a 3D voxel coordinate (0\u2013511 grid) to isolate a specific part.", runEndpoint: "/api/jobs/interactive", runLabel: "Run Interactive Segmentation", buildParams: (sampler) => ({
            glb_path: document.getElementById('i-glb')?.value || glbPath || '',
            ckpt_path: document.getElementById('i-ckpt')?.value || DEFAULT_CKPT,
            transforms_path: document.getElementById('i-transforms')?.value || DEFAULT_TRANSFORMS,
            rendered_img: document.getElementById('i-img')?.value || null,
            points_str: document.getElementById('i-points')?.value || '388 448 392',
            ...sampler,
        }), extraInputs: _jsx(InteractiveInputs, { glbPath: glbPath }) }));
}
function InteractiveInputs({ glbPath }) {
    return (_jsxs(_Fragment, { children: [_jsx(Field, { label: "GLB path", children: _jsx(TextInput, { id: "i-glb", placeholder: "Leave empty to use uploaded model", defaultValue: glbPath ?? '' }) }), _jsx(Field, { label: "Checkpoint (.ckpt)", children: _jsx(TextInput, { id: "i-ckpt", defaultValue: DEFAULT_CKPT }) }), _jsx(Field, { label: "Transforms JSON", children: _jsx(TextInput, { id: "i-transforms", defaultValue: DEFAULT_TRANSFORMS }) }), _jsx(Field, { label: "Override rendered image (optional)", children: _jsx(TextInput, { id: "i-img", placeholder: "path/to/image.png" }) }), _jsx(Field, { label: "Voxel click points (x y z, up to 10)", children: _jsx(TextInput, { id: "i-points", defaultValue: "388 448 392", placeholder: "388 448 392   256 256 256" }) })] }));
}

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef } from 'react';
import { Field, TextInput } from '../ui/Field';
import { SegTab } from './SegTab';
import { uploadFile } from '../../api/client';
const DEFAULT_CKPT = 'ckpt/full_seg_w_2d_map.ckpt';
// Shared mutable ref so SegTab's buildParams can read the latest value
let _guidancePath = null;
export function Full2DTab({ glbPath, initialGuidancePath }) {
    _guidancePath = initialGuidancePath ?? null;
    return (_jsx(SegTab, { title: "Full Segmentation + 2D Guidance Map", description: "Upload a flat-color 2D map (unique solid color per part) to steer segmentation boundaries.", runEndpoint: "/api/jobs/full_2d", runLabel: "Run 2D-Guided Segmentation", buildParams: (sampler) => ({
            glb_path: document.getElementById('t-glb')?.value || glbPath || '',
            ckpt_path: document.getElementById('t-ckpt')?.value || DEFAULT_CKPT,
            guidance_img: _guidancePath ?? '',
            ...sampler,
        }), extraInputs: _jsx(Full2DInputs, { glbPath: glbPath, initialGuidancePath: initialGuidancePath }) }));
}
function Full2DInputs({ glbPath, initialGuidancePath }) {
    const previewRef = useRef(null);
    const pathRef = useRef(null);
    async function pickGuidance() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png,.jpg';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file)
                return;
            const serverPath = await uploadFile(file);
            _guidancePath = serverPath;
            if (pathRef.current)
                pathRef.current.value = serverPath;
            if (previewRef.current)
                previewRef.current.src = URL.createObjectURL(file);
        };
        input.click();
    }
    return (_jsxs(_Fragment, { children: [_jsx(Field, { label: "GLB path", children: _jsx(TextInput, { id: "t-glb", placeholder: "Leave empty to use uploaded model", defaultValue: glbPath ?? '' }) }), _jsx(Field, { label: "Checkpoint (.ckpt)", children: _jsx(TextInput, { id: "t-ckpt", defaultValue: DEFAULT_CKPT }) }), _jsxs(Field, { label: "2D Guidance Map (PNG)", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(TextInput, { ref: pathRef, id: "t-guidance-path", placeholder: "path/to/guidance_map.png", defaultValue: initialGuidancePath ?? '', readOnly: true }), _jsx("button", { onClick: pickGuidance, className: "px-3 py-2 bg-hover border border-border rounded-lg text-xs text-muted hover:text-white hover:border-accent transition-all whitespace-nowrap", children: "Browse" })] }), (initialGuidancePath) && (_jsx("img", { ref: previewRef, src: `/api/files?path=${encodeURIComponent(initialGuidancePath)}`, className: "mt-2 rounded-lg border border-border max-h-20 object-contain bg-input", alt: "guidance preview" }))] })] }));
}

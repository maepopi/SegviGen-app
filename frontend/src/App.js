import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { uploadFile } from './api/client';
import { InteractiveTab } from './components/tabs/InteractiveTab';
import { FullTab } from './components/tabs/FullTab';
import { Full2DTab } from './components/tabs/Full2DTab';
import { GuidanceTab } from './components/tabs/GuidanceTab';
import { Upload, Layers, Grid2x2, Wand2, Map } from 'lucide-react';
const TABS = [
    { id: 'interactive', label: 'Interactive', icon: _jsx(Layers, { size: 15 }), short: 'Interactive' },
    { id: 'full', label: 'Full', icon: _jsx(Grid2x2, { size: 15 }), short: 'Full' },
    { id: 'full2d', label: 'Full + 2D Map', icon: _jsx(Wand2, { size: 15 }), short: 'Full + 2D' },
    { id: 'guidance', label: 'Prepare 2D Map', icon: _jsx(Map, { size: 15 }), short: 'Prepare Map' },
];
export default function App() {
    const [activeTab, setActiveTab] = useState('interactive');
    const [uploadedPath, setUploadedPath] = useState(null);
    const [uploadedName, setUploadedName] = useState(null);
    const [dragOver, setDragOver] = useState(false);
    const [guidancePath, setGuidancePath] = useState(null);
    const handleUpload = useCallback(async (file) => {
        setUploadedName('Uploading…');
        const path = await uploadFile(file);
        setUploadedPath(path);
        setUploadedName(file.name);
    }, []);
    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file)
            handleUpload(file);
    }, [handleUpload]);
    const onFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file)
            handleUpload(file);
    }, [handleUpload]);
    function useAsGuidance(path) {
        setGuidancePath(path);
        setActiveTab('full2d');
    }
    return (_jsxs("div", { className: "flex flex-col h-full bg-bg", children: [_jsxs("header", { className: "flex items-center gap-3 px-5 h-13 border-b border-border bg-bg/90 backdrop-blur-sm sticky top-0 z-50 shrink-0", style: { height: '52px' }, children: [_jsx("span", { className: "text-accent font-bold text-lg tracking-tight", children: "SegviGen" }), _jsx("span", { className: "text-dim text-xs", children: "3D Part Segmentation" })] }), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsxs("aside", { className: "w-52 shrink-0 bg-card border-r border-border flex flex-col gap-4 p-3 overflow-y-auto", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-dim mb-2", children: "Input Model" }), _jsxs("label", { onDragOver: e => { e.preventDefault(); setDragOver(true); }, onDragLeave: () => setDragOver(false), onDrop: onDrop, className: `flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all
                ${dragOver ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50 hover:bg-hover'}`, children: [_jsx("input", { type: "file", accept: ".glb,.obj,.ply", className: "hidden", onChange: onFileChange }), _jsx(Upload, { size: 20, className: "text-muted" }), _jsx("p", { className: "text-xs text-muted text-center leading-tight", children: uploadedName ?? 'Drop GLB / OBJ / PLY\nor click to browse' })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-semibold uppercase tracking-widest text-dim mb-2", children: "Mode" }), _jsx("nav", { className: "flex flex-col gap-1", children: TABS.map(tab => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all
                    ${activeTab === tab.id
                                                ? 'bg-accent/10 text-accent font-semibold'
                                                : 'text-muted hover:bg-hover hover:text-white'}`, children: [tab.icon, tab.short] }, tab.id))) })] }), _jsxs("div", { className: "mt-auto text-[11px] text-dim leading-relaxed", children: ["Base models cached on first run.", _jsx("br", {}), "Checkpoints cached per path."] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6", children: [activeTab === 'interactive' && _jsx(InteractiveTab, { glbPath: uploadedPath }), activeTab === 'full' && _jsx(FullTab, { glbPath: uploadedPath }), activeTab === 'full2d' && _jsx(Full2DTab, { glbPath: uploadedPath, initialGuidancePath: guidancePath }), activeTab === 'guidance' && _jsx(GuidanceTab, { glbPath: uploadedPath, onUseAsGuidance: useAsGuidance })] })] })] }));
}

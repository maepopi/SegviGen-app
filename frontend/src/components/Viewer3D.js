import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '@google/model-viewer';
import { fileUrl, downloadFile } from '../api/client';
import { Download } from 'lucide-react';
export function Viewer3D({ label, filePath, downloadName, compact = false }) {
    return (_jsxs("div", { className: "flex flex-col bg-card border border-border rounded-xl overflow-hidden h-full", children: [!compact && (_jsxs("div", { className: "flex items-center justify-between px-3 py-2 border-b border-border shrink-0", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted", children: label }), filePath && downloadName && (_jsxs("button", { onClick: () => downloadFile(filePath, downloadName), className: "flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors", children: [_jsx(Download, { size: 12 }), " Download"] }))] })), filePath ? (
            // @ts-expect-error model-viewer is a custom element
            _jsx("model-viewer", { src: fileUrl(filePath), "camera-controls": true, "auto-rotate": true, "shadow-intensity": "0.5", style: {
                    width: '100%',
                    flexGrow: 1,
                    background: '#0b1a2e',
                    minHeight: compact ? '0' : '320px',
                } })) : (_jsx("div", { className: "flex-1 flex items-center justify-center text-dim text-xs", style: { minHeight: compact ? '0' : '320px', background: '#0b1a2e' }, children: "No model loaded" }))] }));
}

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
export function Accordion({ title, children, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    const bodyRef = useRef(null);
    const [height, setHeight] = useState(defaultOpen ? undefined : 0);
    useEffect(() => {
        if (!bodyRef.current)
            return;
        if (open) {
            setHeight(bodyRef.current.scrollHeight);
            const t = setTimeout(() => setHeight(undefined), 300);
            return () => clearTimeout(t);
        }
        else {
            setHeight(bodyRef.current.scrollHeight);
            requestAnimationFrame(() => setHeight(0));
        }
    }, [open]);
    return (_jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [_jsxs("button", { onClick: () => setOpen(o => !o), className: "w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left hover:bg-hover transition-colors", children: [_jsx("span", { children: title }), _jsx(ChevronDown, { size: 15, className: `text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}` })] }), _jsx("div", { ref: bodyRef, className: "overflow-hidden transition-all duration-300 ease-in-out", style: { height: height === undefined ? 'auto' : `${height}px` }, children: _jsx("div", { className: "px-4 pb-4 pt-1", children: children }) })] }));
}

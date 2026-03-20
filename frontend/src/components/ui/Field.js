import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export function Label({ children }) {
    return _jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted block mb-1", children: children });
}
export function Field({ label, children }) {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(Label, { children: label }), children] }));
}
export const TextInput = React.forwardRef((props, ref) => (_jsx("input", { ref: ref, ...props, type: props.type ?? 'text', className: `bg-input border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-dim
        focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all w-full ${props.className ?? ''}` })));
TextInput.displayName = 'TextInput';
export function Select({ children, ...props }) {
    return (_jsx("select", { ...props, className: `bg-input border border-border rounded-lg px-3 py-2 text-sm text-white
        focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all w-full
        appearance-none cursor-pointer ${props.className ?? ''}`, children: children }));
}
export function SliderField({ label, min, max, step, value, onChange, format }) {
    const fmt = format ?? ((v) => step < 1 ? v.toFixed(2) : String(v));
    return (_jsx(Field, { label: label, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { type: "range", min: min, max: max, step: step, value: value, onChange: e => onChange(Number(e.target.value)), className: "flex-1 accent-accent cursor-pointer" }), _jsx("span", { className: "text-xs text-muted w-10 text-right tabular-nums", children: fmt(value) })] }) }));
}
export function CheckField({ label, checked, onChange }) {
    return (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer text-sm", children: [_jsx("input", { type: "checkbox", checked: checked, onChange: e => onChange(e.target.checked), className: "accent-accent w-4 h-4 cursor-pointer" }), _jsx("span", { children: label })] }));
}
export function NumberField({ label, value, onChange, min, step }) {
    return (_jsx(Field, { label: label, children: _jsx("input", { type: "number", value: value, min: min, step: step, onChange: e => onChange(Number(e.target.value)), className: "bg-input border border-border rounded-lg px-3 py-2 text-sm text-white\n          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all w-full" }) }));
}
export function SectionTitle({ children }) {
    return _jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-dim mt-3 mb-2 first:mt-0", children: children });
}
export function PresetBar({ onPreset, options }) {
    return (_jsxs("div", { className: "flex items-center gap-2 mb-3 flex-wrap", children: [_jsx("span", { className: "text-xs text-muted font-semibold", children: "Presets:" }), options.map(o => (_jsx("button", { onClick: () => onPreset(o.name), className: `px-3 py-1 rounded-lg text-xs border transition-all
            ${o.primary
                    ? 'bg-accent/10 text-accent border-accent'
                    : 'bg-input text-muted border-border hover:border-accent hover:text-accent'}`, children: o.label }, o.name)))] }));
}
export function Btn({ children, onClick, variant = 'primary', disabled, className = '' }) {
    const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-accent text-white hover:bg-accent-dark active:scale-[0.98] shadow-sm shadow-accent/20',
        secondary: 'bg-hover text-white border border-border hover:border-accent hover:text-accent',
        ghost: 'text-muted hover:text-white',
    };
    return (_jsx("button", { onClick: onClick, disabled: disabled, className: `${base} ${variants[variant]} ${className}`, children: children }));
}
export function StatusBadge({ status, error }) {
    if (status === 'idle')
        return null;
    const cfg = {
        running: { cls: 'bg-accent/10 text-accent border-accent/30', text: 'Running…', spin: true },
        done: { cls: 'bg-success/10 text-success border-success/30', text: '✓ Done', spin: false },
        error: { cls: 'bg-danger/10 text-danger border-danger/30', text: `✗ ${error ?? 'Error'}`, spin: false },
    }[status] ?? { cls: '', text: status, spin: false };
    return (_jsxs("span", { className: `inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${cfg.cls}`, children: [cfg.spin && _jsx("span", { className: "w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin-slow" }), cfg.text] }));
}

import React from 'react'
import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-semibold uppercase tracking-wider text-muted block mb-1">{children}</span>
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

export const TextInput = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      ref={ref}
      {...props}
      type={props.type ?? 'text'}
      className={`bg-input border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-dim
        focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all w-full ${props.className ?? ''}`}
    />
  )
)
TextInput.displayName = 'TextInput'

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`bg-input border border-border rounded-lg px-3 py-2 text-sm text-white
        focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all w-full
        appearance-none cursor-pointer ${props.className ?? ''}`}
    >
      {children}
    </select>
  )
}

interface SliderFieldProps {
  label: string
  min: number; max: number; step: number; value: number
  onChange: (v: number) => void
  format?: (v: number) => string
}
export function SliderField({ label, min, max, step, value, onChange, format }: SliderFieldProps) {
  const fmt = format ?? ((v: number) => step < 1 ? v.toFixed(2) : String(v))
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-accent cursor-pointer"
        />
        <span className="text-xs text-muted w-10 text-right tabular-nums">{fmt(value)}</span>
      </div>
    </Field>
  )
}

interface CheckFieldProps {
  label: string; checked: boolean; onChange: (v: boolean) => void
}
export function CheckField({ label, checked, onChange }: CheckFieldProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm">
      <input
        type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className="accent-accent w-4 h-4 cursor-pointer"
      />
      <span>{label}</span>
    </label>
  )
}

interface NumberFieldProps {
  label: string; value: number; onChange: (v: number) => void
  min?: number; step?: number
}
export function NumberField({ label, value, onChange, min, step }: NumberFieldProps) {
  return (
    <Field label={label}>
      <input
        type="number" value={value} min={min} step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="bg-input border border-border rounded-lg px-3 py-2 text-sm text-white
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all w-full"
      />
    </Field>
  )
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold uppercase tracking-widest text-dim mt-3 mb-2 first:mt-0">{children}</p>
}

interface PresetBarProps {
  onPreset: (name: string) => void
  options: Array<{ name: string; label: string; primary?: boolean }>
}
export function PresetBar({ onPreset, options }: PresetBarProps) {
  return (
    <div className="flex items-center gap-2 mb-3 flex-wrap">
      <span className="text-xs text-muted font-semibold">Presets:</span>
      {options.map(o => (
        <button
          key={o.name}
          onClick={() => onPreset(o.name)}
          className={`px-3 py-1 rounded-lg text-xs border transition-all
            ${o.primary
              ? 'bg-accent/10 text-accent border-accent'
              : 'bg-input text-muted border-border hover:border-accent hover:text-accent'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Btn({
  children, onClick, variant = 'primary', disabled, className = ''
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  className?: string
}) {
  const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-accent text-white hover:bg-accent-dark active:scale-[0.98] shadow-sm shadow-accent/20',
    secondary: 'bg-hover text-white border border-border hover:border-accent hover:text-accent',
    ghost:     'text-muted hover:text-white',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}

export function StatusBadge({ status, error }: { status: string; error?: string | null }) {
  if (status === 'idle') return null
  const cfg = {
    running: { cls: 'bg-accent/10 text-accent border-accent/30', text: 'Running…', spin: true },
    done:    { cls: 'bg-success/10 text-success border-success/30', text: '✓ Done', spin: false },
    error:   { cls: 'bg-danger/10 text-danger border-danger/30', text: `✗ ${error ?? 'Error'}`, spin: false },
  }[status] ?? { cls: '', text: status, spin: false }

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border ${cfg.cls}`}>
      {cfg.spin && <span className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin-slow" />}
      {cfg.text}
    </span>
  )
}

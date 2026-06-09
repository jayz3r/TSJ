import type { ReactNode } from 'react';

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'gray';

const badgeStyles: Record<BadgeVariant, string> = {
  green: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  red:   'bg-red-50 text-red-800 border border-red-200',
  amber: 'bg-amber-50 text-amber-800 border border-amber-200',
  blue:  'bg-blue-50 text-blue-800 border border-blue-200',
  gray:  'bg-stone-100 text-stone-600 border border-stone-200',
};

export function Badge({ variant, children }: { variant: BadgeVariant; children: ReactNode }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeStyles[variant]}`}>
      {children}
    </span>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

const btnStyles: Record<ButtonVariant, string> = {
  primary:   'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600',
  secondary: 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200',
  ghost:     'bg-transparent hover:bg-stone-100 text-stone-600 border-transparent',
  danger:    'bg-red-600 hover:bg-red-700 text-white border-red-600',
};

interface ButtonProps {
  variant?:  ButtonVariant;
  children:  ReactNode;
  onClick?:  () => void;
  type?:     'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  size?:     'sm' | 'md';
}

export function Button({ variant = 'secondary', children, onClick, type = 'button', disabled, className = '', size = 'md' }: ButtonProps) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${sizeClass} ${btnStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-stone-200 rounded-xl overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100">
      <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
type ValueColor = 'default' | 'green' | 'red' | 'amber';

const valueColors: Record<ValueColor, string> = {
  default: 'text-stone-900',
  green:   'text-emerald-600',
  red:     'text-red-600',
  amber:   'text-amber-600',
};

export function MetricCard({ label, value, sub, valueColor = 'default' }: {
  label: string; value: string; sub?: string; valueColor?: ValueColor;
}) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 md:p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400 mb-1.5 truncate">
        {label}
      </p>
      <p className={`text-base md:text-2xl font-semibold font-mono leading-tight break-all ${valueColors[valueColor]}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-stone-400 mt-1 truncate">{sub}</p>}
    </div>
  );
}

// ─── Form fields ──────────────────────────────────────────────────────────────
const inputClass = 'w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-stone-300';

export function FormInput({ label, className = '', ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-stone-500">{label}</label>
      <input className={`${inputClass} ${className}`} {...props} />
    </div>
  );
}

export function FormSelect({ label, children, className = '', ...props }: { label: string; children: ReactNode; className?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-stone-500">{label}</label>
      <select className={`${inputClass} ${className}`} {...props}>{children}</select>
    </div>
  );
}

export function FormTextarea({ label, className = '', ...props }: { label: string; className?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-stone-500">{label}</label>
      <textarea className={`${inputClass} resize-none ${className}`} {...props} />
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
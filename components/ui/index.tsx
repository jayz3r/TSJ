import type { ReactNode } from 'react';

// ─── Badge ────────────────────────────────────────────────────────────────────
type BadgeVariant = 'green' | 'red' | 'amber' | 'blue' | 'gray';

const badgeStyles: Record<BadgeVariant, string> = {
  green: 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30',
  red:   'bg-red-50 text-red-800 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30',
  amber: 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30',
  blue:  'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30',
  gray:  'bg-stone-100 text-stone-600 border border-stone-200 dark:bg-stone-500/10 dark:text-stone-400 dark:border-stone-500/30',
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
  secondary: 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 dark:text-stone-300 dark:border-stone-700',
  ghost:     'bg-transparent hover:bg-stone-100 text-stone-600 border-transparent dark:hover:bg-stone-800 dark:text-stone-400',
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
    <div className={`bg-white border border-stone-200 rounded-xl overflow-hidden dark:bg-stone-900 dark:border-stone-800 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 dark:border-stone-800">
      <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 dark:text-stone-100">{title}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
type ValueColor = 'default' | 'green' | 'red' | 'amber';

const valueColors: Record<ValueColor, string> = {
  default: 'text-stone-900 dark:text-stone-100',
  green:   'text-emerald-600 dark:text-emerald-400',
  red:     'text-red-600 dark:text-red-400',
  amber:   'text-amber-600 dark:text-amber-400',
};

export function MetricCard({ label, value, sub, valueColor = 'default' }: {
  label: string; value: string; sub?: string; valueColor?: ValueColor;
}) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 md:p-4 dark:bg-stone-900/60 dark:border-stone-800">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400 dark:text-stone-500 mb-1.5 truncate">
        {label}
      </p>
      <p className={`text-base md:text-2xl font-semibold font-mono leading-tight break-all ${valueColors[valueColor]}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-stone-400 dark:text-stone-500 mt-1 truncate">{sub}</p>}
    </div>
  );
}

// ─── Switch ───────────────────────────────────────────────────────────────────
export function Switch({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label?: string; description?: string;
}) {
  const el = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? 'bg-emerald-600' : 'bg-stone-200 dark:bg-stone-700'
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-1'
        }`}
      />
    </button>
  );

  if (!label) return el;

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-stone-800 dark:text-stone-200">{label}</p>
        {description && <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{description}</p>}
      </div>
      {el}
    </div>
  );
}

// ─── Form fields ──────────────────────────────────────────────────────────────
const inputClass = 'w-full px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white text-stone-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-stone-300 dark:bg-stone-900 dark:border-stone-700 dark:text-stone-100 dark:placeholder:text-stone-600';
const labelClass = 'text-xs font-medium text-stone-500 dark:text-stone-400';

export function FormInput({ label, className = '', ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <input className={`${inputClass} ${className}`} {...props} />
    </div>
  );
}

export function FormSelect({ label, children, className = '', ...props }: { label: string; children: ReactNode; className?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <select className={`${inputClass} ${className}`} {...props}>{children}</select>
    </div>
  );
}

export function FormTextarea({ label, className = '', ...props }: { label: string; className?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass}>{label}</label>
      <textarea className={`${inputClass} resize-none ${className}`} {...props} />
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between pt-6 mb-5">
      <h1 className="text-lg font-semibold">{title}</h1>
      {action && <div>{action}</div>}
    </div>
  );
}
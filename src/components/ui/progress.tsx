export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div
      aria-label={label || `${value}% complete`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2.5 overflow-hidden rounded-full bg-ink/10"
    >
      <div
        className="h-full rounded-full bg-emerald transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

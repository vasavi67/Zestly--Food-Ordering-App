export default function Logo({ className = "h-8 w-8" }) {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
        <circle cx="20" cy="20" r="20" fill="var(--color-tandoori)" />
        <path
          d="M13 24c0-4.5 3-8 7-8s7 3.5 7 8"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M13 24h14" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M20 16v-4M17 14.5c0-1.5 1-2.5 1-4M23 14.5c0-1.5-1-2.5-1-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight text-ink">Zestly</span>
    </div>
  );
}

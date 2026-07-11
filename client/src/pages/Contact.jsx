const CONTACTS = [
  { label: "Email", value: "vasavimandala2004@gmail.com", href: "mailto:vasavimandala2004@gmail.com" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/vasavi-mandala-191264280",
    href: "https://www.linkedin.com/in/vasavi-mandala-191264280",
  },
  { label: "GitHub", value: "github.com/vasavi67", href: "https://github.com/vasavi67" },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center md:px-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-tandoori">Get in touch</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Contact</h1>
      <p className="mt-3 text-sm text-muted">
        Have feedback on this project, or want to connect? Reach out through any of these.
      </p>

      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white text-left">
        {CONTACTS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noreferrer" : undefined}
            className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-paper-warm"
          >
            <span className="font-display text-sm font-semibold text-ink">{c.label}</span>
            <span className="text-sm text-tandoori">{c.value}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

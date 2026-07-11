export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-6">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-tandoori">About this project</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Built as a portfolio piece</h1>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
        <p>
          Zestly is a full-stack food ordering application built to demonstrate real-world frontend
          and backend engineering — restaurant discovery, search and filtering, a persistent cart,
          and a complete checkout flow backed by a real database.
        </p>
        <p>
          The frontend is built with React 19, React Router, and Redux Toolkit, styled with
          Tailwind CSS. The backend is a Node.js and Express REST API backed by SQLite, handling
          restaurant data, menus, and order persistence.
        </p>
        <p>
          This project was rebuilt from an earlier course exercise into a production-style
          application: a real backend replacing a third-party API dependency, proper error
          handling and loading states throughout, input validation on both client and server, and
          a redesigned interface built around a clear visual identity.
        </p>
      </div>

      <div className="ticket-divider my-8" />

      <h2 className="font-display text-lg font-semibold text-ink">Built by</h2>
      <p className="mt-2 text-sm text-ink/80">
        Vasavi Mandala — you can find contact details on the{" "}
        <a href="/contact" className="font-semibold text-tandoori hover:underline">
          Contact page
        </a>
        .
      </p>
    </div>
  );
}

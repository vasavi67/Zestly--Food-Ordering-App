import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              A modern food ordering experience — browse restaurants, build your cart,
              and check out in seconds.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-ink">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li><Link to="/" className="hover:text-tandoori">Home</Link></li>
              <li><Link to="/orders" className="hover:text-tandoori">Your orders</Link></li>
              <li><Link to="/about" className="hover:text-tandoori">About</Link></li>
              <li><Link to="/contact" className="hover:text-tandoori">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-ink">Connect</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <a href="https://github.com/vasavi67" target="_blank" rel="noreferrer" className="hover:text-tandoori">
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/vasavi-mandala-191264280"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-tandoori"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:vasavimandala2004@gmail.com" className="hover:text-tandoori">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="ticket-divider my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted md:flex-row">
          <p>Built with care by <span className="font-semibold text-ink">Vasavi Mandala</span> · © {new Date().getFullYear()}</p>
          <p>This is a portfolio project — not a real ordering service.</p>
        </div>
      </div>
    </footer>
  );
}

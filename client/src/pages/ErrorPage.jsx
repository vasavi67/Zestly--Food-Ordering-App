import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const status = error?.status ?? 500;
  const message =
    status === 404
      ? "This page doesn't exist. It might have been moved or the link is broken."
      : "Something went wrong on our end.";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm font-semibold text-tandoori">Error {status}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{message}</h1>
      <p className="mt-2 text-sm text-muted">
        Let's get you back to something that works.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-full bg-tandoori px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03]"
      >
        Back to home
      </Link>
    </div>
  );
}

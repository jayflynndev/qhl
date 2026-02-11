import Link from "next/link";

export default function Home() {
  return (
    <main className="qhl-shell">
      <header className="qhl-hero">
        <p className="qhl-kicker">Welcome</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          Quiz Hub Live
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-violet-100/85 md:text-base">
          Choose your experience to enter the live quiz platform.
        </p>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Link
          href="/admin"
          className="qhl-card group block p-6 transition hover:-translate-y-0.5 hover:shadow-2xl"
        >
          <p className="qhl-kicker">Control</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Admin</h2>
          <p className="mt-2 text-sm text-violet-100/80">
            Create quizzes, manage phases, and run the show.
          </p>
        </Link>

        <Link
          href="/players"
          className="qhl-card group block p-6 transition hover:-translate-y-0.5 hover:shadow-2xl"
        >
          <p className="qhl-kicker">Play</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Players</h2>
          <p className="mt-2 text-sm text-violet-100/80">
            Join a team, answer live, and track leaderboard results.
          </p>
        </Link>
      </section>
    </main>
  );
}

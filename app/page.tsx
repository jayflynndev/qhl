import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoGameController } from "react-icons/io5";

export default function Home() {
  return (
    <main className="qhl-shell">
      <header className="qhl-hero">
        <p className="qhl-kicker">Welcome</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          Quiz Hub Live
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-violet-100/85 sm:text-base">
          Choose your experience to enter the live quiz platform.
        </p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:gap-6">
        <Link
          href="/admin"
          className="qhl-card group block p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 focus:-translate-y-1 focus:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <p className="qhl-kicker">Control</p>
            <MdAdminPanelSettings
              className="text-4xl sm:text-5xl text-yellow-400/90 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 group-focus:scale-110 group-focus:rotate-12"
              aria-hidden="true"
            />
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
            Admin
          </h2>
          <p className="mt-2 text-sm sm:text-base text-violet-100/80 leading-relaxed">
            Create quizzes, manage phases, and run the show.
          </p>
        </Link>

        <Link
          href="/players"
          className="qhl-card group block p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400/50 focus:-translate-y-1 focus:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-start justify-between">
            <p className="qhl-kicker">Play</p>
            <IoGameController
              className="text-4xl sm:text-5xl text-yellow-400/90 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 group-focus:scale-110 group-focus:-rotate-12"
              aria-hidden="true"
            />
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white">
            Players
          </h2>
          <p className="mt-2 text-sm sm:text-base text-violet-100/80 leading-relaxed">
            Join a team, answer live, and track leaderboard results.
          </p>
        </Link>
      </section>
    </main>
  );
}

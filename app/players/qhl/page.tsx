import { QuizLobbyList } from "@/components/qhl/player/QuizLobbyList";

export default function Page() {
  return (
    <div className="qhl-shell max-w-4xl space-y-6">
      <div className="qhl-hero">
        <div className="flex items-start justify-between gap-4 md:gap-8">
          <div>
            <div className="qhl-kicker">Player Portal</div>
            <div className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              Quiz Hub Live
            </div>
            <div className="mt-2 max-w-2xl text-sm text-violet-100/85 md:text-base">
              Pick a live quiz, join your team, and play in real time.
            </div>
          </div>

          <div className="hidden sm:block">
            <div className="rounded-xl border border-yellow-300/45 bg-yellow-300/20 px-3 py-2 text-xs font-semibold text-yellow-100">
              Multiplayer • Live scoring • Leaderboards
            </div>
          </div>
        </div>
      </div>

      <QuizLobbyList />
    </div>
  );
}


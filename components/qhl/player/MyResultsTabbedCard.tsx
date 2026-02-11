"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { QuizRuntime } from "@/src/qhl/types";
import type { TeamRow } from "@/src/qhl/teamTypes";
import type { QuizSetup } from "@/src/qhl/quizTypes";

import { PartsTabs } from "@/components/qhl/player/PartsTabs";
import { MarkedResultsSheet } from "@/components/qhl/player/MarkedResultsSheet";

import { coerceAnswersToPartShape, type AnswersV1 } from "@/src/qhl/answersV1";
import { coerceMarksToPartShape, type MarksV1 } from "@/src/qhl/marksV1";

type ResultRow = {
  my_answers: unknown;
  my_marks: unknown;
  part_points: number;
  total_points: number;
  needs_manual_review: boolean;
  notes: string | null;
};

export function MyResultsTabbedCard({
  quizId,
  runtime,
  myTeam,
}: {
  quizId: string;
  runtime: QuizRuntime | null;
  myTeam: TeamRow | null;
}) {
  const show =
    runtime?.phase === "SHOW_LEADERBOARD" || runtime?.phase === "ENDED";

  const [setup, setSetup] = useState<QuizSetup>([]);
  const [partsCount, setPartsCount] = useState<number>(1);

  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(
    runtime?.part_index ?? 1,
  );

  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState<ResultRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  // keep selection in range if runtime changes
  useEffect(() => {
    if (!runtime?.part_index) return;
    setSelectedPartIndex((prev) => prev || runtime.part_index);
  }, [runtime?.part_index]);

  // Load quiz meta (setup + parts_count) when showing results
  useEffect(() => {
    async function loadQuizMeta() {
      const { data, error } = await supabase
        .from("qhl_quizzes")
        .select("parts_count,setup")
        .eq("id", quizId)
        .single();

      if (error) {
        console.error(error);
        setPartsCount(1);
        setSetup([]);
        return;
      }

      const pc = Math.max(1, Math.floor(data?.parts_count ?? 1));
      setPartsCount(pc);
      setSetup(((data?.setup ?? []) as QuizSetup) || []);
    }

    if (show) loadQuizMeta();
  }, [show, quizId]);

  async function loadResults(partIndex: number) {
    if (!myTeam) return;

    setLoading(true);
    setError(null);

    const { data, error: rpcErr } = await supabase.rpc(
      "qhl_player_get_my_part_results",
      {
        p_quiz_id: quizId,
        p_part_index: partIndex,
        p_team_id: myTeam.id,
      },
    );

    if (rpcErr) {
      console.error(rpcErr);
      setError(rpcErr.message);
      setRow(null);
      setLoading(false);
      return;
    }

    setRow((data?.[0] ?? null) as ResultRow | null);
    setLoading(false);
  }

  useEffect(() => {
    if (!show) return;
    if (!myTeam) return;
    loadResults(selectedPartIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, quizId, myTeam?.id, selectedPartIndex]);

  const part = useMemo(() => {
    if (!setup?.length) return null;
    const idx = Math.max(1, Math.min(selectedPartIndex, setup.length)) - 1;
    return setup[idx] ?? null;
  }, [setup, selectedPartIndex]);

  const answers: AnswersV1 = useMemo(() => {
    if (!part) return { v: 1, rounds: [] };
    return coerceAnswersToPartShape(row?.my_answers ?? null, part);
  }, [row?.my_answers, part]);

  const marks: MarksV1 = useMemo(() => {
    if (!part) return { v: 1, rounds: [] };
    return coerceMarksToPartShape(row?.my_marks ?? null, part);
  }, [row?.my_marks, part]);

  if (!show) return null;

  if (!myTeam) {
    return (
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="text-base font-semibold text-slate-900">
          Your results
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Join a team to see your results.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-slate-900">
            Your results
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Team:{" "}
            <span className="font-medium text-slate-900">{myTeam.name}</span>
          </div>
        </div>

        <button
          onClick={() => loadResults(selectedPartIndex)}
          className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-40"
          disabled={loading}
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <PartsTabs
        partsCount={partsCount}
        selectedPartIndex={selectedPartIndex}
        onSelect={setSelectedPartIndex}
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {row?.needs_manual_review ? (
        <div className="rounded-2xl border bg-yellow-50 p-4">
          <div className="text-sm font-semibold text-yellow-900">
            Manual review
          </div>
          <div className="mt-1 text-sm text-yellow-900/80">
            You missed a phase or your marks weren’t submitted in time — this
            will be manually reviewed after the quiz.
          </div>
          {row.notes ? (
            <div className="mt-2 text-xs text-yellow-900/70">
              Notes: {row.notes}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-2xl border bg-slate-50 p-4">
        <div className="text-sm font-medium text-slate-700">Score</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-white p-3 shadow-sm">
            <div className="text-xs text-slate-600">
              Part {selectedPartIndex}
            </div>
            <div className="mt-1 font-mono text-2xl text-slate-900">
              {row?.part_points ?? 0}
            </div>
          </div>
          <div className="rounded-xl border bg-white p-3 shadow-sm">
            <div className="text-xs text-slate-600">Total</div>
            <div className="mt-1 font-mono text-2xl text-slate-900">
              {row?.total_points ?? 0}
            </div>
          </div>
        </div>
      </div>

      {part ? (
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-base font-semibold text-slate-900">
            Your marked sheet
          </div>
          <div className="mt-3">
            <MarkedResultsSheet part={part} answers={answers} marks={marks} />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border bg-slate-50 p-4">
          <div className="text-base font-semibold text-slate-900">
            Your marked sheet
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Quiz setup not found for this part yet.
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { supabase } from "@/supabaseClient";
import type { QuizRuntime } from "@/src/qhl/types";

export function AdminPhaseControls({
  quizId,
  runtime,
}: {
  quizId: string;
  runtime: QuizRuntime | null;
}) {
  if (!runtime) return null;

  async function startAnsweringCountdown() {
    const { error } = await supabase.rpc(
      "qhl_admin_start_answering_countdown",
      {
        p_quiz_id: quizId,
        p_seconds: 30,
      },
    );

    if (error) {
      console.error(error);
      alert(error.message);
    }
  }
  async function startLockCountdown() {
    const { error } = await supabase.rpc("qhl_admin_start_lock_countdown", {
      p_quiz_id: quizId,
      p_seconds: 30,
    });
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function completeAnswersFinalising() {
    const { error } = await supabase.rpc(
      "qhl_admin_complete_answers_finalising",
      {
        p_quiz_id: quizId,
      },
    );
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function swapAnswerSheets() {
    await supabase.rpc("qhl_admin_swap_answer_sheets", {
      p_quiz_id: quizId,
    });
  }

  async function completeSwapping() {
    await supabase.rpc("qhl_admin_complete_swapping", {
      p_quiz_id: quizId,
    });
  }

  async function startMarkingCountdown() {
    const { error } = await supabase.rpc("qhl_admin_start_marking_countdown", {
      p_quiz_id: quizId,
      p_seconds: 30,
    });
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function startSubmitMarksCountdown() {
    const { error } = await supabase.rpc(
      "qhl_admin_start_submit_marks_countdown",
      {
        p_quiz_id: quizId,
        p_seconds: 30,
      },
    );
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function completeMarksFinalising() {
    const { error } = await supabase.rpc(
      "qhl_admin_complete_marks_finalising",
      {
        p_quiz_id: quizId,
      },
    );
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function prepareLeaderboard() {
    const { error } = await supabase.rpc("qhl_admin_prepare_leaderboard", {
      p_quiz_id: quizId,
    });
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function completeLeaderboardPreparing() {
    const { error } = await supabase.rpc(
      "qhl_admin_complete_leaderboard_preparing",
      { p_quiz_id: quizId },
    );
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function showLeaderboard() {
    const { error } = await supabase.rpc("qhl_admin_show_leaderboard", {
      p_quiz_id: quizId,
    });
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function nextPart() {
    const { error } = await supabase.rpc("qhl_admin_next_part", {
      p_quiz_id: quizId,
    });
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function endQuiz() {
    const { error } = await supabase.rpc("qhl_admin_end_quiz", {
      p_quiz_id: quizId,
    });
    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className="rounded-xl border p-4 space-y-2">
      <div className="font-medium">Admin controls</div>

      <button
        onClick={startAnsweringCountdown}
        disabled={runtime.phase !== "LOBBY"}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-40"
      >
        Start answering countdown
      </button>

      <button
        onClick={startLockCountdown}
        disabled={runtime.phase !== "ANSWERING"}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-40"
      >
        Start lock countdown
      </button>

      <button
        onClick={completeAnswersFinalising}
        disabled={runtime.phase !== "ANSWERS_FINALISING"}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-40"
      >
        Confirm answers finalised
      </button>

      {runtime.phase === "ANSWERS_READY_TO_SWAP" && (
        <button onClick={swapAnswerSheets}>Swap answer sheets</button>
      )}

      {runtime.phase === "SWAPPING" && (
        <button onClick={completeSwapping}>Confirm swap complete</button>
      )}

      {/* MARKING_READY → COUNTDOWN_TO_MARKING */}
      {runtime.phase === "MARKING_READY" && (
        <button
          onClick={startMarkingCountdown}
          className="rounded bg-black px-3 py-2 text-white"
        >
          Start marking countdown
        </button>
      )}

      {/* MARKING → COUNTDOWN_TO_SUBMIT_MARKS */}
      {runtime.phase === "MARKING" && (
        <button
          onClick={startSubmitMarksCountdown}
          className="rounded bg-black px-3 py-2 text-white"
        >
          Start submit marks countdown
        </button>
      )}

      {/* MARKS_FINALISING → SCORES_READY */}
      {runtime.phase === "MARKS_FINALISING" && (
        <button
          onClick={completeMarksFinalising}
          className="rounded bg-black px-3 py-2 text-white"
        >
          Confirm marks finalised
        </button>
      )}

      {runtime.phase === "SCORES_READY" && (
        <button
          onClick={prepareLeaderboard}
          className="rounded bg-black px-3 py-2 text-white"
        >
          Prepare leaderboard
        </button>
      )}

      {runtime.phase === "LEADERBOARD_PREPARING" && (
        <button
          onClick={completeLeaderboardPreparing}
          className="rounded bg-black px-3 py-2 text-white"
        >
          Confirm leaderboard ready
        </button>
      )}

      {runtime.phase === "LEADERBOARD_READY" && (
        <button
          onClick={showLeaderboard}
          className="rounded bg-black px-3 py-2 text-white"
        >
          Show leaderboard
        </button>
      )}

      {runtime.phase === "SHOW_LEADERBOARD" && (
        <div className="flex gap-2">
          <button
            onClick={nextPart}
            className="rounded bg-black px-3 py-2 text-white"
          >
            Next part
          </button>
          <button
            onClick={endQuiz}
            className="rounded bg-black px-3 py-2 text-white"
          >
            End quiz
          </button>
        </div>
      )}

      <div className="text-xs opacity-70">Current phase: {runtime.phase}</div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";
import type { QuizVenueOption, TeamRow } from "@/src/qhl/teamTypes";

export function TeamJoinCard({
  quizId,
  onTeamChanged,
}: {
  quizId: string;
  onTeamChanged?: () => void;
}) {
  const [venues, setVenues] = useState<QuizVenueOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedQuizVenueId, setSelectedQuizVenueId] = useState("");
  const [venueCode, setVenueCode] = useState("");

  const [teamName, setTeamName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [myTeam, setMyTeam] = useState<TeamRow | null>(null);

  const selectedVenue = useMemo(
    () => venues.find((v) => v.quiz_venue_id === selectedQuizVenueId) ?? null,
    [venues, selectedQuizVenueId],
  );

  async function loadVenues() {
    setLoading(true);
    const { data, error } = await supabase.rpc("qhl_player_list_quiz_venues", {
      p_quiz_id: quizId,
    });
    if (error) {
      console.error(error);
      setVenues([]);
      setLoading(false);
      return;
    }
    setVenues((data ?? []) as QuizVenueOption[]);
    setLoading(false);
  }

  async function loadMyTeam() {
    const user = await supabase.auth.getUser();
    const uid = user.data.user?.id;
    if (!uid) return;

    const { data, error } = await supabase
      .from("qhl_team_members")
      .select("team_id")
      .eq("user_id", uid);

    if (error || !data?.length) {
      setMyTeam(null);
      return;
    }

    const teamIds = data.map((r: { team_id: string }) => r.team_id);

    const { data: tData, error: tErr } = await supabase
      .from("qhl_teams")
      .select("*")
      .eq("quiz_id", quizId)
      .in("id", teamIds)
      .limit(1);

    if (tErr) {
      console.error(tErr);
      setMyTeam(null);
      return;
    }

    setMyTeam((tData?.[0] as TeamRow) ?? null);
  }

  useEffect(() => {
    loadVenues();
    loadMyTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  async function createTeam() {
    if (!selectedQuizVenueId) return;

    const { data, error } = await supabase.rpc("qhl_player_create_team", {
      p_quiz_id: quizId,
      p_quiz_venue_id: selectedQuizVenueId,
      p_team_name: teamName,
      p_venue_access_code: venueCode || null,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setTeamName("");
    setJoinCode("");
    setMyTeam(data as TeamRow);

    setTimeout(() => onTeamChanged?.(), 0);
  }

  async function joinTeam() {
    const { data, error } = await supabase.rpc("qhl_player_join_team", {
      p_quiz_id: quizId,
      p_join_code: joinCode,
      p_venue_access_code: venueCode || null,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setJoinCode("");
    setMyTeam(data as TeamRow);

    setTimeout(() => onTeamChanged?.(), 0);
  }

  async function leaveTeam() {
    if (!myTeam) return;
    const { error } = await supabase.rpc("qhl_player_leave_team", {
      p_team_id: myTeam.id,
    });
    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }
    setMyTeam(null);

    setTimeout(() => onTeamChanged?.(), 0);
  }

  const createDisabled = !selectedQuizVenueId || teamName.trim().length === 0;
  const joinDisabled = joinCode.trim().length === 0;

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold tracking-tight text-slate-900">
            Team
          </div>
          <div className="mt-1 text-sm text-slate-600">
            Create a team or join with a code.
          </div>
        </div>

        {myTeam ? (
          <div className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-900">
            Joined
          </div>
        ) : null}
      </div>

      {myTeam ? (
        <div className="space-y-3">
          <div className="rounded-xl border bg-slate-50 p-4">
            <div className="text-sm text-slate-600">You’re in</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">
              {myTeam.name}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Join code{" "}
                <span className="font-mono rounded-md bg-white px-2 py-1 border text-slate-900">
                  {myTeam.join_code}
                </span>
              </div>

              <button
                className="rounded-xl border px-3 py-2 text-sm font-medium text-slate-800 hover:bg-white"
                onClick={leaveTeam}
              >
                Leave team
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Share the join code with teammates so they can join your team.
          </div>
        </div>
      ) : (
        <>
          {/* Venue */}
          <div className="space-y-2">
            {loading ? (
              <div className="text-sm text-slate-600">Loading venues…</div>
            ) : (
              <label className="block">
                <div className="text-sm font-medium text-slate-800">Venue</div>
                <div className="mt-1 text-sm text-slate-600">
                  Choose where you’re playing.
                </div>

                <select
                  className="mt-3 w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                  value={selectedQuizVenueId}
                  onChange={(e) => setSelectedQuizVenueId(e.target.value)}
                >
                  <option value="">Select venue…</option>
                  {venues.map((v) => (
                    <option key={v.quiz_venue_id} value={v.quiz_venue_id}>
                      {v.venue_name} {v.is_private ? "(Private)" : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {selectedVenue?.is_private && (
              <label className="block">
                <div className="text-sm font-medium text-slate-800">
                  Venue access code
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  This venue is private. Enter the access code to join.
                </div>
                <input
                  className="mt-3 w-full rounded-xl border bg-white px-3 py-2 text-sm font-mono text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  value={venueCode}
                  onChange={(e) => setVenueCode(e.target.value.toUpperCase())}
                  placeholder="e.g. P4TR0N"
                  autoCapitalize="characters"
                />
              </label>
            )}
          </div>

          {/* Create / Join */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border bg-gradient-to-br from-violet-50 via-white to-white p-4 space-y-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Create team
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  You’ll get a join code to share.
                </div>
              </div>

              <input
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name"
              />

              <button
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40"
                disabled={createDisabled}
                onClick={createTeam}
              >
                Create
              </button>
            </div>

            <div className="rounded-2xl border bg-gradient-to-br from-yellow-50 via-white to-white p-4 space-y-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Join team
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  Enter the code from your teammate.
                </div>
              </div>

              <input
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm font-mono text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="JOINCODE"
                autoCapitalize="characters"
              />

              <button
                className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40"
                disabled={joinDisabled}
                onClick={joinTeam}
              >
                Join
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

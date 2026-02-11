"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";

export function CreateVenueCard({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [teamCap, setTeamCap] = useState(10);
  const [saving, setSaving] = useState(false);

  const teamCapSafe = useMemo(
    () => Math.max(1, Math.floor(teamCap || 10)),
    [teamCap],
  );

  async function createVenue() {
    setSaving(true);

    const { error } = await supabase.from("qhl_venues").insert({
      name: name.trim() || "Untitled Venue",
      is_private: isPrivate,
      team_cap: teamCapSafe,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      setSaving(false);
      return;
    }

    setName("");
    setIsPrivate(false);
    setTeamCap(10);
    onCreated();
    setSaving(false);
  }

  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="font-medium">Create venue</div>

      <label className="block text-sm">
        <div className="opacity-70">Name</div>
        <input
          className="mt-1 w-full rounded border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="The Patreon Arms"
        />
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        Private venue (requires access code per quiz)
      </label>

      <label className="block text-sm">
        <div className="opacity-70">Team cap (default)</div>
        <input
          type="number"
          min={1}
          className="mt-1 w-full rounded border px-3 py-2"
          value={teamCap}
          onChange={(e) => setTeamCap(Number(e.target.value))}
        />
      </label>

      <button
        onClick={createVenue}
        disabled={saving}
        className="rounded bg-black px-3 py-2 text-white disabled:opacity-40"
      >
        {saving ? "Creating…" : "Create venue"}
      </button>
    </div>
  );
}

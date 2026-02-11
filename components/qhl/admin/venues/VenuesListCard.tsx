"use client";

import type { VenueRow } from "./AdminVenuesPage";

export function VenuesListCard({
  venues,
  loading,
  onRefresh,
}: {
  venues: VenueRow[];
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Venues</div>
        <button
          onClick={onRefresh}
          className="rounded border px-2 py-1 text-sm"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-sm opacity-70">Loading…</div>
      ) : venues.length === 0 ? (
        <div className="text-sm opacity-70">No venues yet.</div>
      ) : (
        <div className="space-y-2">
          {venues.map((v) => (
            <div key={v.id} className="rounded border p-3">
              <div className="font-medium">{v.name}</div>
              <div className="text-xs opacity-70">
                {v.is_private ? "Private" : "Public"} • Team cap: {v.team_cap}
              </div>
              <div className="text-xs opacity-50">ID: {v.id}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

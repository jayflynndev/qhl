"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { CreateVenueCard } from "@/components/qhl/admin/venues/CreateVenueCard";
import { VenuesListCard } from "@/components/qhl/admin/venues/VenuesListCard";

export type VenueRow = {
  id: string;
  name: string;
  is_private: boolean;
  team_cap: number;
  created_at: string;
};

export function AdminVenuesPage() {
  const [venues, setVenues] = useState<VenueRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("qhl_venues")
      .select("id,name,is_private,team_cap,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setVenues([]);
      setLoading(false);
      return;
    }

    setVenues((data ?? []) as VenueRow[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">QHL Venues</h1>
        <div className="text-sm opacity-70">
          Create venues (public or private). Private venues use per-quiz access
          codes.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <CreateVenueCard onCreated={load} />
        <VenuesListCard venues={venues} loading={loading} onRefresh={load} />
      </div>
    </div>
  );
}

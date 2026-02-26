"use client";

import { useState } from "react";

interface Props {
  campaignId: string;
  initialCount: number;
}

export default function AmenButton({
  campaignId,
  initialCount,
}: Props) {
  const [amen, setAmen] = useState<number>(initialCount);
  const [loading, setLoading] = useState(false);

  const handleAmen = async () => {
    if (loading) return;

    setAmen((prev: number) => prev + 1); // optimistic
    setLoading(true);

    await fetch("/api/amen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ campaignId }),
    });

    setLoading(false);
  };

  return (
    <div className="mt-6 text-center">
      <p className="mb-2 text-sm text-gray-500">
        🤲 {amen.toLocaleString()} Orang Mengaminkan
      </p>

      <button
        onClick={handleAmen}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Aamiin 🤍
      </button>
    </div>
  );
}

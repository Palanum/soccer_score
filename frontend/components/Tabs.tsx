"use client";

export default function Tabs({ tab, setTab }: any) {
  return (
    <div className="flex justify-center mt-4 space-x-6">
      {["live", "fixtures"].map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`pb-2 border-b-2 ${
            tab === t
              ? "border-green-500 text-green-600"
              : "border-transparent text-zinc-500"
          }`}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
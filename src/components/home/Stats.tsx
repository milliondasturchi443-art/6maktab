"use client";

import { Users, GraduationCap, DoorOpen, Trophy, Puzzle } from "lucide-react";
import { useEffect, useState } from "react";

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / 40);
    const id = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(id);
      } else setCount(start);
    }, 30);
    return () => clearInterval(id);
  }, [value]);
  return <>{count}</>;
}

export default function Stats({ data }: { data: { studentsCount: number | null; teachersCount: number | null; classesCount: number | null; achievementsCount: number | null; clubsCount: number | null } }) {
  const all = [
    { label: "O'quvchilar", value: data.studentsCount, icon: Users, color: "bg-blue-500" },
    { label: "O'qituvchilar", value: data.teachersCount, icon: GraduationCap, color: "bg-teal-600" },
    { label: "Sinflar", value: data.classesCount, icon: DoorOpen, color: "bg-violet-500" },
    { label: "Yutuqlar", value: data.achievementsCount, icon: Trophy, color: "bg-amber-500" },
    { label: "To'garaklar", value: data.clubsCount, icon: Puzzle, color: "bg-emerald-500" },
  ];
  const items = all.filter((it) => typeof it.value === "number" && it.value > 0);
  if (items.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
      <div className={`grid gap-4 ${items.length >= 5 ? "grid-cols-2 lg:grid-cols-5" : items.length === 4 ? "grid-cols-2 lg:grid-cols-4" : items.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {items.map((it) => (
          <div key={it.label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${it.color} flex items-center justify-center text-white mb-3`}>
              <it.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-extrabold dark:text-white"><Counter value={it.value!} /></div>
            <div className="text-xs text-zinc-500 mt-1">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

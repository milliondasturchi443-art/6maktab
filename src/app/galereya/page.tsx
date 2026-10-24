"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Gallery = { id: string; title: string; category: string | null; coverImage: string | null; images: { id: string; url: string }[] };

export default function GalereyaPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filter, setFilter] = useState("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gallery").then((r) => r.json()).then(setGalleries);
  }, []);

  const categories = ["all", ...new Set(galleries.map((g) => g.category).filter(Boolean) as string[])];
  const filtered = filter === "all" ? galleries : galleries.filter((g) => g.category === filter);
  // all images flattened for potential use
  void filtered.flatMap((g) => g.images.map((im) => im.url));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold dark:text-white">Galereya</h1>
      <p className="text-zinc-500 mt-2">Maktab hayotidan lavhalar</p>

      <div className="flex flex-wrap gap-2 mt-6">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c!)} className={`px-4 py-2 rounded-full text-sm font-medium border ${filter === c ? "bg-[#0f766e] text-white border-[#0f766e]" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 dark:text-zinc-300"}`}>
            {c === "all" ? "Barchasi" : c}
          </button>
        ))}
      </div>

      {filtered.map((g) => (
        <div key={g.id} className="mt-8">
          <h3 className="font-bold dark:text-white">{g.title} <span className="text-sm font-normal text-zinc-500">• {g.images.length} ta rasm</span></h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
            {g.images.map((im) => (
              <button key={im.id} onClick={() => setLightbox(im.url)} className="rounded-2xl overflow-hidden aspect-square bg-zinc-100 dark:bg-zinc-800 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </button>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && <p className="text-center text-zinc-500 mt-12">Rasmlar topilmadi.</p>}

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><X className="w-6 h-6" /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

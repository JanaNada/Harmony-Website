"use client";

import { C_BLUE, C_PINK, C_ORANGE } from "@/content/services";

/* Marketing sells badly as a capability list — every agency has the same one.
   It sells well as a single concrete moment, so the page opens with one. */

export function MarketingStory() {
  return (
    <div className="rounded-[40px] overflow-hidden border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_60px_-25px_rgba(0,0,0,0.1)]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* The moment */}
        <div className="p-9 md:p-14 lg:p-20 flex flex-col justify-center">
          <span
            className="text-xs font-bold uppercase tracking-widest mb-6"
            style={{ color: C_BLUE }}
          >
            How we think about it
          </span>

          <p className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-[#1a1a1a] mb-7">
            You order an ice cream. It arrives with a spoon made of chocolate.
          </p>

          <div className="flex flex-col gap-8 text-xl md:text-2xl leading-[1.8] text-[#1a1a1a]/70 font-medium">
            <p>
              Nobody asked for that. It costs almost nothing. But now the dessert is a
              small event — the guest photographs it before they eat it, and they tell
              someone about it later.
            </p>
            <p>
              That's the part of marketing we care about most: the thing the guest is
              actually holding. Get that right and the content makes itself.
            </p>
          </div>

          <div className="mt-9 pt-8 border-t border-black/[0.07] grid grid-cols-3 gap-8">
            {[
              { n: "01", t: "Design the moment", c: C_ORANGE },
              { n: "02", t: "Capture it properly", c: C_PINK },
              { n: "03", t: "Put it where people are", c: C_BLUE },
            ].map((s) => (
              <div key={s.n}>
                <div
                  className="font-extrabold text-6xl tracking-tighter mb-2 opacity-40"
                  style={{ color: s.c }}
                >
                  {s.n}
                </div>
                <div className="text-2xl font-bold leading-[1.3] text-[#1a1a1a]">
                  {s.t}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="relative min-h-[400px] lg:min-h-[500px] order-first lg:order-last flex items-center justify-center p-8 lg:p-12">
          <div className="w-full h-full max-w-[400px] max-h-[500px] rounded-3xl overflow-hidden shadow-2xl relative">
            <img
              src="https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=1000&q=80"
              alt="An ice cream served with a chocolate spoon"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/20 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}







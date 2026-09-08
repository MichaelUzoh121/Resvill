import React from "react";
import { Camera } from "lucide-react";

function Row1() {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
      <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2">
          <Camera size={15} className="text-primary-500" />

          <span className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
            Gallery
          </span>
        </div>

        <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-dark-950 sm:text-5xl">
          A taste of what's
          <span className="block text-primary-500">waiting for you.</span>
        </h1>

        <p className="mt-6 text-base leading-7 text-dark-500 sm:text-lg">
          A look inside our kitchen, our dining space, and the dishes
          that keep our customers coming back.
        </p>
      </div>
    </section>
  );
}

export default Row1;

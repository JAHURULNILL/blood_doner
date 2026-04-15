"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image: "/one.jpg",
    alt: "ফ্রি মেডিকেল ক্যাম্পের আয়োজকদের ছবি"
  },
  {
    image: "/two.jpg",
    alt: "ফ্রি মেডিকেল ক্যাম্পে অংশগ্রহণকারীদের ছবি"
  }
] as const;

export function MedicalCampCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => setActiveIndex((current) => (current === 0 ? slides.length - 1 : current - 1));
  const goToNext = () => setActiveIndex((current) => (current === slides.length - 1 ? 0 : current + 1));

  return (
    <section className="container-shell space-y-8 py-16">
      <div className="space-y-3">
        <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
          চলমান আয়োজন
        </div>
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">ফ্রি মেডিকেল ক্যাম্প</h2>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-white shadow-soft">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary/40">
          {slides.map((slide, index) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-500 ${index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <Image src={slide.image} alt={slide.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1200px" priority={index === 0} />
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent px-5 py-5 sm:px-7">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1 text-white">
                <p className="text-xl font-semibold sm:text-2xl">ফ্রি মেডিকেল ক্যাম্প</p>
                <p className="max-w-2xl text-sm leading-6 text-white/88 sm:text-base">আমাদের আয়োজনের কিছু বাস্তব মুহূর্ত।</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="border-white/25 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                  onClick={goToPrevious}
                  aria-label="আগের ছবি"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="border-white/25 bg-white/12 text-white hover:bg-white/20 hover:text-white"
                  onClick={goToNext}
                  aria-label="পরের ছবি"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 px-5 py-4">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`ছবি ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-primary/25"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

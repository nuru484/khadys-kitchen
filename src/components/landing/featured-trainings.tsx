"use client";

import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { TrainingCard } from "@/components/trainings/training-card";
import { routes } from "@/lib/routes";
import { useGetPublicTrainingsQuery } from "@/redux/trainings/trainings-api";

// Fixed tracks (not auto-fit): one or two featured classes keep the same card
// width as a full row of three instead of stretching across the section.
const GRID_CLASS =
  "grid grid-cols-1 gap-[clamp(20px,3vw,32px)] sm:grid-cols-2 lg:grid-cols-3";

/**
 * Home page teaser for the Bake School: the newest three featured classes
 * (admin picks them with the "Featured on the home page" toggle), rendered
 * with the catalogue's TrainingCard. When nothing is featured (or the API
 * can't be reached) the section disappears entirely. Sits on the oat band
 * (like Story) so it reads as its own section against the dark CTA below.
 */
export function FeaturedTrainings() {
  const { data, isLoading, isError } = useGetPublicTrainingsQuery({
    featured: true,
    limit: 3,
  });

  const trainings = data?.data ?? [];
  if (isError || (!isLoading && trainings.length === 0)) return null;

  return (
    <section className="border-y border-ink/10 bg-oat">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] py-[clamp(56px,8vw,100px)]">
      <Reveal className="mb-[clamp(32px,5vw,52px)] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <h2 className="font-serif text-[clamp(32px,4vw,52px)] font-normal">
          Learn to bake it
        </h2>
        <Link
          href={routes.trainings}
          className="text-[13px] font-semibold uppercase tracking-[0.1em] text-accent no-underline transition-colors hover:text-ink"
        >
          All trainings →
        </Link>
      </Reveal>

      {isLoading ? (
        <div className={GRID_CLASS}>
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              aria-busy="true"
              className="h-[420px] animate-pulse rounded-[18px] bg-ink/[0.06]"
            />
          ))}
        </div>
      ) : (
        <div className={GRID_CLASS}>
          {trainings.map((training) => (
            <TrainingCard key={training.id} training={training} />
          ))}
        </div>
      )}
      </div>
    </section>
  );
}

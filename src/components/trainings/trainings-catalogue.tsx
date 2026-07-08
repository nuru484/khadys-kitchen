"use client";

import { TrainingCard } from "@/components/trainings/training-card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { routes } from "@/lib/routes";
import { useGetPublicTrainingsQuery } from "@/redux/trainings/trainings-api";

/**
 * The catalogue: every published class in one responsive grid. One fetch —
 * the list is a bakery school's worth, so no pagination UI.
 */
export function TrainingsCatalogue() {
  const { data, isLoading, isError, error, refetch } =
    useGetPublicTrainingsQuery({ limit: 100 });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-[clamp(20px,3vw,32px)] sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[420px] animate-pulse rounded-[18px] bg-ink/[0.06]"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => void refetch()} />;
  }

  const trainings = data?.data ?? [];

  if (trainings.length === 0) {
    return (
      <EmptyState
        eyebrow="Khady's Kitchen Trainings"
        title="No classes are published just yet"
        description="New trainings are announced here first. Message us and we'll tell you the moment enrolment opens - places fill fast."
        action={{ label: "Ask about upcoming classes", href: routes.contact }}
        className="my-2"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[clamp(20px,3vw,32px)] sm:grid-cols-2 lg:grid-cols-3">
      {trainings.map((training) => (
        <TrainingCard key={training.id} training={training} />
      ))}
    </div>
  );
}

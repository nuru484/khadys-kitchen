"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/admin/ui";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { RippleLoader } from "@/components/ui/Loader";
import { ApplicationsTable } from "@/components/admin/applications-table";
import { StudentsTable } from "@/components/admin/students-table";
import { notify } from "@/lib/notify";
import { extractApiError } from "@/lib/extract-api-error";
import { formatMoney } from "@/lib/format-money";
import { formatDate } from "@/lib/format-date";
import {
  useDeleteTrainingMutation,
  useGetTrainingByIdQuery,
  usePublishTrainingMutation,
  useUnpublishTrainingMutation,
} from "@/redux/trainings/trainings-api";

export default function TrainingDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [tab, setTab] = useState<"applications" | "students">("applications");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: training, isLoading, isError, error, refetch } =
    useGetTrainingByIdQuery(id);
  const [publish, { isLoading: publishing }] = usePublishTrainingMutation();
  const [unpublish, { isLoading: unpublishing }] = useUnpublishTrainingMutation();
  const [deleteTraining, { isLoading: deleting }] = useDeleteTrainingMutation();

  if (isLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <RippleLoader />
      </div>
    );
  }
  if (isError || !training) {
    return (
      <div style={{ animation: "kk-rise .5s both" }}>
        <ErrorState error={error} onRetry={() => void refetch()} />
        <Link href="/admin/classes" className="mt-3 inline-block font-semibold text-accent">
          ← All trainings
        </Link>
      </div>
    );
  }

  const togglePublish = async () => {
    try {
      if (training.isPublished) await unpublish(id).unwrap();
      else await publish(id).unwrap();
      notify.success(training.isPublished ? "Unpublished" : "Published");
    } catch (err) {
      notify.error("Action failed", { description: extractApiError(err).message });
    }
  };

  const onDelete = async () => {
    try {
      await deleteTraining(id).unwrap();
      notify.success("Training deleted");
      router.push("/admin/classes");
    } catch (err) {
      notify.error("Couldn't delete", { description: extractApiError(err).message });
    }
  };

  const facts: [string, string][] = [
    ["Slug", training.slug],
    ["Currency", training.currency],
    ["Applications", training.applicationsOpen ? "Open" : "Closed"],
    ["Capacity", training.capacity != null ? String(training.capacity) : "—"],
    ["Hostel places", training.hostelCapacity != null ? String(training.hostelCapacity) : "—"],
    ["Starts", formatDate(training.startDate)],
    ["Ends", formatDate(training.endDate)],
  ];

  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <Link href="/admin/classes" className="mb-4 inline-block text-[13.5px] font-semibold text-accent">
        ← All trainings
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[clamp(26px,3.4vw,38px)] font-normal">{training.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={training.status} />
            <StatusBadge
              status={training.isPublished ? "PUBLISHED" : "DRAFT"}
              label={training.isPublished ? "Published" : "Unpublished"}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant={training.isPublished ? "outline" : "primary"}
            isLoading={publishing || unpublishing}
            onClick={togglePublish}
          >
            {training.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[18px]">
        <Card className="p-[clamp(20px,3vw,28px)]">
          <h2 className="mb-4 font-serif text-[19px]">Overview</h2>
          <div className="grid gap-2.5">
            {facts.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 text-[14px]">
                <span className="text-ink/55">{label}</span>
                <span className="font-medium text-ink">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-ink/10 pt-4 text-[14px] leading-[1.6] text-ink/70">
            {training.description}
          </p>
        </Card>

        <Card className="p-[clamp(20px,3vw,28px)]">
          <h2 className="mb-4 font-serif text-[19px]">Fees</h2>
          {training.feeItems && training.feeItems.length > 0 ? (
            <div className="grid gap-2">
              {training.feeItems.map((f) => (
                <div key={f.id} className="flex items-baseline justify-between gap-4 text-[14px]">
                  <span className="text-ink/70">
                    {f.name}
                    {f.required ? "" : " (optional)"}
                  </span>
                  <span className="font-medium text-ink">
                    {f.priceLabel ?? formatMoney(f.amount, training.currency)}
                    {f.suffix ? ` ${f.suffix}` : ""}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[14px] text-ink/50">No fees configured.</p>
          )}
        </Card>
      </div>

      {/* Applications + Students */}
      <div className="mt-8">
        <div className="mb-4 flex gap-2">
          {(["applications", "students"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={
                "rounded-full px-4 py-2 text-[14px] font-semibold capitalize transition-colors " +
                (tab === t ? "bg-ink text-cream" : "text-ink/60 hover:bg-ink/[0.06]")
              }
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "applications" ? (
          <ApplicationsTable trainingId={id} />
        ) : (
          <StudentsTable trainingId={id} />
        )}
      </div>

      <ConfirmationDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this training?"
        description="This hides the cohort and its data. This can't be undone from here."
        confirmText={deleting ? "Deleting…" : "Delete training"}
        isDestructive
        onConfirm={onDelete}
      />
    </div>
  );
}

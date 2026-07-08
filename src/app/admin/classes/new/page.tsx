import Link from "next/link";
import { TrainingForm } from "@/components/admin/training-form";

export default function NewTrainingPage() {
  return (
    <div style={{ animation: "kk-rise .5s both" }}>
      <Link
        href="/admin/classes"
        className="mb-4 inline-block text-[13.5px] font-semibold text-accent"
      >
        ← All trainings
      </Link>
      <div className="mb-6">
        <h1 className="font-serif text-[26px] font-normal text-ink">New training</h1>
        <p className="mt-1 text-[14px] text-ink/55">
          Configure a training class. It stays a draft until you publish it.
        </p>
      </div>
      <TrainingForm />
    </div>
  );
}

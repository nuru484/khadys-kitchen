"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdmin } from "@/lib/admin/store";
import { ItemForm } from "@/components/admin/item-form";

export default function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const { getItem } = useAdmin();
  const item = getItem(id);

  if (!item) {
    return (
      <div style={{ animation: "kk-rise .5s both" }}>
        <p className="text-[15px] text-ink/60">This item no longer exists.</p>
        <Link href="/admin/items" className="mt-3 inline-block font-semibold text-accent">
          ← All items
        </Link>
      </div>
    );
  }

  return <ItemForm initial={item} />;
}

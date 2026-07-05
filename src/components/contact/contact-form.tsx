"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import {
  CONTACT_TOPICS,
  contactSchema,
  type ContactValues,
} from "@/validations/contact-schema";

const inputClass =
  "w-full rounded-[12px] border border-ink/20 bg-cream px-4 py-3.5 font-sans text-[16px] text-ink outline-none transition-colors focus:border-accent";

const labelClass =
  "grid gap-2 text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [senderName, setSenderName] = useState("friend");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", contact: "", message: "", topic: "An order" },
  });

  const topic = watch("topic");
  const errorMessage =
    errors.name?.message ?? errors.contact?.message ?? errors.message?.message;

  const onSubmit = (data: ContactValues) => {
    setSenderName(data.name.trim().split(" ")[0] || "friend");
    setSent(true);
  };

  return (
    <section className="border-t border-ink/10 bg-oat">
      <div className="mx-auto max-w-[600px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,7vw,88px)]">
        <Reveal variant="mask">
          <h2 className="mb-2.5 text-center font-serif text-[clamp(28px,3.4vw,42px)] font-normal">
            Send us a message
          </h2>
          <p className="mx-auto mb-[26px] max-w-[44ch] text-center text-[15px] leading-[1.6] text-ink/65">
            Tell us what you need — we&rsquo;ll come back on WhatsApp or email.
          </p>
        </Reveal>

        {sent ? (
          <div
            className="rounded-[22px] border border-ink/10 bg-card p-[clamp(36px,5vw,52px)] text-center"
            style={{ animation: "kk-fadein .7s both" }}
          >
            <div className="mx-auto mb-5 grid h-[60px] w-[60px] place-items-center rounded-full bg-accent text-[26px] text-[#FDFAF3]">
              ✓
            </div>
            <h3 className="mb-2.5 font-serif text-[26px] font-normal">
              Message sent
            </h3>
            <p className="text-[15.5px] leading-[1.65] text-ink/70">
              Thank you, {senderName} — we&rsquo;ll be in touch shortly.
            </p>
          </div>
        ) : (
          <Reveal variant="blur">
            <form
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-5 rounded-[22px] border border-ink/10 bg-card p-[clamp(24px,4vw,40px)]"
            >
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-5">
                <label className={labelClass}>
                  Your name
                  <input
                    {...register("name")}
                    placeholder="e.g. Kofi Owusu"
                    className={inputClass}
                  />
                </label>
                <label className={labelClass}>
                  Phone or email
                  <input
                    {...register("contact")}
                    placeholder="How do we reach you?"
                    className={inputClass}
                  />
                </label>
              </div>

              <div className="grid gap-2.5">
                <span className="text-[13.5px] font-semibold uppercase tracking-[0.06em] text-ink/70">
                  What&rsquo;s it about?
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {CONTACT_TOPICS.map((t) => {
                    const on = topic === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setValue("topic", t, { shouldValidate: true })
                        }
                        className={cn(
                          "cursor-pointer rounded-full border-[1.5px] px-5 py-2.5 font-sans text-[14px] font-semibold transition-colors",
                          on
                            ? "border-accent bg-accent text-[#FDFAF3]"
                            : "border-ink/25 bg-transparent text-ink hover:border-ink/50",
                        )}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className={labelClass}>
                Message
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Tell us about your order, event, or question…"
                  className={cn(inputClass, "resize-y")}
                />
              </label>

              {errorMessage ? (
                <div className="rounded-[12px] border border-danger/25 bg-danger/[0.08] px-4 py-3 text-[14.5px] text-danger">
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                className="cursor-pointer rounded-full border-none bg-accent px-[34px] py-[17px] font-sans text-[15.5px] font-semibold tracking-[0.06em] text-[#FDFAF3] transition-colors hover:bg-ink"
              >
                Send message
              </button>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}

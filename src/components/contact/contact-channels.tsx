import { Reveal } from "@/components/reveal";

interface Channel {
  label: string;
  desc: string;
  value: string;
  /** Email wraps and is a touch smaller; the rest stay on one line. */
  wrap?: boolean;
}

const CHANNELS: Channel[] = [
  {
    label: "WhatsApp · fastest",
    desc: "Orders, cake quotes and class questions. We reply within the hour, 7 am - 7 pm.",
    value: "+233 24 000 0000",
  },
  {
    label: "Email",
    desc: "For wholesale, events and anything with an attachment. Within two working days.",
    value: "hello@khadyskitchen.com",
    wrap: true,
  },
  {
    label: "Visit",
    desc: "Wed - Fri 7 am until sold out · Sat - Sun 8 am - 2 pm · closed Mon - Tue.",
    value: "Kumasi, Ghana",
  },
  {
    label: "Social",
    desc: "Daily bake photos, sold-out alerts and student showcases on Instagram & TikTok.",
    value: "@khadyskitchen",
  },
];

export function ContactChannels() {
  return (
    <section className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,48px)] pb-[clamp(48px,7vw,88px)] pt-[clamp(24px,4vw,48px)]">
      {CHANNELS.map((channel, i) => (
        <Reveal
          key={channel.label}
          className={`flex flex-wrap items-start justify-between gap-x-12 gap-y-3.5 border-t border-ink/[0.18] py-[clamp(22px,3vw,32px)] ${
            i === CHANNELS.length - 1 ? "border-b" : ""
          }`}
        >
          <div className="flex-[1_1_300px]">
            <div className="mb-2 text-[13px] font-semibold uppercase tracking-[0.2em] text-accent">
              {channel.label}
            </div>
            <p className="max-w-[44ch] text-[14.5px] leading-[1.6] text-ink/[0.62]">
              {channel.desc}
            </p>
          </div>
          <div
            className={
              channel.wrap
                ? "flex-[0_1_auto] break-words font-serif text-[clamp(21px,2.6vw,34px)] leading-[1.15] [overflow-wrap:anywhere]"
                : "flex-none whitespace-nowrap font-serif text-[clamp(24px,3vw,38px)] leading-[1.15]"
            }
          >
            {channel.value}
          </div>
        </Reveal>
      ))}
    </section>
  );
}

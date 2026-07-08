import { brandOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const alt = "Track your Khady's Kitchen order";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TrackOrderOpengraphImage() {
  return brandOgImage({
    eyebrow: "The Shop · Order tracking",
    title: "Track your order.",
    subtitle: "See baking progress, pickup day, and any balance - live.",
    cta: "Track it at khadyskitchen.com →",
  });
}

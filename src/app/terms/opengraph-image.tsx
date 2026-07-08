import { brandOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const alt = "Khady's Kitchen Terms of Service";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function TermsOpengraphImage() {
  return brandOgImage({
    eyebrow: "Legal · Khady's Kitchen",
    title: "Terms of Service",
    subtitle: "The terms for ordering bakes, enrolling, and using our services.",
    cta: "Read them at khadyskitchen.com →",
  });
}

import { brandOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const alt = "Khady's Kitchen Privacy Policy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function PrivacyOpengraphImage() {
  return brandOgImage({
    eyebrow: "Legal · Khady's Kitchen",
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect the information you share.",
    cta: "Read it at khadyskitchen.com →",
  });
}

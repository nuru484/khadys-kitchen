import { brandOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const alt = "Khady's Kitchen - Kumasi patisserie, the authentic taste";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return brandOgImage({
    eyebrow: "Kumasi patisserie · The authentic taste",
    title: "Khady's Kitchen",
    subtitle: "Baked before sunrise, gone by noon.",
  });
}

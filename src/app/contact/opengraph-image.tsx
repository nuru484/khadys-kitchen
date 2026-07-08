import { brandOgImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og-template";

export const alt = "Contact Khady's Kitchen - Kumasi patisserie";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function ContactOpengraphImage() {
  return brandOgImage({
    eyebrow: "Get in touch · Kumasi, Ghana",
    title: "Contact us",
    subtitle: "WhatsApp, email, or drop by - orders and classes reach a human.",
    cta: "Message us at khadyskitchen.com →",
  });
}

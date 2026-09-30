import { PageHero } from "@/components/sections/PageHero";
import { notFound } from "next/navigation";
import { getTestimonials } from "@/lib/content/repository";
import { buildMetadata } from "@/lib/seo/metadata";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
export const dynamic = "force-static";
export async function generateMetadata() { return buildMetadata({ title: "Testimonials", canonicalPath: "/testimonials" }); }
export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  if (!testimonials.length) notFound();
  return <><PageHero eyebrow="Testimonials" title="In their words." /><TestimonialsSection testimonials={testimonials} /></>;
}

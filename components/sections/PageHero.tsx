import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Reveal } from "@/components/ui/Reveal";

/** Shared editorial hero for static pages and the property archive. */
export function PageHero({ eyebrow, title, description, links }: {
  eyebrow: string;
  title: string;
  description?: string;
  links?: { label: string; href: string }[];
}) {
  return <Section variant="dark" aria-label={`${eyebrow} hero`} style={{ paddingTop: "clamp(8rem, 14vw, 12rem)" }}>
    <Container>
      <Reveal><Eyebrow theme="dark" style={{ marginBottom: "1.5rem" }}>{eyebrow}</Eyebrow></Reveal>
      <SplitHeading as="h1" mountOnLoad delay={0.05} stagger={0.1} style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(2.5rem, 6vw, 6rem)",
        fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 0.95,
        color: "var(--color-bone)", maxWidth: "20ch",
      }}>{title}</SplitHeading>
      {description && <p className="page-hero-intro">{description}</p>}
      {!!links?.length && <nav className="page-hero-nav" aria-label={`${eyebrow} page sections`}>
        {links.map(link => <a key={link.href} href={link.href}>{link.label} <span aria-hidden>↗</span></a>)}
      </nav>}
      <Reveal delay={0.6}><div aria-hidden className="page-hero-rule" /></Reveal>
    </Container>
  </Section>;
}

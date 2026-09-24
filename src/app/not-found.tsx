import { Section } from '@/components/layout/Section';
import { Cta, EditorialLink } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Section ground="cream" density="air">
      <h1 className="max-w-[18ch] font-serif text-d2 text-forest">Siden findes ikke.</h1>
      <p className="mt-6 max-w-meas-n text-body">
        Den er enten flyttet, eller adressen er skrevet forkert. Prøv forsiden, eller se hvad vi
        måler.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-[22px]">
        <Cta href="/">Til forsiden</Cta>
        <EditorialLink href="/hvad-vi-maaler">Se hvad vi måler</EditorialLink>
      </div>
    </Section>
  );
}

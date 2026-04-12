export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
          Légal
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface">
          Conditions générales d&apos;utilisation
        </h1>
        <p className="mt-4 font-body text-sm text-on-surface-variant">
          Dernière mise à jour : 12 avril 2026
        </p>
      </div>

      <div className="mt-16 space-y-8">
        <Section title="1. Objet">
          Les présentes CGU régissent l&apos;utilisation de la plateforme Callpme,
          éditée par Pirabel Labs. En créant un compte, vous acceptez ces conditions
          dans leur intégralité.
        </Section>

        <Section title="2. Description du service">
          Callpme est une plateforme SaaS B2B permettant de créer et gérer des agents
          d&apos;appels téléphoniques propulsés par l&apos;intelligence artificielle.
          Le service comprend : création d&apos;agents vocaux, gestion de workspaces,
          campagnes d&apos;appels, bases de connaissances, API REST et webhooks.
        </Section>

        <Section title="3. Inscription et compte">
          L&apos;inscription est gratuite. Vous êtes responsable de la confidentialité
          de vos identifiants. Chaque compte est personnel et ne peut être partagé.
          Vous devez fournir des informations exactes lors de l&apos;inscription.
        </Section>

        <Section title="4. Facturation">
          La facturation est basée sur la consommation de minutes par workspace.
          Les tarifs en vigueur sont affichés sur la page Tarifs. Les dépassements
          sont facturés au tarif configuré dans le workspace. Les factures sont
          émises mensuellement via Stripe.
        </Section>

        <Section title="5. Utilisation acceptable">
          Il est interdit d&apos;utiliser Callpme pour :
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Des appels frauduleux, de harcèlement ou de spam</li>
            <li>Usurper l&apos;identité d&apos;une personne physique ou morale</li>
            <li>Contourner les limites techniques ou de facturation</li>
            <li>Collecter des données personnelles sans consentement</li>
            <li>Toute activité illégale au regard du droit français</li>
          </ul>
        </Section>

        <Section title="6. Mention légale IA">
          Conformément à la réglementation en vigueur, chaque agent publié doit
          inclure une mention informant l&apos;interlocuteur qu&apos;il converse avec
          une intelligence artificielle (aiTransparencyPrompt).
        </Section>

        <Section title="7. Propriété intellectuelle">
          La plateforme Callpme, son code source, son design et sa documentation
          sont la propriété exclusive de Pirabel Labs. Les données créées par
          l&apos;utilisateur (prompts, configurations, contacts) restent sa propriété.
        </Section>

        <Section title="8. Limitation de responsabilité">
          Callpme est fourni &quot;en l&apos;état&quot;. Pirabel Labs ne garantit pas
          une disponibilité de 100% et ne saurait être tenu responsable des
          interruptions de service liées à des tiers (Vapi, providers TTS, opérateurs
          télécom).
        </Section>

        <Section title="9. Résiliation">
          Vous pouvez supprimer votre compte à tout moment depuis les Paramètres.
          Pirabel Labs se réserve le droit de suspendre ou supprimer un compte
          en cas de violation des CGU, avec notification préalable de 48h.
        </Section>

        <Section title="10. Droit applicable">
          Les présentes CGU sont soumises au droit français. Tout litige sera porté
          devant les tribunaux compétents de Paris.
        </Section>

        <Section title="11. Contact">
          Pour toute question relative aux CGU :{" "}
          <a href="mailto:legal@callpme.com" className="text-primary hover:underline">legal@callpme.com</a>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold text-on-surface">{title}</h2>
      <div className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">{children}</div>
    </div>
  );
}

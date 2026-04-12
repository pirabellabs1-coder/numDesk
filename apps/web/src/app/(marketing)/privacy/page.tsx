export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-32 pb-20">
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
          Légal
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface">
          Politique de confidentialité
        </h1>
        <p className="mt-4 font-body text-sm text-on-surface-variant">
          Dernière mise à jour : 12 avril 2026
        </p>
      </div>

      <div className="legal-content mt-16 space-y-8">
        <Section title="1. Responsable du traitement">
          La plateforme Callpme est éditée par <strong>Pirabel Labs</strong>, agence
          spécialisée en développement web, marketing digital et automatisation, basée à
          Paris, France. Contact : <a href="mailto:privacy@callpme.com" className="text-primary hover:underline">privacy@callpme.com</a>
        </Section>

        <Section title="2. Données collectées">
          Nous collectons les données suivantes lors de votre utilisation de Callpme :
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Données d&apos;inscription : nom, prénom, email, nom d&apos;agence</li>
            <li>Données d&apos;appels : numéros (pseudonymisés), durée, transcriptions, enregistrements audio</li>
            <li>Données de facturation : historique des cycles, consommation de minutes</li>
            <li>Données techniques : logs de connexion, adresse IP, agent utilisateur</li>
          </ul>
        </Section>

        <Section title="3. Finalités du traitement">
          Vos données sont traitées pour :
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Fournir et améliorer le service Callpme</li>
            <li>Gérer votre compte et vos workspaces</li>
            <li>Facturer les services consommés</li>
            <li>Assurer la sécurité de la plateforme</li>
            <li>Répondre à vos demandes de support</li>
          </ul>
        </Section>

        <Section title="4. Base légale">
          Le traitement repose sur l&apos;exécution du contrat (CGU), votre consentement pour
          les enregistrements audio, et notre intérêt légitime pour la sécurité et l&apos;amélioration
          du service.
        </Section>

        <Section title="5. Durée de conservation">
          <ul className="list-disc pl-6 space-y-1">
            <li>Données de compte : durée de la relation contractuelle + 3 ans</li>
            <li>Enregistrements audio : configurable par workspace (défaut 90 jours)</li>
            <li>Transcriptions : durée de vie du workspace</li>
            <li>Logs techniques : 12 mois</li>
            <li>Données de facturation : 10 ans (obligation légale)</li>
          </ul>
        </Section>

        <Section title="6. Partage des données">
          Vos données ne sont jamais vendues. Elles sont partagées uniquement avec nos
          sous-traitants techniques : Supabase (hébergement EU), Vapi (orchestration vocale),
          Stripe (paiement), Cartesia/ElevenLabs/Google (synthèse vocale).
        </Section>

        <Section title="7. Hébergement et sécurité">
          Toutes les données sont hébergées dans l&apos;Union Européenne (Frankfurt, Allemagne).
          Les communications sont chiffrées en TLS 1.3. Les credentials sont chiffrés
          AES-256 au repos.
        </Section>

        <Section title="8. Vos droits">
          Conformément au RGPD, vous disposez des droits d&apos;accès, de rectification,
          d&apos;effacement, de portabilité, de limitation et d&apos;opposition.
          Contactez <a href="mailto:privacy@callpme.com" className="text-primary hover:underline">privacy@callpme.com</a>.
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

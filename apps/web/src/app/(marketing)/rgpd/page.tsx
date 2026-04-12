import { Shield, Database, Clock, Download, Trash2, UserCheck } from "lucide-react";

const rights = [
  {
    icon: UserCheck,
    title: "Droit d'accès",
    description: "Vous pouvez demander une copie de toutes les données personnelles que nous détenons à votre sujet.",
  },
  {
    icon: Database,
    title: "Droit de rectification",
    description: "Vous pouvez demander la correction de données inexactes ou incomplètes vous concernant.",
  },
  {
    icon: Trash2,
    title: "Droit à l'effacement",
    description: "Vous pouvez demander la suppression de vos données personnelles (droit à l'oubli).",
  },
  {
    icon: Download,
    title: "Droit à la portabilité",
    description: "Vous pouvez recevoir vos données dans un format structuré et lisible par machine.",
  },
  {
    icon: Clock,
    title: "Droit à la limitation",
    description: "Vous pouvez demander la limitation du traitement de vos données dans certains cas.",
  },
  {
    icon: Shield,
    title: "Droit d'opposition",
    description: "Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes.",
  },
];

const dataTypes = [
  {
    category: "Données d'identité",
    data: "Nom, prénom, email, nom d'agence",
    retention: "Durée du contrat + 3 ans",
    legal: "Exécution du contrat",
  },
  {
    category: "Données d'appels",
    data: "Transcriptions, durée, statut, sentiment",
    retention: "Configurable (défaut 90j)",
    legal: "Exécution du contrat",
  },
  {
    category: "Enregistrements audio",
    data: "Fichiers audio des conversations",
    retention: "Configurable (défaut 90j)",
    legal: "Consentement",
  },
  {
    category: "Données de facturation",
    data: "Cycles, minutes, montants",
    retention: "10 ans (obligation légale)",
    legal: "Obligation légale",
  },
  {
    category: "Données techniques",
    data: "IP, user agent, logs de connexion",
    retention: "12 mois",
    legal: "Intérêt légitime",
  },
  {
    category: "Numéros de téléphone",
    data: "Numéros des appelants (pseudonymisés)",
    retention: "Durée du workspace",
    legal: "Exécution du contrat",
  },
];

export default function RGPDPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pt-32 pb-20">
      <div className="text-center">
        <span className="font-nav text-[10px] font-bold tracking-[0.2em] text-secondary uppercase">
          Conformité
        </span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-on-surface md:text-5xl">
          Conformité <span className="text-gradient-primary">RGPD</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant">
          Callpme, édité par Pirabel Labs, est conçu dès sa conception pour
          respecter le Règlement Général sur la Protection des Données.
        </p>
      </div>

      {/* Key points */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Hébergement", value: "EU (Frankfurt)", color: "primary" },
          { label: "Chiffrement", value: "AES-256 + TLS 1.3", color: "secondary" },
          { label: "DPO", value: "privacy@callpme.com", color: "tertiary" },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-white/5 bg-card p-4 text-center">
            <p className={`font-display text-lg font-bold text-${item.color}`}>{item.value}</p>
            <p className="mt-1 font-body text-xs text-on-surface-variant">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Your rights */}
      <div className="mt-16">
        <h2 className="text-center font-display text-2xl font-bold text-on-surface">
          Vos droits
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rights.map((right) => (
            <div key={right.title} className="rounded-xl border border-white/5 bg-card p-5">
              <right.icon size={20} className="text-secondary" />
              <h3 className="mt-3 font-display text-sm font-semibold text-on-surface">{right.title}</h3>
              <p className="mt-2 font-body text-xs leading-relaxed text-on-surface-variant">{right.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Data register */}
      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold text-on-surface">
          Registre des traitements
        </h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {["Catégorie", "Données", "Conservation", "Base légale"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-nav text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataTypes.map((d) => (
                <tr key={d.category} className="border-b border-white/5">
                  <td className="px-4 py-3 font-body text-sm font-medium text-on-surface">{d.category}</td>
                  <td className="px-4 py-3 font-body text-sm text-on-surface-variant">{d.data}</td>
                  <td className="px-4 py-3 font-body text-sm text-on-surface-variant">{d.retention}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 font-nav text-[9px] font-bold text-primary">
                      {d.legal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact DPO */}
      <div className="mt-16 rounded-2xl border border-secondary/20 bg-secondary/5 p-8 text-center">
        <h3 className="font-display text-lg font-semibold text-on-surface">Exercer vos droits</h3>
        <p className="mt-3 font-body text-sm text-on-surface-variant">
          Pour exercer vos droits RGPD ou pour toute question relative à la
          protection de vos données, contactez notre DPO :
        </p>
        <a
          href="mailto:privacy@callpme.com"
          className="mt-4 inline-block rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3 font-nav text-sm font-bold text-white hover:brightness-110"
        >
          privacy@callpme.com
        </a>
        <p className="mt-3 font-body text-xs text-on-surface-variant/50">
          Délai de réponse : 30 jours maximum conformément au RGPD
        </p>
      </div>
    </div>
  );
}

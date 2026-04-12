---
name: security-audit
description: >
  Utiliser ce skill pour auditer la sécurité de l'application Vocalia.
  Déclencher quand l'utilisateur dit "audit sécurité", "vérifie la sécurité",
  "est-ce que c'est sécurisé ?", "pentest", "RGPD", "vulnérabilités",
  "check les failles", avant chaque mise en production, ou après l'ajout
  d'un endpoint API ou d'une authentification.
---

# Skill — Audit Sécurité Vocalia

## Périmètre d'audit

Vocalia traite des données sensibles : numéros de téléphone, transcriptions
d'appels, credentials SIP, clés API. Un incident de sécurité peut avoir
des conséquences légales (RGPD) et commerciales (perte de clients).

L'audit se déroule en 7 domaines. Chaque domaine produit une note /10
et une liste de remèdes classés par criticité.

---

## DOMAINE 1 — Secrets & Variables d'environnement

```
Vérifier :
[ ] Aucune clé API dans le code source (grep récursif pour : sk-, vapi_, VAPI, twilio)
[ ] Aucune clé dans les fichiers de config commités (.env.example ne contient que des placeholders)
[ ] .env est dans .gitignore
[ ] NEXT_PUBLIC_ uniquement pour les valeurs vraiment publiques (pas d'URL interne, pas d'ID)
[ ] Les clés sont rotées régulièrement (vérifier la date de création dans les services tiers)
[ ] Variables d'env nécessaires documentées dans README.md ou .env.example
[ ] Pas de secret dans les variables Vercel/Railway exposées côté client

Commande de détection :
grep -r "sk-\|vapi_\|VAPI_KEY\|twilio\|cartesia\|stripe_secret" \
  --include="*.ts" --include="*.tsx" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.git
```

---

## DOMAINE 2 — Authentification & Tokens

```
Vérifier :
[ ] Tous les endpoints API vérifient l'authentification AVANT tout traitement
[ ] Les tokens API Vocalia (voc_xxx) sont stockés en SHA-256 en base, jamais en clair
[ ] Le token n'est affiché qu'une seule fois à la création (pas de récupération possible)
[ ] Les sessions JWT ont une expiration (< 24h pour access token, < 30j pour refresh)
[ ] Les tokens Vapi ne transitent jamais dans le frontend
[ ] Pas de "bypass auth" conditionnel dans le code (ex: if (DEV) skip auth)
[ ] Les tokens API peuvent être révoqués immédiatement

Test manuel :
curl -X GET /api/agents \
  -H "Authorization: Bearer invalid_token"
→ Doit retourner 401, pas 200 ni 500
```

---

## DOMAINE 3 — Autorisation & RBAC

```
Vérifier :
[ ] Chaque endpoint vérifie que l'entité demandée appartient au workspace de l'utilisateur
    (protection contre les IDOR - Insecure Direct Object References)
[ ] Un membre ne peut pas accéder aux workspaces d'un autre membre
[ ] Un membre ne peut pas accéder aux routes /admin
[ ] Les IDs dans les URLs sont validés contre req.user (pas de trust aveugle)
[ ] La hiérarchie d'accès est : admin > membre (ses workspaces uniquement)

Test IDOR :
1. Créer deux comptes membres A et B
2. Créer un agent dans le workspace de A
3. Essayer d'accéder à l'agent avec le token de B
→ Doit retourner 403, pas les données de A

Code à vérifier :
// ❌ FAILLE IDOR
const agent = await db.findAgent(agentId)  // Pas de vérification workspace

// ✅ CORRECT
const agent = await db.findAgent(agentId, { workspaceId: req.workspace.id })
```

---

## DOMAINE 4 — Validation des entrées

```
Vérifier :
[ ] Toutes les entrées utilisateur passent par un schéma zod
[ ] La validation est faite côté SERVEUR (pas uniquement côté client)
[ ] Les champs de type enum sont strictement validés (pas de valeurs arbitraires)
[ ] Les tailles max sont définies (varchar(255), pas de text illimité pour les inputs UI)
[ ] Les uploads de fichiers (bases de connaissance) :
    - Type MIME vérifié côté serveur (pas seulement l'extension)
    - Taille max définie (ex: 50MB)
    - Stockés sur R2, pas dans le filesystem du serveur
[ ] Les numéros de téléphone sont validés au format E.164
[ ] Les URLs webhook sont validées (http/https uniquement, pas de localhost en prod)

Test injection :
Envoyer dans un champ texte : <script>alert(1)</script>
→ Doit être échappé ou rejeté, jamais exécuté
```

---

## DOMAINE 5 — Webhooks & Signatures

```
Vérifier :
[ ] Chaque webhook sortant inclut X-Vocalia-Signature avec HMAC-SHA256
[ ] Le secret HMAC est unique par webhook (pas un secret global partagé)
[ ] La vérification de signature est documentée pour les intégrateurs
[ ] Les webhooks reçus de Vapi sont vérifiés (signature Vapi)
[ ] Les URLs webhook rejettent localhost et les IPs privées en production
[ ] Timeout sur les appels webhook (max 10s)
[ ] Retry avec backoff exponentiel en cas d'échec (max 3 tentatives)
[ ] Les webhooks échoués sont loggués sans les données sensibles

Code de signature :
import { createHmac } from 'crypto'

function signPayload(payload: object, secret: string): string {
  const body = JSON.stringify(payload)
  return createHmac('sha256', secret).update(body).digest('hex')
}

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  // timingSafeEqual protège contre les timing attacks
}
```

---

## DOMAINE 6 — Données sensibles & RGPD

```
Vérifier :
[ ] Les credentials SIP sont chiffrés en base (AES-256 ou champ pgcrypto)
[ ] Les numéros de téléphone des appelants sont pseudonymisés dans les logs
[ ] La durée de rétention des conversations est configurable (défaut 90j)
[ ] Un job de purge automatique existe et fonctionne
[ ] L'export des données utilisateur est possible (endpoint dédié)
[ ] La suppression définitive supprime vraiment toutes les données liées
[ ] La mention IA (aiTransparencyPrompt) est obligatoire dans les agents publiés
[ ] Les transcriptions ne sont pas loggées dans les logs applicatifs

Vérifier que les logs ne contiennent PAS :
- Numéros de téléphone complets (masquer : +336****789)
- Tokens API même partiellement
- Contenu des transcriptions
- Credentials SIP
```

---

## DOMAINE 7 — Infrastructure & Headers HTTP

```
Vérifier :
[ ] HTTPS obligatoire (redirection HTTP → HTTPS)
[ ] Headers de sécurité présents :
    - Content-Security-Policy
    - X-Frame-Options: DENY
    - X-Content-Type-Options: nosniff
    - Strict-Transport-Security
    - Referrer-Policy: strict-origin-when-cross-origin
[ ] Rate limiting activé sur tous les endpoints (100 req/min par token)
[ ] Rate limiting renforcé sur /api/auth/login (5 tentatives/min par IP)
[ ] CORS configuré strictement (pas de wildcard * en production)
[ ] Les erreurs serveur retournent un message générique (pas de stack trace)
[ ] Pas de header X-Powered-By exposant la technologie

Configuration Next.js (next.config.ts) :
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

---

## FORMAT DU RAPPORT D'AUDIT

```markdown
# Rapport d'audit sécurité — Vocalia
Date : [date]  |  Auditeur : Claude  |  Version : [commit/tag]

## Score global : X/70

| Domaine | Score | Statut |
|---|---|---|
| Secrets & Variables | X/10 | 🔴/🟡/🟢 |
| Authentification | X/10 | |
| Autorisation RBAC | X/10 | |
| Validation entrées | X/10 | |
| Webhooks | X/10 | |
| RGPD & Données | X/10 | |
| Infrastructure | X/10 | |

## 🔴 Critiques (à corriger immédiatement)
- [problème] → [fichier:ligne] → [correction]

## 🟡 Importants (à corriger avant la mise en prod)
- [problème] → [fichier:ligne] → [correction]

## 🟢 Recommandations (à planifier)
- [amélioration]

## ✅ Points forts
- [ce qui est bien sécurisé]
```

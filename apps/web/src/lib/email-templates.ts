/**
 * Beautiful HTML email templates for Callpme
 * All templates follow the Callpme brand: dark theme, gradient accents, professional
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://callpme.com";

// ── Shared layout ──

function layout(content: string, preheader?: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Callpme</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#0A0B0F;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>` : ""}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body { margin: 0; padding: 0; background-color: #0A0B0F; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .container { max-width: 580px; margin: 0 auto; }
    a { color: #4F7FFF; text-decoration: none; }
    .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #4F7FFF, #7B5CFA); color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 14px; }
    .btn-secondary { background: rgba(79, 127, 255, 0.1); color: #4F7FFF !important; border: 1px solid rgba(79, 127, 255, 0.3); }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0A0B0F;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0B0F;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" class="container" width="580" cellpadding="0" cellspacing="0">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:8px;">
                    <div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);display:flex;align-items:center;justify-content:center;">
                      <img src="${BASE_URL}/logo-icon.png" alt="" width="20" height="20" style="display:block;" onerror="this.style.display='none'" />
                    </div>
                  </td>
                  <td>
                    <span style="font-size:22px;font-weight:700;color:#E3E2E8;letter-spacing:-0.5px;">Callpme</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Card -->
          <tr>
            <td style="background-color:#121317;border-radius:16px;border:1px solid rgba(255,255,255,0.05);overflow:hidden;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;text-align:center;">
              <p style="color:#8B90B0;font-size:12px;margin:0 0 8px;">
                Callpme — Agents vocaux IA pour le marché français
              </p>
              <p style="color:#5A5D73;font-size:11px;margin:0 0 4px;">
                Une solution créée par <a href="https://pirabel.com" style="color:#7B5CFA;">Pirabel Labs</a>
              </p>
              <p style="color:#5A5D73;font-size:11px;margin:0;">
                <a href="${BASE_URL}/privacy" style="color:#5A5D73;">Confidentialité</a> &middot;
                <a href="${BASE_URL}/terms" style="color:#5A5D73;">CGU</a> &middot;
                <a href="${BASE_URL}/settings" style="color:#5A5D73;">Préférences email</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function iconCircle(emoji: string, bgColor: string) {
  return `<div style="width:56px;height:56px;border-radius:16px;background:${bgColor};display:inline-flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px;">${emoji}</div>`;
}

function statBox(label: string, value: string, color = "#E3E2E8") {
  return `<td style="padding:12px 16px;background:rgba(255,255,255,0.03);border-radius:10px;text-align:center;">
    <div style="font-size:20px;font-weight:700;color:${color};margin-bottom:2px;">${value}</div>
    <div style="font-size:11px;color:#8B90B0;text-transform:uppercase;letter-spacing:0.5px;">${label}</div>
  </td>`;
}

// ── Template: Welcome / Bienvenue ──

export function welcomeEmail(firstName: string, planName: string) {
  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("🎉", "rgba(0,212,170,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:24px;font-weight:700;text-align:center;margin:0 0 8px;">
        Bienvenue sur Callpme, ${firstName} !
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6;">
        Votre compte a été créé avec succès. Vous êtes prêt à créer vos premiers agents vocaux IA.
      </p>

      <div style="background:rgba(79,127,255,0.05);border:1px solid rgba(79,127,255,0.15);border-radius:12px;padding:20px;margin-bottom:28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:40px;vertical-align:top;">
              <div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);text-align:center;line-height:32px;font-size:14px;">✨</div>
            </td>
            <td style="padding-left:12px;">
              <div style="color:#E3E2E8;font-size:13px;font-weight:600;margin-bottom:4px;">Plan ${planName}</div>
              <div style="color:#8B90B0;font-size:12px;">Votre plan est actif et prêt à utiliser.</div>
            </td>
          </tr>
        </table>
      </div>

      <h3 style="color:#E3E2E8;font-size:14px;font-weight:600;margin:0 0 16px;">Pour bien démarrer :</h3>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr>
          <td style="padding:12px 16px;background:rgba(255,255,255,0.03);border-radius:10px;margin-bottom:8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:32px;color:#4F7FFF;font-size:16px;font-weight:700;">1.</td>
                <td style="color:#C3C6D7;font-size:13px;">Créez votre premier agent vocal</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:rgba(255,255,255,0.03);border-radius:10px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:32px;color:#7B5CFA;font-size:16px;font-weight:700;">2.</td>
                <td style="color:#C3C6D7;font-size:13px;">Configurez votre prompt et voix française</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:rgba(255,255,255,0.03);border-radius:10px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:32px;color:#00D4AA;font-size:16px;font-weight:700;">3.</td>
                <td style="color:#C3C6D7;font-size:13px;">Testez un appel et lancez en production</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="text-align:center;">
        <a href="${BASE_URL}/dashboard" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Accéder à mon espace
        </a>
      </div>
    </td>`;

  return layout(content, `Bienvenue ${firstName} ! Votre compte Callpme est prêt.`);
}

// ── Template: Email Verification OTP ──

export function verificationEmail(code: string) {
  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("🔐", "rgba(79,127,255,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:24px;font-weight:700;text-align:center;margin:0 0 8px;">
        Vérifiez votre email
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 32px;line-height:1.6;">
        Entrez ce code dans l'application pour vérifier votre adresse email et activer votre compte.
      </p>

      <!-- OTP Code -->
      <div style="text-align:center;margin-bottom:32px;">
        <div style="display:inline-block;background:rgba(79,127,255,0.08);border:2px solid rgba(79,127,255,0.2);border-radius:14px;padding:20px 40px;">
          <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#4F7FFF;font-family:'Courier New',monospace;">${code}</span>
        </div>
      </div>

      <p style="color:#5A5D73;font-size:12px;text-align:center;margin:0 0 8px;">
        Ce code expire dans <strong style="color:#8B90B0;">10 minutes</strong>.
      </p>
      <p style="color:#5A5D73;font-size:12px;text-align:center;margin:0;">
        Si vous n'avez pas créé de compte, ignorez cet email.
      </p>
    </td>`;

  return layout(content, `Votre code de vérification Callpme : ${code}`);
}

// ── Template: Call Ended ──

export function callEndedEmail(agentName: string, duration: number, sentiment?: string, callerNumber?: string) {
  const mins = Math.ceil(duration / 60);
  const sentimentColor = sentiment === "positive" ? "#00D4AA" : sentiment === "negative" ? "#FFB4AB" : "#8B90B0";
  const sentimentLabel = sentiment === "positive" ? "Positif" : sentiment === "negative" ? "Négatif" : "Neutre";
  const sentimentEmoji = sentiment === "positive" ? "😊" : sentiment === "negative" ? "😟" : "😐";

  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("📞", "rgba(0,212,170,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Appel terminé
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;">
        L'agent <strong style="color:#E3E2E8;">${agentName}</strong> vient de terminer un appel.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin-bottom:24px;">
        <tr>
          ${statBox("Durée", `${mins} min`, "#4F7FFF")}
          ${statBox("Sentiment", `${sentimentEmoji} ${sentimentLabel}`, sentimentColor)}
          ${callerNumber ? statBox("Appelant", callerNumber.slice(0, 8) + "...", "#C3C6D7") : statBox("Type", "Entrant", "#C3C6D7")}
        </tr>
      </table>

      <div style="text-align:center;">
        <a href="${BASE_URL}/conversations" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Voir la conversation
        </a>
      </div>
    </td>`;

  return layout(content, `Appel terminé — Agent ${agentName} — ${mins} min`);
}

// ── Template: Credits Low ──

export function creditsLowEmail(remaining: number, total: number, planName: string) {
  const percentage = Math.round((remaining / total) * 100);

  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("⚠️", "rgba(255,179,0,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Crédits bientôt épuisés
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6;">
        Il vous reste <strong style="color:#FFB3A7;">${remaining} minutes</strong> sur ${total}. Rechargez maintenant pour éviter une interruption de service.
      </p>

      <!-- Progress bar -->
      <div style="margin-bottom:28px;">
        <div style="background:rgba(255,255,255,0.05);border-radius:8px;height:12px;overflow:hidden;">
          <div style="background:linear-gradient(90deg,#FF7F3F,#FF4D6D);width:${100 - percentage}%;height:100%;border-radius:8px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:8px;">
          <span style="color:#8B90B0;font-size:11px;">${remaining} min restantes</span>
          <span style="color:#5A5D73;font-size:11px;">Plan ${planName}</span>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="${BASE_URL}/billing" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FF7F3F,#FF4D6D);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Recharger mes minutes
        </a>
      </div>
    </td>`;

  return layout(content, `Attention : il vous reste ${remaining} minutes sur Callpme`);
}

// ── Template: Credits Exhausted ──

export function creditsExhaustedEmail(planName: string) {
  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("🚨", "rgba(255,77,109,0.1)")}
      </div>
      <h1 style="color:#FFB4AB;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Minutes épuisées
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6;">
        Vos minutes sont à zéro. Les appels entrants et sortants sont <strong style="color:#FFB4AB;">temporairement suspendus</strong> jusqu'au rechargement.
      </p>

      <div style="background:rgba(255,77,109,0.05);border:1px solid rgba(255,77,109,0.2);border-radius:12px;padding:16px;margin-bottom:28px;text-align:center;">
        <div style="color:#FFB4AB;font-size:13px;font-weight:600;">Action requise</div>
        <div style="color:#8B90B0;font-size:12px;margin-top:4px;">Rechargez votre compte pour reprendre les appels</div>
      </div>

      <div style="text-align:center;">
        <a href="${BASE_URL}/billing" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#FF7F3F,#FF4D6D);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Recharger maintenant
        </a>
        <div style="margin-top:12px;">
          <a href="${BASE_URL}/billing" style="color:#4F7FFF;font-size:13px;">Voir les offres de recharge</a>
        </div>
      </div>
    </td>`;

  return layout(content, `Urgent : vos minutes Callpme sont épuisées (Plan ${planName})`);
}

// ── Template: Credits Purchased ──

export function creditsPurchasedEmail(minutes: number, amountCents: number) {
  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("✅", "rgba(0,212,170,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Recharge confirmée
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;">
        Votre achat de minutes a été traité avec succès.
      </p>

      <div style="background:rgba(0,212,170,0.05);border:1px solid rgba(0,212,170,0.15);border-radius:12px;padding:24px;margin-bottom:28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:12px;margin-bottom:12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#8B90B0;font-size:13px;">Minutes ajoutées</td>
                  <td style="color:#00D4AA;font-size:16px;font-weight:700;text-align:right;">${minutes} min</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding-top:12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="color:#8B90B0;font-size:13px;">Montant facturé</td>
                  <td style="color:#E3E2E8;font-size:16px;font-weight:700;text-align:right;">${(amountCents / 100).toFixed(2)} €</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align:center;">
        <a href="${BASE_URL}/billing" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Voir ma facturation
        </a>
      </div>
    </td>`;

  return layout(content, `Recharge confirmée : ${minutes} minutes ajoutées à votre compte Callpme`);
}

// ── Template: Plan Upgrade ──

export function planUpgradeEmail(oldPlan: string, newPlan: string, features: string[]) {
  const featureListHtml = features.map(f => `
    <tr>
      <td style="padding:6px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:24px;color:#00D4AA;font-size:14px;">✓</td>
            <td style="color:#C3C6D7;font-size:13px;">${f}</td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("");

  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("🚀", "rgba(123,92,250,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Plan mis à jour !
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6;">
        Vous êtes passé de <strong style="color:#8B90B0;">${oldPlan}</strong> à <strong style="color:#7B5CFA;">${newPlan}</strong>. Profitez de vos nouvelles fonctionnalités !
      </p>

      <div style="background:rgba(123,92,250,0.05);border:1px solid rgba(123,92,250,0.15);border-radius:12px;padding:20px;margin-bottom:28px;">
        <div style="color:#7B5CFA;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Nouvelles fonctionnalités</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${featureListHtml}
        </table>
      </div>

      <div style="text-align:center;">
        <a href="${BASE_URL}/dashboard" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#7B5CFA,#4F7FFF);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Explorer mon espace
        </a>
      </div>
    </td>`;

  return layout(content, `Votre plan Callpme a été mis à jour vers ${newPlan}`);
}

// ── Template: Campaign Completed ──

export function campaignCompletedEmail(campaignName: string, totalCalls: number, successCount: number, failedCount: number) {
  const successRate = totalCalls > 0 ? Math.round((successCount / totalCalls) * 100) : 0;

  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("📢", "rgba(79,127,255,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Campagne terminée
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;">
        La campagne <strong style="color:#E3E2E8;">"${campaignName}"</strong> est terminée.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="8" style="margin-bottom:24px;">
        <tr>
          ${statBox("Total", `${totalCalls}`, "#E3E2E8")}
          ${statBox("Réussis", `${successCount}`, "#00D4AA")}
          ${statBox("Échoués", `${failedCount}`, "#FFB4AB")}
        </tr>
      </table>

      <!-- Success rate bar -->
      <div style="margin-bottom:28px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="color:#8B90B0;font-size:12px;">Taux de succès</span>
          <span style="color:#00D4AA;font-size:12px;font-weight:600;">${successRate}%</span>
        </div>
        <div style="background:rgba(255,255,255,0.05);border-radius:8px;height:8px;overflow:hidden;">
          <div style="background:linear-gradient(90deg,#00D4AA,#4F7FFF);width:${successRate}%;height:100%;border-radius:8px;"></div>
        </div>
      </div>

      <div style="text-align:center;">
        <a href="${BASE_URL}/campaigns" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Voir les résultats
        </a>
      </div>
    </td>`;

  return layout(content, `Campagne "${campaignName}" terminée — ${successRate}% de succès`);
}

// ── Template: Anomaly Detected ──

export function anomalyEmail(title: string, description: string, severity: "warning" | "critical" = "warning") {
  const isCritical = severity === "critical";
  const color = isCritical ? "#FF4D6D" : "#FF7F3F";
  const bgColor = isCritical ? "rgba(255,77,109,0.1)" : "rgba(255,127,63,0.1)";
  const emoji = isCritical ? "🔴" : "🟡";

  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle(emoji, bgColor)}
      </div>
      <h1 style="color:${color};font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Anomalie détectée
      </h1>
      <p style="color:#E3E2E8;font-size:15px;font-weight:600;text-align:center;margin:0 0 8px;">
        ${title}
      </p>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6;">
        ${description}
      </p>

      <div style="background:${bgColor};border:1px solid ${color}30;border-radius:12px;padding:16px;margin-bottom:28px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:24px;vertical-align:top;color:${color};font-size:16px;">⚡</td>
            <td style="padding-left:8px;color:#C3C6D7;font-size:13px;line-height:1.5;">
              ${isCritical ? "Cette anomalie nécessite une action immédiate. Vérifiez votre tableau de bord." : "Surveillez la situation. Si le problème persiste, contactez le support."}
            </td>
          </tr>
        </table>
      </div>

      <div style="text-align:center;">
        <a href="${BASE_URL}/dashboard" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,${color},${isCritical ? "#FF7F3F" : "#FFB4AB"});color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Voir le tableau de bord
        </a>
      </div>
    </td>`;

  return layout(content, `${isCritical ? "CRITIQUE" : "Attention"} — ${title}`);
}

// ── Template: Password Reset ──

export function passwordResetEmail(resetLink: string) {
  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("🔑", "rgba(79,127,255,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Réinitialisez votre mot de passe
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6;">
        Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
      </p>

      <div style="text-align:center;margin-bottom:24px;">
        <a href="${resetLink}" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Réinitialiser mon mot de passe
        </a>
      </div>

      <p style="color:#5A5D73;font-size:12px;text-align:center;margin:0 0 8px;">
        Ce lien expire dans <strong style="color:#8B90B0;">1 heure</strong>.
      </p>
      <p style="color:#5A5D73;font-size:12px;text-align:center;margin:0;">
        Si vous n'avez pas fait cette demande, ignorez cet email.
      </p>
    </td>`;

  return layout(content, "Réinitialisez votre mot de passe Callpme");
}

// ── Template: Admin Alert ──

export function adminAlertEmail(title: string, details: { label: string; value: string }[]) {
  const detailsHtml = details.map(d => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#8B90B0;font-size:13px;">${d.label}</td>
            <td style="color:#E3E2E8;font-size:13px;font-weight:600;text-align:right;">${d.value}</td>
          </tr>
        </table>
      </td>
    </tr>
  `).join("");

  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("🛡️", "rgba(123,92,250,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Alerte Admin
      </h1>
      <p style="color:#7B5CFA;font-size:14px;font-weight:600;text-align:center;margin:0 0 28px;">
        ${title}
      </p>

      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${detailsHtml}
        </table>
      </div>

      <div style="text-align:center;">
        <a href="${BASE_URL}/cpme-7f9b2e4d" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#7B5CFA,#4F7FFF);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Accéder à l'administration
        </a>
      </div>
    </td>`;

  return layout(content, `[Admin] ${title}`);
}

// ── Template: Agent Published ──

export function agentPublishedEmail(agentName: string, workspaceName: string) {
  const content = `
    <td style="padding:40px 36px;">
      <div style="text-align:center;margin-bottom:24px;">
        ${iconCircle("🤖", "rgba(0,212,170,0.1)")}
      </div>
      <h1 style="color:#E3E2E8;font-size:22px;font-weight:700;text-align:center;margin:0 0 8px;">
        Agent publié en production
      </h1>
      <p style="color:#8B90B0;font-size:14px;text-align:center;margin:0 0 28px;line-height:1.6;">
        L'agent <strong style="color:#00D4AA;">"${agentName}"</strong> est maintenant actif sur le workspace <strong style="color:#E3E2E8;">${workspaceName}</strong>.
      </p>

      <div style="background:rgba(0,212,170,0.05);border:1px solid rgba(0,212,170,0.15);border-radius:12px;padding:20px;margin-bottom:28px;text-align:center;">
        <div style="color:#00D4AA;font-size:28px;margin-bottom:8px;">✅</div>
        <div style="color:#E3E2E8;font-size:14px;font-weight:600;">En production</div>
        <div style="color:#8B90B0;font-size:12px;margin-top:4px;">L'agent reçoit et passe des appels</div>
      </div>

      <div style="text-align:center;">
        <a href="${BASE_URL}/agents" class="btn" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">
          Gérer mes agents
        </a>
      </div>
    </td>`;

  return layout(content, `Agent "${agentName}" publié en production sur ${workspaceName}`);
}

import { getDb } from "@/lib/db";
import { notifications } from "@vocalia/db";
import {
  welcomeEmail,
  callEndedEmail,
  creditsLowEmail,
  creditsExhaustedEmail,
  creditsPurchasedEmail,
  planUpgradeEmail,
  campaignCompletedEmail,
  anomalyEmail,
  agentPublishedEmail,
  adminAlertEmail,
} from "./email-templates";

export type NotificationType = "call" | "credit" | "campaign" | "agent" | "system" | "anomaly";

interface CreateNotificationParams {
  userId: string;
  workspaceId?: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  sendEmail?: boolean;
  emailHtml?: string;
  emailSubject?: string;
}

/**
 * Create a notification in DB and optionally send email + push
 */
export async function createNotification(params: CreateNotificationParams) {
  const db = getDb();

  // 1. Save to DB (in-app notification)
  const [notif] = await db.insert(notifications).values({
    userId: params.userId,
    workspaceId: params.workspaceId || null,
    type: params.type,
    title: params.title,
    message: params.message || null,
    link: params.link || null,
  }).returning();

  // 2. Send email via Resend (if configured)
  if (params.sendEmail !== false) {
    await sendEmailNotification(params).catch((e) => {
      console.error("[Notification] Email failed:", e.message);
    });
  }

  return notif;
}

/**
 * Send email notification via Brevo SMTP API
 */
async function sendEmailNotification(params: CreateNotificationParams) {
  const brevoKey = process.env.BREVO_SMTP_KEY;
  if (!brevoKey) return;

  // Get user email from DB
  const db = getDb();
  const { users } = await import("@vocalia/db");
  const { eq } = await import("drizzle-orm");
  const [user] = await db.select().from(users).where(eq(users.id, params.userId));
  if (!user?.email) return;

  const typeEmoji: Record<string, string> = {
    call: "📞",
    credit: "💳",
    campaign: "📢",
    agent: "🤖",
    system: "ℹ️",
    anomaly: "⚠️",
  };

  const subject = params.emailSubject || `${typeEmoji[params.type] || ""} ${params.title}`;
  const html = params.emailHtml || buildFallbackEmail(params);

  await sendBrevoEmail(user.email, subject, html);
}

/**
 * Fallback simple email for notifications without custom templates
 */
function buildFallbackEmail(params: CreateNotificationParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://callpme.com";
  return `
    <div style="font-family:'Inter',sans-serif;max-width:580px;margin:0 auto;padding:40px 20px;background:#0A0B0F;">
      <div style="background:#121317;border-radius:16px;border:1px solid rgba(255,255,255,0.05);padding:40px 36px;">
        <div style="text-align:center;margin-bottom:20px;">
          <span style="font-size:22px;font-weight:700;color:#E3E2E8;">Callpme</span>
        </div>
        <h2 style="color:#E3E2E8;font-size:20px;text-align:center;margin:0 0 12px;">${params.title}</h2>
        ${params.message ? `<p style="color:#8B90B0;font-size:14px;text-align:center;line-height:1.6;">${params.message}</p>` : ""}
        ${params.link ? `<div style="text-align:center;margin-top:24px;"><a href="${baseUrl}${params.link}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">Voir les détails</a></div>` : ""}
      </div>
      <p style="color:#5A5D73;font-size:11px;text-align:center;margin-top:24px;">Callpme — Une solution Pirabel Labs</p>
    </div>
  `;
}

/**
 * Send email via Brevo SMTP relay using nodemailer.
 * Falls back to Brevo REST API if SMTP credentials are not configured.
 * Returns true if sent successfully, false otherwise.
 */
async function sendBrevoEmail(to: string, subject: string, html: string): Promise<boolean> {
  const smtpHost = process.env.BREVO_SMTP_HOST;
  const smtpUser = process.env.BREVO_SMTP_USER;
  const smtpKey = process.env.BREVO_SMTP_KEY;

  if (!smtpKey) {
    console.warn("[Email] BREVO_SMTP_KEY not configured — skipping email to", to);
    return false;
  }

  // Use SMTP relay (preferred — works with xsmtpsib keys)
  if (smtpHost && smtpUser) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: smtpHost,
        port: 587,
        secure: false,
        auth: {
          user: smtpUser,
          pass: smtpKey,
        },
      });

      await transporter.sendMail({
        from: '"Callpme" <allo@callpme.com>',
        to,
        subject,
        html,
      });

      console.log(`[Email] SMTP sent to ${to} — subject: "${subject}"`);
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[Email] SMTP error sending to ${to}: ${message}`);
      // Fall through to REST API attempt
    }
  }

  // Fallback: Brevo REST API (requires xkeysib API key)
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": smtpKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Callpme", email: "allo@callpme.com" },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`[Email] Brevo REST API error ${res.status} for ${to}: ${body}`);
      return false;
    }

    console.log(`[Email] REST API sent to ${to} — subject: "${subject}"`);
    return true;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[Email] Network error sending to ${to}: ${message}`);
    return false;
  }
}

/**
 * Send email directly (without DB notification) — for admin alerts, transactional emails.
 * Returns true if sent successfully.
 */
export async function sendDirectEmail(to: string, subject: string, html: string): Promise<boolean> {
  return sendBrevoEmail(to, subject, html);
}

// ── Pre-built notification templates with beautiful emails ──

export async function notifyWelcome(userId: string, firstName: string, planName: string) {
  return createNotification({
    userId,
    type: "system",
    title: `Bienvenue sur Callpme, ${firstName} !`,
    message: "Votre compte est prêt. Créez votre premier agent vocal IA.",
    link: "/dashboard",
    emailHtml: welcomeEmail(firstName, planName),
    emailSubject: `🎉 Bienvenue sur Callpme, ${firstName} !`,
  });
}

export async function notifyCallEnded(userId: string, workspaceId: string, agentName: string, duration: number, sentiment?: string, callerNumber?: string) {
  const mins = Math.ceil(duration / 60);
  return createNotification({
    userId,
    workspaceId,
    type: "call",
    title: "Appel terminé",
    message: `Agent ${agentName} — ${mins} min${sentiment ? ` — Sentiment ${sentiment}` : ""}`,
    link: "/conversations",
    emailHtml: callEndedEmail(agentName, duration, sentiment, callerNumber),
    emailSubject: `📞 Appel terminé — Agent ${agentName} — ${mins} min`,
  });
}

export async function notifyCreditsLow(userId: string, workspaceId: string, remaining: number, total: number, planName = "Actuel") {
  return createNotification({
    userId,
    workspaceId,
    type: "credit",
    title: "Crédits bientôt épuisés",
    message: `Il vous reste ${remaining} minutes sur ${total}. Rechargez pour éviter une interruption.`,
    link: "/billing",
    sendEmail: true,
    emailHtml: creditsLowEmail(remaining, total, planName),
    emailSubject: `⚠️ Crédits bientôt épuisés — ${remaining} minutes restantes`,
  });
}

export async function notifyCreditsExhausted(userId: string, workspaceId: string, planName = "Actuel") {
  return createNotification({
    userId,
    workspaceId,
    type: "credit",
    title: "Minutes épuisées",
    message: "Vos minutes sont épuisées. Les appels sont suspendus jusqu'au rechargement.",
    link: "/billing",
    sendEmail: true,
    emailHtml: creditsExhaustedEmail(planName),
    emailSubject: "🚨 Minutes épuisées — Action requise",
  });
}

export async function notifyCreditsPurchased(userId: string, workspaceId: string, minutes: number, amountCents: number) {
  return createNotification({
    userId,
    workspaceId,
    type: "credit",
    title: `${minutes} minutes ajoutées`,
    message: `Achat de ${minutes} minutes pour ${(amountCents / 100).toFixed(2)}€ confirmé.`,
    link: "/billing",
    emailHtml: creditsPurchasedEmail(minutes, amountCents),
    emailSubject: `✅ ${minutes} minutes ajoutées à votre compte`,
  });
}

export async function notifyCampaignCompleted(userId: string, workspaceId: string, campaignName: string, totalCalls: number, successCount: number) {
  const failedCount = totalCalls - successCount;
  return createNotification({
    userId,
    workspaceId,
    type: "campaign",
    title: "Campagne terminée",
    message: `${campaignName} — ${successCount}/${totalCalls} appels réussis.`,
    link: "/campaigns",
    emailHtml: campaignCompletedEmail(campaignName, totalCalls, successCount, failedCount),
    emailSubject: `📢 Campagne "${campaignName}" terminée`,
  });
}

export async function notifyAgentPublished(userId: string, workspaceId: string, agentName: string, workspaceName = "Mon Workspace") {
  return createNotification({
    userId,
    workspaceId,
    type: "agent",
    title: "Agent publié",
    message: `L'agent "${agentName}" est maintenant en production.`,
    link: "/agents",
    emailHtml: agentPublishedEmail(agentName, workspaceName),
    emailSubject: `🤖 Agent "${agentName}" publié en production`,
  });
}

export async function notifyAnomaly(userId: string, workspaceId: string, anomalyTitle: string, description = "", severity: "warning" | "critical" = "warning") {
  return createNotification({
    userId,
    workspaceId,
    type: "anomaly",
    title: "Anomalie détectée",
    message: anomalyTitle,
    link: "/dashboard",
    sendEmail: true,
    emailHtml: anomalyEmail(anomalyTitle, description, severity),
    emailSubject: `${severity === "critical" ? "🔴" : "🟡"} Anomalie — ${anomalyTitle}`,
  });
}

export async function notifyPlanUpgrade(userId: string, planName: string, oldPlan = "Essai gratuit") {
  const featuresByPlan: Record<string, string[]> = {
    Starter: ["2 agents vocaux", "API REST", "2 webhooks", "Support email"],
    Pro: ["Agents illimités", "50+ voix premium", "Campagnes outbound", "Voice Studio", "Base de connaissances RAG", "Analytics avancés", "SLA 99.9%"],
    Enterprise: ["Tout le plan Pro", "Voix custom", "Support dédié", "SLA 99.99%"],
  };
  const features = featuresByPlan[planName] || [`Toutes les fonctionnalités du plan ${planName}`];

  return createNotification({
    userId,
    type: "system",
    title: `Plan mis à jour : ${planName}`,
    message: `Votre plan a été mis à jour vers ${planName}. Profitez de vos nouvelles fonctionnalités !`,
    link: "/billing",
    emailHtml: planUpgradeEmail(oldPlan, planName, features),
    emailSubject: `🚀 Bienvenue sur le plan ${planName} !`,
  });
}

// ── Admin notifications ──

export async function notifyAdminNewUser(adminEmail: string, userName: string, userEmail: string, plan: string) {
  const html = adminAlertEmail("Nouvel utilisateur inscrit", [
    { label: "Nom", value: userName },
    { label: "Email", value: userEmail },
    { label: "Plan", value: plan },
    { label: "Date", value: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }) },
  ]);
  await sendDirectEmail(adminEmail, `👤 Nouvel utilisateur : ${userName}`, html);
}

export async function notifyAdminCreditPurchase(adminEmail: string, userName: string, minutes: number, amountCents: number) {
  const html = adminAlertEmail("Achat de crédits", [
    { label: "Utilisateur", value: userName },
    { label: "Minutes", value: `${minutes} min` },
    { label: "Montant", value: `${(amountCents / 100).toFixed(2)} €` },
    { label: "Date", value: new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }) },
  ]);
  await sendDirectEmail(adminEmail, `💳 Achat : ${minutes} min — ${(amountCents / 100).toFixed(2)}€`, html);
}

export async function notifyAdminAnomaly(adminEmail: string, title: string, details: { label: string; value: string }[]) {
  const html = adminAlertEmail(title, details);
  await sendDirectEmail(adminEmail, `⚠️ [Admin] ${title}`, html);
}

import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents, conversations, suggestions } from "@vocalia/db";
import { eq, desc, count, and } from "drizzle-orm";

// Analyse les données réelles et génère des suggestions IA pertinentes
async function generateSuggestions(workspaceId: string) {
  const db = getDb();

  // Get agents and their conversations
  const agentList = await db.select().from(agents).where(eq(agents.workspaceId, workspaceId));
  const convList = await db.select().from(conversations).where(eq(conversations.workspaceId, workspaceId));

  const generatedSuggestions: any[] = [];

  for (const agent of agentList) {
    const agentConvs = convList.filter((c) => c.agentId === agent.id);
    const totalCalls = agentConvs.length;

    // 1. Agent sans prompt → suggestion de configurer le prompt
    if (!agent.prompt || agent.prompt.length < 50) {
      generatedSuggestions.push({
        id: `sug-prompt-${agent.id}`,
        agentId: agent.id,
        agentName: agent.name,
        type: "prompt",
        title: "Configurer le prompt de l'agent",
        description: `L'agent "${agent.name}" n'a pas de prompt configuré ou il est trop court (${agent.prompt?.length ?? 0} caractères). Un prompt détaillé améliore significativement la qualité des conversations.`,
        impact: "high",
        applied: false,
        action: "Ajoutez un prompt d'au moins 200 caractères décrivant le rôle, le ton et les objectifs de l'agent.",
      });
    }

    // 2. Agent non publié → suggestion de publier
    if (!agent.isPublished) {
      generatedSuggestions.push({
        id: `sug-publish-${agent.id}`,
        agentId: agent.id,
        agentName: agent.name,
        type: "tool",
        title: "Publier l'agent sur Vapi",
        description: `L'agent "${agent.name}" est en brouillon. Publiez-le pour qu'il puisse recevoir et passer des appels.`,
        impact: "high",
        applied: false,
        action: "Cliquez sur PUBLIER dans l'éditeur d'agent pour le synchroniser avec Vapi.",
      });
    }

    // 3. Agent avec beaucoup d'appels manqués
    if (totalCalls > 5) {
      const missedCalls = agentConvs.filter((c) => c.status === "missed").length;
      const missedRate = missedCalls / totalCalls;
      if (missedRate > 0.2) {
        generatedSuggestions.push({
          id: `sug-missed-${agent.id}`,
          agentId: agent.id,
          agentName: agent.name,
          type: "prompt",
          title: "Réduire les appels manqués",
          description: `${Math.round(missedRate * 100)}% des appels de "${agent.name}" sont manqués (${missedCalls}/${totalCalls}). Vérifiez la configuration du numéro SIP et la disponibilité de l'agent.`,
          impact: "high",
          applied: false,
          action: "Vérifiez que l'agent est actif et qu'un numéro de téléphone lui est assigné.",
        });
      }
    }

    // 4. Agent avec sentiment négatif élevé
    if (totalCalls > 3) {
      const negativeConvs = agentConvs.filter((c) => c.sentiment === "negative").length;
      const negativeRate = negativeConvs / totalCalls;
      if (negativeRate > 0.15) {
        generatedSuggestions.push({
          id: `sug-sentiment-${agent.id}`,
          agentId: agent.id,
          agentName: agent.name,
          type: "prompt",
          title: "Améliorer le sentiment des conversations",
          description: `${Math.round(negativeRate * 100)}% des conversations de "${agent.name}" ont un sentiment négatif. Ajustez le prompt pour être plus empathique et orienté solution.`,
          impact: "medium",
          applied: false,
          action: "Ajoutez des instructions d'empathie et de résolution proactive dans le prompt.",
        });
      }
    }

    // 5. Agent avec durée moyenne trop longue
    if (totalCalls > 3) {
      const avgDuration = agentConvs.reduce((a, c) => a + (c.durationSeconds || 0), 0) / totalCalls;
      if (avgDuration > 600) { // > 10 minutes
        generatedSuggestions.push({
          id: `sug-duration-${agent.id}`,
          agentId: agent.id,
          agentName: agent.name,
          type: "prompt",
          title: "Réduire la durée des appels",
          description: `La durée moyenne des appels de "${agent.name}" est de ${Math.round(avgDuration / 60)} minutes. Des réponses plus concises amélioreraient l'efficacité.`,
          impact: "medium",
          applied: false,
          action: "Ajoutez dans le prompt : 'Sois concis et va droit au but. Ne dépasse pas 5 minutes par appel.'",
        });
      }
    }

    // 6. Agent sans voix premium
    if (agent.voiceProvider !== "cartesia" && agent.voiceProvider !== "elevenlabs") {
      generatedSuggestions.push({
        id: `sug-voice-${agent.id}`,
        agentId: agent.id,
        agentName: agent.name,
        type: "voice",
        title: "Passer à une voix premium",
        description: `"${agent.name}" utilise une voix standard. Les voix Cartesia ou ElevenLabs offrent une expérience plus naturelle et un taux de satisfaction supérieur.`,
        impact: "low",
        applied: false,
        action: "Changez la voix dans l'onglet PAROLE de l'éditeur d'agent.",
      });
    }

    // 7. Agent avec température élevée
    if (Number(agent.temperature) > 1.0) {
      generatedSuggestions.push({
        id: `sug-temp-${agent.id}`,
        agentId: agent.id,
        agentName: agent.name,
        type: "prompt",
        title: "Réduire la température du LLM",
        description: `La température de "${agent.name}" est à ${agent.temperature}. Une valeur élevée rend les réponses moins prévisibles. Pour un agent de support, une température entre 0.3 et 0.5 est recommandée.`,
        impact: "medium",
        applied: false,
        action: "Baissez la température à 0.4 dans l'onglet RÉGLAGES.",
      });
    }
  }

  // 8. Suggestions globales
  if (agentList.length === 0) {
    generatedSuggestions.push({
      id: "sug-first-agent",
      agentId: null,
      agentName: null,
      type: "tool",
      title: "Créer votre premier agent",
      description: "Vous n'avez pas encore d'agent IA configuré. Créez-en un pour commencer à automatiser vos appels.",
      impact: "high",
      applied: false,
      action: "Allez dans Agents → Créer un agent.",
    });
  }

  if (convList.length === 0 && agentList.length > 0) {
    generatedSuggestions.push({
      id: "sug-first-call",
      agentId: agentList[0]?.id,
      agentName: agentList[0]?.name,
      type: "tool",
      title: "Lancer votre premier appel test",
      description: "Vous avez des agents configurés mais aucun appel n'a encore été passé. Testez votre agent avec un appel réel.",
      impact: "high",
      applied: false,
      action: "Ouvrez un agent → cliquez ESSAYER → entrez un numéro de téléphone.",
    });
  }

  return generatedSuggestions;
}

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);

    const db = getDb();

    // Check for saved suggestions first
    const saved = await db.select().from(suggestions).where(eq(suggestions.workspaceId, workspaceId)).orderBy(desc(suggestions.createdAt));

    // Generate new suggestions from real data analysis
    const generated = await generateSuggestions(workspaceId);

    // Merge: saved suggestions + generated (avoid duplicates)
    const savedIds = new Set(saved.map((s) => s.title));
    const merged = [
      ...saved,
      ...generated.filter((g) => !savedIds.has(g.title)),
    ];

    return apiSuccess(merged);
  } catch (error) {
    return handleApiError(error);
  }
}

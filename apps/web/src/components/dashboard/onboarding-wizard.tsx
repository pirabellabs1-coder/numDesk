"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const steps = [
  { id: 1, title: "Créer votre workspace", description: "Configurez votre premier espace de travail client.", href: "/dashboard", icon: "business" },
  { id: 2, title: "Configurer votre premier agent", description: "Créez un agent IA avec un prompt et une voix.", href: "/agents", icon: "smart_toy" },
  { id: 3, title: "Ajouter un numéro de téléphone", description: "Connectez un numéro SIP pour recevoir des appels.", href: "/phone-numbers", icon: "call" },
  { id: 4, title: "Lancer votre premier appel test", description: "Testez votre agent avec un appel réel.", href: "/agents", icon: "play_circle" },
  { id: 5, title: "Créer votre première campagne", description: "Lancez une campagne d'appels sortants.", href: "/campaigns", icon: "campaign" },
];

export function OnboardingWizard() {
  const [isOpen, setIsOpen] = useState(true);
  const [completed, setCompleted] = useState<number[]>([1]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("onboarding-completed");
    if (saved) setCompleted(JSON.parse(saved));
    const wasDismissed = localStorage.getItem("onboarding-dismissed");
    if (wasDismissed === "true") setDismissed(true);
  }, []);

  const toggleStep = (id: number) => {
    const next = completed.includes(id) ? completed.filter((s) => s !== id) : [...completed, id];
    setCompleted(next);
    localStorage.setItem("onboarding-completed", JSON.stringify(next));
  };

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem("onboarding-dismissed", "true");
  };

  if (dismissed) return null;

  const progress = Math.round((completed.length / steps.length) * 100);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-surface/90 px-5 py-3 shadow-2xl backdrop-blur-xl transition-all hover:border-primary/30"
        >
          <div className="relative h-8 w-8">
            <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2"
                strokeDasharray={`${progress} 100`}
                className="text-primary"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary">
              {completed.length}/{steps.length}
            </span>
          </div>
          <span className="text-sm font-bold text-on-surface">Guide de démarrage</span>
        </button>
      )}

      {/* Expanded panel */}
      {isOpen && (
        <div className="w-80 overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
            <div>
              <p className="text-sm font-bold text-on-surface">Guide de démarrage</p>
              <p className="text-[11px] text-on-surface-variant">{completed.length}/{steps.length} étapes complétées</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <button onClick={dismiss} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-white/5">
            <div className="h-full bg-gradient-to-r from-primary to-tertiary transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          {/* Steps */}
          <div className="max-h-80 overflow-y-auto p-3">
            {steps.map((step) => {
              const isDone = completed.includes(step.id);
              return (
                <div key={step.id} className="flex items-start gap-3 rounded-xl p-3 transition-all hover:bg-white/[0.02]">
                  <button
                    onClick={() => toggleStep(step.id)}
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      isDone ? "border-tertiary bg-tertiary/10" : "border-white/10"
                    }`}
                  >
                    {isDone && <span className="material-symbols-outlined text-xs text-tertiary">check</span>}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold ${isDone ? "text-on-surface-variant line-through" : "text-on-surface"}`}>
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-on-surface-variant">{step.description}</p>
                    {!isDone && (
                      <Link
                        href={step.href}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        Commencer
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 px-5 py-3">
            <button onClick={dismiss} className="text-xs text-on-surface-variant hover:text-on-surface">
              Ignorer le guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

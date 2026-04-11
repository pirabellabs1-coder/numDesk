"use client";

import { useState } from "react";
import { mockKnowledgeBases } from "@/lib/mock-data";

export default function KnowledgePage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
            Base de Connaissances
          </h1>
          <p className="mt-2 text-on-surface-variant">
            {mockKnowledgeBases.length} bases configurées
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nouvelle Base
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockKnowledgeBases.map((kb) => (
          <div key={kb.id} className="rounded-2xl border border-white/5 bg-card p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                kb.mode === "rag" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
              }`}>
                {kb.modeLabel}
              </span>
            </div>
            <h3 className="mb-1 font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
              {kb.name}
            </h3>
            <p className="mb-4 text-xs text-on-surface-variant">
              {kb.fileCount} fichier(s) · Créée le {kb.createdAt}
            </p>
            <div className="mb-4 space-y-1">
              {kb.files.map((f) => (
                <div key={f} className="flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">description</span>
                  <span className="truncate text-xs text-on-surface">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-surface-container-low py-2 text-xs font-bold text-on-surface hover:bg-surface-container">
                Modifier
              </button>
              <button className="rounded-lg bg-surface-container-low px-3 py-2 text-on-surface-variant hover:text-error">
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
                Nouvelle Base de Connaissances
              </h2>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Nom</label>
                <input className="input-field" placeholder="Documentation produit" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Mode</label>
                <select className="input-field">
                  <option>Full Context — Tout le contenu dans le prompt</option>
                  <option>RAG — Recherche vectorielle intelligente</option>
                </select>
              </div>
              <div className="rounded-xl border-2 border-dashed border-white/10 p-8 text-center">
                <span className="material-symbols-outlined mb-2 text-4xl text-on-surface-variant/20">cloud_upload</span>
                <p className="text-sm font-medium text-on-surface">Déposez vos fichiers ici</p>
                <p className="text-xs text-on-surface-variant">PDF, DOCX, TXT, CSV acceptés</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm font-bold text-on-surface-variant">
                Annuler
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg bg-gradient-to-r from-primary to-secondary py-2.5 text-sm font-bold text-white">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

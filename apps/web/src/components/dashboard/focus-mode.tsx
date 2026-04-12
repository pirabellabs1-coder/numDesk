"use client";

import { useState, useEffect, createContext, useContext } from "react";

type FocusContextType = {
  isActive: boolean;
  remainingMinutes: number;
  missedCount: number;
  activate: (minutes: number) => void;
  deactivate: () => void;
};

const FocusContext = createContext<FocusContextType>({
  isActive: false,
  remainingMinutes: 0,
  missedCount: 0,
  activate: () => {},
  deactivate: () => {},
});

export const useFocusMode = () => useContext(FocusContext);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [missedCount, setMissedCount] = useState(0);

  useEffect(() => {
    if (!isActive || remainingMinutes <= 0) return;
    const interval = setInterval(() => {
      setRemainingMinutes((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
      // Simulate missed notifications
      if (Math.random() > 0.7) setMissedCount((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, [isActive, remainingMinutes]);

  const activate = (minutes: number) => {
    setIsActive(true);
    setRemainingMinutes(minutes);
    setMissedCount(0);
  };

  const deactivate = () => {
    setIsActive(false);
    setRemainingMinutes(0);
  };

  return (
    <FocusContext.Provider value={{ isActive, remainingMinutes, missedCount, activate, deactivate }}>
      {children}
    </FocusContext.Provider>
  );
}

export function FocusModeToggle() {
  const { isActive, remainingMinutes, missedCount, activate, deactivate } = useFocusMode();
  const [showMenu, setShowMenu] = useState(false);

  const durations = [
    { label: "30 min", value: 30 },
    { label: "1 heure", value: 60 },
    { label: "2 heures", value: 120 },
    { label: "Jusqu'à désactivation", value: 9999 },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => (isActive ? deactivate() : setShowMenu(!showMenu))}
        className={`relative p-2 transition-opacity hover:opacity-80 ${
          isActive ? "text-secondary" : "text-on-surface-variant"
        }`}
      >
        <span className="material-symbols-outlined">
          {isActive ? "do_not_disturb_on" : "dark_mode"}
        </span>
        {isActive && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[8px] font-bold text-white">
            {missedCount || ""}
          </span>
        )}
      </button>

      {showMenu && !isActive && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-white/10 bg-surface/95 shadow-2xl backdrop-blur-xl">
            <div className="border-b border-white/5 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Mode Focus</p>
            </div>
            <div className="p-2">
              {durations.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    activate(d.value);
                    setShowMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-on-surface-variant transition-all hover:bg-white/[0.04] hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-sm">timer</span>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function FocusBanner() {
  const { isActive, remainingMinutes, missedCount, deactivate } = useFocusMode();

  if (!isActive) return null;

  const formatRemaining = () => {
    if (remainingMinutes >= 9999) return "Jusqu'à désactivation";
    const h = Math.floor(remainingMinutes / 60);
    const m = remainingMinutes % 60;
    if (h > 0) return `${h}h ${m}min restantes`;
    return `${m}min restantes`;
  };

  return (
    <div className="fixed left-[240px] right-0 top-16 z-30 flex items-center justify-between border-b border-secondary/20 bg-secondary/5 px-8 py-2">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-sm text-secondary">do_not_disturb_on</span>
        <span className="text-xs font-bold text-secondary">Mode Focus activé</span>
        <span className="text-xs text-on-surface-variant">— Les notifications sont en pause</span>
        <span className="text-xs text-on-surface-variant">· {formatRemaining()}</span>
        {missedCount > 0 && (
          <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-bold text-secondary">
            {missedCount} notification(s) manquée(s)
          </span>
        )}
      </div>
      <button onClick={deactivate} className="text-xs font-bold text-secondary hover:underline">
        Désactiver
      </button>
    </div>
  );
}

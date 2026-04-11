export function Waveform({ className = "" }: { className?: string }) {
  const bars = [
    { animation: "animate-waveform-1", delay: "0s", height: "h-3" },
    { animation: "animate-waveform-2", delay: "0.1s", height: "h-5" },
    { animation: "animate-waveform-4", delay: "0.05s", height: "h-6" },
    { animation: "animate-waveform-3", delay: "0.15s", height: "h-4" },
    { animation: "animate-waveform-5", delay: "0.2s", height: "h-7" },
    { animation: "animate-waveform-2", delay: "0.08s", height: "h-5" },
    { animation: "animate-waveform-4", delay: "0.12s", height: "h-8" },
    { animation: "animate-waveform-1", delay: "0.18s", height: "h-4" },
    { animation: "animate-waveform-3", delay: "0.03s", height: "h-6" },
    { animation: "animate-waveform-5", delay: "0.14s", height: "h-3" },
    { animation: "animate-waveform-2", delay: "0.22s", height: "h-7" },
    { animation: "animate-waveform-4", delay: "0.07s", height: "h-5" },
    { animation: "animate-waveform-1", delay: "0.16s", height: "h-4" },
    { animation: "animate-waveform-3", delay: "0.09s", height: "h-6" },
    { animation: "animate-waveform-5", delay: "0.19s", height: "h-3" },
    { animation: "animate-waveform-2", delay: "0.11s", height: "h-8" },
    { animation: "animate-waveform-4", delay: "0.04s", height: "h-5" },
    { animation: "animate-waveform-1", delay: "0.13s", height: "h-4" },
    { animation: "animate-waveform-3", delay: "0.21s", height: "h-7" },
    { animation: "animate-waveform-5", delay: "0.06s", height: "h-3" },
    { animation: "animate-waveform-2", delay: "0.17s", height: "h-6" },
  ];

  return (
    <div
      className={`flex items-end justify-center gap-[3px] ${className}`}
      aria-hidden="true"
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-gradient-to-t from-primary via-secondary to-tertiary ${bar.animation} ${bar.height}`}
          style={{ animationDelay: bar.delay }}
        />
      ))}
    </div>
  );
}

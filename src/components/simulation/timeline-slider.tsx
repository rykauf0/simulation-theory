'use client';

import { useSimulationStore } from '@/stores/simulation-store';

export function TimelineSlider() {
  const { rounds, selectedRound, setSelectedRound, setOrganismState } = useSimulationStore();

  if (rounds.length <= 1) return null;

  const handleRoundSelect = (roundIndex: number) => {
    setSelectedRound(roundIndex);
    const round = rounds[roundIndex];
    if (round) {
      // Derive organism state from round data for time-travel
      const health = round.consensus.overallHealth / 100;
      const organs = Object.entries(round.consensus.dimensionScores).map(([dim, score], i) => ({
        id: dim,
        dimension: dim,
        label: dim.charAt(0).toUpperCase() + dim.slice(1),
        health: score / 100,
        size: 0.3 + (score / 100) * 0.4,
        activity: 0.5,
        position: [
          Math.cos((i / 6) * Math.PI * 2) * 2,
          Math.sin((i / 6) * Math.PI * 2) * 2,
          0,
        ] as [number, number, number],
      }));

      setOrganismState({
        health,
        pulseRate: 1 + (1 - health) * 2,
        pulseIntensity: 0.2 + (1 - health) * 0.3,
        volatility: round.consensus.topRisks.length * 0.1,
        momentum: health > 0.5 ? 0.3 : -0.3,
        agreement: round.consensus.agreement,
        organs,
      });
    }
  };

  return (
    <div className="px-3 py-2 border-t border-[var(--border-color)]">
      <div className="text-[var(--text-muted)] text-xs mb-2 tracking-wider">
        ─── TIMELINE ───
      </div>
      <div className="flex items-center gap-1">
        {rounds.map((round, i) => (
          <button
            key={round.roundNumber}
            onClick={() => handleRoundSelect(i)}
            className={`flex-1 py-1 text-xs border transition-colors cursor-pointer ${
              selectedRound === i
                ? 'border-[var(--cyan-info)] text-[var(--cyan-info)] bg-[rgba(0,212,255,0.1)]'
                : 'border-[var(--border-color)] text-[var(--text-dim)] hover:border-[var(--matrix-green)]'
            }`}
          >
            R{round.roundNumber}
          </button>
        ))}
      </div>
    </div>
  );
}

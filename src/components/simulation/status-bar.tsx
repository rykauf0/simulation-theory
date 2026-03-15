'use client';

import { useSimulationStore } from '@/stores/simulation-store';

export function StatusBar() {
  const { status, agents, currentRound, organismState } = useSimulationStore();

  const completedAgents = agents.filter((a) => a.status === 'complete').length;
  const totalAgents = agents.length;
  const healthPct = Math.round(organismState.health * 100);

  return (
    <div className="px-4 py-1.5 border-t border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <span className="text-[var(--text-muted)]">░░░ SIMULATION THEORY ░░░</span>
        <span className="text-[var(--text-dim)]">
          agents: <span className="text-[var(--matrix-green)]">{completedAgents}/{totalAgents}</span>
        </span>
        <span className="text-[var(--text-dim)]">
          round: <span className="text-[var(--matrix-green)]">{currentRound || 1}</span>
        </span>
        <span className="text-[var(--text-dim)]">
          health: <span style={{
            color: healthPct > 65 ? 'var(--matrix-green)' :
                   healthPct > 35 ? 'var(--amber-warning)' :
                   'var(--critical-red)'
          }}>{healthPct}/100</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={`${
          status === 'running' ? 'text-[var(--matrix-green)] pulse-active' :
          status === 'completed' ? 'text-[var(--cyan-info)]' :
          'text-[var(--text-muted)]'
        } px-2 py-0.5`}>
          {status?.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

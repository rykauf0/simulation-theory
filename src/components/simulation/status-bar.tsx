'use client';

import { useSimulationStore } from '@/stores/simulation-store';

export function StatusBar() {
  const { status, agents, currentRound, organismState } = useSimulationStore();

  const completedAgents = agents.filter((a) => a.status === 'complete').length;
  const totalAgents = agents.length;
  const healthPct = Math.round(organismState.health * 100);

  return (
    <div className="px-2 sm:px-4 py-1.5 border-t border-[var(--border-color)] bg-[var(--bg-panel)] flex items-center justify-between text-[10px] sm:text-xs min-w-0">
      <div className="flex items-center gap-2 sm:gap-4 overflow-hidden min-w-0">
        <span className="text-[var(--text-muted)] hidden sm:inline shrink-0">░░░ SIMULATION THEORY ░░░</span>
        <span className="text-[var(--text-dim)] shrink-0">
          agents: <span className="text-[var(--matrix-green)]">{completedAgents}/{totalAgents}</span>
        </span>
        <span className="text-[var(--text-dim)] shrink-0">
          r: <span className="text-[var(--matrix-green)]">{currentRound || 1}</span>
        </span>
        <span className="text-[var(--text-dim)] shrink-0">
          hp: <span style={{
            color: healthPct > 65 ? 'var(--matrix-green)' :
                   healthPct > 35 ? 'var(--amber-warning)' :
                   'var(--critical-red)'
          }}>{healthPct}/100</span>
        </span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
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

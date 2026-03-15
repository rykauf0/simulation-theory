'use client';

import { useState } from 'react';
import type { AgentRole, SimulationStatus } from '@/types/simulation';
import type { OrganismState } from '@/types/organism';

interface AgentStatus {
  agentId: string;
  role: AgentRole;
  status: 'pending' | 'running' | 'complete' | 'error';
}

interface SidebarProps {
  simulationId: string;
  agents: AgentStatus[];
  status: SimulationStatus;
  organismState: OrganismState;
  onInjectEvent: (event: string) => void;
  onRequestSummary: () => void;
}

const ROLE_LABELS: Record<AgentRole, string> = {
  market_analyst: 'MKT',
  financial_analyst: 'FIN',
  geopolitical_risk: 'GEO',
  supply_chain: 'SUP',
  talent_culture: 'TAL',
  technology: 'TEC',
};

const ROLE_NAMES: Record<AgentRole, string> = {
  market_analyst: 'Market Analyst',
  financial_analyst: 'Financial Analyst',
  geopolitical_risk: 'Geopolitical Risk',
  supply_chain: 'Supply Chain',
  talent_culture: 'Talent & Culture',
  technology: 'Technology',
};

export function Sidebar({ agents, status, organismState, onInjectEvent, onRequestSummary }: SidebarProps) {
  const [eventText, setEventText] = useState('');
  const [showEventInput, setShowEventInput] = useState(false);

  const handleInjectEvent = () => {
    if (eventText.trim()) {
      onInjectEvent(eventText.trim());
      setEventText('');
      setShowEventInput(false);
    }
  };

  return (
    <div className="w-[250px] border-r border-[var(--border-color)] bg-[var(--bg-panel)] flex flex-col overflow-hidden">
      {/* Agents section */}
      <div className="p-3 border-b border-[var(--border-color)]">
        <div className="text-[var(--text-dim)] text-xs mb-3 tracking-wider">
          ─── AGENTS ───
        </div>
        <div className="space-y-1">
          {agents.map((agent) => (
            <div
              key={agent.role}
              className="flex items-center gap-2 text-xs py-1"
            >
              <span className={`${
                agent.status === 'running' ? 'text-[var(--amber-warning)] text-glow-amber' :
                agent.status === 'complete' ? 'text-[var(--matrix-green)]' :
                agent.status === 'error' ? 'text-[var(--critical-red)]' :
                'text-[var(--text-muted)]'
              }`}>
                {agent.status === 'running' ? '▶' :
                 agent.status === 'complete' ? '●' :
                 agent.status === 'error' ? '✗' : '○'}
              </span>
              <span className="text-[var(--cyan-info)] font-bold">[{ROLE_LABELS[agent.role]}]</span>
              <span className="text-[var(--text-dim)] truncate">{ROLE_NAMES[agent.role]}</span>
            </div>
          ))}
          {agents.length === 0 && (
            <div className="text-[var(--text-muted)] text-xs">No agents dispatched</div>
          )}
        </div>
      </div>

      {/* Scores section */}
      <div className="p-3 border-b border-[var(--border-color)] flex-1 overflow-auto">
        <div className="text-[var(--text-dim)] text-xs mb-3 tracking-wider">
          ─── DIMENSIONS ───
        </div>
        <div className="space-y-2">
          {organismState.organs.map((organ) => {
            const pct = Math.round(organ.health * 100);
            const barWidth = `${pct}%`;
            const color = pct > 65 ? 'var(--matrix-green)' : pct > 35 ? 'var(--amber-warning)' : 'var(--critical-red)';
            return (
              <div key={organ.id} className="text-xs">
                <div className="flex justify-between text-[var(--text-dim)] mb-0.5">
                  <span>{organ.label}</span>
                  <span style={{ color }}>{pct}</span>
                </div>
                <div className="h-[2px] bg-[var(--bg-secondary)] overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{ width: barWidth, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions section */}
      <div className="p-3 space-y-2">
        <div className="text-[var(--text-dim)] text-xs mb-2 tracking-wider">
          ─── ACTIONS ───
        </div>

        {/* Inject Event */}
        {showEventInput ? (
          <div className="space-y-1">
            <textarea
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="e.g., China imposes 25% tariffs..."
              rows={3}
              className="w-full bg-black border border-[var(--border-color)] text-[var(--matrix-green)] text-xs p-2 outline-none placeholder:text-[var(--text-muted)] caret-[var(--matrix-green)] resize-none"
            />
            <div className="flex gap-1">
              <button
                onClick={handleInjectEvent}
                className="flex-1 py-1 border border-[var(--amber-warning)] text-[var(--amber-warning)] text-xs hover:bg-[var(--amber-warning)] hover:text-black transition-colors cursor-pointer"
              >
                INJECT
              </button>
              <button
                onClick={() => setShowEventInput(false)}
                className="px-2 py-1 border border-[var(--border-color)] text-[var(--text-dim)] text-xs hover:text-[var(--matrix-green)] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowEventInput(true)}
            disabled={status !== 'running' && status !== 'completed'}
            className="w-full py-1.5 border border-[var(--border-color)] text-[var(--text-dim)] text-xs hover:border-[var(--amber-warning)] hover:text-[var(--amber-warning)] transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
          >
            [ INJECT EVENT ]
          </button>
        )}

        {/* Summary */}
        <button
          onClick={onRequestSummary}
          disabled={status !== 'completed' && status !== 'running'}
          className="w-full py-1.5 border border-[var(--border-color)] text-[var(--text-dim)] text-xs hover:border-[var(--cyan-info)] hover:text-[var(--cyan-info)] transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
        >
          [ EXECUTIVE BRIEFING ]
        </button>
      </div>
    </div>
  );
}

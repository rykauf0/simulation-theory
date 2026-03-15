'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useSimulationStore } from '@/stores/simulation-store';
import { useSimulationWs } from '@/hooks/use-simulation-ws';
import { AgentFeed } from '@/components/simulation/agent-feed';
import { Sidebar } from '@/components/simulation/sidebar';
import { StatusBar } from '@/components/simulation/status-bar';
import { SummaryPanel } from '@/components/simulation/summary-panel';

// Dynamic import for 3D canvas (no SSR)
const OrganismCanvas = dynamic(
  () => import('@/components/organism/organism-canvas').then((m) => m.OrganismCanvas),
  { ssr: false }
);

export default function SimulationPage() {
  const { id } = useParams<{ id: string }>();
  const { injectEvent, requestSummary } = useSimulationWs();
  const { status, companyName, showSummary, agents, organismState } = useSimulationStore();
  const [loaded, setLoaded] = useState(false);

  // Load simulation data on mount
  useEffect(() => {
    async function loadSimulation() {
      try {
        const res = await fetch(`/api/simulation/${id}`);
        const data = await res.json();
        if (data.simulation) {
          const sim = data.simulation;
          useSimulationStore.getState().setSimulation(sim.id, sim.companyName, sim.context);
          if (sim.organismState) {
            useSimulationStore.getState().setOrganismState(sim.organismState);
          }
          useSimulationStore.getState().setStatus(sim.status);
        }
      } catch {
        // Will rely on WebSocket for updates
      }
      setLoaded(true);
    }
    loadSimulation();
  }, [id]);

  if (!loaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="text-[var(--text-dim)] text-sm">
          <span className="cursor-blink">█</span> Loading simulation...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-panel)]">
        <div className="flex items-center gap-4">
          <span className="text-[var(--matrix-green)] text-sm font-bold text-glow tracking-wider">
            SIMULATION THEORY
          </span>
          <span className="text-[var(--text-muted)] text-xs">│</span>
          <span className="text-[var(--text-dim)] text-xs uppercase tracking-wider">
            {companyName || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs uppercase tracking-wider ${
            status === 'running' ? 'text-[var(--matrix-green)] text-glow' :
            status === 'completed' ? 'text-[var(--cyan-info)] text-glow-cyan' :
            status === 'error' ? 'text-[var(--critical-red)] text-glow-red' :
            'text-[var(--text-dim)]'
          }`}>
            {status === 'running' && '● '}
            STATUS: {status?.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <Sidebar
          simulationId={id}
          agents={agents}
          status={status}
          organismState={organismState}
          onInjectEvent={(event) => injectEvent(id, event)}
          onRequestSummary={() => requestSummary(id)}
        />

        {/* Main area */}
        <div className="flex-1 flex flex-col">
          {/* 3D Viewport */}
          <div className="flex-[2] relative border-b border-[var(--border-color)]">
            <OrganismCanvas />
            {/* Viewport overlay label */}
            <div className="absolute top-2 left-3 text-[var(--text-muted)] text-xs">
              ┌─ NEURAL NETWORK VIEWPORT ─┐
            </div>
            <div className="absolute bottom-2 right-3 text-[var(--text-muted)] text-xs">
              Health: {Math.round(organismState.health * 100)}/100
            </div>
          </div>

          {/* Agent Feed */}
          <div className="flex-1 min-h-[200px]">
            <AgentFeed />
          </div>
        </div>
      </div>

      {/* Status bar */}
      <StatusBar />

      {/* Summary overlay */}
      {showSummary && <SummaryPanel />}
    </div>
  );
}

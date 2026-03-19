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
  const { connectSSE, injectEvent, requestSummary } = useSimulationWs();
  const { status, companyName, showSummary, agents, organismState } = useSimulationStore();
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load simulation data on mount and connect SSE
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
        // Will rely on SSE for updates
      }

      // Connect SSE stream for real-time updates
      connectSSE(id);
      setLoaded(true);
    }
    loadSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-[var(--border-color)] bg-[var(--bg-panel)]">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-[var(--matrix-green)] text-sm px-1 cursor-pointer"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <span className="text-[var(--matrix-green)] text-xs sm:text-sm font-bold text-glow tracking-wider whitespace-nowrap">
            SIMULATION THEORY
          </span>
          <span className="text-[var(--text-muted)] text-xs hidden sm:inline">│</span>
          <span className="text-[var(--text-dim)] text-xs uppercase tracking-wider truncate hidden sm:inline">
            {companyName || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
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
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left sidebar - hidden on mobile, toggleable */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative
          fixed top-0 left-0 h-full z-40
          transition-transform duration-200 ease-in-out
          w-[250px] shrink-0
        `}>
          <Sidebar
            simulationId={id}
            agents={agents}
            status={status}
            organismState={organismState}
            onInjectEvent={(event) => injectEvent(id, event)}
            onRequestSummary={() => requestSummary(id)}
          />
        </div>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 3D Viewport */}
          <div className="flex-[2] relative border-b border-[var(--border-color)] min-h-[200px]">
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
          <div className="flex-1 min-h-[150px] sm:min-h-[200px]">
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

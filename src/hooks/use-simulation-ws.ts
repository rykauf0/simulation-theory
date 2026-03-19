'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { ServerMessage } from '@/types/ws-messages';
import { useSimulationStore } from '@/stores/simulation-store';

export function useSimulationWs() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const simulationDoneRef = useRef(false);

  const {
    setSimulation,
    setStatus,
    setAgents,
    updateAgent,
    addRound,
    setOrganismState,
    setSummary,
    addLogEntry,
  } = useSimulationStore();

  const handleMessage = useCallback((message: ServerMessage) => {
    switch (message.type) {
      case 'simulation_created': {
        const { simulationId, config } = message.payload;
        addLogEntry({ text: `Simulation ${simulationId.slice(0, 8)} initialized`, type: 'system' });
        setAgents(
          config.enabledRoles.map((role) => ({
            agentId: '',
            role,
            status: 'pending' as const,
          }))
        );
        setStatus('running');
        break;
      }

      case 'agent_started': {
        const { agentId, role } = message.payload;
        updateAgent(agentId, { agentId, role, status: 'running' });
        addLogEntry({
          text: `[${role.toUpperCase().replace('_', ' ')}] Agent initialized, analyzing...`,
          type: 'info',
        });
        break;
      }

      case 'agent_progress': {
        const { agentId, partialAnalysis } = message.payload;
        updateAgent(agentId, { partialAnalysis });
        break;
      }

      case 'agent_complete': {
        const { agentId, result } = message.payload;
        updateAgent(agentId, { status: result.status === 'error' ? 'error' : 'complete', result });

        if (result.status === 'error') {
          addLogEntry({
            text: `[${result.role.toUpperCase().replace('_', ' ')}] FAILED: ${result.analysis}`,
            type: 'error',
          });
        } else {
          const healthPct = Math.round(
            Object.values(result.scores).reduce((a, b) => a + b, 0) / 6
          );
          addLogEntry({
            text: `[${result.role.toUpperCase().replace('_', ' ')}] Analysis complete — health: ${healthPct}/100, confidence: ${(result.confidence * 100).toFixed(0)}%`,
            type: 'success',
          });
        }
        break;
      }

      case 'organism_update': {
        setOrganismState(message.payload.state);
        break;
      }

      case 'round_complete': {
        const { round } = message.payload;
        addRound(round);
        addLogEntry({
          text: `[CONSENSUS] Round ${round.roundNumber} complete — overall health: ${round.consensus.overallHealth}/100, agreement: ${(round.consensus.agreement * 100).toFixed(0)}%`,
          type: 'system',
        });
        break;
      }

      case 'simulation_complete': {
        setStatus('completed');
        setOrganismState(message.payload.finalState);
        addLogEntry({ text: 'Simulation complete', type: 'system' });
        break;
      }

      case 'summary_ready': {
        setSummary(message.payload.summary);
        addLogEntry({ text: 'Executive briefing generated', type: 'info' });
        break;
      }

      case 'error': {
        addLogEntry({ text: `Error: ${message.payload.message}`, type: 'error' });
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connectSSE = useCallback((simulationId: string, companyName?: string, context?: string) => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Reset done flag for new simulation
    simulationDoneRef.current = false;

    addLogEntry({ text: 'Connecting to simulation server...', type: 'system' });

    // Pass creation params so the stream route can re-create the simulation
    // if the in-memory store was lost between serverless invocations.
    const params = new URLSearchParams();
    if (companyName) params.set('companyName', companyName);
    if (context) params.set('context', context);
    const qs = params.toString();
    const es = new EventSource(`/api/simulation/${simulationId}/stream${qs ? `?${qs}` : ''}`);
    eventSourceRef.current = es;

    // Handle all SSE event types
    const eventTypes = [
      'simulation_created',
      'simulation_state',
      'agent_started',
      'agent_complete',
      'organism_update',
      'round_complete',
      'simulation_complete',
      'error',
    ];

    for (const eventType of eventTypes) {
      es.addEventListener(eventType, (event) => {
        try {
          const payload = JSON.parse(event.data);

          // simulation_state is a special SSE-only event for pre-completed sims
          if (eventType === 'simulation_state') {
            if (payload.status) setStatus(payload.status);
            if (payload.organismState) setOrganismState(payload.organismState);
            if (payload.rounds) {
              for (const round of payload.rounds) {
                addRound(round);
              }
            }
            return;
          }

          // When simulation completes or errors, mark as done so we don't reconnect
          if (eventType === 'simulation_complete' || eventType === 'error') {
            simulationDoneRef.current = true;
          }

          handleMessage({ type: eventType, payload } as ServerMessage);
        } catch {
          // Ignore parse errors
        }
      });
    }

    es.onopen = () => {
      addLogEntry({ text: 'Connected to simulation server', type: 'system' });
    };

    es.onerror = () => {
      // EventSource auto-reconnects by default. We must close it
      // explicitly when the simulation is done, otherwise it loops
      // forever on serverless (each reconnect creates a new simulation).
      if (simulationDoneRef.current || es.readyState === EventSource.CLOSED) {
        es.close();
        addLogEntry({ text: 'Stream closed', type: 'system' });
      }
    };

    return es;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleMessage]);

  const startSimulation = useCallback(
    async (companyName: string, context: string) => {
      setSimulation('pending', companyName, context);
      addLogEntry({ text: `Initializing simulation for "${companyName}"...`, type: 'system' });

      // Create simulation via REST API
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, context }),
      });
      const data = await res.json();
      const simulationId = data.simulationId;

      // Connect SSE to stream events, passing creation params as fallback
      connectSSE(simulationId, companyName, context);

      return simulationId;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connectSSE]
  );

  const injectEvent = useCallback(
    async (simulationId: string, event: string) => {
      addLogEntry({ text: `Injecting event: "${event}"`, type: 'warning' });
      await fetch(`/api/simulation/${simulationId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event }),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const requestSummary = useCallback(
    async (simulationId: string) => {
      addLogEntry({ text: 'Generating executive briefing...', type: 'info' });
      try {
        const res = await fetch(`/api/simulation/${simulationId}/summary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (data.summary) {
          setSummary(data.summary);
          addLogEntry({ text: 'Executive briefing generated', type: 'info' });
        }
      } catch {
        addLogEntry({ text: 'Failed to generate briefing', type: 'error' });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return { startSimulation, connectSSE, injectEvent, requestSummary };
}

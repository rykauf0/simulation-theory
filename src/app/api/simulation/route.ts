import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';
import { createSimulation, listSimulations } from '@/lib/simulation-store';
import type { CreateSimulationRequest } from '@/types/api';
import type { AgentRole, SimulationConfig } from '@/types/simulation';

const DEFAULT_CONFIG: SimulationConfig = {
  agentCount: 6,
  roundCount: 1,
  model: 'claude-sonnet-4-20250514',
  enabledRoles: [
    'market_analyst',
    'financial_analyst',
    'geopolitical_risk',
    'supply_chain',
    'talent_culture',
    'technology',
  ] as AgentRole[],
};

export async function POST(request: Request) {
  const body: CreateSimulationRequest = await request.json();

  if (!body.companyName?.trim()) {
    return NextResponse.json(
      { error: 'companyName is required' },
      { status: 400 }
    );
  }

  const id = uuid();
  const config = { ...DEFAULT_CONFIG, ...body.config };
  const simulation = createSimulation(id, body.companyName, body.context || '', config);

  return NextResponse.json({
    simulationId: simulation.id,
    config: simulation.config,
  });
}

export async function GET() {
  const simulations = listSimulations();
  return NextResponse.json({ simulations });
}

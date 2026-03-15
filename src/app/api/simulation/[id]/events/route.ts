import { NextResponse } from 'next/server';
import { getSimulation, updateSimulation } from '@/lib/simulation-store';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const simulation = getSimulation(id);

  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  const body = await request.json();
  if (!body.event?.trim()) {
    return NextResponse.json({ error: 'event is required' }, { status: 400 });
  }

  // Store the injected event — the orchestrator will pick it up on the next round
  const currentContext = simulation.context;
  const updatedContext = `${currentContext}\n\n[INJECTED EVENT]: ${body.event}`;
  updateSimulation(id, { context: updatedContext });

  return NextResponse.json({ success: true, event: body.event });
}

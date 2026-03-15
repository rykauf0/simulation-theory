import { NextResponse } from 'next/server';
import { getSimulation, deleteSimulation } from '@/lib/simulation-store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const simulation = getSimulation(id);

  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  return NextResponse.json({ simulation });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteSimulation(id);
  return NextResponse.json({ success: true });
}

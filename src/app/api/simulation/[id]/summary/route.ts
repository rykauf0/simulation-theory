import { NextResponse } from 'next/server';
import { getSimulation } from '@/lib/simulation-store';
import { callClaude } from '@/lib/anthropic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const simulation = getSimulation(id);

  if (!simulation) {
    return NextResponse.json({ error: 'Simulation not found' }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const roundNumber = body.roundNumber ?? simulation.currentRound;
  const round = simulation.rounds[roundNumber - 1];

  if (!round) {
    return NextResponse.json({ error: 'Round not found' }, { status: 404 });
  }

  const systemPrompt = `You are an executive briefing generator for organizational health analysis.
You produce clear, actionable executive summaries in a structured format. Be direct and specific.`;

  const userPrompt = `Generate an executive briefing for ${simulation.companyName} based on the following simulation results:

Overall Health Score: ${round.consensus.overallHealth}/100
Agreement Level: ${(round.consensus.agreement * 100).toFixed(0)}%

Dimension Scores:
${Object.entries(round.consensus.dimensionScores)
  .map(([dim, score]) => `  - ${dim}: ${score}/100`)
  .join('\n')}

Top Risks:
${round.consensus.topRisks.map((r) => `  - [${r.severity.toUpperCase()}] ${r.description} (${r.dimension})`).join('\n')}

Top Opportunities:
${round.consensus.topOpportunities.map((o) => `  - [${o.impact.toUpperCase()}] ${o.description} (${o.dimension})`).join('\n')}

Divergent Views:
${round.consensus.divergentViews.map((d) => `  - ${d.agentRole}: ${d.reasoning}`).join('\n')}

Format your response as an executive briefing with these sections:
1. EXECUTIVE SUMMARY (3 sentences max)
2. HEALTH SCORECARD (formatted table)
3. TOP RISKS & MITIGATIONS (top 3)
4. TOP OPPORTUNITIES & ACTIONS (top 3)
5. DIVERGENT VIEWS (areas needing deeper investigation)
6. RECOMMENDED NEXT ACTIONS (prioritized list)
7. KEY METRICS TO TRACK`;

  try {
    const summary = await callClaude(systemPrompt, userPrompt);
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate summary', details: String(error) },
      { status: 500 }
    );
  }
}

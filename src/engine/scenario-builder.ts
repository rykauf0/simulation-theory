import type { ConsensusResult } from '@/types/simulation';

export function buildScenarioPrompt(
  companyName: string,
  context: string,
  previousRound?: ConsensusResult,
  injectedEvents?: string[]
): string {
  const sections: string[] = [];

  sections.push(`## Company Under Analysis: ${companyName}`);
  sections.push(`## Context and Background\n${context}`);

  if (previousRound) {
    sections.push(`## Previous Round Results
The prior analysis round produced the following consensus:
- Overall Health Score: ${previousRound.overallHealth.toFixed(1)}/100
- Dimension Scores: Financial ${previousRound.dimensionScores.financial.toFixed(1)}, Market ${previousRound.dimensionScores.market.toFixed(1)}, Reputation ${previousRound.dimensionScores.reputation.toFixed(1)}, Operational ${previousRound.dimensionScores.operational.toFixed(1)}, Innovation ${previousRound.dimensionScores.innovation.toFixed(1)}, Resilience ${previousRound.dimensionScores.resilience.toFixed(1)}
- Agreement Level: ${(previousRound.agreement * 100).toFixed(0)}%
- Top Risks: ${previousRound.topRisks.map((r) => r.description).join('; ')}
- Top Opportunities: ${previousRound.topOpportunities.map((o) => o.description).join('; ')}
- Action Plan: ${previousRound.actionPlan.join('; ')}

Build upon this prior analysis. Refine your scores based on deeper reflection and consider whether prior consensus missed important nuances from your domain expertise.`);
  }

  if (injectedEvents && injectedEvents.length > 0) {
    sections.push(`## Breaking Events / Injected Scenarios
The following events have occurred since the last analysis. Factor these into your assessment:
${injectedEvents.map((e, i) => `${i + 1}. ${e}`).join('\n')}`);
  }

  sections.push(`## Instructions
Analyze ${companyName} through the lens of your specific domain expertise. Provide honest, nuanced scoring and identify the most material risks and opportunities. Ground your analysis in the context provided and any injected events. Return your analysis as the specified JSON structure.`);

  return sections.join('\n\n');
}

import type {
  AgentResult,
  ConsensusResult,
  DimensionKey,
  DimensionScores,
  DivergentView,
  Risk,
  Opportunity,
} from '@/types/simulation';
import type { OrganismState } from '@/types/organism';
import { DEFAULT_ORGANISM_STATE } from '@/types/organism';
import { clamp } from '@/lib/utils';

const DIMENSION_KEYS: DimensionKey[] = [
  'financial',
  'market',
  'reputation',
  'operational',
  'innovation',
  'resilience',
];

const SEVERITY_WEIGHTS: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function aggregateResults(results: AgentResult[]): ConsensusResult {
  const validResults = results.filter((r) => r.status === 'complete' && r.confidence > 0);

  if (validResults.length === 0) {
    return {
      overallHealth: 50,
      dimensionScores: { financial: 50, market: 50, reputation: 50, operational: 50, innovation: 50, resilience: 50 },
      agreement: 0,
      topRisks: [],
      topOpportunities: [],
      divergentViews: [],
      narrativeSummary: 'Insufficient data to generate consensus.',
      actionPlan: [],
    };
  }

  // Weighted average of dimension scores (weight = confidence)
  const totalWeight = validResults.reduce((sum, r) => sum + r.confidence, 0);
  const dimensionScores: DimensionScores = {
    financial: 0,
    market: 0,
    reputation: 0,
    operational: 0,
    innovation: 0,
    resilience: 0,
  };

  for (const dim of DIMENSION_KEYS) {
    dimensionScores[dim] =
      validResults.reduce((sum, r) => sum + r.scores[dim] * r.confidence, 0) / totalWeight;
  }

  // Overall health = average of dimension scores
  const overallHealth =
    DIMENSION_KEYS.reduce((sum, dim) => sum + dimensionScores[dim], 0) / DIMENSION_KEYS.length;

  // Agreement: 1 - (avg standard deviation / 50), clamped 0-1
  const stdDevs = DIMENSION_KEYS.map((dim) => {
    const mean = dimensionScores[dim];
    const variance =
      validResults.reduce((sum, r) => sum + Math.pow(r.scores[dim] - mean, 2), 0) /
      validResults.length;
    return Math.sqrt(variance);
  });
  const avgStdDev = stdDevs.reduce((sum, sd) => sum + sd, 0) / stdDevs.length;
  const agreement = clamp(1 - avgStdDev / 50, 0, 1);

  // Divergent views: agents deviating >15 points from mean on any dimension
  const divergentViews: DivergentView[] = [];
  for (const result of validResults) {
    for (const dim of DIMENSION_KEYS) {
      const deviation = result.scores[dim] - dimensionScores[dim];
      if (Math.abs(deviation) > 15) {
        divergentViews.push({
          dimension: dim,
          agentRole: result.role,
          deviation,
          reasoning: result.analysis,
        });
      }
    }
  }

  // Collect and rank risks by severity * probability, take top 5
  const allRisks: Risk[] = validResults.flatMap((r) => r.risks);
  const topRisks = allRisks
    .sort((a, b) => {
      const scoreA = (SEVERITY_WEIGHTS[a.severity] || 1) * a.probability;
      const scoreB = (SEVERITY_WEIGHTS[b.severity] || 1) * b.probability;
      return scoreB - scoreA;
    })
    .slice(0, 5);

  // Collect and rank opportunities by priority, take top 5
  const allOpportunities: Opportunity[] = validResults.flatMap((r) => r.opportunities);
  const topOpportunities = allOpportunities
    .sort((a, b) => (b.priority ?? 3) - (a.priority ?? 3))
    .slice(0, 5);

  // Action plan from top opportunities' recommended actions
  const actionPlan = topOpportunities
    .map((o) => o.recommendedAction)
    .filter((action): action is string => !!action);

  // Narrative summary
  const bestDim = DIMENSION_KEYS.reduce((best, dim) =>
    dimensionScores[dim] > dimensionScores[best] ? dim : best
  );
  const worstDim = DIMENSION_KEYS.reduce((worst, dim) =>
    dimensionScores[dim] < dimensionScores[worst] ? dim : worst
  );
  const narrativeSummary = `Consensus health score: ${overallHealth.toFixed(1)}/100 with ${(agreement * 100).toFixed(0)}% agreement. Strongest dimension: ${bestDim} (${dimensionScores[bestDim].toFixed(1)}). Weakest dimension: ${worstDim} (${dimensionScores[worstDim].toFixed(1)}). ${topRisks.length} material risks identified, ${topOpportunities.length} actionable opportunities.`;

  return {
    overallHealth,
    dimensionScores,
    agreement,
    topRisks,
    topOpportunities,
    divergentViews,
    narrativeSummary,
    actionPlan,
  };
}

export function deriveOrganismState(consensus: ConsensusResult): OrganismState {
  const health = clamp(consensus.overallHealth / 100, 0, 1);

  // Pulse rate: low health = fast pulse (stressed), high health = slow pulse (calm)
  // Range: 0.5 (very healthy/calm) to 3.0 (very unhealthy/stressed)
  const pulseRate = 0.5 + (1 - health) * 2.5;

  // Pulse intensity scales with volatility and inversely with agreement
  const pulseIntensity = clamp(0.2 + (1 - consensus.agreement) * 0.6, 0.1, 0.9);

  // Volatility from risk count
  const riskCount = consensus.topRisks.length;
  const volatility = clamp(riskCount / 10, 0, 1);

  // Momentum from overall health relative to midpoint
  // Positive when above 50, negative when below
  const momentum = clamp((consensus.overallHealth - 50) / 50, -1, 1);

  // Map dimension scores to organ states
  const organs = DEFAULT_ORGANISM_STATE.organs.map((defaultOrgan) => {
    const dim = defaultOrgan.dimension as DimensionKey;
    const score = consensus.dimensionScores[dim] ?? 50;
    const organHealth = clamp(score / 100, 0, 1);

    return {
      ...defaultOrgan,
      position: [...defaultOrgan.position] as [number, number, number],
      health: organHealth,
      size: 0.5 + organHealth * 1.0, // 0.5 to 1.5
      activity: clamp(organHealth * consensus.agreement, 0, 1),
    };
  });

  return {
    health,
    pulseRate,
    pulseIntensity,
    volatility,
    momentum,
    agreement: consensus.agreement,
    organs,
  };
}

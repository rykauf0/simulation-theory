import { v4 as uuidv4 } from 'uuid';
import { callClaude } from '@/lib/anthropic';
import { AGENT_ROLES } from './agent-roles';
import { buildScenarioPrompt } from './scenario-builder';
import type {
  AgentRole,
  AgentResult,
  ConsensusResult,
  DimensionScores,
} from '@/types/simulation';

function parseAgentResponse(raw: string): {
  scores: DimensionScores;
  risks: AgentResult['risks'];
  opportunities: AgentResult['opportunities'];
  keyMetrics: string[];
  confidence: number;
  analysis: string;
} {
  // Try to extract JSON from ```json ... ``` block
  const jsonBlockMatch = raw.match(/```json\s*([\s\S]*?)```/);
  const jsonStr = jsonBlockMatch ? jsonBlockMatch[1].trim() : raw.trim();

  const parsed = JSON.parse(jsonStr);

  return {
    scores: {
      financial: parsed.scores?.financial ?? 50,
      market: parsed.scores?.market ?? 50,
      reputation: parsed.scores?.reputation ?? 50,
      operational: parsed.scores?.operational ?? 50,
      innovation: parsed.scores?.innovation ?? 50,
      resilience: parsed.scores?.resilience ?? 50,
    },
    risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
    keyMetrics: Array.isArray(parsed.keyMetrics) ? parsed.keyMetrics : [],
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
    analysis: typeof parsed.analysis === 'string' ? parsed.analysis : '',
  };
}

function defaultResult(role: AgentRole, agentId: string, durationMs: number, errorMsg?: string): AgentResult {
  return {
    agentId,
    role,
    status: 'error',
    scores: {
      financial: 50,
      market: 50,
      reputation: 50,
      operational: 50,
      innovation: 50,
      resilience: 50,
    },
    analysis: errorMsg || 'Unable to parse agent response. Returning default scores.',
    risks: [],
    opportunities: [],
    keyMetrics: [],
    confidence: 0.1,
    timestamp: Date.now(),
    durationMs,
  };
}

export async function executeAgent(
  role: AgentRole,
  companyName: string,
  context: string,
  previousRound?: ConsensusResult,
  injectedEvents?: string[]
): Promise<AgentResult> {
  const agentId = uuidv4();
  const startTime = Date.now();
  const agentDef = AGENT_ROLES[role];

  const userPrompt = buildScenarioPrompt(
    companyName,
    context,
    previousRound,
    injectedEvents
  );

  try {
    const responseText = await callClaude(agentDef.systemPrompt, userPrompt);
    const parsed = parseAgentResponse(responseText);
    const durationMs = Date.now() - startTime;

    return {
      agentId,
      role,
      status: 'complete',
      scores: parsed.scores,
      analysis: parsed.analysis,
      risks: parsed.risks,
      opportunities: parsed.opportunities,
      keyMetrics: parsed.keyMetrics,
      confidence: parsed.confidence,
      timestamp: Date.now(),
      durationMs,
    };
  } catch (error) {
    const durationMs = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`Agent ${role} (${agentId}) failed:`, errorMsg);
    return defaultResult(role, agentId, durationMs, `Agent error: ${errorMsg}`);
  }
}

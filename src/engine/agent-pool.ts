import type { AgentResult } from '@/types/simulation';

export class AgentPool {
  private maxConcurrent: number;

  constructor(maxConcurrent: number = 5) {
    this.maxConcurrent = maxConcurrent;
  }

  async executeAll(
    tasks: Array<() => Promise<AgentResult>>,
    onComplete: (result: AgentResult) => void
  ): Promise<AgentResult[]> {
    const results: AgentResult[] = [];
    let taskIndex = 0;
    const totalTasks = tasks.length;

    const executeWithRetry = async (
      task: () => Promise<AgentResult>,
      retries: number = 3,
      backoff: number = 1000
    ): Promise<AgentResult> => {
      try {
        return await task();
      } catch (error: unknown) {
        const isRateLimit =
          error instanceof Error &&
          (error.message.includes('429') || error.message.includes('rate'));

        if (isRateLimit && retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, backoff));
          return executeWithRetry(task, retries - 1, backoff * 2);
        }

        // Return error result rather than throwing
        return {
          agentId: 'error',
          role: 'market_analyst',
          status: 'error',
          scores: {
            financial: 50,
            market: 50,
            reputation: 50,
            operational: 50,
            innovation: 50,
            resilience: 50,
          },
          analysis: `Agent execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          risks: [],
          opportunities: [],
          keyMetrics: [],
          confidence: 0,
          timestamp: Date.now(),
          durationMs: 0,
        };
      }
    };

    return new Promise((resolve) => {
      let activeTasks = 0;
      let completedTasks = 0;

      const runNext = () => {
        while (activeTasks < this.maxConcurrent && taskIndex < totalTasks) {
          const currentTask = tasks[taskIndex];
          taskIndex++;
          activeTasks++;

          executeWithRetry(currentTask).then((result) => {
            activeTasks--;
            completedTasks++;
            results.push(result);

            try {
              onComplete(result);
            } catch (callbackError) {
              console.error('onComplete callback error:', callbackError);
            }

            if (completedTasks === totalTasks) {
              resolve(results);
            } else {
              runNext();
            }
          });
        }
      };

      runNext();
    });
  }
}

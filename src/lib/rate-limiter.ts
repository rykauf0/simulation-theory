export class RateLimiter {
  private availableTokens: number;
  private maxTokens: number;
  private refillRate: number; // tokens per millisecond
  private lastRefill: number;
  private concurrentLimit: number;
  private activeTasks: number;
  private waitQueue: Array<() => void>;

  constructor(tokensPerMinute: number, concurrentLimit: number = 5) {
    this.maxTokens = tokensPerMinute;
    this.availableTokens = tokensPerMinute;
    this.refillRate = tokensPerMinute / 60000; // per ms
    this.lastRefill = Date.now();
    this.concurrentLimit = concurrentLimit;
    this.activeTasks = 0;
    this.waitQueue = [];
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.availableTokens = Math.min(
      this.maxTokens,
      this.availableTokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }

  async acquire(): Promise<void> {
    this.refill();

    if (this.activeTasks < this.concurrentLimit && this.availableTokens >= 1) {
      this.activeTasks++;
      this.availableTokens--;
      return;
    }

    return new Promise<void>((resolve) => {
      this.waitQueue.push(() => {
        this.activeTasks++;
        this.availableTokens--;
        resolve();
      });

      // Set up a periodic check for token availability
      const interval = setInterval(() => {
        this.refill();
        this.processQueue();
        if (this.waitQueue.length === 0) {
          clearInterval(interval);
        }
      }, 100);
    });
  }

  release(): void {
    this.activeTasks--;
    this.refill();
    this.processQueue();
  }

  private processQueue(): void {
    while (
      this.waitQueue.length > 0 &&
      this.activeTasks < this.concurrentLimit &&
      this.availableTokens >= 1
    ) {
      const next = this.waitQueue.shift();
      if (next) {
        next();
      }
    }
  }
}

import { feedManager } from './feedManager';

class DealScheduler {
  private timer: NodeJS.Timeout | null = null;
  private intervalMs: number = 30 * 60 * 1000; // 30 minutes
  private isRunning: boolean = false;

  public start(delayStartMs: number = 3000): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log(`[DealScheduler] Initializing automated deal collection engine (Interval: ${this.intervalMs / 60000} mins)...`);

    // Initial delayed run to avoid blocking server boot
    setTimeout(async () => {
      try {
        console.log('[DealScheduler] Running initial automated deal ingestion...');
        await feedManager.runIngestion();
      } catch (err: any) {
        console.warn('[DealScheduler] Initial ingestion failed:', err.message);
      }

      // Schedule recurring periodic collection
      this.timer = setInterval(async () => {
        try {
          console.log('[DealScheduler] Triggering recurring automated deal update...');
          await feedManager.runIngestion();
        } catch (err: any) {
          console.warn('[DealScheduler] Scheduled ingestion run failed:', err.message);
        }
      }, this.intervalMs);
    }, delayStartMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('[DealScheduler] Automated deal collector stopped.');
  }
}

export const dealScheduler = new DealScheduler();

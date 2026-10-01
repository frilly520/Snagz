import { query, testConnection } from '../dbClient';
import { db } from '../db';
import { AdminMetrics } from '../../src/types';

export class MetricsRepository {
  /**
   * Get operational administrative metrics.
   * If PostgreSQL is configured and connected, augments live counts;
   * Otherwise returns db.getMetrics() with database connection telemetry.
   */
  async getMetrics(): Promise<AdminMetrics & { dbStatus?: any }> {
    const dbStatus = await testConnection();
    const baseMetrics = db.getMetrics();

    if (dbStatus.isConnected) {
      try {
        const [dealsRes, obsRes, reportsRes, runsRes] = await Promise.all([
          query<{ count: string }>('SELECT count(*) as count FROM deals WHERE is_active = TRUE'),
          query<{ count: string }>('SELECT count(*) as count FROM price_observations WHERE observed_at >= NOW() - INTERVAL \'24 HOURS\''),
          query<{ count: string }>('SELECT count(*) as count FROM reports WHERE status = \'PENDING\''),
          query<{ count: string }>('SELECT count(*) as count FROM ingestion_runs WHERE started_at >= NOW() - INTERVAL \'24 HOURS\'')
        ]);

        const activeDeals = dealsRes && dealsRes.rows[0] ? parseInt(dealsRes.rows[0].count, 10) : baseMetrics.activeDeals;
        const observationsToday = obsRes && obsRes.rows[0] ? parseInt(obsRes.rows[0].count, 10) : baseMetrics.dealsDiscoveredToday;
        const pendingReports = reportsRes && reportsRes.rows[0] ? parseInt(reportsRes.rows[0].count, 10) : baseMetrics.userReportsPending;
        const syncsToday = runsRes && runsRes.rows[0] ? parseInt(runsRes.rows[0].count, 10) : 0;

        return {
          ...baseMetrics,
          activeDeals: activeDeals || baseMetrics.activeDeals,
          dealsDiscoveredToday: observationsToday || baseMetrics.dealsDiscoveredToday,
          userReportsPending: pendingReports,
          dbStatus: {
            isConfigured: true,
            isConnected: true,
            connectionType: 'postgres',
            syncsToday
          }
        };
      } catch (err) {
        console.warn('[MetricsRepository] Error gathering live DB metrics, returning fallback:', err);
      }
    }

    return {
      ...baseMetrics,
      dbStatus
    };
  }
}

export const metricsRepository = new MetricsRepository();

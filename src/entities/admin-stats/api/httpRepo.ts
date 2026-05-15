// BE TODO: replace Promise.resolve with `http.get<AdminOverviewStats>("/admin/stats/overview")`
// once the gateway/core endpoint lands. Shape matches the planned response.

export interface AdminOverviewStats {
  totalStudents: number;
  activeCourses: number;
}

export const adminStatsRepo = {
  getOverview: (): Promise<AdminOverviewStats> =>
    Promise.resolve({ totalStudents: 0, activeCourses: 0 }),
};

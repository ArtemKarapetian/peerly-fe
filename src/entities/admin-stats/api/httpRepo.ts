export interface AdminOverviewStats {
  totalStudents: number;
  activeCourses: number;
}

export const adminStatsRepo = {
  getOverview: (): Promise<AdminOverviewStats> =>
    Promise.resolve({ totalStudents: 0, activeCourses: 0 }),
};

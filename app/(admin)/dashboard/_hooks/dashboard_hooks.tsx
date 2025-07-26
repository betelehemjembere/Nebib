import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";

interface DashboardStats {
  totalForms: number;
  activeForms: number;
  totalSubmissions: number;
  avgResponseRate: number;
  formTrend: number;
  submissionTrend: number;
  responseRateTrend: number;
}

interface RecentForm {
  id: string;
  title: string;
  submissions: number;
  lastSubmission: string;
  status: string;
  category: string;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentForms: RecentForm[];
}

const getDashboardData = async (): Promise<DashboardData> => {
  const res = await betterFetch<DashboardData>("/api/dashboard");
  return res.data || {
    stats: {
      totalForms: 0,
      activeForms: 0,
      totalSubmissions: 0,
      avgResponseRate: 0,
      formTrend: 0,
      submissionTrend: 0,
      responseRateTrend: 0
    },
    recentForms: []
  };
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });
}; 
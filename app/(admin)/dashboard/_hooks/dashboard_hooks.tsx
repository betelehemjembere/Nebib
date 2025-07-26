import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@better-fetch/fetch";

interface Form {
  id: string;
  topic: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  submissions: number;
  type: 'Public' | 'Private';
  fields: Array<{
    id: string;
    label: string;
    type: string;
    required: boolean;
  }>;
  datas: Array<{
    id: string;
    data: any;
    createdAt: string;
  }>;
}

const getForms = async (): Promise<Form[]> => {
  const res = await betterFetch<Form[]>("/api/forms");
  return res.data || [];
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["forms"],
    queryFn: getForms,
  });
}; 
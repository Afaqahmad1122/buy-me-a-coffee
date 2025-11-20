import { apiClient } from "../api-client";

export type Supporter = {
  _id: string;
  name: string;
  message?: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export async function getRecentSupporters(limit = 10): Promise<Supporter[]> {
  const { data } = await apiClient.get<Supporter[]>("/supporters", {
    params: { limit },
  });
  return data;
}

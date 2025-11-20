import { useQuery } from "@tanstack/react-query";
import { Supporter, getRecentSupporters } from "../lib/services/supporters";

export function useRecentSupporters(limit = 10) {
  return useQuery<Supporter[]>({
    queryKey: ["supporters", limit],
    queryFn: () => getRecentSupporters(limit),
    staleTime: 1000 * 60,
  });
}

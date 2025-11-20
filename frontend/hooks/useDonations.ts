import { useMutation } from "@tanstack/react-query";
import {
  CreateDonationPayload,
  createDonationIntent,
} from "../lib/services/donations";

export function useCreateDonationIntent() {
  return useMutation({
    mutationFn: (payload: CreateDonationPayload) =>
      createDonationIntent(payload),
  });
}

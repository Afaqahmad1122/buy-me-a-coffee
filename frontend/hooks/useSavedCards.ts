import { useMutation, useQuery } from "@tanstack/react-query";
import {
  PaymentMethod,
  createSetupIntent,
  listSavedPaymentMethods,
} from "../lib/services/cards";

export function useSavedPaymentMethods(customerId?: string) {
  return useQuery<PaymentMethod[]>({
    queryKey: ["saved-payment-methods", customerId],
    queryFn: () =>
      customerId ? listSavedPaymentMethods(customerId) : Promise.resolve([]),
    enabled: !!customerId,
  });
}

export function useCreateSetupIntent() {
  return useMutation({
    mutationFn: (customerId: string) => createSetupIntent(customerId),
  });
}

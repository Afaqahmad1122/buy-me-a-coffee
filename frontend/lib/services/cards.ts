import { apiClient } from "../api-client";

export type SetupIntentResponse = {
  clientSecret: string;
};

export type PaymentMethod = {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};

export async function createSetupIntent(
  customerId: string
): Promise<SetupIntentResponse> {
  const { data } = await apiClient.post<SetupIntentResponse>(
    "/stripe/setup-intent",
    { customerId }
  );
  return data;
}

export async function listSavedPaymentMethods(
  customerId: string
): Promise<PaymentMethod[]> {
  const { data } = await apiClient.get<PaymentMethod[]>(
    "/stripe/payment-methods",
    {
      params: { customerId },
    }
  );
  return data;
}

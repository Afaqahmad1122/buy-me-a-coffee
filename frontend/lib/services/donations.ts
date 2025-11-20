import { apiClient } from "../api-client";

export type CreateDonationPayload = {
  amount: number;
  name?: string;
  message?: string;
  customerId?: string;
  paymentMethodId?: string;
  savePaymentMethod?: boolean;
};

export type CreateDonationResponse = {
  clientSecret: string;
  paymentIntentId: string;
};

export async function createDonationIntent(
  payload: CreateDonationPayload
): Promise<CreateDonationResponse> {
  const { data } = await apiClient.post<CreateDonationResponse>(
    "/donations/create-intent",
    payload
  );
  return data;
}

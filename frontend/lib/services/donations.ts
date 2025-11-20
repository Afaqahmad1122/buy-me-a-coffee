import { apiClient } from "../api-client";
import type { Supporter } from "./supporters";

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

export type RecordDonationPayload = {
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

export async function recordDonation(
  payload: RecordDonationPayload
): Promise<Supporter> {
  const { data } = await apiClient.post<Supporter>(
    "/donations/record",
    payload
  );
  return data;
}

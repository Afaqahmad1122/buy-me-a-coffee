"use client";

import { useMemo, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeCardElementOptions } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useCreateDonationIntent } from "../hooks/useDonations";

const presetAmounts = [25, 50, 100, 250, 500];

const cardElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      color: "#09090b",
      fontFamily: "var(--font-geist-sans), system-ui",
      fontSize: "16px",
      "::placeholder": { color: "#a1a1aa" },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};

export function DonationForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(50);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);
  const [cardMessage, setCardMessage] = useState<string | null>(null);

  const { mutateAsync, isPending, reset } = useCreateDonationIntent();

  const isProcessing = isPending || isConfirming;

  const buttonLabel = useMemo(() => {
    if (isProcessing) return "Processing...";
    if (lastPaymentId) return "Donation complete";
    return "Donate now";
  }, [isProcessing, lastPaymentId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Stripe is still loading. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("Please enter card details.");
      return;
    }

    setIsConfirming(true);
    setCardMessage(null);

    try {
      const intent = await mutateAsync({
        amount,
        name: name.trim() || undefined,
        message: message.trim() || undefined,
        savePaymentMethod: saveCard,
        customerId: customerId.trim() || undefined,
      });

      const confirmation = await stripe.confirmCardPayment(
        intent.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: name.trim() || undefined,
            },
          },
        }
      );

      if (
        confirmation.error ||
        confirmation.paymentIntent?.status !== "succeeded"
      ) {
        throw new Error(
          confirmation.error?.message || "Payment could not be confirmed."
        );
      }

      toast.success("Donation confirmed! 🎉");
      setLastPaymentId(confirmation.paymentIntent.id);
      setAmount(50);
      setName("");
      setMessage("");
      setSaveCard(false);
      setCustomerId("");
      cardElement.clear();
      reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to process donation.";
      toast.error(message);
    } finally {
      setIsConfirming(false);
    }
  }

  function handleReset() {
    reset();
    setAmount(50);
    setName("");
    setMessage("");
    setSaveCard(false);
    setCustomerId("");
    setLastPaymentId(null);
    setCardMessage(null);
    elements?.getElement(CardElement)?.clear();
  }

  return (
    <section className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-xl shadow-zinc-100/80 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-black/40">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-500">
          Make an impact
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
          Fuel the mission
        </h2>
        <p className="text-sm text-zinc-500 dark:text-white/60">
          Every donation goes directly to our community-driven initiatives.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <p className="text-sm font-medium text-zinc-800 dark:text-white">
            Quick select
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {presetAmounts.map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => setAmount(preset)}
                className={`rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
                  amount === preset
                    ? "border-transparent bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "border-zinc-200 text-zinc-600 hover:border-emerald-200 hover:bg-emerald-50"
                } dark:border-white/10 dark:text-white dark:hover:border-white/30`}
              >
                ${preset}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-sm font-medium text-zinc-800 dark:text-white">
          Custom amount (USD)
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-base text-zinc-900 shadow-sm shadow-zinc-100 focus:border-emerald-400 focus:outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-800 dark:text-white">
          Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Optional"
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-base text-zinc-900 shadow-sm shadow-zinc-100 focus:border-emerald-400 focus:outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-800 dark:text-white">
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Share a note with the team"
            rows={3}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-base text-zinc-900 shadow-sm shadow-zinc-100 focus:border-emerald-400 focus:outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
          />
        </label>
        <div>
          <p className="text-sm font-medium text-zinc-800 dark:text-white">
            Payment method
          </p>
          <div className="mt-2 rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 shadow-sm shadow-zinc-100 focus-within:border-emerald-400 dark:border-white/10 dark:bg-white/10">
            <CardElement
              options={cardElementOptions}
              onChange={(event) => {
                if (event.error) {
                  setCardMessage(event.error.message ?? null);
                } else {
                  setCardMessage(null);
                }
              }}
            />
          </div>
          {cardMessage && (
            <p className="mt-2 text-sm text-rose-500">{cardMessage}</p>
          )}
        </div>
        <label className="block text-sm font-medium text-zinc-800 dark:text-white">
          Customer ID
          <input
            type="text"
            value={customerId}
            onChange={(event) => setCustomerId(event.target.value)}
            placeholder="Attach to an existing Stripe customer"
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-base text-zinc-900 shadow-sm shadow-zinc-100 focus:border-emerald-400 focus:outline-none dark:border-white/10 dark:bg-white/10 dark:text-white"
          />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium text-zinc-800 dark:text-white">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(event) => setSaveCard(event.target.checked)}
            className="h-5 w-5 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
          />
          Save payment method for future support
        </label>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isProcessing || !stripe || !elements}
            className="flex-1 rounded-2xl bg-linear-to-b from-emerald-500 to-emerald-400 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/40 transition hover:brightness-105 disabled:cursor-not-allowed disabled:brightness-95"
          >
            {buttonLabel}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-2xl border border-zinc-200 px-4 py-3 text-base font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
          >
            Reset
          </button>
        </div>
        {lastPaymentId && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm text-emerald-700 shadow-sm dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-100">
            Donation confirmed! Stripe PaymentIntent:
            <span className="mt-2 block font-mono text-xs">
              {lastPaymentId}
            </span>
          </div>
        )}
      </form>
    </section>
  );
}

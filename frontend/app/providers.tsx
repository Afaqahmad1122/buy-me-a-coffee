"use client";

import { PropsWithChildren, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Toaster } from "sonner";
import { env } from "../lib/env";

const stripePromise = env.stripePublishableKey
  ? loadStripe(env.stripePublishableKey)
  : null;

export function ReactQueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 30,
          },
        },
      })
  );

  const wrappedChildren = useMemo(() => {
    return <Elements stripe={stripePromise}>{children}</Elements>;
  }, [children]);

  return (
    <QueryClientProvider client={queryClient}>
      {wrappedChildren}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}

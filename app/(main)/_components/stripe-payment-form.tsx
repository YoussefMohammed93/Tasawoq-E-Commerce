"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";

interface StripePaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: Error) => void;
}

export function StripePaymentForm({
  clientSecret,
  amount,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Track if payment was already successful to prevent duplicate callbacks
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    // Check the payment intent status
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;

      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("تمت عملية الدفع بنجاح");
          if (!paymentSuccessful) {
            setPaymentSuccessful(true);
            onSuccess(paymentIntent.id);
          }
          break;
        case "processing":
          setMessage("جاري معالجة الدفع");
          break;
        case "requires_payment_method":
          setMessage(null);
          break;
        default:
          setMessage("حدث خطأ ما");
          break;
      }
    });
  }, [stripe, clientSecret, onSuccess, paymentSuccessful]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || paymentSuccessful) {
      // Stripe.js hasn't loaded yet or payment was already successful
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "حدث خطأ في عملية الدفع");
        } else {
          setMessage("حدث خطأ غير متوقع");
        }
        // Only call onError if payment wasn't already successful
        if (!paymentSuccessful) {
          onError(new Error(error.message || "حدث خطأ في عملية الدفع"));
        }
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        setMessage("تمت عملية الدفع بنجاح");
        if (!paymentSuccessful) {
          setPaymentSuccessful(true);
          onSuccess(paymentIntent.id);
        }
      } else {
        setMessage("حدث خطأ غير متوقع");
      }
    } catch (err) {
      const error = err as Error;
      setMessage(error.message || "حدث خطأ غير متوقع");
      // Only call onError if payment wasn't already successful
      if (!paymentSuccessful) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement />
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.includes("بنجاح")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            جاري المعالجة...
          </>
        ) : (
          <>
            <ArrowRight className="h-4 w-4" />
            دفع {amount.toFixed(2)} ر.س
          </>
        )}
      </Button>
    </form>
  );
}

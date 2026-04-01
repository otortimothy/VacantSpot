"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize payment");
      }

      // Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button size="lg" onClick={handlePayment} disabled={loading} className="w-full md:w-auto h-14 px-8 text-lg font-bold rounded-xl shadow-lg">
        {loading ? "Redirecting to Paystack..." : "Pay ₦10,000 Now"}
      </Button>
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
}

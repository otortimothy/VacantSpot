"use client";

import React, { useState } from "react";
import { submitInquiry } from "@/lib/actions/inquiries";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface InquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

const InquiryForm = ({ propertyId, propertyTitle }: InquiryFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("property_id", propertyId);

    try {
      await submitInquiry(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-3xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-green-800 dark:text-green-300">Inquiry Sent!</h3>
        <p className="text-green-700 dark:text-green-400 text-sm font-medium">
          Your request to inspect <strong>"{propertyTitle}"</strong> has been submitted.
          The landlord will review your message shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="property_id" value={propertyId} />

      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Your Name"
          name="tenant_name"
          placeholder="John Doe"
          required
        />
        <Input
          label="Your Email"
          name="tenant_email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground/80 ml-1">Message</label>
        <textarea
          name="message"
          placeholder="Hi, I'm interested in viewing this property. I'd like to schedule an inspection..."
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl font-bold"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          "📋 Request Inspection"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        🔒 Your contact info stays private. VacantSpot manages all communications.
      </p>
    </form>
  );
};

export default InquiryForm;

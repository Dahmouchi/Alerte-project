"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AnalystResponseFormProps {
  onSubmit: (response: string) => void;
  onCancel?: () => void;
}

export function AnalystResponseForm({
  onSubmit,
  onCancel,
}: AnalystResponseFormProps) {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(response);
      window.location.reload();
      setResponse(""); // Clear form after submission
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="analystResponse" className="block mb-2">
          Your Response
        </Label>
        <Textarea
          id="analystResponse"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Enter your response to the user's justification..."
          required
          minLength={10}
          className="min-h-[120px]"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !response.trim()}>
          {isSubmitting ? "Submitting..." : "Submit Response"}
        </Button>
      </div>
    </form>
  );
}
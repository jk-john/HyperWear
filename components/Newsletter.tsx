"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Gift, Mail, X } from "lucide-react";
import { useState } from "react";

interface NewsletterProps {
  onClose?: () => void;
  className?: string;
}

export default function Newsletter({ onClose, className }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-white/20 shadow-2xl backdrop-blur-sm",
          className
        )}
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Thank you! 🎉
                </h3>
                <p className="text-white text-sm">
                  We'll send you a special gift soon!
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-white/20 shadow-2xl backdrop-blur-sm",
        className
      )}
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Hey, we have a gift for your first shop! 🎁
              </h3>
              <p className="text-white text-sm">
                Subscribe to get exclusive deals and your welcome gift
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <form onSubmit={handleSubmit} className="flex gap-2 min-w-0">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 bg-white border-white/20 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-white min-w-[280px]"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="bg-white text-primary hover:bg-white/90 font-medium px-6 cursor-pointer"
              >
                {isLoading ? "..." : "Get Gift"}
              </Button>
            </form>
            
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 hover:text-white flex-shrink-0 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mt-3 text-white text-sm bg-red-500/20 rounded-md px-3 py-2 border border-red-500/30">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
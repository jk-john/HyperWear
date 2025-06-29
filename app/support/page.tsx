"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | null
  >(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        setSubmissionStatus("success");
        setFeedbackMessage(
          "Thanks for your message! We'll get back to you shortly ✉️",
        );
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const errorData = await response.json();
        setSubmissionStatus("error");
        setFeedbackMessage(
          errorData.error || "An unexpected error occurred. Please try again.",
        );
      }
    } catch (error) {
      setSubmissionStatus("error");
      setFeedbackMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-jungle flex min-h-screen items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-jungle w-full max-w-lg space-y-8 rounded-lg p-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold">Support</h1>
          <p className="mt-2 text-lg">How can we help you today?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="bg-primary border-white text-white placeholder:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-primary border-white text-white placeholder:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="subject" className="sr-only">
              Subject
            </label>
            <Input
              id="subject"
              name="subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="bg-primary border-white text-white placeholder:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              className="bg-primary w-full rounded-md border border-white p-2 text-white placeholder:text-gray-300"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-primary w-full border-white bg-white hover:bg-gray-200"
            >
              {isSubmitting ? "Submitting..." : "Send Message"}
            </Button>
          </div>
        </form>

        {submissionStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 rounded-md p-4 text-center ${
              submissionStatus === "success"
                ? "bg-green-500/20 text-green-300"
                : "bg-red-500/20 text-red-300"
            }`}
          >
            {feedbackMessage}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { AtSign, MessageSquare, Send, Twitter, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (response.ok) {
        toast.success("Thanks for reaching out! We'll get back to you soon.");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.error || "We couldn't send your message. Try again later.",
        );
      }
    } catch {
      toast.error("We couldn't send your message. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16 md:flex-row md:gap-16">
        {/* Left Side: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 max-w-md text-center md:mb-0 md:text-left"
        >
          <h1 className="font-display text-5xl font-bold">Get in Touch</h1>
          <p className="mt-4 text-lg text-white/70">
            Having an issue with your order or have a question? Our team is here
            to help!
          </p>

          <div className="mt-10 space-y-6">
            <h2 className="font-display text-2xl font-semibold">
              Contact us via:
            </h2>
            <div className="flex flex-col items-center space-y-4 md:items-start">
              <Link
                href="https://twitter.com/wear_hyper"
                target="_blank"
                className="hover:text-accent flex items-center gap-4 text-lg transition-colors"
              >
                <Twitter className="h-7 w-7" />
                <span>@wear_hyper</span>
              </Link>
              <div className="flex items-center gap-4 text-lg">
                <MessageSquare className="h-7 w-7" />
                <span>Chat messaging on the website</span>
              </div>
              {/* <a
                href="mailto:contact@hyperwear.io"
                className="hover:text-accent flex items-center gap-4 text-lg transition-colors"
              >
                <AtSign className="h-7 w-7" />
                <span>contact@hyperwear.io</span>
              </a> */}
            </div>
          </div>

          <p className="mt-10 text-white/50">
            We&apos;ll get back to you as soon as possible.
          </p>
        </motion.div>

        {/* Right Side: Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-dark1 w-full max-w-lg rounded-xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-white/40" />
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="bg-dark2 border-tealMid/30 focus:ring-accent focus:border-accent h-12 rounded-lg pl-10 text-white placeholder:text-white/40 focus:ring-2"
              />
            </div>
            <div className="relative">
              <AtSign className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-white/40" />
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-dark2 border-tealMid/30 focus:ring-accent focus:border-accent h-12 rounded-lg pl-10 text-white placeholder:text-white/40 focus:ring-2"
              />
            </div>
            <div className="relative">
              <Send className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-white/40" />
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="bg-dark2 border-tealMid/30 focus:ring-accent focus:border-accent h-12 rounded-lg pl-10 text-white placeholder:text-white/40 focus:ring-2"
              />
            </div>
            <div>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message..."
                className="bg-dark2 border-tealMid/30 focus:ring-accent focus:border-accent w-full rounded-lg p-3 text-white placeholder:text-white/40 focus:ring-2"
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-jungle shadow-accent/20 hover:bg-cream/90 h-14 w-full transform rounded-lg bg-white px-8 font-bold shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {isSubmitting ? "Submitting..." : "Send Message"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Instagram, Twitter } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";

const PurrNftForm = dynamic(
  () => import("@/components/ui/PurrNftForm").then((mod) => mod.PurrNftForm),
  {
    ssr: false,
    loading: () => (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-1/4 rounded bg-gray-700" />
          <div className="h-10 w-full rounded bg-gray-700" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-1/4 rounded bg-gray-700" />
          <div className="h-10 w-full rounded bg-gray-700" />
        </div>
        <div className="h-12 w-full rounded-full bg-gray-700" />
      </div>
    ),
  },
);

export default function CommunityPageClient() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-start rounded-md pt-20 antialiased"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      <div className="mx-auto max-w-4xl p-4 text-center">
        <h1
          className="font-display relative z-10 bg-gradient-to-b from-white to-neutral-600 bg-clip-text text-lg font-bold text-transparent md:text-7xl"
          style={{ color: "var(--color-light)" }}
        >
          Community First
        </h1>

        <p
          className="text-cream font-body relative z-10 mx-auto my-2 max-w-lg text-justify"
          style={{ color: "var(--color-light)" }}
        >
          Are you a member of the HyperLiquid community looking to collaborate?
          We&apos;d love to hear from you! Reach out to us and let&apos;s build
          something amazing together for the HyperLiquid community.
        </p>
      </div>

      <Separator className="my-12 bg-gray-700/50" />

      <div className="relative z-10 w-full max-w-2xl space-y-12 px-4">
        {/* PURR NFT Holders Section */}
        <section className="w-full max-w-2xl rounded-lg border border-cyan-500/30 bg-cyan-900/20 p-8 text-center backdrop-blur-sm">
          <div className="mb-10 flex flex-row items-center justify-center gap-4">
            <Image
              src="/purr-happy.png"
              alt="Purr NFT"
              width={150}
              height={150}
              className="mx-auto mb-4 rounded-2xl"
              key="purr-happy"
            />
            <div className="flex flex-col items-center gap-y-2">
              <h2 className="font-body text-xl font-semibold text-white">
                Eligible PURR NFT holders, fill this form.
              </h2>
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            <Image
              src="/purr-lying-happy.png"
              alt="Purr Happy"
              width={150}
              height={150}
              className="mx-auto mb-4 rounded-2xl"
              key="purr-lying-happy"
            />
          </div>
          <fieldset disabled className="cursor-not-allowed opacity-50">
            <PurrNftForm />
          </fieldset>
        </section>

        {/* HYPE Stakers Section */}
        <section className="w-full max-w-2xl rounded-lg border border-cyan-500/30 bg-cyan-900/20 p-8 text-center backdrop-blur-sm">
          <div className="mb-4 flex flex-col items-center gap-y-2">
            <h2 className="font-display text-3xl font-bold text-white">
              HYPE Stakers Get Ready!
            </h2>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
          <div className="opacity-50">
            <p className="font-body mx-auto max-w-lg text-lg text-cyan-200">
              Reductions for $HYPE stakers will be coming for the next drop.
              Stay tuned for more details!
            </p>
            <br />
            <br />
            <p className="text-cyan-200">
              Join us on our socials for more updates!
            </p>

            <div className="mt-4 flex flex-row items-center justify-center gap-12">
              <Instagram className="h-6 w-6 text-cyan-200" />
              <Twitter className="h-6 w-6 text-cyan-200" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

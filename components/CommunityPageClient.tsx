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
      className="relative flex min-h-screen w-full flex-col items-center justify-start rounded-md pt-20 antialiased overflow-hidden"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      {/* Floating Purr Images - Positioned absolutely for creative placement */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left corner - peeking in */}
        <Image
          src="/purr-happy.png"
          alt="Purr NFT"
          width={80}
          height={80}
          className="absolute -top-4 -left-4 rounded-2xl opacity-60 rotate-12 animate-pulse"
        />
        
        {/* Top right - floating */}
        <Image
          src="/purr-lying-happy.png"
          alt="Purr Happy"
          width={100}
          height={100}
          className="absolute top-32 right-8 rounded-2xl opacity-40 -rotate-12 animate-bounce"
          style={{ animationDelay: '1s', animationDuration: '3s' }}
        />
        
        {/* Middle left - subtle presence */}
        <Image
          src="/purr-happy.png"
          alt="Purr NFT"
          width={60}
          height={60}
          className="absolute top-1/2 -left-8 rounded-2xl opacity-30 rotate-45 animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Bottom right corner - playful */}
        <Image
          src="/purr-lying-happy.png"
          alt="Purr Happy"
          width={90}
          height={90}
          className="absolute bottom-20 -right-6 rounded-2xl opacity-50 -rotate-6 animate-bounce"
          style={{ animationDelay: '0.5s', animationDuration: '4s' }}
        />
        
        {/* Center background - very subtle */}
        <Image
          src="/purr-happy.png"
          alt="Purr NFT"
          width={200}
          height={200}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl opacity-5 rotate-12"
        />
      </div>

      <div className="mx-auto max-w-4xl p-4 text-center relative z-10">
        <h1
          className="font-display relative z-10 bg-gradient-to-b from-white to-neutral-600 bg-clip-text text-lg font-bold text-transparent md:text-7xl"
          style={{ color: "var(--color-light)" }}
        >
          Community First
        </h1>

        <p
          className="text-cream font-body relative z-10 mx-auto my-2 max-w-lg text-center sm:text-justify"
          style={{ color: "var(--color-light)" }}
        >
          Are you a member of the HyperLiquid community looking to collaborate?
          We&apos;d love to hear from you! Reach out to us and let&apos;s build
          something amazing together for the HyperLiquid community.
        </p>
      </div>

      <Separator className="my-12 bg-gray-700/50 relative z-10" />

      <div className="relative z-10 w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* PURR NFT Holders Section */}
          <section className="w-full rounded-lg border border-cyan-500/30 bg-cyan-900/20 p-8 text-center backdrop-blur-sm relative overflow-hidden">
            {/* Floating Purr in the section background */}
            <div className="absolute top-4 right-4 opacity-20">
              <Image
                src="/purr-happy.png"
                alt="Purr NFT"
                width={40}
                height={40}
                className="rounded-xl animate-spin"
                style={{ animationDuration: '20s' }}
              />
            </div>
            <div className="absolute bottom-4 left-4 opacity-20">
              <Image
                src="/purr-lying-happy.png"
                alt="Purr Happy"
                width={35}
                height={35}
                className="rounded-xl animate-pulse"
              />
            </div>
            
            <div className="mb-10 flex flex-col items-center gap-4 relative z-10">
              <div className="flex flex-col items-center gap-y-2">
                <h2 className="font-body text-lg font-semibold text-white">
                  Eligible PURR NFT holders, fill this form.
                </h2>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </div>
            <fieldset disabled className="cursor-not-allowed opacity-50 relative z-10">
              <PurrNftForm />
            </fieldset>
          </section>

          {/* Future Surprise Section */}
          <section className="w-full rounded-lg border border-purple-500/30 bg-purple-900/20 p-8 text-center backdrop-blur-sm">
            <div className="mb-6 flex flex-col items-center gap-y-4">
              <Image
                src="/HYPE.svg"
                alt="HYPE"
                width={80}
                height={80}
                className="mx-auto opacity-80"
              />
              <h2 className="font-display text-2xl font-bold text-white">
                Something Special is Coming
              </h2>
              <Badge variant="outline" className="border-purple-400 text-purple-200">
                Surprise Ahead
              </Badge>
            </div>
            <div className="space-y-6">
              <p className="font-body mx-auto max-w-lg text-base text-purple-200">
                We&apos;re working on something extraordinary for the HyperLiquid community. 
                A new chapter in the HyperWear journey that will revolutionize how we connect, 
                create, and celebrate together.
              </p>
              <div className="rounded-lg bg-purple-800/30 p-4">
                <p className="text-purple-100 font-medium text-sm">
                  🎁 Exclusive community rewards<br />
                  🚀 Innovative collaboration features<br />
                  ✨ Unique experiences for HyperLiquid enthusiasts
                </p>
              </div>
              <p className="text-purple-200 text-sm">
                Stay connected with us to be the first to know!
              </p>

              <div className="mt-6 flex flex-row items-center justify-center gap-12">
                <a
                  href="https://www.instagram.com/wear_hyper/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <Instagram className="h-6 w-6 text-purple-200 hover:text-white" />
                </a>
                <a
                  href="https://x.com/wear_hyper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                >
                  <Twitter className="h-6 w-6 text-purple-200 hover:text-white" />
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

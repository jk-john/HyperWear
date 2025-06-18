import { PurrNftForm } from "@/components/ui/PurrNftForm";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { Separator } from "@/components/ui/separator";

export default function CommunityPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-start rounded-md pt-20 antialiased"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      <div className="mx-auto max-w-2xl p-4 text-center">
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
        <section className="text-center">
          <h2 className="font-display mb-4 text-3xl font-bold text-white">
            Eligible PURR NFT holders, we have a surprise for you :)
          </h2>
          <PurrNftForm />
        </section>

        {/* HYPE Stakers Section */}
        <section className="rounded-lg border border-cyan-500/30 bg-cyan-900/20 p-8 text-center backdrop-blur-sm">
          <h2 className="font-display mb-4 text-3xl font-bold text-white">
            HYPE Stakers Get Ready!
          </h2>
          <p className="font-body mx-auto max-w-lg text-lg text-cyan-200">
            Reductions for HYPE stakers will be coming for the next drop. Stake
            now and prepare!
          </p>
        </section>
      </div>

      <BackgroundBeams />
    </div>
  );
}

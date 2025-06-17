import { BackgroundBeams } from "@/components/ui/background-beams";

export default function CommunityPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-start rounded-md pt-20 antialiased"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      <div className="mx-auto max-w-2xl p-4">
        <h1
          className="font-display relative z-10 bg-gradient-to-b from-white to-neutral-600 bg-clip-text text-center text-lg font-bold text-transparent md:text-7xl"
          style={{ color: "var(--color-light)" }}
        >
          Community First
        </h1>

        <p
          className="text- text-cream font-body relative z-10 mx-auto my-2 w-full max-w-lg text-justify"
          style={{ color: "var(--color-light)" }}
        >
          Are you a member of the HyperLiquid community looking to collaborate?
          We&apos;d love to hear from you! Reach out to us and let&apos;s build
          something amazing together for the HyperLiquid community.
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}

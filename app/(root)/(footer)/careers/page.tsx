import CareersForm from "@/components/ui/CareersForm";

export default function CareersPage() {
  return (
    <div className="bg-dark font-inter text-white">
      <div className="container mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="from-cream to-secondary mb-4 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
            Careers
          </h1>
          <p className="text-accent mx-auto max-w-2xl text-lg md:text-xl">
            Join our team and help us build the full HyperWear collection.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-xl">
          <CareersForm />
        </div>
      </div>
    </div>
  );
}

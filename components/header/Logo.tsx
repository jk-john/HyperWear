import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="HyperWear"
          width={200}
          height={120}
          className="rounded-md"
        />
      </Link>
    </div>
  );
};

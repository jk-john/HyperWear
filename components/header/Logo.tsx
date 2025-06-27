import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo.svg"
          alt="HyperWear"
          width={180}
          height={180}
          className="bg-primary cursor-pointer rounded-4xl p-3"
        />
      </Link>
    </div>
  );
};

import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <>
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/logo-hyperwear.svg"
          alt="HyperWear"
          width={250}
          height={250}
          className="cursor-pointer"
        />
      </Link>
    </>
  );
};

import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <>
      <Link href="/" className="flex items-center gap-2" legacyBehavior>
        <Image
          src="/logo.svg"
          alt="HyperWear"
          width={180}
          height={180}
          className="bg-primary cursor-pointer rounded-xl p-3"
        />
      </Link>
    </>
  );
};

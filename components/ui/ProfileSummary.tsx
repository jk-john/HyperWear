import { Tables } from "@/types/supabase";
import Image from "next/image";

type Address = Tables<"user_addresses">;

interface ProfileSummaryProps {
  defaultAddress: Address | null;
  user: {
    email?: string;
  };
}

export function ProfileSummary({ defaultAddress, user }: ProfileSummaryProps) {
  const userEmail = user.email;

  const {
    first_name,
    last_name,
    company_name,
    phone_number,
    street,
    address_complement,
    city,
    postal_code,
    country,
    delivery_instructions,
  } = defaultAddress || {};

  return (
    <div className="bg-primary rounded-lg p-8 shadow-lg">
      <h2 className="font-display mb-6 text-3xl font-semibold text-white">
        Profile Summary
      </h2>
      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex-shrink-0 text-center md:text-left">
          <Image
            src="/purr-lying-happy.png"
            alt="User Avatar"
            width={128}
            height={128}
            className="border-secondary mx-auto rounded-xl border-4 object-cover"
          />
        </div>
        <div className="grid flex-grow grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <InfoItem label="First Name" value={first_name} />
          <InfoItem label="Last Name" value={last_name} />
          <InfoItem label="Email Address" value={userEmail} />
          <InfoItem label="Phone Number" value={phone_number} />
          <InfoItem label="Street Address" value={street} />
          <InfoItem label="City" value={city} />
          <InfoItem label="ZIP Code" value={postal_code} />
          <InfoItem label="Country" value={country} />
          {defaultAddress && company_name && (
            <InfoItem label="Company" value={company_name} />
          )}
          {defaultAddress && address_complement && (
            <InfoItem label="Apt / Suite" value={address_complement} />
          )}
          {defaultAddress && delivery_instructions && (
            <InfoItem
              label="Delivery Instructions"
              value={delivery_instructions}
              fullWidth
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string | null | undefined;
  fullWidth?: boolean;
}

function InfoItem({ label, value, fullWidth = false }: InfoItemProps) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <p className="text-sm font-semibold text-gray-400">{label}</p>
      <p className="text-lg text-white">{value || "–"}</p>
    </div>
  );
}

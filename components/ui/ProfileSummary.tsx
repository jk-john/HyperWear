import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

type UserAddress = Tables<"user_addresses">;

interface ProfileSummaryProps {
  defaultAddress: UserAddress | null;
  user: User;
}

export function ProfileSummary({ defaultAddress, user }: ProfileSummaryProps) {
  const userEmail = user.email;

  const firstName = user.user_metadata.first_name;
  const lastName = user.user_metadata.last_name;
  const fullName = user.user_metadata.full_name || user.user_metadata.name;

  const displayFirstName =
    firstName || (fullName ? fullName.split(" ")[0] : undefined);
  const displayLastName =
    lastName || (fullName ? fullName.split(" ").slice(1).join(" ") : undefined);

  const {
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
    <div className="bg-primary flex flex-col rounded-lg p-8 shadow-lg">
      <h2 className="font-display mb-6 text-3xl font-semibold text-white">
        Profile Summary
      </h2>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex flex-col items-center text-center md:text-left">
          <Image
            src="/purr-logo.jpg"
            alt="User Avatar"
            width={128}
            height={128}
            className="border-secondary mx-auto mr-15 ml-10 rounded-full border-4 object-cover"
          />
        </div>
        <div className="grid flex-grow grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="First Name" value={displayFirstName} />
          <InfoItem label="Last Name" value={displayLastName} />
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
    <div className={fullWidth ? "sm:col-span-2 lg:col-span-3" : ""}>
      <p className="text-sm font-semibold text-gray-400">{label}</p>
      <p className="text-lg text-white">{value || "–"}</p>
    </div>
  );
}

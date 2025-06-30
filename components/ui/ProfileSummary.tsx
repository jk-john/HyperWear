import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { Edit } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { UpdateProfileForm } from "./UpdateProfileForm";

type UserAddress = Tables<"user_addresses">;
type UserProfile = Tables<"user_profiles">;

interface ProfileSummaryProps {
  defaultAddress: UserAddress | null;
  user: User;
  profile: UserProfile | null;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSuccess: () => void;
}

export function ProfileSummary({
  defaultAddress,
  user,
  profile,
  isEditing,
  onToggleEdit,
  onSuccess,
}: ProfileSummaryProps) {
  const userEmail = user.email;

  const firstName =
    user.user_metadata.first_name ||
    user.user_metadata.full_name?.split(" ")[0];
  const lastName =
    user.user_metadata.last_name ||
    user.user_metadata.full_name?.split(" ").slice(1).join(" ");

  const {
    company_name,
    street,
    address_complement,
    city,
    postal_code,
    country,
    delivery_instructions,
  } = defaultAddress || {};

  const phoneNumber = profile?.phone_number || defaultAddress?.phone_number;
  const birthday = profile?.birthday;

  return (
    <div className="bg-primary flex flex-col rounded-lg p-8 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-3xl font-semibold text-white">
          Profile Summary
        </h2>
        <Button variant="ghost" size="icon" onClick={onToggleEdit}>
          <Edit className="h-5 w-5" />
        </Button>
      </div>
      {isEditing ? (
        <UpdateProfileForm profile={profile} onSuccess={onSuccess} />
      ) : (
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
            <InfoItem label="First Name" value={firstName} />
            <InfoItem label="Last Name" value={lastName} />
            <InfoItem label="Email Address" value={userEmail} />
            <InfoItem label="Phone Number" value={phoneNumber} />
            <InfoItem label="Birthday" value={birthday} />
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
      )}
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

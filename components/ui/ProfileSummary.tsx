import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { Home, Mail, Phone, User as UserIcon } from "lucide-react";

type UserAddress = Tables<"user_addresses">;

export function ProfileSummary({
  user,
  defaultAddress,
}: {
  user: User;
  defaultAddress: UserAddress | null;
}) {
  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.user_metadata?.first_name ||
    "User";
  const userEmail = user.email || "No email provided";

  return (
    <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Profile Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <UserIcon className="h-6 w-6 text-[var(--color-accent)]" />
          <p>{userName}</p>
        </div>
        <div className="flex items-center gap-4">
          <Mail className="h-6 w-6 text-[var(--color-accent)]" />
          <p>{userEmail}</p>
        </div>
        {defaultAddress ? (
          <>
            <div className="flex items-center gap-4">
              <Home className="h-6 w-6 text-[var(--color-accent)]" />
              <p>
                {defaultAddress.street}, {defaultAddress.city},{" "}
                {defaultAddress.postal_code}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-[var(--color-accent)]" />
              <p>{defaultAddress.phone_number}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Home className="h-6 w-6 text-[var(--color-accent)]" />
            <p>No default address set.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/ui/ProfileForm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // This case should ideally not happen if the trigger is working correctly
    return <div>Could not load profile. Please contact support.</div>;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <Card className="border-[var(--color-emerald)] bg-[var(--color-deep)]">
        <CardHeader>
          <CardTitle className="text-[var(--color-light)]">
            Your Profile
          </CardTitle>
          <CardDescription className="text-[var(--color-accent)]">
            Manage your public profile information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}

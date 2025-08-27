"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PhoneInput from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "./button";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  phoneNumber: z
    .string()
    .min(4, { message: "Phone number is too short" })
    .regex(/^\+\d{6,15}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  birthday: z.string().optional(),
  street: z.string().min(1, { message: "Street is required." }).optional().or(z.literal("")),
  addressComplement: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }).optional().or(z.literal("")),
  zip: z.string().min(1, { message: "ZIP code is required." }).optional().or(z.literal("")),
  country: z.string().min(1, { message: "Country is required." }).optional().or(z.literal("")),
  companyName: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  evmAddress: z
    .string()
    .optional()
    .refine(
      (val) => !val || (val.startsWith("0x") && val.length === 42),
      "Must be a valid EVM address (0x...)"
    ),
});

type FormValues = z.infer<typeof formSchema>;
type UserProfile = Tables<"user_profiles">;
type UserAddress = Tables<"user_addresses">;

interface UpdateProfileFormProps {
  profile: UserProfile | null;
  user: User;
  defaultAddress: UserAddress | null;
  onSuccess: () => void;
}

export function UpdateProfileForm({
  profile,
  user,
  defaultAddress,
  onSuccess,
}: UpdateProfileFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(" ")[0] || "",
      lastName: user?.user_metadata?.last_name || user?.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
      phoneNumber: profile?.phone_number || defaultAddress?.phone_number || "",
      birthday: profile?.birthday || "",
      street: defaultAddress?.street || "",
      addressComplement: defaultAddress?.address_complement || "",
      city: defaultAddress?.city || "",
      zip: defaultAddress?.postal_code || "",
      country: defaultAddress?.country || "",
      companyName: defaultAddress?.company_name || "",
      deliveryInstructions: defaultAddress?.delivery_instructions || "",
      evmAddress: "", // Will be populated from users table
    },
  });

  React.useEffect(() => {
    // Load wallet address from users table
    const loadWalletAddress = async () => {
      const { data } = await supabase
        .from("users")
        .select("wallet_address")
        .eq("id", user.id)
        .single();
      if (data?.wallet_address) {
        form.setValue("evmAddress", data.wallet_address);
      }
    };
    loadWalletAddress();
  }, [user.id, form, supabase]);

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      // Update user names and wallet address in users table
      if (values.firstName || values.lastName || values.evmAddress) {
        const { error: usersError } = await supabase
          .from("users")
          .upsert({
            id: user.id,
            first_name: values.firstName || null,
            last_name: values.lastName || null,
            wallet_address: values.evmAddress || null,
          });
        
        if (usersError) {
          toast.error("Failed to update user information: " + usersError.message);
          setIsLoading(false);
          return;
        }
      }

      // Update phone and birthday in user_profiles table
      if (values.phoneNumber || values.birthday) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .upsert({
            user_id: user.id,
            phone_number: values.phoneNumber || null,
            birthday: values.birthday || null,
            updated_at: new Date().toISOString(),
          });
        
        if (profileError) {
          toast.error("Failed to update profile: " + profileError.message);
          setIsLoading(false);
          return;
        }
      }

      // Update or create default address in user_addresses table
      if (values.street || values.city || values.zip || values.country) {
        const addressData = {
          user_id: user.id,
          type: "shipping" as const,
          first_name: values.firstName || "",
          last_name: values.lastName || "",
          street: values.street || null,
          address_complement: values.addressComplement || null,
          city: values.city || null,
          postal_code: values.zip || null,
          country: values.country || null,
          phone_number: values.phoneNumber || "",
          company_name: values.companyName || null,
          delivery_instructions: values.deliveryInstructions || null,
          is_default: true,
          updated_at: new Date().toISOString(),
        };

        if (defaultAddress) {
          // Update existing address
          const { error: addressError } = await supabase
            .from("user_addresses")
            .update(addressData)
            .eq("id", defaultAddress.id);
          
          if (addressError) {
            toast.error("Failed to update address: " + addressError.message);
            setIsLoading(false);
            return;
          }
        } else {
          // Create new default address
          const { error: addressError } = await supabase
            .from("user_addresses")
            .insert(addressData);
          
          if (addressError) {
            toast.error("Failed to create address: " + addressError.message);
            setIsLoading(false);
            return;
          }
        }
      }

      toast.success("Profile updated successfully!");
      router.refresh();
      onSuccess();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Personal Information</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">First Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your first name"
                      className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Last Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your last name"
                      className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Phone Number</FormLabel>
                <FormControl>
                  <PhoneInput
                    {...field}
                    placeholder="Enter your phone number"
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Birthday</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Address Information</h3>
          
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Street Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your street address"
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressComplement"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Address Complement (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Apartment, suite, etc."
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">City</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your city"
                      className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">ZIP Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your ZIP code"
                      className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Country</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your country"
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Additional Information</h3>
          
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Company Name (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your company name"
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Delivery Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Any special delivery instructions"
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="evmAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">EVM Address (Optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="0x..."
                    className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="bg-secondary text-jungle hover:bg-mint w-full rounded-full py-6 text-lg font-bold transition-colors hover:text-white" 
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
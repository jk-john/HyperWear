"use client";

import { Checkbox } from "@/components/ui/checkbox";
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
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "./button";

const E164_PHONE_REGEX = /^\+\d{6,15}$/;

const addressFormSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  last_name: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  phone_number: z
    .string()
    .min(1, { message: "Phone number is required." })
    .regex(
      E164_PHONE_REGEX,
      "Invalid phone number format. Please use E.164 format (e.g., +15555555555).",
    ),
  street: z.string().min(1, { message: "Street is required." }),
  address_complement: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }),
  postal_code: z.string().min(1, { message: "ZIP code is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  company_name: z.string().optional(),
  delivery_instructions: z.string().optional(),
  is_default: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;
type UserAddress = Tables<"user_addresses">;

interface AddressFormProps {
  address?: UserAddress | null;
  onSuccess: () => void;
}

export function AddressForm({ address, onSuccess }: AddressFormProps) {
  const router = useRouter();

  const isValidE164 = address?.phone_number
    ? E164_PHONE_REGEX.test(address.phone_number)
    : false;

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      first_name: address?.first_name || "",
      last_name: address?.last_name || "",
      phone_number: address && isValidE164 ? address.phone_number || "" : "",
      street: address?.street || "",
      address_complement: address?.address_complement || "",
      city: address?.city || "",
      postal_code: address?.postal_code || "",
      country: address?.country || "",
      company_name: address?.company_name || "",
      delivery_instructions: address?.delivery_instructions || "",
      is_default: address?.is_default || false,
    },
  });

  const onSubmit = async (data: AddressFormValues) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in to manage addresses.");
      return;
    }

    const addressData = {
      ...data,
      user_id: user.id,
      type: "shipping" as const,
    };

    let promise;
    if (address) {
      promise = supabase
        .from("user_addresses")
        .update(addressData)
        .eq("id", address.id);
    } else {
      promise = supabase.from("user_addresses").insert(addressData);
    }

    const { error } = await promise;

    if (error) {
      toast.error(`Failed to save address: ${error.message}`);
    } else {
      toast.success(`Address ${address ? "updated" : "added"} successfully!`);

      // Upsert the phone number into the user's profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .upsert({ user_id: user.id, phone_number: data.phone_number });

      if (profileError) {
        toast.error(`Failed to save phone number: ${profileError.message}`);
      }

      onSuccess();
      router.refresh(); // Refresh server components
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 pb-8 sm:space-y-6 sm:pb-6"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white">
                  First Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John"
                    className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white">
                  Last Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Doe"
                    className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Phone Number
              </FormLabel>
              <FormControl>
                <div className="h-10 sm:h-12">
                  <PhoneInput
                    {...field}
                    defaultCountry="US"
                    placeholder="+1 (555) 555-5555"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Company (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ACME Inc."
                  className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Street Address
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="123 Main St"
                  className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Apartment, suite, etc. (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Apt #4B"
                  className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white">
                  City
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="New York"
                    className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-white">
                  ZIP Code
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="10001"
                    className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="sm:col-span-2 lg:col-span-1">
                <FormLabel className="text-sm font-medium text-white">
                  Country
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="USA"
                    className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="delivery_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Delivery Instructions (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Leave at front door"
                  className="h-10 border-2 border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)] placeholder:text-[var(--color-accent)] focus:border-[var(--color-mint)] focus:ring-2 focus:ring-[var(--color-mint)]/20 sm:h-12"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-y-0 space-x-3 rounded-lg border-2 border-[var(--color-primary)] p-3 shadow-sm sm:space-x-4 sm:p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-4 w-4 border-2 border-[var(--color-secondary)] data-[state=checked]:bg-[var(--color-secondary)] data-[state=checked]:text-[var(--color-primary)] sm:h-5 sm:w-5"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="cursor-pointer text-sm font-medium text-white">
                  Set as default shipping address
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <div className="pt-4 sm:pt-6">
          <Button
            type="submit"
            className="h-12 w-full text-base font-bold transition-all duration-200 hover:scale-[1.02] sm:h-14 sm:text-lg"
            style={{
              backgroundColor: "var(--color-secondary)",
              color: "var(--color-jungle)",
              border: "2px solid var(--color-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-mint)";
              e.currentTarget.style.color = "var(--color-white)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-secondary)";
              e.currentTarget.style.color = "var(--color-jungle)";
            }}
          >
            {address ? "Update Address" : "Save Address"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

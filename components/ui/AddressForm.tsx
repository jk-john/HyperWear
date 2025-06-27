"use client";

import { Button } from "@/components/ui/Button";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-white">First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John"
                    className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-white">Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Doe"
                    className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-white">Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  defaultCountry="US"
                  placeholder="+1 (555) 555-5555"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-white">
                Company (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="ACME Inc."
                  className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-white">
                Street Address
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="123 Main St"
                  className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-white">
                Apartment, suite, etc. (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Apt #4B"
                  className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-white">City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="New York"
                    className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-white">ZIP Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="10001"
                    className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-white">Country</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="USA"
                    className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="delivery_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-white">
                Delivery Instructions (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Leave at front door"
                  className="border-[var(--color-secondary)] bg-[var(--color-primary)] text-[var(--color-light)]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-y-0 space-x-3 rounded-md border border-[var(--color-primary)] p-3 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-[var(--color-secondary)] data-[state=checked]:bg-[var(--color-secondary)] data-[state=checked]:text-[var(--color-primary)]"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-white">
                  Set as default shipping address
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-[var(--color-secondary)] text-lg font-bold text-[var(--color-jungle)] hover:bg-[var(--color-mint)] hover:text-white"
        >
          {address ? "Update Address" : "Save Address"}
        </Button>
      </form>
    </Form>
  );
}

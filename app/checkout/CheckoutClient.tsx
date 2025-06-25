"use client";

import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/stores/cart";
import { Tables } from "@/types/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createCheckoutSession } from "./actions";

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phoneNumber: z.string().min(1, { message: "Phone number is required." }),
    street: z.string().min(1, { message: "Street is required." }),
    addressComplement: z.string().optional(),
    city: z.string().min(1, { message: "City is required." }),
    zip: z.string().min(1, { message: "ZIP code is required." }),
    country: z.string().min(1, { message: "Country is required." }),
    companyName: z.string().optional(),
    deliveryInstructions: z.string().optional(),
    paymentMethod: z.enum(["stripe", "nowpayments", "hype", "usdhl"], {
      required_error: "You need to select a payment method.",
    }),
    evmAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        (data.paymentMethod === "hype" || data.paymentMethod === "usdhl") &&
        (!data.evmAddress ||
          !data.evmAddress.startsWith("0x") ||
          data.evmAddress.length !== 42)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "A valid EVM address (0x...) is required for this payment method.",
      path: ["evmAddress"],
    },
  );

type CheckoutFormValues = z.infer<typeof formSchema>;
type UserAddress = Tables<"user_addresses">;

interface CheckoutClientProps {
  user: User | null;
  defaultAddress: UserAddress | null;
  walletAddress: string | null;
}

export function CheckoutClient({
  user,
  defaultAddress,
  walletAddress,
}: CheckoutClientProps) {
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultAddress?.first_name || "",
      lastName: defaultAddress?.last_name || "",
      email: user?.email || "",
      phoneNumber: defaultAddress?.phone_number || "",
      street: defaultAddress?.street || "",
      addressComplement: defaultAddress?.address_complement || "",
      city: defaultAddress?.city || "",
      zip: defaultAddress?.postal_code || "",
      country: defaultAddress?.country || "",
      companyName: defaultAddress?.company_name || "",
      deliveryInstructions: defaultAddress?.delivery_instructions || "",
      paymentMethod: "stripe",
      evmAddress: walletAddress || "",
    },
  });

  const router = useRouter();

  useEffect(() => {
    if (user) {
      form.setValue("email", user.email || "");
      if (!defaultAddress) {
        const [firstName, lastName] =
          user.user_metadata.full_name?.split(" ") || [];
        form.setValue("firstName", firstName || "");
        form.setValue("lastName", lastName || "");
      }
    }
  }, [user, defaultAddress, form]);

  useEffect(() => {
    if (walletAddress) {
      form.setValue("evmAddress", walletAddress);
    }
  }, [walletAddress, form]);

  async function onSubmit(values: CheckoutFormValues) {
    setIsSubmitting(true);
    try {
      const shippingAddress = {
        first_name: values.firstName,
        last_name: values.lastName,
        phone_number: values.phoneNumber,
        street: values.street,
        address_complement: values.addressComplement || null,
        city: values.city,
        postal_code: values.zip,
        country: values.country,
        company_name: values.companyName || null,
        delivery_instructions: values.deliveryInstructions || null,
      };

      if (values.paymentMethod === "stripe") {
        const result = await createCheckoutSession(
          cartItems,
          shippingAddress,
          values.email,
        );
        if (result?.error) {
          toast.error(result.error);
        } else {
          clearCart();
        }
      } else if (
        values.paymentMethod === "hype" ||
        values.paymentMethod === "usdhl"
      ) {
        const cartTotal = totalPrice();
        let amount = cartTotal.toString();
        if (values.paymentMethod === "hype") {
          try {
            const hypePriceResponse = await fetch("/api/hype-price", {
              cache: "no-store",
            });
            if (!hypePriceResponse.ok)
              throw new Error("Failed to fetch HYPE price");
            const priceData = await hypePriceResponse.json();
            amount = (cartTotal / priceData.hypeToUsd).toFixed(2);
          } catch (error) {
            console.error("Could not fetch HYPE price:", error);
            toast.error("Could not fetch HYPE price. Please try again.");
            setIsSubmitting(false);
            return;
          }
        }
        localStorage.setItem(
          "shippingAddress",
          JSON.stringify(shippingAddress),
        );
        router.push(
          `/checkout/hype-confirmation?cartTotal=${cartTotal}&amount=${amount}&evmAddress=${values.evmAddress}&paymentMethod=${values.paymentMethod}`,
        );
      } else if (values.paymentMethod === "nowpayments") {
        toast.error("NowPayments is not yet implemented.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-jungle mt-10 min-h-screen text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display mb-12 text-center text-5xl font-bold text-[--color-secondary]">
          Checkout
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-16 lg:grid-cols-2"
          >
            <div className="bg-primary rounded-lg p-8 shadow-lg">
              <h2 className="font-display mb-6 text-3xl font-semibold text-white">
                Shipping Information
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>First Name</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input {...field} placeholder="John" />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Last Name</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input {...field} placeholder="Doe" />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>Email Address</FormLabel>{" "}
                      <FormControl>
                        {" "}
                        <Input
                          type="email"
                          {...field}
                          placeholder="john.doe@example.com"
                        />{" "}
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>Phone Number</FormLabel>{" "}
                      <FormControl>
                        {" "}
                        <Input
                          type="tel"
                          {...field}
                          placeholder="+1 (555) 555-5555"
                        />{" "}
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>Company (Optional)</FormLabel>{" "}
                      <FormControl>
                        {" "}
                        <Input {...field} placeholder="ACME Inc." />{" "}
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>Street Address</FormLabel>{" "}
                      <FormControl>
                        {" "}
                        <Input {...field} placeholder="123 Main St" />{" "}
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressComplement"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>
                        Apartment, suite, etc. (Optional)
                      </FormLabel>{" "}
                      <FormControl>
                        {" "}
                        <Input {...field} placeholder="Apt #4B" />{" "}
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>City</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input {...field} placeholder="New York" />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>ZIP Code</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input {...field} placeholder="10001" />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        {" "}
                        <FormLabel>Country</FormLabel>{" "}
                        <FormControl>
                          {" "}
                          <Input {...field} placeholder="USA" />{" "}
                        </FormControl>{" "}
                        <FormMessage />{" "}
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="deliveryInstructions"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>
                        Delivery Instructions (Optional)
                      </FormLabel>{" "}
                      <FormControl>
                        {" "}
                        <Input
                          {...field}
                          placeholder="Leave at front door"
                        />{" "}
                      </FormControl>{" "}
                      <FormMessage />{" "}
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="bg-primary rounded-lg p-8 shadow-lg">
              <h2 className="font-display mb-6 text-3xl font-semibold text-white">
                Payment Method
              </h2>
              <div className="pt-2">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white text-black">
                          <SelectItem value="stripe">
                            <div className="flex w-full items-center justify-between">
                              <span>Credit Card (Stripe)</span>
                              <Image
                                src="/stripe.png"
                                alt="Stripe"
                                width={24}
                                height={24}
                                className="ml-2"
                              />
                            </div>
                          </SelectItem>
                          <SelectItem value="nowpayments">
                            <div className="flex w-full items-center justify-between">
                              <span>Crypto (NowPayments)</span>
                              <div className="ml-2 flex items-center gap-2">
                                <Image
                                  src="/usdc.png"
                                  alt="USDC"
                                  width={24}
                                  height={24}
                                />
                                <Image
                                  src="/usdt.svg"
                                  alt="USDT"
                                  width={24}
                                  height={24}
                                />
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="usdhl">
                            <div className="flex w-full items-center justify-between">
                              <span>Pay with USDT0 or USDHL on HyperEVM</span>
                              <div className="ml-2 flex items-center gap-2">
                                <Image
                                  src="/USDT0.svg"
                                  alt="USDT0"
                                  width={24}
                                  height={24}
                                />
                                <Image
                                  src="/USDHL.svg"
                                  alt="USDHL"
                                  width={24}
                                  height={24}
                                />
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="hype">
                            <div className="flex w-full items-center justify-between">
                              <span>Pay with $HYPE on HyperEVM</span>
                              <Image
                                src="/hype.svg"
                                alt="HYPE"
                                width={24}
                                height={24}
                                className="ml-2"
                              />
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {(form.watch("paymentMethod") === "hype" ||
                  form.watch("paymentMethod") === "usdhl") && (
                  <FormField
                    control={form.control}
                    name="evmAddress"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Your EVM Address (HyperEVM)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="0x..."
                            readOnly={!!walletAddress}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <h2 className="font-display mt-4 mb-6 text-3xl font-semibold text-white">
                Order Summary
              </h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-semibold">
                          {item.name} {item.size && `(${item.size})`}
                        </p>
                        <p className="text-sm text-white/70">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="my-8 h-px bg-white/20" />
              <div className="flex items-center justify-between text-xl font-bold">
                <p>Total</p>
                <p>${totalPrice().toFixed(2)}</p>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="bg-secondary text-jungle hover:bg-mint hover:shadow-mint/40 mt-8 w-full rounded-full py-6 text-lg font-bold transition-colors hover:text-white"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  cancelOrder,
  createCheckoutSession,
  initiateHypePayment,
} from "./actions";

const getShippingCost = (cartTotal: number): number => {
  return cartTotal >= 60 ? 0 : 9.99;
};

const isValidE164 = (phoneNumber: string | undefined | null): boolean => {
  if (!phoneNumber) return false;
  const e164Regex = /^\+\d{6,15}$/;
  return e164Regex.test(phoneNumber);
};

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    phoneNumber: z
      .string()
      .min(4, { message: "Phone number is too short" })
      .regex(/^\+\d{6,15}$/, "Invalid phone number format"),
    street: z.string().min(1, { message: "Street is required." }),
    addressComplement: z.string().optional(),
    city: z.string().min(1, { message: "City is required." }),
    zip: z.string().min(1, { message: "ZIP code is required." }),
    country: z.string().min(1, { message: "Country is required." }),
    companyName: z.string().optional(),
    deliveryInstructions: z.string().optional(),
    paymentMethod: z.enum(["stripe", "nowpayments", "hype", "usdhl", "usdt0"], {
      required_error: "You need to select a payment method.",
    }),
    evmAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      if (
        (data.paymentMethod === "hype" ||
          data.paymentMethod === "usdhl" ||
          data.paymentMethod === "usdt0") &&
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

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function CheckoutClient({
  user,
  defaultAddress,
  walletAddress,
}: CheckoutClientProps) {
  const {
    cartItems,
    totalPrice,
    clearCart,
    pendingOrder,
    timeLeft,
    checkPendingOrder,
  } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (user && !hasChecked) {
      checkPendingOrder(user.id);
      setHasChecked(true);
    }
  }, [user, hasChecked, checkPendingOrder]);

  const cartTotal = totalPrice();
  const shippingCost = getShippingCost(cartTotal);
  const finalTotal = cartTotal + shippingCost;

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: defaultAddress?.first_name || "",
      lastName: defaultAddress?.last_name || "",
      email: user?.email || "",
      phoneNumber: isValidE164(defaultAddress?.phone_number)
        ? defaultAddress?.phone_number
        : "",
      street: defaultAddress?.street || "",
      addressComplement: defaultAddress?.address_complement || "",
      city: defaultAddress?.city || "",
      zip: defaultAddress?.postal_code || "",
      country: defaultAddress?.country || "",
      companyName: defaultAddress?.company_name || "",
      deliveryInstructions: defaultAddress?.delivery_instructions || "",
      paymentMethod: "usdt0",
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

  const handleGoToPayment = () => {
    if (pendingOrder) {
      router.push(
        `/checkout/confirmation/${pendingOrder.payment_method?.toLowerCase()}?orderId=${
          pendingOrder.id
        }`,
      );
    }
  };

  const handleCancelOrder = async () => {
    if (pendingOrder) {
      const result = await cancelOrder(pendingOrder.id);
      if (result.success) {
        toast.success("Your order has been cancelled.");
        // The cart store will update automatically via its own logic
      } else {
        toast.error(result.error || "Failed to cancel order.");
      }
    }
  };

  if (pendingOrder) {
    return (
      <div className="bg-jungle mt-10 min-h-screen text-white">
        <div className="container mx-auto flex h-full flex-col items-center justify-center p-4 text-center">
          <div className="w-full max-w-md rounded-2xl bg-[--color-primary] p-8 shadow-2xl shadow-black/40">
            <h1 className="font-display text-3xl font-bold text-white">
              You Have a Pending Order
            </h1>
            <p className="text-primary/60 mt-2">
              Your previous order has not been completed yet. Please complete or
              cancel it before creating a new one.
            </p>
            {timeLeft !== null && (
              <div className="mt-4 text-2xl font-bold text-red-500">
                Time left: {formatTime(timeLeft)}
              </div>
            )}
            <div className="mt-8 space-y-3">
              <Button
                onClick={handleGoToPayment}
                className="bg-secondary hover:bg-mint w-full rounded-full py-3 text-lg font-bold text-white shadow-lg transition-all hover:scale-105"
              >
                Complete Payment
              </Button>
              <Button
                onClick={handleCancelOrder}
                variant="outline"
                className="w-full rounded-full border-red-500/50 text-red-500/80 hover:bg-red-500/10 hover:text-red-500"
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        values.paymentMethod === "usdhl" ||
        values.paymentMethod === "usdt0"
      ) {
        if (!values.evmAddress) {
          toast.error("Please enter your EVM address.");
          setIsSubmitting(false);
          return;
        }

        const paymentResult = await initiateHypePayment(cartItems, values);

        if (paymentResult.success && paymentResult.orderId) {
          clearCart();
          router.push(
            `/checkout/confirmation/${values.paymentMethod}?orderId=${paymentResult.orderId}`,
          );
        } else {
          toast.error(paymentResult.error || "Failed to initiate payment.");
        }
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
                        <FormLabel>
                          <p className="mb-2 text-white">First Name</p>
                        </FormLabel>{" "}
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
                        <FormLabel>
                          <p className="mb-2 text-white">Last Name</p>
                        </FormLabel>{" "}
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
                      <FormLabel>
                        <p className="mb-2 text-white">Email Address</p>
                      </FormLabel>{" "}
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
                      <FormLabel>
                        <p className="mb-4 ml-4 text-white">Phone Number</p>
                      </FormLabel>
                      <FormControl>
                        <PhoneInput {...field} defaultCountry="US" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      {" "}
                      <FormLabel>
                        <p className="mb-2 text-white">Company (Optional)</p>
                      </FormLabel>{" "}
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
                      <FormLabel>
                        <p className="mb-2 text-white">Street Address</p>
                      </FormLabel>{" "}
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
                        <p className="mb-2 text-white">
                          Apartment, suite, etc. (Optional)
                        </p>
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
                        <FormLabel>
                          <p className="mb-2 text-white">City</p>
                        </FormLabel>{" "}
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
                        <FormLabel>
                          <p className="mb-2 text-white">ZIP Code</p>
                        </FormLabel>{" "}
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
                        <FormLabel>
                          <p className="mb-2 text-white">Country</p>
                        </FormLabel>{" "}
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
                        <p className="mb-2 text-white">
                          Delivery Instructions (Optional)
                        </p>
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
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value="stripe"
                            className="relative cursor-not-allowed overflow-hidden border-b-2 border-black bg-gradient-to-r from-gray-100 to-gray-200"
                            disabled
                          >
                            <div className="relative flex w-full items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-gray-500">
                                  Credit Card (Stripe)
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-[--color-secondary] px-3 py-1 text-sm font-bold text-[--color-primary] shadow-lg"
                                >
                                  Coming Soon
                                </Badge>
                                <Image
                                  src="/stripe.png"
                                  alt="Stripe"
                                  width={24}
                                  height={24}
                                  className="ml-2 opacity-50"
                                />
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="usdt0"
                            className="border-b-2 border-black bg-white"
                          >
                            <div className="flex w-full items-center justify-between">
                              <span>Pay with USDT0 on HyperEVM</span>
                              <div className="ml-2 flex items-center gap-2">
                                <Image
                                  src="/USDT0.svg"
                                  alt="USDT0"
                                  width={24}
                                  height={24}
                                />
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="usdhl"
                            className="border-b-2 border-black bg-white"
                          >
                            <div className="flex w-full items-center justify-between">
                              <span>Pay with USDHL on HyperEVM</span>
                              <div className="ml-2 flex items-center gap-2">
                                <Image
                                  src="/USDHL.svg"
                                  alt="USDHL"
                                  width={24}
                                  height={24}
                                />
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem
                            value="hype"
                            className="border-b-2 border-black bg-white"
                          >
                            <div className="flex w-full items-center justify-between">
                              <span>Pay with $HYPE on HyperEVM</span>
                              <Image
                                src="/HYPE.svg"
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
                  form.watch("paymentMethod") === "usdhl" ||
                  form.watch("paymentMethod") === "usdt0") && (
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
              <div className="space-y-4">
                <div className="flex items-center justify-between font-semibold">
                  <p>Subtotal</p>
                  <p>${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <p>Shipping</p>
                  <p>
                    {shippingCost === 0
                      ? "Free"
                      : `$${shippingCost.toFixed(2)}`}
                  </p>
                </div>
                {shippingCost === 0 && (
                  <p className="text-sm text-green-400">
                    Free shipping on orders over $60!
                  </p>
                )}
              </div>
              <div className="my-8 h-px bg-white/20" />
              <div className="flex items-center justify-between text-xl font-bold">
                <p>Total</p>
                <p>${finalTotal.toFixed(2)}</p>
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

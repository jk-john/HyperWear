"use client";

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
        <div className="mx-auto max-w-lg px-4 py-16">
          <div className="bg-card mb-8 rounded-2xl border-5 border-white p-6 shadow-lg">
            <h1 className="font-display mb-4 text-center text-3xl font-bold text-white">
              Payment Pending
            </h1>
            <p className="mb-6 text-center text-white">
              You have a pending order. Please complete the payment or cancel
              the order to proceed.
            </p>

            <div className="mb-6 rounded-lg bg-white/10 p-4">
              <div className="mb-2 flex justify-between">
                <span className="font-semibold">Order Total:</span>
                <span className="font-bold">
                  ${(pendingOrder.total ?? pendingOrder.amount_total ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="mb-2 flex justify-between">
                <span className="font-semibold">Payment Method:</span>
                <span className="font-bold">
                  {pendingOrder.payment_method}
                </span>
              </div>
              {timeLeft !== null && (
                <div className="mt-4 text-center">
                  <div className="text-lg font-bold text-red-400">
                    Time Remaining: {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-white/70">
                    This order will be automatically cancelled if not completed
                    in time.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleGoToPayment}
                className="bg-secondary text-jungle hover:bg-mint hover:shadow-mint/40 w-full rounded-full py-6 text-lg font-bold transition-colors hover:text-white"
              >
                Complete Payment
              </Button>
              <Button
                onClick={handleCancelOrder}
                variant="outline"
                className="w-full rounded-full border-white py-6 text-lg font-bold text-white hover:bg-white hover:text-black"
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
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!user) {
      toast.error("You must be signed in to place an order");
      return;
    }

    setIsSubmitting(true);

    try {
      if (
        values.paymentMethod === "hype" ||
        values.paymentMethod === "usdt0" ||
        values.paymentMethod === "usdhl"
      ) {
        const result = await initiateHypePayment(cartItems, values);
        if (result.success && result.orderId) {
          router.push(
            `/checkout/confirmation/${values.paymentMethod}?orderId=${result.orderId}`,
          );
        } else {
          toast.error(result.error || "Failed to initiate payment");
        }
      } else if (values.paymentMethod === "stripe") {
        try {
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user?.id, // Pass user ID for webhook
              shippingAddress: {
                first_name: values.firstName,
                last_name: values.lastName,
                email: values.email,
                phone_number: values.phoneNumber,
                street: values.street,
                city: values.city,
                postal_code: values.zip,
                country: values.country,
                address_complement: values.addressComplement,
                company_name: values.companyName,
                delivery_instructions: values.deliveryInstructions,
              },
              cartItems: cartItems.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
              })),
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create checkout session');
          }

          const { url } = await response.json();
          
          if (url) {
            window.location.href = url;
          } else {
            toast.error("Failed to redirect to checkout");
          }
        } catch (error: unknown) {
          console.error('Checkout error:', error);
          toast.error(error instanceof Error ? error.message : 'Failed to create checkout session');
        }
      } else {
        toast.error("Payment method not yet supported");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-jungle min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
              <div className="bg-card rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
                <h2 className="font-display mb-4 sm:mb-6 text-2xl sm:text-3xl font-semibold text-white">
                  Shipping Information
                </h2>

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
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                          disabled
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="mt-4">
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
                  name="street"
                  render={({ field }) => (
                    <FormItem className="mt-4">
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
                    <FormItem className="mt-4">
                      <FormLabel className="text-white">
                        Address Complement (Optional)
                      </FormLabel>
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

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <FormItem className="mt-4">
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

                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel className="text-white">
                        Company Name (Optional)
                      </FormLabel>
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
                    <FormItem className="mt-4">
                      <FormLabel className="text-white">
                        Delivery Instructions (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Any special delivery instructions"
                          className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="bg-primary rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
                <h2 className="font-display mb-4 sm:mb-6 text-2xl sm:text-3xl font-semibold text-white">
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
                              className="border-b-2 border-black bg-white"
                            >
                              <div className="relative flex w-full items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span>Credit Card (Stripe)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Image
                                    src="/stripe.png"
                                    alt="Stripe payment logo"
                                    width={24}
                                    height={24}
                                    className="ml-2"
                                    quality={90}
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
                                    alt="USDT0 cryptocurrency logo"
                                    width={24}
                                    height={24}
                                    quality={90}
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
                                    alt="USDHL cryptocurrency logo"
                                    width={24}
                                    height={24}
                                    quality={90}
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
                                  alt="HYPE cryptocurrency logo"
                                  width={24}
                                  height={24}
                                  className="ml-2"
                                  quality={90}
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

                <h2 className="font-display mt-6 sm:mt-8 mb-4 sm:mb-6 text-2xl sm:text-3xl font-semibold text-white">
                  Order Summary
                </h2>
                <div className="space-y-4 sm:space-y-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={`${item.name} product image`}
                            fill
                            sizes="(max-width: 640px) 48px, 64px"
                            className="rounded-md object-cover"
                            priority={index < 3}
                            loading={index < 3 ? "eager" : "lazy"}
                            quality={85}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base truncate">
                            {item.name} {item.size && `(${item.size})`}
                          </p>
                          <p className="text-xs sm:text-sm text-white/70">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-sm sm:text-base flex-shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="my-6 sm:my-8 h-px bg-white/20" />
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between font-semibold text-sm sm:text-base">
                    <p>Subtotal</p>
                    <p>${cartTotal.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-sm sm:text-base">
                    <p>Shipping</p>
                    <p>
                      {shippingCost === 0
                        ? "Free"
                        : `$${shippingCost.toFixed(2)}`}
                    </p>
                  </div>
                  {shippingCost === 0 && (
                    <p className="text-xs sm:text-sm text-green-400">
                      Free shipping on orders over $60!
                    </p>
                  )}
                </div>
                <div className="my-6 sm:my-8 h-px bg-white/20" />
                <div className="flex items-center justify-between text-lg sm:text-xl font-bold">
                  <p>Total</p>
                  <p>${finalTotal.toFixed(2)}</p>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting || cartItems.length === 0}
                  className="bg-secondary text-jungle hover:bg-mint hover:shadow-mint/40 mt-6 sm:mt-8 w-full rounded-full py-4 sm:py-6 text-base sm:text-lg font-bold transition-colors hover:text-white touch-manipulation"
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

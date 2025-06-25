"use client";

import StripeIcon from "@/components/icons/StripeIcon";
import UsdcIcon from "@/components/icons/UsdcIcon";
import UsdtIcon from "@/components/icons/UsdtIcon";
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
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import * as z from "zod";
import {
  cancelHypeOrder,
  createCheckoutSession,
  createHypeOrder,
} from "./actions";

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." }),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    street: z.string().min(1, { message: "Street is required." }),
    city: z.string().min(1, { message: "City is required." }),
    zip: z.string().min(1, { message: "ZIP code is required." }),
    country: z.string().min(1, { message: "Country is required." }),
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

interface CustomCSSProperties extends CSSProperties {
  "--value"?: number;
}

export default function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollOrderId, setPollOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [hypeAmount, setHypeAmount] = useState<string | null>(null);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [receivingAddress, setReceivingAddress] = useState<string | null>(null);
  const [hypeToUsdRate, setHypeToUsdRate] = useState<number | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      street: "",
      city: "",
      zip: "",
      country: "",
      paymentMethod: "stripe",
      evmAddress: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");
  const router = useRouter();
  const supabase = createClient();

  // Effect for polling order status
  useEffect(() => {
    if (!isPolling || !pollOrderId) return;

    const interval = setInterval(async () => {
      const { data: order, error } = await supabase
        .from("orders")
        .select("status")
        .eq("id", pollOrderId)
        .single();

      if (error) {
        console.error("Error polling order status:", error);
        return;
      }

      if (order?.status === "completed") {
        setIsPolling(false);
        clearInterval(interval);
        clearCart();
        router.push("/checkout/success");
      }
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [isPolling, pollOrderId, supabase, router, clearCart]);

  // Effect for countdown timer
  useEffect(() => {
    if (!isPolling) return;

    if (countdown === 0) {
      setIsPolling(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPolling, countdown]);

  // Effect for live HYPE price update
  useEffect(() => {
    if (!isPolling || cartTotal === 0) return;

    const fetchPriceAndRecalculate = async () => {
      try {
        const hypePriceResponse = await fetch("/api/hype-price", {
          cache: "no-store",
        });
        if (!hypePriceResponse.ok) {
          throw new Error("Failed to fetch HYPE price");
        }
        const priceData = await hypePriceResponse.json();
        const hypeToUsd = priceData.hypeToUsd;
        const newHypeAmount = (cartTotal / hypeToUsd).toFixed(2);
        setHypeAmount(newHypeAmount);
        setHypeToUsdRate(hypeToUsd);
      } catch (error) {
        console.error("Could not update HYPE price:", error);
      } finally {
        setIsPriceLoading(false);
      }
    };

    fetchPriceAndRecalculate(); // Fetch immediately on component mount
    const priceInterval = setInterval(fetchPriceAndRecalculate, 15000); // Update every 15 seconds

    return () => clearInterval(priceInterval);
  }, [isPolling, cartTotal]);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        form.setValue("email", user.email || "");
        const [firstName, lastName] =
          user.user_metadata.full_name?.split(" ") || [];
        form.setValue("firstName", firstName || "");
        form.setValue("lastName", lastName || "");
      }
    };
    fetchUser();
  }, [form, supabase]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const shippingAddress = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        street: values.street,
        city: values.city,
        zip: values.zip,
        country: values.country,
      };

      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));

      if (values.paymentMethod === "stripe") {
        const result = await createCheckoutSession(
          cartItems,
          shippingAddress,
          values.email,
        );
        if (result?.error) {
          toast.error(result.error);
        }
      } else if (values.paymentMethod === "hype") {
        const formData = new FormData();
        formData.append("cartItems", JSON.stringify(cartItems));
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("street", values.street);
        formData.append("city", values.city);
        formData.append("zip", values.zip);
        formData.append("country", values.country);
        formData.append("walletAddress", values.evmAddress || "");

        const result = await createHypeOrder(formData);

        if (result.error) {
          toast.error(result.error);
        } else if (
          result.success &&
          result.orderId &&
          result.amountHype &&
          result.receivingAddress
        ) {
          setHypeAmount(result.amountHype);
          setPollOrderId(result.orderId);
          setCartTotal(parseFloat(result.cartTotal));
          setReceivingAddress(result.receivingAddress);
          setIsPolling(true);
          setIsPriceLoading(true); // Set loading before first fetch
          setCountdown(300); // Reset timer
        } else {
          toast.error("Could not initiate HYPE payment. Please try again.");
        }
      } else if (values.paymentMethod === "nowpayments") {
        toast.error("NowPayments is not yet implemented.");
        console.log("Redirecting to NowPayments...");
      } else if (values.paymentMethod === "usdhl") {
        toast.error("Pay with USDT0 or USDHL is not yet implemented.");
        console.log("Redirecting to Pay with USDT0 or USDHL...");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred during checkout.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCopyAddress = () => {
    if (receivingAddress) {
      navigator.clipboard.writeText(receivingAddress);
      toast.success("Address copied to clipboard!");
    }
  };

  const handleCancel = async () => {
    if (!pollOrderId) return;

    setIsSubmitting(true);
    const result = await cancelHypeOrder(pollOrderId);
    setIsSubmitting(false);

    if (result.success) {
      setIsPolling(false);
      setPollOrderId(null);
      setCountdown(300); // Reset timer
      toast.info("Your order has been cancelled.");
    } else {
      toast.error(result.error || "Could not cancel the order.");
    }
  };

  if (isPolling) {
    return (
      <div className="bg-jungle mt-10 flex min-h-screen flex-col items-center justify-center text-white">
        <div className="bg-primary/50 w-full max-w-lg rounded-lg p-8 text-center shadow-2xl">
          <h1 className="font-display mb-4 text-4xl font-bold text-[--color-secondary]">
            Waiting for Payment Confirmation
          </h1>
          <p className="mb-2 text-lg text-white/80">
            Please send exactly{" "}
            {isPriceLoading ? (
              <span className="inline-block h-6 w-24 animate-pulse rounded-md bg-white/10 align-middle"></span>
            ) : (
              <strong className="text-white">{hypeAmount} HYPE</strong>
            )}{" "}
            to the wallet below.
          </p>
          <p className="mb-6 text-lg text-white/80">
            Once sent, we will scan the blockchain for your transaction.
          </p>

          <div className="mb-6">
            <div className="mx-auto w-fit rounded-lg bg-white p-4">
              <QRCode value={receivingAddress || ""} size={128} />
            </div>
          </div>

          <div className="bg-jungle mb-6 flex items-center justify-center rounded-md p-3 font-mono text-sm text-white/90">
            <span className="truncate">{receivingAddress}</span>
            <Button
              onClick={handleCopyAddress}
              variant="ghost"
              size="sm"
              className="ml-2"
            >
              Copy
            </Button>
          </div>

          <div className="mb-8 flex items-center justify-center space-x-4">
            <div
              className="radial-progress text-[--color-mint]"
              style={
                { "--value": (countdown / 300) * 100 } as CustomCSSProperties
              }
            ></div>
            <span className="font-mono text-5xl text-white">
              {Math.floor(countdown / 60)}:
              {String(countdown % 60).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/70">
            <Image
              src="/hyperliquid.png"
              alt="Hyperliquid Logo"
              width={16}
              height={16}
            />
            <span>
              {isPriceLoading ? (
                <span className="inline-block h-5 w-28 animate-pulse rounded-md bg-white/10"></span>
              ) : (
                `1 HYPE = $${hypeToUsdRate?.toFixed(2)}`
              )}
            </span>
          </div>

          <p className="mt-4 text-sm text-white/60">
            This page will automatically redirect upon confirmation.
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <Button
              onClick={handleCancel}
              variant="destructive"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cancelling..." : "Cancel Payment"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isPolling && countdown === 0) {
    return (
      <div className="bg-jungle mt-10 flex min-h-screen flex-col items-center justify-center text-white">
        <div className="max-w-md text-center">
          <h1 className="font-display mb-4 text-4xl font-bold text-red-500">
            Payment Not Detected
          </h1>
          <p className="mb-6 text-lg text-white/80">
            We couldn&rsquo;t confirm your payment within the time limit. If you
            have already sent the funds, please allow some more time for the
            transaction to be processed.
          </p>
          <p className="mb-8 text-white/80">
            You can also manually submit your transaction hash below, or contact
            support for assistance.
          </p>
          {/* Optional: Add a form here to submit tx hash */}
          <Button
            onClick={() => setCountdown(300)}
            className="bg-mint hover:bg-mint-dark font-bold text-black"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
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
                        <FormLabel className="text-white/80">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@example.com"
                          {...field}
                          className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]"
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
                      <FormLabel className="text-white/80">
                        Street Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St"
                          {...field}
                          className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="New York"
                            {...field}
                            className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">
                          ZIP Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="10001"
                            {...field}
                            className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]"
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
                        <FormLabel className="text-white/80">Country</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="USA"
                            {...field}
                            className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="pt-6">
                  <h3 className="font-display mb-4 text-2xl font-semibold text-white">
                    Payment Method
                  </h3>
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
                            <SelectTrigger className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]">
                              <SelectValue placeholder="Select a payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-[--color-deep] bg-white text-black">
                            <SelectItem value="stripe">
                              <div className="flex items-center">
                                Credit Card (Stripe)
                                <span className="ml-2 inline-block">
                                  <StripeIcon />
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="nowpayments">
                              <div className="flex items-center">
                                Cryptocurrency Stablecoins USDC/USDT with
                                NowPayments
                                <span className="ml-2 inline-block">
                                  <UsdcIcon />
                                </span>
                                <span className="ml-2 inline-block">
                                  <UsdtIcon />
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="usdhl">
                              Pay with USDT0 or USDHL on HyperEVM{" "}
                              <span className="inline-block">
                                <Image
                                  src="/USDT0.svg"
                                  alt="Hyperliquid"
                                  width={20}
                                  height={20}
                                />
                              </span>
                              <span className="inline-block">
                                <Image
                                  src="/USDHL.svg"
                                  alt="Hyperliquid"
                                  width={20}
                                  height={20}
                                  className="ml-2 rounded-full"
                                />
                              </span>
                            </SelectItem>
                            <SelectItem value="hype">
                              Pay with $HYPE on HyperEVM{" "}
                              <span className="inline-block">
                                <Image
                                  src="/HYPE.svg"
                                  alt="Hyperliquid"
                                  width={22}
                                  height={22}
                                  className="ml-2 rounded-full"
                                />
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(paymentMethod === "hype" || paymentMethod === "usdhl") && (
                    <FormField
                      control={form.control}
                      name="evmAddress"
                      render={({ field }) => (
                        <FormItem className="mt-4">
                          <FormLabel className="text-white/80">
                            EVM Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0x..."
                              {...field}
                              className="border-[--color-deep] bg-[--color-jungle] text-white focus:border-[--color-mint]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-primary rounded-lg p-8 shadow-lg">
              <h2 className="font-display mb-6 text-3xl font-semibold text-white">
                Order Summary
              </h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
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
                className="bg-secondary text-jungle hover:bg-mint hover:shadow-mint/40 mt-8 w-full rounded-full py-6 text-lg font-bold transition-colors hover:text-white"
                disabled={isSubmitting}
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

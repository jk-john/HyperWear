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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createCheckoutSession } from "./actions";

const formSchema = z.object({
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
});

export default function CheckoutPage() {
  const { cartItems, totalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
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
    },
  });

  useEffect(() => {
    const supabase = createClient();
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
  }, [form]);

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
        const result = await form.trigger(["firstName", "lastName", "email"]);
        if (!result) {
          toast.error("Please fill in your name and email before proceeding.");
          return;
        }
        // Save user info to local storage before redirecting
        localStorage.setItem(
          "hypeUserData",
          JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
          }),
        );
        router.push("/checkout/hype-form");
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

  return (
    <div className="bg-jungle min-h-screen text-white">
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

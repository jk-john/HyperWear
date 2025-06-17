"use client";

import StripeIcon from "@/components/icons/StripeIcon";
import UsdcIcon from "@/components/icons/UsdcIcon";
import UsdtIcon from "@/components/icons/UsdtIcon";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCartStore } from "@/stores/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { createCheckoutSession } from "./actions";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  street: z.string().min(1, { message: "Street is required." }),
  city: z.string().min(1, { message: "City is required." }),
  zip: z.string().min(1, { message: "ZIP code is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  paymentMethod: z.enum(["stripe", "nowpayments"], {
    required_error: "You need to select a payment method.",
  }),
});

export default function CheckoutPage() {
  const { cartItems, totalPrice } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      street: "",
      city: "",
      zip: "",
      country: "",
      paymentMethod: "stripe",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const shippingAddress = {
        name: values.name,
        email: values.email,
        street: values.street,
        city: values.city,
        zip: values.zip,
        country: values.country,
      };

      // Store shipping info in local storage to retrieve on success page
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));

      if (values.paymentMethod === "stripe") {
        await createCheckoutSession(shippingAddress, values.email);
      } else {
        console.log("Redirecting to NowPayments...");
        // Mock redirection for NowPayments
      }
    } catch (error) {
      console.error("Submission error:", error);
      // Optionally show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[--color-dark] text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display mb-12 text-center text-5xl font-bold text-[--color-secondary]">
          Checkout
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-16 lg:grid-cols-2"
          >
            {/* Shipping Information & Payment */}
            <div className="rounded-lg bg-[--color-primary] p-8 shadow-lg">
              <h2 className="font-display mb-6 text-3xl font-semibold text-white">
                Shipping Information
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
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
                </div>
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
                {/* Payment Method Section */}
                <div className="pt-6">
                  <h3 className="font-display mb-4 text-2xl font-semibold text-white">
                    Payment Method
                  </h3>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-4"
                          >
                            <FormItem className="flex items-center space-x-3 rounded-md border border-[--color-deep] bg-[--color-jungle] p-4 has-[:checked]:border-[--color-mint]">
                              <FormControl>
                                <RadioGroupItem
                                  value="stripe"
                                  className="text-[--color-mint]"
                                />
                              </FormControl>
                              <FormLabel className="flex items-center gap-4 font-medium text-white">
                                Credit Card (Stripe)
                                <StripeIcon />
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 rounded-md border border-[--color-deep] bg-[--color-jungle] p-4 has-[:checked]:border-[--color-mint]">
                              <FormControl>
                                <RadioGroupItem
                                  value="nowpayments"
                                  className="text-[--color-mint]"
                                />
                              </FormControl>
                              <FormLabel className="flex items-center gap-2 font-medium text-white">
                                Cryptocurrency (NowPayments)
                                <div className="flex items-center">
                                  <UsdcIcon />
                                  <UsdtIcon />
                                </div>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage className="pt-2" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-8">
              <div className="rounded-lg bg-[--color-primary] p-8 shadow-lg">
                <h2 className="font-display mb-6 text-3xl font-semibold text-white">
                  Order Summary
                </h2>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-grow">
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-sm text-white/80">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="my-6 border-t border-[--color-deep]" />
                <div className="space-y-3 text-lg">
                  <div className="flex justify-between">
                    <p className="text-white/80">Subtotal</p>
                    <p className="font-semibold text-white">
                      ${totalPrice().toFixed(2)}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-white/80">Shipping</p>
                    <p className="font-semibold text-white">
                      Calculated at next step
                    </p>
                  </div>
                  <div className="border-t border-[--color-deep] pt-3" />
                  <div className="flex justify-between font-bold">
                    <p className="text-white">Total</p>
                    <p className="text-[--color-secondary]">
                      ${totalPrice().toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-secondary hover:bg-mint hover:text-dark text-dark transition-color w-full py-6 text-lg font-bold hover:text-white"
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

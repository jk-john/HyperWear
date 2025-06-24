"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { createManualOrder } from "../actions";

const hypeFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  walletAddress: z
    .string()
    .startsWith("0x")
    .length(42, { message: "Invalid HyperEVM wallet address" }),
});

type HypeFormData = z.infer<typeof hypeFormSchema>;

export default function HypeCheckoutFormPage() {
  const [isPending, startTransition] = useTransition();
  const cartTotalUsd = 55; // Mocked value as requested

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<HypeFormData>({
    resolver: zodResolver(hypeFormSchema),
  });

  useEffect(() => {
    const userData = localStorage.getItem("hypeUserData");
    if (userData) {
      const { firstName, lastName, email } = JSON.parse(userData);
      setValue("firstName", firstName);
      setValue("lastName", lastName);
      setValue("email", email);
    }
  }, [setValue]);

  const onSubmit = (data: HypeFormData) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("walletAddress", data.walletAddress);
    formData.append("cartTotalUsd", cartTotalUsd.toString());

    startTransition(async () => {
      try {
        await createManualOrder(formData);
        toast.success("Order submitted! Redirecting to confirmation...");
      } catch {
        toast.error("An error occurred while submitting your order.");
      }
    });
  };

  return (
    <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 text-white">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Pay with HYPE{" "}
          <span className="inline-block">
            <Image
              src="/hyperliquid-logo.png"
              alt="Hyperliquid"
              width={60}
              height={20}
              className="inline-block"
            />
          </span>
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              disabled={isPending}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              disabled={isPending}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              disabled={isPending}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="walletAddress">HyperEVM Wallet Address</Label>
            <Input
              id="walletAddress"
              {...register("walletAddress")}
              disabled={isPending}
            />
            {errors.walletAddress && (
              <p className="mt-1 text-sm text-red-500">
                {errors.walletAddress.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="bg-secondary text-jungle hover:bg-mint hover:shadow-mint/40 mt-8 w-full rounded-full py-6 text-lg font-bold transition-colors hover:text-white"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Order"}
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { AddressForm } from "@/components/ui/AddressForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileSummary } from "@/components/ui/ProfileSummary";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UpdateProfileForm } from "@/components/ui/UpdateProfileForm";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  CreditCard,
  DollarSign,
  Edit,
  PlusCircle,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

type Product = Tables<"products">;
type OrderItem = Tables<"order_items"> & { products: Product | null };
type OrderWithItems = Tables<"orders"> & { order_items: OrderItem[] };
type UserAddress = Tables<"user_addresses">;
type UserProfile = Tables<"user_profiles">;

interface DashboardClientProps {
  user: User;
  orders: OrderWithItems[];
  profile: UserProfile | null;
  addresses: UserAddress[];
}

export default function DashboardClient({
  user,
  orders,
  profile: initialProfile,
  addresses: initialAddresses,
}: DashboardClientProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null,
  );
  const [addressToDelete, setAddressToDelete] = useState<UserAddress | null>(
    null,
  );
  const [profile] = useState<UserProfile | null>(initialProfile);
  const [addresses, setAddresses] = useState<UserAddress[]>(initialAddresses);
  const [visibleOrdersCount, setVisibleOrdersCount] = useState(5);
  const supabase = createClient();

  const totalSpent = orders?.reduce((acc, order) => acc + order.total, 0) ?? 0;
  const totalOrders = orders?.length ?? 0;
  const userName = user.user_metadata?.full_name || "User";
  const defaultAddress =
    initialAddresses.find((address) => address.is_default) || null;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out. Please try again.");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="mt-10 flex min-h-screen w-full flex-col text-white">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--color-primary)] px-4 backdrop-blur sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-3xl font-bold">
            {userName}
            &apos;s Dashboard
          </h1>
          <Button onClick={handleSignOut} variant="outline" className="ml-auto">
            Sign Out
          </Button>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <ProfileSummary defaultAddress={defaultAddress} user={user} />

          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total spent
                </CardTitle>
                <DollarSign className="h-4 w-4 text-[var(--color-accent)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalSpent.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-[var(--color-accent)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{totalOrders}</div>
              </CardContent>
            </Card>
            <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Account Status
                </CardTitle>
                <CreditCard className="h-4 w-4 text-[var(--color-accent)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-[var(--color-accent)]">
                  Your account is currently active
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.slice(0, visibleOrdersCount).map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-xs">
                            {order.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{order.status}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell className="space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/dashboard/orders/${order.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {(visibleOrdersCount > 5 ||
                    visibleOrdersCount < orders.length) && (
                    <div className="mt-4 flex justify-center gap-4">
                      {visibleOrdersCount > 5 && (
                        <Button
                          variant="outline"
                          onClick={() => setVisibleOrdersCount(5)}
                        >
                          See Less
                        </Button>
                      )}
                      {visibleOrdersCount < orders.length && (
                        <Button
                          variant="outline"
                          onClick={() =>
                            setVisibleOrdersCount((prevCount) => prevCount + 5)
                          }
                        >
                          Load More
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-8 border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddressModalOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New
                  </Button>
                </CardHeader>
                <CardContent>
                  {addresses.length > 0 ? (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="flex items-center justify-between rounded-lg border border-gray-700 p-4"
                        >
                          <div>
                            <p className="font-semibold">
                              {address.first_name} {address.last_name}{" "}
                              {address.is_default && (
                                <span className="text-xs text-green-400">
                                  (Default)
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-gray-400">
                              {address.street}, {address.city},{" "}
                              {address.postal_code}
                            </p>
                            <p className="text-sm text-gray-400">
                              {address.country}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingAddress(address);
                                setIsAddressModalOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setAddressToDelete(address);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>You have no saved addresses.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              {/* Profile Info */}
              <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isEditingProfile ? (
                    <UpdateProfileForm
                      profile={profile}
                      onSuccess={() => setIsEditingProfile(false)}
                    />
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-semibold text-gray-400">
                          Email:{" "}
                        </span>
                        {user.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-400">
                          Phone:{" "}
                        </span>
                        {profile?.phone_number || "Not set"}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-400">
                          Birthday:{" "}
                        </span>
                        {profile?.birthday || "Not set"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Management */}
              <Card className="mt-8 border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/password-update">Change Password</Link>
                  </Button>
                  <Button variant="destructive" className="w-full" asChild>
                    <a href="mailto:support@hyperwear.xyz?subject=Account Deletion Request">
                      Request Account Deletion
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="rounded-2xl border-[var(--color-secondary)] bg-[var(--color-jungle)] text-[var(--color-light)] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-[var(--color-secondary)]">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              Manage your shipping information here.
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            address={editingAddress}
            onSuccess={() => setIsAddressModalOpen(false)}
          />
          <DialogClose className="data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm text-white opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="rounded-2xl border-[var(--color-secondary)] bg-[var(--color-jungle)] text-[var(--color-light)] shadow-2xl">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              address.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              className="cursor-pointer hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer hover:bg-red-700"
              onClick={async () => {
                if (!addressToDelete) return;
                const { error } = await supabase
                  .from("user_addresses")
                  .delete()
                  .eq("id", addressToDelete.id);

                if (error) {
                  toast.error(error.message);
                } else {
                  toast.success("Address deleted successfully");
                  setAddresses(
                    addresses.filter((a) => a.id !== addressToDelete.id),
                  );
                }
                setIsDeleteModalOpen(false);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
        <DialogContent className="bg-background border-[var(--color-primary)] text-white">
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
            <DialogDescription>
              Manage your profile information here.
            </DialogDescription>
          </DialogHeader>
          <UpdateProfileForm
            profile={profile}
            onSuccess={() => setIsEditingProfile(false)}
          />
          <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}

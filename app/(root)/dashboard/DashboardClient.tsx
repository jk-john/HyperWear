"use client";

import { AddressForm } from "@/components/ui/AddressForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
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
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Edit,
  Package,
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
  const defaultAddress =
    initialAddresses.find((address) => address.is_default) || null;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out. Please try again.");
    } else {
      toast.success("👋 You've been signed out successfully.");
      window.location.href = "/";
    }
  };

  return (
    <div
      className="min-h-screen w-full px-4 py-6 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "var(--color-dark)",
        color: "var(--color-light)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Profile Summary */}
        <div className="mb-8">
          <ProfileSummary
            defaultAddress={defaultAddress}
            user={user}
            profile={profile}
            isEditing={isEditingProfile}
            onToggleEdit={() => setIsEditingProfile(!isEditingProfile)}
            onSuccess={() => {
              toast.success("Profile saved successfully.");
              setIsEditingProfile(false);
            }}
          />
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            className="border-2 backdrop-blur-sm"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-emerald)",
              color: "var(--color-light)",
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-medium"
                style={{ color: "var(--color-light)" }}
              >
                Total Spent
              </CardTitle>
              <DollarSign
                className="h-4 w-4"
                style={{ color: "var(--color-secondary)" }}
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--color-secondary)" }}
              >
                ${totalSpent.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-2 backdrop-blur-sm"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-emerald)",
              color: "var(--color-light)",
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-medium"
                style={{ color: "var(--color-light)" }}
              >
                Total Orders
              </CardTitle>
              <ShoppingBag
                className="h-4 w-4"
                style={{ color: "var(--color-secondary)" }}
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--color-secondary)" }}
              >
                +{totalOrders}
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-2 backdrop-blur-sm sm:col-span-2 lg:col-span-1"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-emerald)",
              color: "var(--color-light)",
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle
                className="text-sm font-medium"
                style={{ color: "var(--color-light)" }}
              >
                Account Status
              </CardTitle>
              <CreditCard
                className="h-4 w-4"
                style={{ color: "var(--color-secondary)" }}
              />
            </CardHeader>
            <CardContent>
              <div
                className="text-xl font-bold sm:text-2xl"
                style={{ color: "var(--color-secondary)" }}
              >
                Active
              </div>
              <p className="text-xs" style={{ color: "var(--color-accent)" }}>
                Your account is currently active
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Orders and Addresses */}
          <div className="space-y-8 lg:col-span-2">
            {/* Recent Orders */}
            <Card
              className="border-2 backdrop-blur-sm"
              style={{
                borderColor: "var(--color-primary)",
                backgroundColor: "var(--color-emerald)",
                color: "var(--color-light)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="text-lg sm:text-xl"
                  style={{ color: "var(--color-light)" }}
                >
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ borderColor: "var(--color-primary)" }}>
                        <TableHead style={{ color: "var(--color-accent)" }}>
                          Order ID
                        </TableHead>
                        <TableHead style={{ color: "var(--color-accent)" }}>
                          Date
                        </TableHead>
                        <TableHead style={{ color: "var(--color-accent)" }}>
                          Status
                        </TableHead>
                        <TableHead style={{ color: "var(--color-accent)" }}>
                          Total
                        </TableHead>
                        <TableHead style={{ color: "var(--color-accent)" }}>
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.slice(0, visibleOrdersCount).map((order) => (
                        <TableRow
                          key={order.id}
                          style={{ borderColor: "var(--color-primary)" }}
                        >
                          <TableCell
                            className="font-mono text-xs"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {order.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell style={{ color: "var(--color-light)" }}>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <span
                              className="rounded-full px-2 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: "var(--color-mint)",
                                color: "var(--color-dark)",
                              }}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell
                            className="font-semibold"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            ${order.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              style={{
                                borderColor: "var(--color-secondary)",
                                color: "var(--color-secondary)",
                              }}
                              className="hover:bg-[var(--color-secondary)] hover:text-[var(--color-dark)]"
                            >
                              <Link href={`/dashboard/orders/${order.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="space-y-4 sm:hidden">
                  {orders.slice(0, visibleOrdersCount).map((order) => (
                    <div
                      key={order.id}
                      className="rounded-lg border-2 p-4"
                      style={{
                        borderColor: "var(--color-primary)",
                        backgroundColor: "var(--color-deep)",
                      }}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <p
                            className="font-mono text-xs"
                            style={{ color: "var(--color-accent)" }}
                          >
                            #{order.id.substring(0, 8)}...
                          </p>
                          <p
                            className="font-semibold"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                        <span
                          className="rounded-full px-2 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: "var(--color-mint)",
                            color: "var(--color-dark)",
                          }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div
                        className="mb-3 flex items-center gap-2 text-sm"
                        style={{ color: "var(--color-accent)" }}
                      >
                        <Calendar className="h-4 w-4" />
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-dark)]"
                        style={{
                          borderColor: "var(--color-secondary)",
                          color: "var(--color-secondary)",
                        }}
                        asChild
                      >
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <Package className="mr-2 h-4 w-4" />
                          View Order Details
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Load More/Less Buttons */}
                {(visibleOrdersCount > 5 ||
                  visibleOrdersCount < orders.length) && (
                  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-4">
                    {visibleOrdersCount > 5 && (
                      <Button
                        variant="outline"
                        onClick={() => setVisibleOrdersCount(5)}
                        className="w-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-dark)] sm:w-auto"
                        style={{
                          borderColor: "var(--color-secondary)",
                          color: "var(--color-secondary)",
                        }}
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
                        className="w-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-dark)] sm:w-auto"
                        style={{
                          borderColor: "var(--color-secondary)",
                          color: "var(--color-secondary)",
                        }}
                      >
                        Load More Orders
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Addresses */}
            <Card
              className="border-2 backdrop-blur-sm"
              style={{
                borderColor: "var(--color-primary)",
                backgroundColor: "var(--color-emerald)",
                color: "var(--color-light)",
              }}
            >
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle
                  className="text-lg sm:text-xl"
                  style={{ color: "var(--color-light)" }}
                >
                  Saved Addresses
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingAddress(null);
                    setIsAddressModalOpen(true);
                  }}
                  className="w-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-dark)] sm:w-auto"
                  style={{
                    borderColor: "var(--color-secondary)",
                    color: "var(--color-secondary)",
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                </Button>
              </CardHeader>
              <CardContent>
                {addresses.length > 0 ? (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="flex flex-col gap-4 rounded-lg border-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                        style={{
                          borderColor: "var(--color-primary)",
                          backgroundColor: "var(--color-deep)",
                        }}
                      >
                        <div className="flex-1">
                          <p
                            className="font-semibold"
                            style={{ color: "var(--color-light)" }}
                          >
                            {address.first_name} {address.last_name}{" "}
                            {address.is_default && (
                              <span
                                className="rounded px-2 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor: "var(--color-mint)",
                                  color: "var(--color-dark)",
                                }}
                              >
                                Default
                              </span>
                            )}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {address.street}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {address.city}, {address.postal_code}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--color-accent)" }}
                          >
                            {address.country}
                          </p>
                        </div>
                        <div className="flex gap-2 sm:flex-col lg:flex-row">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingAddress(address);
                              setIsAddressModalOpen(true);
                            }}
                            className="flex-1 hover:bg-[var(--color-primary)] sm:flex-none"
                            style={{ color: "var(--color-secondary)" }}
                          >
                            <Edit className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAddressToDelete(address);
                              setIsDeleteModalOpen(true);
                            }}
                            className="flex-1 hover:bg-red-900/50 sm:flex-none"
                            style={{ color: "#ff6b6b" }}
                          >
                            <Trash2 className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="py-8 text-center"
                    style={{ color: "var(--color-accent)" }}
                  >
                    <p className="mb-4">You have no saved addresses.</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingAddress(null);
                        setIsAddressModalOpen(true);
                      }}
                      className="hover:bg-[var(--color-secondary)] hover:text-[var(--color-dark)]"
                      style={{
                        borderColor: "var(--color-secondary)",
                        color: "var(--color-secondary)",
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Your First
                      Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Account Management */}
          <div className="lg:col-span-1">
            <Card
              className="border-2 backdrop-blur-sm"
              style={{
                borderColor: "var(--color-primary)",
                backgroundColor: "var(--color-emerald)",
                color: "var(--color-light)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="text-lg sm:text-xl"
                  style={{ color: "var(--color-light)" }}
                >
                  Account Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full hover:bg-[var(--color-secondary)] hover:text-[var(--color-dark)]"
                  style={{
                    borderColor: "var(--color-secondary)",
                    color: "var(--color-secondary)",
                  }}
                  asChild
                >
                  <Link href="/password-update">Change Password</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full hover:bg-red-600 hover:text-white"
                  style={{
                    borderColor: "#ff6b6b",
                    color: "#ff6b6b",
                  }}
                  asChild
                >
                  <Link href="/support">Request Account Deletion</Link>
                </Button>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full hover:bg-[var(--color-accent)] hover:text-[var(--color-dark)]"
                  style={{
                    borderColor: "var(--color-accent)",
                    color: "var(--color-accent)",
                  }}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent
          className="mx-2 my-2 h-[96vh] w-[96vw] max-w-2xl overflow-hidden rounded-2xl border-2 shadow-2xl sm:mx-4 sm:my-4 sm:h-[90vh] sm:w-full"
          style={{
            borderColor: "var(--color-secondary)",
            backgroundColor: "var(--color-jungle)",
            color: "var(--color-light)",
          }}
        >
          <div className="flex h-full flex-col">
            <DialogHeader className="flex-shrink-0 space-y-2 pb-4 sm:space-y-3 sm:pb-6">
              <DialogTitle
                className="font-display text-xl font-bold sm:text-2xl lg:text-3xl"
                style={{ color: "var(--color-secondary)" }}
              >
                {editingAddress ? "Edit Address" : "Add New Address"}
              </DialogTitle>
              <DialogDescription
                className="text-xs sm:text-sm lg:text-base"
                style={{ color: "var(--color-accent)" }}
              >
                Manage your shipping information here.
              </DialogDescription>
            </DialogHeader>

            <div
              className="flex-1 overflow-y-scroll pr-1 sm:pr-2"
              style={{
                maxHeight: "calc(96vh - 140px)",
                minHeight: "0",
              }}
            >
              <div className="pb-4">
                <AddressForm
                  address={editingAddress}
                  onSuccess={() => {
                    toast.success(
                      `Address ${editingAddress ? "updated" : "added"} successfully.`,
                    );
                    setIsAddressModalOpen(false);
                  }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsAddressModalOpen(false)}
            className="absolute top-2 right-2 z-[60] rounded-lg p-2 opacity-80 transition-all hover:scale-105 hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none sm:top-4 sm:right-4"
            style={{
              color: "var(--color-light)",
              backgroundColor: "var(--color-primary)",
              borderRadius: "8px",
              border: "1px solid var(--color-secondary)",
            }}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">Close</span>
          </button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent
          className="mx-4 rounded-2xl shadow-2xl sm:mx-0 sm:max-w-md"
          style={{
            borderColor: "var(--color-secondary)",
            backgroundColor: "var(--color-jungle)",
            color: "var(--color-light)",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "var(--color-light)" }}>
              Are you sure?
            </DialogTitle>
            <DialogDescription style={{ color: "var(--color-accent)" }}>
              This action cannot be undone. This will permanently delete your
              address.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              className="hover:bg-[var(--color-primary)]"
              style={{ color: "var(--color-accent)" }}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="hover:bg-red-600 hover:text-white"
              style={{
                borderColor: "#ff6b6b",
                color: "#ff6b6b",
              }}
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
    </div>
  );
}

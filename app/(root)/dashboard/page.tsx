import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SignOutButton from "@/components/ui/SignOutButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { CreditCard, DollarSign, Home, ShoppingBag } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Product = Tables<"products">;
type OrderItem = Tables<"order_items"> & { products: Product | null };
type OrderWithItems = Tables<"orders"> & { order_items: OrderItem[] };
type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    // TODO: Handle error state in the UI
  }

  const orders: OrderWithItems[] = data || [];
  const latestOrder = orders.length > 0 ? orders[0] : null;
  const shippingAddress = latestOrder?.shipping_address as ShippingAddress;

  const totalSpent =
    orders?.reduce((acc, order) => acc + order.total_price, 0) ?? 0;
  const totalOrders = orders?.length ?? 0;
  const userName = user.user_metadata?.full_name || "User";
  const userEmail = user.email;

  return (
    <div className="mt-10 flex min-h-screen w-full flex-col text-white">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-[var(--color-primary)] px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-3xl font-bold">
            {user.user_metadata?.full_name}&apos;s Dashboard
          </h1>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
                <p className="text-xs text-[var(--color-accent)]">
                  +20.1% from last month
                </p>
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
                <p className="text-xs text-[var(--color-accent)]">
                  +180.1% from last month
                </p>
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
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center">
                  <div className="grid gap-2">
                    <CardTitle>Recent Orders</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders && orders.length > 0 ? (
                        orders.slice(0, 5).map((order) =>
                          order.order_items.map(
                            (item) =>
                              item.products && (
                                <TableRow
                                  key={item.id}
                                  className="border-[var(--color-primary)]"
                                >
                                  <TableCell>
                                    <div className="font-medium">
                                      {item.products.name}
                                    </div>
                                    <div className="hidden text-sm text-[var(--color-accent)] md:inline">
                                      Qty: {item.quantity}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <span
                                      className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                        order.status === "Processing"
                                          ? "bg-yellow-900/50 text-yellow-300"
                                          : order.status === "Shipped"
                                            ? "bg-blue-900/50 text-blue-300"
                                            : "bg-green-900/50 text-green-300"
                                      }`}
                                    >
                                      {order.status || "Completed"}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    ${order.total_price.toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ),
                          ),
                        )
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} className="py-12 text-center">
                            <ShoppingBag className="mx-auto h-12 w-12 text-[var(--color-accent)]" />
                            <h3 className="mt-4 text-lg font-medium">
                              No orders yet
                            </h3>
                            <p className="mt-1 text-sm text-[var(--color-accent)]">
                              Looks like you haven&apos;t placed any orders.
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="overflow-hidden border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-start bg-[var(--color-primary)]/50">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center gap-2 text-lg">
                      Welcome, {userName}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-sm">
                  <div className="grid gap-3">
                    <div className="font-semibold">User Details</div>
                    <dl className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <dt className="text-[var(--color-accent)]">Email</dt>
                        <dd>{userEmail}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-[var(--color-accent)]">
                          Member Since
                        </dt>
                        <dd>
                          {new Date(user.created_at || "").toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                    <Separator className="my-2 bg-[var(--color-primary)]" />
                    {shippingAddress && (
                      <>
                        <div className="font-semibold">Shipping Address</div>
                        <dl className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <dt className="flex items-center gap-2 text-[var(--color-accent)]">
                              <Home className="h-4 w-4" />
                              Address
                            </dt>
                            <dd className="text-right">
                              {shippingAddress.street}, {shippingAddress.city},{" "}
                              {shippingAddress.state} {shippingAddress.zip},{" "}
                              {shippingAddress.country}
                            </dd>
                          </div>
                        </dl>
                      </>
                    )}
                    <Separator className="my-2 bg-[var(--color-primary)]" />
                    <SignOutButton />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

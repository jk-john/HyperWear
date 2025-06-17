import { BackgroundBeams } from "@/components/ui/background-beams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import { CreditCard, DollarSign, ShoppingBag } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Product = Tables<"products">;
type OrderItem = Tables<"order_items"> & { products: Product | null };
type OrderWithItems = Tables<"orders"> & { order_items: OrderItem[] };

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

  const totalSpent =
    orders?.reduce((acc, order) => acc + order.total_price, 0) ?? 0;
  const totalOrders = orders?.length ?? 0;
  const userName = user.user_metadata?.full_name || "User";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--color-dark)] pt-10 text-[var(--color-light)]">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-5xl font-extrabold">
            Welcome Back, {userName}!
          </h1>
          <p className="text-lg text-[var(--color-accent)]">
            Here&apos;s a summary of your HyperWear activity.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-accent)]">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-5 w-5 text-[var(--color-secondary)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-accent)]">
                Total Spent
              </CardTitle>
              <DollarSign className="h-5 w-5 text-[var(--color-secondary)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalSpent.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[var(--color-accent)]">
                Account Status
              </CardTitle>
              <CreditCard className="h-5 w-5 text-[var(--color-secondary)]" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Active</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="mb-6 text-center text-3xl font-bold">Recent Orders</h2>
          <div className="space-y-6">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary)]/50 p-6 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-[var(--color-secondary)]/10"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-accent)]">
                        Order #{order.id.substring(0, 8)}
                      </p>
                      <p className="text-2xl font-bold">
                        ${order.total_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
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
                      <p className="mt-1 text-sm text-[var(--color-accent)]">
                        {new Date(order.created_at || "").toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    {order.order_items.map(
                      (item) =>
                        item.products && (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 border-t border-[var(--color-primary)] py-3 last:border-b-0"
                          >
                            <img
                              src={item.products.image_url ?? undefined}
                              alt={item.products.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold">
                                {item.products.name}
                              </p>
                              <p className="text-sm text-[var(--color-accent)]">
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--color-primary)] bg-[var(--color-primary)]/50 py-12 text-center backdrop-blur-sm">
                <ShoppingBag className="mx-auto h-12 w-12 text-[var(--color-accent)]" />
                <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                <p className="mt-1 text-sm text-[var(--color-accent)]">
                  Looks like you haven&apos;t placed any orders.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}

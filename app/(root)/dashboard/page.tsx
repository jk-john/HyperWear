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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="mb-2 text-5xl font-extrabold text-gray-800">
            Welcome Back!
          </h1>
          <p className="text-lg text-gray-500">
            Here&apos;s a summary of your HyperWear activity.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mr-4 rounded-full bg-green-100 p-3">
              <ShoppingBag className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{totalOrders}</p>
            </div>
          </div>
          <div className="flex items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mr-4 rounded-full bg-blue-100 p-3">
              <DollarSign className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-3xl font-bold text-gray-800">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex items-center rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mr-4 rounded-full bg-purple-100 p-3">
              <CreditCard className="h-7 w-7 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Account Status
              </p>
              <p className="text-3xl font-bold text-gray-800">Active</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="mb-6 text-3xl font-bold text-gray-800">
            Recent Orders
          </h2>
          <div className="space-y-6">
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        Order #{order.id.substring(0, 8)}
                      </p>
                      <p className="text-2xl font-bold text-gray-800">
                        ${order.total_price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          order.status === "Processing"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status || "Completed"}
                      </span>
                      <p className="mt-1 text-sm text-gray-500">
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
                            className="flex items-center space-x-4 border-t border-gray-100 py-3 last:border-b-0"
                          >
                            <img
                              src={item.products.image_url ?? undefined}
                              alt={item.products.name}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-semibold text-gray-700">
                                {item.products.name}
                              </p>
                              <p className="text-sm text-gray-500">
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
              <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No orders yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Looks like you haven&apos;t placed any orders.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";

// Safe date formatting to prevent hydration issues
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  // Use a format that's consistent across server/client
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

type Order = Database["public"]["Tables"]["orders"]["Row"];
type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];

interface OrderItemWithProduct extends OrderItem {
  products: Product | null;
}

interface OrderWithItems extends Order {
  order_items: OrderItemWithProduct[];
}

export default async function OrdersPage() {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <div className="container mx-auto bg-white px-4 py-8 text-black">
        <h1 className="text-2xl font-bold text-black">My Orders</h1>
        <p className="mt-4 text-black">Please log in to see your orders.</p>
      </div>
    );
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        *,
        products (*)
      )
    `,
    )
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="container mx-auto bg-white px-4 py-8 text-black">
        <h1 className="text-2xl font-bold text-black">My Orders</h1>
        <p className="mt-4 text-red-600">
          Could not fetch orders. Please try again later.
        </p>
      </div>
    );
  }

  const typedOrders = orders as OrderWithItems[];

  return (
    <div className="container mx-auto mt-10 rounded-lg bg-white px-4 py-8 text-black">
      <h1 className="mb-8 text-center text-2xl font-bold text-black">
        My Orders
      </h1>
      <div className="space-y-8">
        {typedOrders.map((order) => (
          <Card key={order.id} className="border-gray-200 bg-white">
            <CardHeader className="bg-white">
              <CardTitle className="text-black">
                Order #{order.id.substring(0, 8)}
              </CardTitle>
              <CardDescription className="text-gray-600">
                Placed on {formatDate(order.created_at!)}
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="mb-4">
                <h3 className="font-bold text-black">Shipping To:</h3>
                <p className="text-sm text-gray-700">
                  {order.shipping_first_name} {order.shipping_last_name}
                </p>
                <p className="text-sm text-gray-700">{order.shipping_street}</p>
                {order.shipping_address_complement && (
                  <p className="text-sm text-gray-700">
                    {order.shipping_address_complement}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  {order.shipping_city}, {order.shipping_postal_code}
                </p>
                <p className="text-sm text-gray-700">
                  {order.shipping_country}
                </p>
              </div>
              <Table className="bg-white">
                <TableHeader>
                  <TableRow className="border-gray-200 bg-white">
                    <TableHead className="text-black">Product</TableHead>
                    <TableHead className="text-black">Quantity</TableHead>
                    <TableHead className="text-black">Price</TableHead>
                    <TableHead className="text-black">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_items.map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-gray-200 bg-white"
                    >
                      <TableCell className="text-black">
                        {item.products?.name}
                      </TableCell>
                      <TableCell className="text-black">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-black">
                        ${item.price_at_purchase?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-black">
                        $
                        {(
                          (item.price_at_purchase ?? 0) * (item.quantity ?? 0)
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right font-bold text-black">
                Total: ${(order.total ?? order.amount_total ?? 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <p className="text-black">You have no orders yet.</p>
        )}
      </div>
    </div>
  );
}

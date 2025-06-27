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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="mt-4">Please log in to see your orders.</p>
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-destructive mt-4">
          Could not fetch orders. Please try again later.
        </p>
      </div>
    );
  }

  const typedOrders = orders as OrderWithItems[];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">My Orders</h1>
      <div className="space-y-8">
        {typedOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
              <CardDescription>
                Placed on {new Date(order.created_at!).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.order_items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.products?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        ${item.price_at_purchase?.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        $
                        {(
                          (item.price_at_purchase ?? 0) * (item.quantity ?? 0)
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 text-right font-bold">
                Total: ${order.total?.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && <p>You have no orders yet.</p>}
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Link from "next/link";
import { notFound } from "next/navigation";

// Safe date formatting to prevent hydration issues
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  // Use a format that's consistent across server/client
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

type Product = Tables<"products">;
type OrderItem = Tables<"order_items"> & { products: Product | null };
type OrderWithItems = Tables<"orders"> & { order_items: OrderItem[] };

export default async function OrderDetailsPage(
  props: {
    params: Promise<{ orderId: string }>;
  }
) {
  const params = await props.params;

  const {
    orderId
  } = params;

  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("id", orderId)
    .single();

  const order: OrderWithItems | null = data;

  if (error || !order) {
    notFound();
  }

  return (
    <div className="container mx-auto my-10 max-w-4xl text-white">
      <Card className="border-[var(--color-primary)] bg-[var(--color-primary)]/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <p className="text-sm text-gray-400">
            Order #{order.id.substring(0, 8)}...
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold">Shipping Address</h3>
              <address className="text-gray-300 not-italic">
                {order.shipping_first_name} {order.shipping_last_name}
                <br />
                {order.shipping_company_name && (
                  <>
                    {order.shipping_company_name}
                    <br />
                  </>
                )}
                {order.shipping_street}
                <br />
                {order.shipping_address_complement && (
                  <>
                    {order.shipping_address_complement}
                    <br />
                  </>
                )}
                {order.shipping_city}, {order.shipping_postal_code}
                <br />
                {order.shipping_country}
                <br />
                {order.shipping_phone_number}
              </address>
            </div>
            <div>
              <h3 className="font-semibold">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Order Date:</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{order.payment_method || "N/A"}</span>
                </div>
                {/* Crypto payment fields not available in current schema - commenting out for Stripe flow
                {order.status === "underpaid" && (
                  <>
                    <div className="flex justify-between text-yellow-400">
                      <span>Amount Paid:</span>
                      <span>
                        $
                        {typeof order.paid_amount === "number"
                          ? order.paid_amount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-400">
                      <span>Amount Remaining:</span>
                      <span>
                        $
                        {typeof order.remaining_amount === "number"
                          ? order.remaining_amount.toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </>
                )}
                */}
                <div className="flex justify-between font-bold">
                  <span>Total Amount:</span>
                  <span>${(order.total ?? order.amount_total ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Products</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.order_items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.products?.name}</TableCell>
                    <TableCell>N/A</TableCell> {/* Size info not in DB yet */}
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.price_at_purchase.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="pt-4">
            <h3 className="font-semibold">Transactions</h3>
            <p className="text-gray-400">
              {Array.isArray(order.tx_hashes) && order.tx_hashes.length > 0 ? order.tx_hashes.join(", ") : "Not available yet."}
            </p>
          </div>
          <div className="pt-4">
            <Link href="/dashboard" className="text-blue-400 hover:underline">
              &larr; Back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-primary">
        <main className="flex-grow">{children}</main>
      </div>
    </CartProvider>
  );
}

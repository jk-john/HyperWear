import CommunityPageClient from "@/components/CommunityPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the HyperWear community. Connect with other HyperLiquid fans, share your style, and be part of our Web3 fashion movement.",
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "Community | HyperWear.io",
    description:
      "Join the HyperWear community. Connect with other HyperLiquid fans, share your style, and be part of our Web3 fashion movement.",
    url: "/community",
  },
};

export default function CommunityPage() {
  return <CommunityPageClient />;
}

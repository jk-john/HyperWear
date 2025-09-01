import dynamic from "next/dynamic";
import React from "react";

// Hero components - load after 2s for progressive enhancement
export const ParticleCanvasOptimized = dynamic(
  () => import("@/components/hero/ParticleCanvasOptimized"),
  { 
    ssr: false,
    loading: () => null 
  }
);

export const AnimatedBackgroundLite = dynamic(
  () => import("@/components/hero/AnimatedBackgroundLite"),
  { 
    ssr: false,
    loading: () => null 
  }
);

export const MotionEnhancements = dynamic(
  () => import("@/components/hero/MotionEnhancements"),
  { 
    ssr: false,
    loading: () => null 
  }
);

// Heavy form components - load on interaction
export const AddressForm = dynamic(
  () => import("@/components/ui/AddressForm"),
  {
    loading: () => <div className="animate-pulse h-32 bg-gray-200 rounded" />
  }
);

export const PurrNftForm = dynamic(
  () => import("@/components/ui/PurrNftForm"),
  {
    loading: () => <div className="animate-pulse h-40 bg-gray-200 rounded" />
  }
);

export const ProfileForm = dynamic(
  () => import("@/components/ui/ProfileForm"),
  {
    loading: () => <div className="animate-pulse h-48 bg-gray-200 rounded" />
  }
);

export const UpdatePasswordForm = dynamic(
  () => import("@/components/ui/UpdatePasswordForm"),
  {
    loading: () => <div className="animate-pulse h-32 bg-gray-200 rounded" />
  }
);

// Analytics and tracking - load after interaction
export const AnalyticsProvider = dynamic(
  () => import("@/components/AnalyticsProvider"),
  { 
    ssr: false,
    loading: () => null 
  }
);

// QR Code component - only load when needed (checkout confirmation)
export const QRCodeDynamic = dynamic(
  () => import("qrcode.react").then(mod => ({ default: mod.QRCodeSVG })),
  {
    loading: () => <div className="w-32 h-32 bg-gray-200 animate-pulse rounded" />,
    ssr: false
  }
);

// Phone input - only load in forms that need it
export const PhoneInputDynamic = dynamic(
  () => import("react-phone-number-input"),
  {
    loading: () => <div className="h-12 bg-gray-200 animate-pulse rounded" />
  }
);

// 3D Carousel - load when in viewport
export const Carousel3D = dynamic(
  () => import("@/components/ui/3d-carousel"),
  {
    loading: () => <div className="h-80 bg-gray-200 animate-pulse rounded-lg" />,
    ssr: false
  }
);

// Product image carousel - progressive loading
export const ProductImageCarousel = dynamic(
  () => import("@/components/ProductImageCarousel"),
  {
    loading: () => <div className="aspect-square bg-gray-200 animate-pulse rounded-lg" />
  }
);

// Lottie animations - load only when needed
export const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then(mod => ({ default: mod.Player })),
  {
    ssr: false,
    loading: () => <div className="w-full h-64 bg-gray-200 animate-pulse rounded" />
  }
);
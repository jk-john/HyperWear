"use client";

import dynamic from "next/dynamic";

// Centralized dynamic imports for commonly used Lucide icons
// This prevents HMR module factory issues by using dynamic imports

// Loading placeholder component for icons
const IconPlaceholder = ({ size = "h-4 w-4" }: { size?: string }) => (
  <div className={`${size} bg-gray-400/20 rounded animate-pulse`} />
);

// Commonly used icons with dynamic imports
export const Menu = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.Menu })), {
  ssr: false,
  loading: () => <IconPlaceholder size="h-6 w-6" />
});

export const X = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.X })), {
  ssr: false,
  loading: () => <IconPlaceholder size="h-6 w-6" />
});

export const Search = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.Search })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const ShoppingBag = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.ShoppingBag })), {
  ssr: false,
  loading: () => <IconPlaceholder size="h-6 w-6" />
});

export const Plus = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.Plus })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const Minus = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.Minus })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const LogOut = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.LogOut })), {
  ssr: false,
  loading: () => <IconPlaceholder size="h-5 w-5" />
});

export const User = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.User })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const Mail = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.Mail })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const Twitter = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.Twitter })), {
  ssr: false,
  loading: () => <IconPlaceholder size="h-6 w-6" />
});

export const ChevronLeft = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.ChevronLeft })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const ChevronRight = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.ChevronRight })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const BarChart3 = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.BarChart3 })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const TrendingUp = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.TrendingUp })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const TrendingDown = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.TrendingDown })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

export const Edit = dynamic(() => import("lucide-react").then((mod) => ({ default: mod.Edit })), {
  ssr: false,
  loading: () => <IconPlaceholder />
});

// Google Icon Component (not from Lucide)  
const GoogleIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={className}
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Icons object for compatibility with existing code
export const Icons = {
  google: GoogleIcon,
};

// Add more icons as needed...
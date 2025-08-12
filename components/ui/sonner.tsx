"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useEffect, useState } from "react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={true}
      richColors={false}
      closeButton={true}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: `
            group toast group-[.toaster]:bg-[#0f3933] group-[.toaster]:text-white 
            group-[.toaster]:border group-[.toaster]:border-[#33998c]/30
            group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm
            group-[.toaster]:rounded-lg group-[.toaster]:min-h-[60px]
            group-[.toaster]:transition-all group-[.toaster]:duration-300
            group-[.toaster]:hover:shadow-xl group-[.toaster]:hover:scale-[1.02]
            group-[.toaster]:flex group-[.toaster]:items-center
            group-[.toaster]:gap-3 group-[.toaster]:px-4 group-[.toaster]:py-3
            data-[type=success]:bg-[#0f3933] data-[type=success]:border-[#97fce4]/40 data-[type=success]:text-white
            data-[type=error]:bg-[#0f3933] data-[type=error]:border-[#97fce4]/40 data-[type=error]:text-white
            data-[type=info]:bg-[#0f3933] data-[type=info]:border-[#97fce4]/40 data-[type=info]:text-white
            data-[type=warning]:bg-[#0f3933] data-[type=warning]:border-[#97fce4]/40 data-[type=warning]:text-white
          `,
          description: `
            group-[.toast]:text-white/80 group-[.toast]:text-sm
            group-[.toast]:leading-relaxed group-[.toast]:mt-1
            data-[type=success]:text-white/90
            data-[type=error]:text-white/90
            data-[type=info]:text-white/80
            data-[type=warning]:text-white/90
          `,
          actionButton: `
            group-[.toast]:bg-[#97fce4] group-[.toast]:text-[#02231e]
            group-[.toast]:hover:bg-[#97fce4]/90 group-[.toast]:font-medium
            group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md
            group-[.toast]:transition-colors group-[.toast]:duration-200
            group-[.toast]:text-sm
          `,
          cancelButton: `
            group-[.toast]:bg-[#193833] group-[.toast]:text-white
            group-[.toast]:hover:bg-[#193833]/80 group-[.toast]:font-medium
            group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md
            group-[.toast]:transition-colors group-[.toast]:duration-200
            group-[.toast]:text-sm group-[.toast]:border group-[.toast]:border-[#b0c5c1]/30
          `,
          closeButton: `
            group-[.toast]:bg-[#193833]/50 group-[.toast]:text-white
            group-[.toast]:hover:bg-[#193833]/80 group-[.toast]:hover:text-[#97fce4]
            group-[.toast]:border group-[.toast]:border-[#b0c5c1]/30
            group-[.toast]:hover:border-[#97fce4]/50 group-[.toast]:transition-all
            group-[.toast]:duration-200 group-[.toast]:rounded-md
            group-[.toast]:w-5 group-[.toast]:h-5 group-[.toast]:flex
            group-[.toast]:items-center group-[.toast]:justify-center
          `,
          icon: `
            group-[.toast]:text-[#97fce4] group-[.toast]:flex-shrink-0
            data-[type=success]:text-[#97fce4]
            data-[type=error]:text-[#97fce4]
            data-[type=info]:text-[#97fce4]
            data-[type=warning]:text-[#97fce4]
          `,
          content: `
            group-[.toast]:flex group-[.toast]:flex-col group-[.toast]:gap-1
            group-[.toast]:flex-1 group-[.toast]:min-w-0
          `,
          title: `
            group-[.toast]:font-semibold group-[.toast]:text-base
            group-[.toast]:leading-tight group-[.toast]:font-["Inter"]
            data-[type=success]:text-white
            data-[type=error]:text-white
            data-[type=info]:text-white
            data-[type=warning]:text-white
          `,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

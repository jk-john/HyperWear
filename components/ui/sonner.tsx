"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

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
            group toast group-[.toaster]:bg-[#0f3933] group-[.toaster]:text-[#dbfbf6] 
            group-[.toaster]:border group-[.toaster]:border-[#33998c]/30
            group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm
            group-[.toaster]:rounded-lg group-[.toaster]:min-h-[60px]
            group-[.toaster]:transition-all group-[.toaster]:duration-300
            group-[.toaster]:hover:shadow-xl group-[.toaster]:hover:scale-[1.02]
            group-[.toaster]:flex group-[.toaster]:items-center
            group-[.toaster]:gap-3 group-[.toaster]:px-4 group-[.toaster]:py-3
            data-[type=success]:bg-gradient-to-r data-[type=success]:from-[#23524c] data-[type=success]:to-[#33998c]
            data-[type=success]:border-[#97fce4]/40 data-[type=success]:text-[#edfffc]
            data-[type=error]:bg-gradient-to-r data-[type=error]:from-[#722c2c] data-[type=error]:to-[#8b3a3a]
            data-[type=error]:border-[#ff6b6b]/40 data-[type=error]:text-[#fff5f5]
            data-[type=info]:bg-gradient-to-r data-[type=info]:from-[#0f3933] data-[type=info]:to-[#193833]
            data-[type=info]:border-[#b0c5c1]/40 data-[type=info]:text-[#dbfbf6]
            data-[type=warning]:bg-gradient-to-r data-[type=warning]:from-[#8b6914] data-[type=warning]:to-[#a67c14]
            data-[type=warning]:border-[#fbbf24]/40 data-[type=warning]:text-[#fef3c7]
          `,
          description: `
            group-[.toast]:text-[#dbfbf6]/80 group-[.toast]:text-sm
            group-[.toast]:leading-relaxed group-[.toast]:mt-1
            data-[type=success]:text-[#edfffc]/90
            data-[type=error]:text-[#fff5f5]/90
            data-[type=info]:text-[#dbfbf6]/80
            data-[type=warning]:text-[#fef3c7]/90
          `,
          actionButton: `
            group-[.toast]:bg-[#97fce4] group-[.toast]:text-[#02231e]
            group-[.toast]:hover:bg-[#97fce4]/90 group-[.toast]:font-medium
            group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md
            group-[.toast]:transition-colors group-[.toast]:duration-200
            group-[.toast]:text-sm
          `,
          cancelButton: `
            group-[.toast]:bg-[#193833] group-[.toast]:text-[#b0c5c1]
            group-[.toast]:hover:bg-[#193833]/80 group-[.toast]:font-medium
            group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-md
            group-[.toast]:transition-colors group-[.toast]:duration-200
            group-[.toast]:text-sm group-[.toast]:border group-[.toast]:border-[#b0c5c1]/30
          `,
          closeButton: `
            group-[.toast]:bg-[#193833]/50 group-[.toast]:text-[#b0c5c1]
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
            data-[type=error]:text-[#ff6b6b]
            data-[type=info]:text-[#b0c5c1]
            data-[type=warning]:text-[#fbbf24]
          `,
          content: `
            group-[.toast]:flex group-[.toast]:flex-col group-[.toast]:gap-1
            group-[.toast]:flex-1 group-[.toast]:min-w-0
          `,
          title: `
            group-[.toast]:font-semibold group-[.toast]:text-base
            group-[.toast]:leading-tight group-[.toast]:font-["Inter"]
            data-[type=success]:text-[#edfffc]
            data-[type=error]:text-[#fff5f5]
            data-[type=info]:text-[#dbfbf6]
            data-[type=warning]:text-[#fef3c7]
          `,
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

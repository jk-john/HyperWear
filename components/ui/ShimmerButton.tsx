import { ShoppingBag, Sparkles } from "lucide-react";
import * as React from "react";

// Utility function
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Shimmer Button Component
interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#97fce4",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "linear-gradient(135deg, #0f3933 0%, #23524c 100%)",
      className,
      children = "Shop Now",
      ...props
    },
    ref,
  ) => {
    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @keyframes shimmer-slide {
              to {
                transform: translate(calc(100cqw - 100%), 0);
              }
            }
            @keyframes spin-around {
              0% {
                transform: translateZ(0) rotate(0);
              }
              15%, 35% {
                transform: translateZ(0) rotate(90deg);
              }
              65%, 85% {
                transform: translateZ(0) rotate(270deg);
              }
              100% {
                transform: translateZ(0) rotate(360deg);
              }
            }
            .animate-shimmer-slide {
              animation: shimmer-slide var(--speed) ease-in-out infinite alternate;
            }
            .animate-spin-around {
              animation: spin-around calc(var(--speed) * 2) infinite linear;
            }
          `,
          }}
        />
        <button
          style={
            {
              "--spread": "90deg",
              "--shimmer-color": shimmerColor,
              "--radius": borderRadius,
              "--speed": shimmerDuration,
              "--cut": shimmerSize,
              "--bg": background,
            } as React.CSSProperties
          }
          className={cn(
            "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-white/10 px-4 py-2 text-base font-bold whitespace-nowrap text-white [background:var(--bg)]",
            "transform-gpu transition-transform duration-300 ease-in-out hover:scale-105 active:translate-y-px",
            className,
          )}
          ref={ref}
          {...props}
        >
          <div
            className={cn(
              "-z-30 blur-[2px]",
              "[container-type:size] absolute inset-0 overflow-visible",
            )}
          >
            <div className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
              <div className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
            </div>
          </div>
          <ShoppingBag className="mr-2 h-5 w-5" />
          {children}
          <Sparkles className="ml-2 h-4 w-4" />
          <div
            className={cn(
              "insert-0 absolute size-full",
              "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",
              "transform-gpu transition-all duration-300 ease-in-out",
              "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",
              "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]",
            )}
          />
          <div
            className={cn(
              "absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]",
            )}
          />
        </button>
      </>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;

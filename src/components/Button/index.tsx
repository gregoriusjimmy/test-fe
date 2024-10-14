import { ComponentPropsWithRef, forwardRef } from "react";
import { cva } from "class-variance-authority";

import cn from "lib/cn";

export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  color?: "foreground";
  isLoading?: boolean;
}

const buttonVariants = cva(
  "px-4 py-2.5 rounded-lg text-center transition-all text-base inline-flex justify-center items-center",
  {
    variants: {
      color: {
        foreground:
          "bg-background-8 text-foreground-100 border-background-500 border",
      },
      isLoading: {
        true: "cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      color: "foreground",
    },
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, color = "foreground", isLoading = false, className, ...rest },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ color, isLoading }), className)}
        disabled={isLoading}
        {...rest}
      >
        {isLoading ? <span className="loader animate-spin" /> : null}
        <span
          className={cn("flex w-full h-full items-center justify-center", {
            invisible: isLoading,
          })}
        >
          {children}
        </span>
      </button>
    );
  }
);

export default Button;

import classNames from "classnames";
import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "inverted"; // Default solid
  size?: "small" | "medium" | "large"; // Default medium
};

export const Button = ({
  variant = "solid",
  size = "medium",
  className,
  ...props
}: ButtonProps) => {
  const styles = classNames({
    // Universal button styles
    "box-border rounded-md focus:outline-none focus:ring-1 focus:ring-blue focus:ring-opacity-50": true,

    // Variant styles
    "bg-blue hover:bg-blue-light active:bg-blue-dark text-white disabled:opacity-50":
      variant === "solid",
    "bg-transparent active:bg-blue text-blue active:text-white border border-blue hover:border-2":
      variant === "inverted",

    // Size styles
    "h-14 w-41": size === "medium",
    "h-9 w-41": size === "small",
    "h-16 w-86": size === "large",

    // Override styles
    [`${className}`]: true,
  });

  return <button className={styles} {...props} />;
};

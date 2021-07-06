import classNames from "classnames";
import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "inverted"; // Default solid
  size?: "small" | "medium" | "large" | "auto"; // Default medium
};

const Button = ({
  variant = "solid",
  size = "medium",
  className,
  ...props
}: ButtonProps) => {
  const styles = classNames({
    // Universal button styles
    ["box-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-50 duration-75 \
      disabled:cursor-not-allowed shadow-md active:shadow-none whitespace-nowrap"]:
      true,

    // Variant styles
    ["bg-primary text-white \
      hover:bg-secondary \
      active:bg-white active:text-primary active:border active:border-primary \
      disabled:bg-inactive"]:
      variant === "solid",

    ["bg-white text-black border border-black \
      hover:ring-primary hover:bg-tertiary \
      active:bg-primary active:text-white \
      disabled:text-inactive disabled:border disabled:border-inactive disabled:bg-white \
      focus:ring-opacity-100"]:
      variant === "inverted",

    // Size styles
    "h-14 w-41": size === "medium",
    "h-9 w-41": size === "small",
    "h-16 w-86": size === "large",
    "": size === "auto",

    // Override styles
    [`${className}`]: true,
  });

  return <button className={styles} {...props} />;
};

export default Button;

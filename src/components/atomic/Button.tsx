import classNames from "classnames";
import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "inverted"; // Default solid
  size?: "small" | "medium" | "large"; // Default medium
};

const Button = ({
  variant = "solid",
  size = "medium",
  className,
  ...props
}: ButtonProps) => {
  const styles = classNames({
    // Universal button styles
    [`${classNames(
      "box-border rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:ring-opacity-50 duration-75",
      "disabled:cursor-not-allowed"
    )}`]: true,

    // Variant styles
    [`${classNames(
      "bg-primary text-white",
      "hover:bg-secondary",
      "active:bg-white active:text-primary active:border active:border-primary",
      "disabled:bg-inactive"
    )}`]: variant === "solid",

    [`${classNames(
      "bg-white text-black border border-black",
      "hover:ring-primary hover:font-bold",
      "active:bg-primary active:text-white",
      "disabled:text-inactive disabled:border disabled:border-inactive ",
      "focus:ring-opacity-100"
    )}`]: variant === "inverted",

    // Size styles
    "h-14 w-41": size === "medium",
    "h-9 w-41": size === "small",
    "h-16 w-86": size === "large",

    // Override styles
    [`${className}`]: true,
  });

  return <button className={styles} {...props} />;
};

export default Button;

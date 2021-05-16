import React, { InputHTMLAttributes } from "react";
import classNames from "classnames"

type InputProps = { 
    className?: string,
    width?: string, 
    padding?: string 
} & InputHTMLAttributes<HTMLInputElement>;

//TODO: Implement color depending on theme
export const Input = ( {className = "", ...props} : InputProps) => {
    const styles = classNames({
        "rounded-md p-3 placeholder-gray-dark border-1.5 border-gray-light focus:border-black-light focus:outline-none focus:shadow-border": true,
        [`${className}`]: true,
    })
    return (
        <input {...props} className={styles} />
    )
}
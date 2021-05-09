import React, { InputHTMLAttributes } from "react";
import classNames from "classnames"
/**
 * SINGLE-LINE INPUT
 * 
 * Props:
 * - width
 * - height
 * - padding
 * 
 * Return:
 * div
 */

type LineInputProps = { 
    className?: string,
    width?: string, 
    padding?: string 
} & InputHTMLAttributes<HTMLInputElement>;

//TODO: Implement color depending on theme
export const LineInput: React.FC<LineInputProps> = ( {className = "", width = "w-auto", padding = "px-2 py-2", ...args} : LineInputProps) => {
    const styles = classNames({
        [`rounded-md placeholder-dark-gray-500 border border-light-gray-500 focus:outline-none focus:ring-gray-500 focus:blur-sm ${width} ${padding}`]: true,
        [`${className}`]: true,
    })
    return (
        <input {...args} className={styles} />
    )
}
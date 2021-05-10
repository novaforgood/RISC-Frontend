import React, {HTMLAttributes} from "react";
import classNames from "classnames";

type CardProps = HTMLAttributes<HTMLDivElement>;

//TODO: Implement color for background depending on themes?
export const Card = ({children, className, ...props} : CardProps) => {
    //You can override width, height, and padding like this.
    const styles = classNames({
        "bg-white shadow-md rounded-md border border-gray-light": true,
        [`${className}`]: true
    })
    return (
        <div {...props} className={styles}>{children}</div>
    )
}
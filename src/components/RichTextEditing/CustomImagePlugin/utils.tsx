import classNames from "classnames";
import { HTMLProps, useEffect, useRef, useState, MouseEvent } from "react";

type ResizeSquareProps = HTMLProps<HTMLDivElement> & {
  cursor: string;
};

const ResizeSquare = ({ cursor, ...props }: ResizeSquareProps) => {
  const styles = classNames({
    "bg-skyblue border border-white h-2 w-2 absolute": true,
    "cursor-s-resize": cursor === "s-resize",
    "cursor-w-resize": cursor === "w-resize",
    "cursor-se-resize": cursor === "se-resize",
    "cursor-sw-resize": cursor === "sw-resize",
  });
  return <div {...props} className={styles} />;
};

export const ResizeBorder = ({
  className,
  children,
  ...props
}: HTMLProps<HTMLDivElement>) => {
  /**
   * For any coordinate plane, you can transform coordinates using a matrix:
   *
   * Consider the point (x,y) and constants a, b, c, d, e, & f
   *
   * CSS- transform: matrix(a,b,c,d,e,f) gives us
   *
   *  | a c e |   | x |   | ax + cy + e |
   *  | b d f | * | y | = | bx + dy + f |
   *  | 0 0 1 |   | 1 |   | 0  + 0  + 1 |
   *
   * Common Transforms:
   *
   * Translation
   *  | 1 0 tx |
   *  | 0 1 ty |
   *  | 0 0 1  |
   *
   * Scale
   *  | x 0 0 |
   *  | 0 y 0 |
   *  | 0 0 1 |
   *
   * Rotation Counter-Clockwise (Clockwise just means a negative angle)
   *  | cos(theta) -sin(theta) 0 |
   *  | sin(theta) cos(theta)  0 |
   *  | 0          0           1 |
   *
   * Rotation Clockwise
   *  | cos(theta) sin(theta)  0 |
   *  | -sin(theta) cos(theta) 0 |
   *  | 0          0           1 |
   */

  const [transform, setTransform] = useState({
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0,
  });
  const containerRef = useRef<HTMLImageElement | null>(null);

  const styles = classNames({
    "border-4 border-skyblue": true,
    [`${className}`]: className,
  });

  const resize = (e: MouseEvent) => {
    const xStart = e.nativeEvent.offsetX;
    const yStart = e.nativeEvent.offsetY;
    console.log(xStart, yStart);
  };
  // const clickedOutside = (e: MouseEvent) => {
  //   if (
  //     containerRef.current &&
  //     !containerRef.current?.contains(e.target as Node)
  //   ) {
  //     containerRef.current.style.border = "none";
  //     containerRef.current.style.cursor = "default";
  //   }
  //   document.removeEventListener("click", clickedOutside);
  // };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `matrix(${transform.a},${transform.b},${transform.c},${transform.d},${transform.e},${transform.f})`;
    }
  }, [containerRef]);

  return (
    <div id="resize-container" {...props}>
      <ResizeSquare id="top-left" cursor="se-resize" onClick={resize} />
      <ResizeSquare id="top" cursor="s-resize" />
      <ResizeSquare id="top-right" cursor="sw-resize" />
      <ResizeSquare id="left" cursor="w-resize" />
      <div className={styles}>
        <img
          ref={containerRef}
          src="https://www.pockettactics.com/wp-content/uploads/2021/03/genshin-impact-tartaglia-1.jpg"
        />
      </div>
      <ResizeSquare id="right" cursor="w-resize" />
      <ResizeSquare id="bottom-left" cursor="sw-resize" />
      <ResizeSquare id="bottom" cursor="s-resize" />
      <ResizeSquare id="bottom-right" cursor="se-resize" />
    </div>
  );
};

import classNames from "classnames";
import React, {
  HTMLProps,
  useEffect,
  useRef,
  useState,
  HTMLAttributes,
} from "react";

type ResizeSquareProps = HTMLAttributes<HTMLDivElement> & {
  cursor: string;
};

//Small Squares besides an image
const ResizeSquare = ({ cursor, ...props }: ResizeSquareProps) => {
  const styles = classNames({
    "bg-skyblue border border-white h-3.5 w-3.5 absolute z-10": true,
    "cursor-s-resize": cursor === "s-resize",
    "cursor-w-resize": cursor === "w-resize",
    "cursor-se-resize": cursor === "se-resize",
    "cursor-sw-resize": cursor === "sw-resize",
  });
  return <div {...props} className={styles} />;
};

//Allows the children of this component to be resized
export default React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    //Used for storing original proportions
    const [size, setSize] = useState({
      width: 0,
      height: 0,
      ratio: 1,
      horizontal: true,
    });
    //Use to get offset
    const [adjustedSize, setAdjustedSize] = useState({
      halfHorizontal: 0,
      fullHorizontal: 0,
      halfVertical: 0,
      fullVertical: 0,
    });
    //Controls whether the edit tools are on
    const [edit, setEdit] = useState(false);
    const childRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const styles = classNames({
      [`box-border transform border-4 border-skyblue h-full w-full pointer-events-none select-none`]:
        true,
      [`${className}`]: className,
    });

    //TODO: Vertical boxes scaling (Can only scale horizontally & diagonally right now)
    const resize = (e_click: MouseEvent, left: boolean) => {
      const mousemove = (e_move: MouseEvent) => {
        const container = containerRef.current;
        if (container) {
          //If the resizing is on a left resize box, invert the difference
          const xDif = left
            ? e_click.pageX - e_move.pageX
            : e_move.pageX - e_click.pageX;
          container.style.width = `${adjustedSize.fullHorizontal + xDif}px`;

          /*
          The outside container will go past the max width / max height at this point, 
          we need to get the coordinates for the new size immediately

          We take the size of the child component which is contrained to 
          these max width/ max height values
        */
          if (childRef.current) {
            getBounds(childRef.current);
          }
        }
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", function mouseup() {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      });
    };

    //Helper function to get the offset for the resize boxes
    //Can be separated from the return values for performance
    const getBounds = (ref: HTMLDivElement | null) => {
      if (ref == null)
        return { width: 0, height: 0, ratio: 1, horizontal: true };
      const dimensions = ref.getBoundingClientRect();
      const width = dimensions.width;
      const height = dimensions.height;
      setAdjustedSize({
        halfHorizontal: width / 2,
        halfVertical: height / 2,
        fullHorizontal: width,
        fullVertical: height,
      });
      return {
        width,
        height,
        ratio: width == 0 ? 1 : height / width,
        horizontal: width > height,
      };
    };

    useEffect(() => {}, []);

    //When the window changes sizes, we need to reset the offset of the resize boxes
    //TODO: Figure out why initial size pulls return a height and width of 0
    useEffect(() => {
      const refObj = childRef.current;
      const container = containerRef.current;
      if (refObj && container) {
        const initialBounds = () => getBounds(refObj);
        refObj.firstChild?.addEventListener("load", () => {
          const props = initialBounds();
          console.log(props);
          container.style.minWidth = `${20 / props.ratio}vh`;
          container.style.maxWidth = `${65 / props.ratio}vh`;
          container.style.minHeight = `20vh`;
          container.style.maxHeight = `65vh`;
          setSize(props);
        });
        window.addEventListener("resize", initialBounds);

        return () => {
          window.removeEventListener("resize", initialBounds);
        };
      }
    }, []);

    //TODO: Determine suitable minimum and maximum width
    //TODO: Picture alignment
    //TODO: Make size consistent when in and out of edit mode
    return (
      <div
        ref={ref}
        tabIndex={0}
        className="border-box w-max h-max select-none m-auto"
        {...props}
        onClick={() => setEdit(true)}
        onBlur={() => setEdit(false)}
      >
        <div className="border-box w-max h-max" ref={containerRef}>
          {edit ? (
            <>
              <ResizeSquare
                id="top-left"
                cursor="se-resize"
                style={{
                  transform: `translate(-6px,-6px)`,
                }}
                onMouseDown={(e: MouseEvent) => resize(e, true)}
              />
              <ResizeSquare
                id="top"
                cursor="s-resize"
                style={{
                  transform: `translate(${adjustedSize.halfHorizontal}px,-6px)`,
                }}
                onMouseDown={resize}
              />
              <ResizeSquare
                id="top-right"
                cursor="sw-resize"
                style={{
                  transform: `translate(${adjustedSize.fullHorizontal}px,-6px)`,
                }}
                onMouseDown={resize}
              />
              <ResizeSquare
                id="left"
                cursor="w-resize"
                style={{
                  transform: `translate(-6px,${adjustedSize.halfVertical}px)`,
                }}
                onMouseDown={(e: MouseEvent) => resize(e, true)}
              />
              <ResizeSquare
                id="right"
                cursor="w-resize"
                style={{
                  transform: `translate(${adjustedSize.fullHorizontal}px,${adjustedSize.halfVertical}px)`,
                }}
                onMouseDown={resize}
              />
              <div ref={childRef} className={styles}>
                {children}
              </div>
              <ResizeSquare
                id="bottom-left"
                cursor="sw-resize"
                style={{
                  transform: `translate(-6px,-6px)`,
                }}
                onMouseDown={(e: MouseEvent) => resize(e, true)}
              />
              <ResizeSquare
                id="bottom"
                cursor="s-resize"
                style={{
                  transform: `translate(${adjustedSize.halfHorizontal}px,-6px)`,
                }}
                onMouseDown={resize}
              />
              <ResizeSquare
                id="bottom-right"
                cursor="se-resize"
                style={{
                  transform: `translate(${adjustedSize.fullHorizontal}px,-6px)`,
                }}
                onMouseDown={resize}
              />
            </>
          ) : (
            <div className="box-border h-full w-full" ref={childRef}>
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
);

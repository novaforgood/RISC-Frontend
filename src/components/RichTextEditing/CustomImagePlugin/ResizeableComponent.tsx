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

//Small Squares beside an image
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

    //Helper function to get the offset for the resize boxes
    //Can be separated from the return values for performance
    const getBounds = () => {
      const ref = containerRef.current;
      if (!ref)
        return {
          width: 0,
          height: 0,
          ratio: 1,
          horizontal: true,
        };
      const width = ref.clientWidth;
      const height = ref.clientHeight;
      setAdjustedSize({
        halfHorizontal: width / 2,
        halfVertical: height / 2,
        fullHorizontal: width,
        fullVertical: height,
      });
      return {
        width,
        height,
        ratio: height == 0 ? 1 : width / height,
        horizontal: width > height,
      };
    };

    const setBounds = () => {
      const container = containerRef.current;
      if (container) {
        if (size.horizontal) {
          container.style.minWidth = `20%`;
          container.style.maxWidth = `90%`;
        } else {
          container.style.minWidth = `${20 * size.ratio}vh`;
          container.style.maxWidth = `${65 * size.ratio}vh`;
          container.style.minHeight = `20vh`;
          container.style.maxHeight = `70vh`;
        }
      }
    };

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

          We take the size of the child component which is constrained to 
          these max width/ max height values
        */
          getBounds();
        }
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", function mouseup() {
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
      });
    };

    //For the initial load, we want the size of the container
    useEffect(() => {
      const child = childRef.current;
      if (child) {
        child.firstChild?.addEventListener("load", async () => {
          const props = getBounds();
          await setSize(props);
          setBounds();
          console.log(size);
        });
      }
    }, []);

    useEffect(() => {
      if (edit) {
        getBounds();
      }
    }, [edit]);

    //TODO: Determine suitable minimum and maximum width
    //TODO: Picture alignment
    //TODO: Make size consistent when in and out of edit mode
    return (
      <div className="max-w-full select-none" {...props}>
        <div className="w-max h-max max-w-full m-auto" ref={containerRef}>
          <div
            ref={ref}
            tabIndex={0}
            className="w-max h-max max-w-full"
            onClick={() => setEdit(true)}
            onBlur={() => setEdit(false)}
          >
            {edit ? (
              <>
                <ResizeSquare
                  id="top-left"
                  cursor="se-resize"
                  style={{
                    transform: `translate(-8px,-8px)`,
                  }}
                  onMouseDown={(e: MouseEvent) => resize(e, true)}
                />
                <ResizeSquare
                  id="top"
                  cursor="s-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.halfHorizontal - 6
                    }px,-8px)`,
                  }}
                  onMouseDown={resize}
                />
                <ResizeSquare
                  id="top-right"
                  cursor="sw-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.fullHorizontal - 6
                    }px,-8px)`,
                  }}
                  onMouseDown={resize}
                />
                <ResizeSquare
                  id="left"
                  cursor="w-resize"
                  style={{
                    transform: `translate(-8px,${
                      adjustedSize.halfVertical - 6
                    }px)`,
                  }}
                  onMouseDown={(e: MouseEvent) => resize(e, true)}
                />
                <ResizeSquare
                  id="right"
                  cursor="w-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.fullHorizontal - 6
                    }px,${adjustedSize.halfVertical - 6}px)`,
                  }}
                  onMouseDown={resize}
                />
                <div
                  ref={childRef}
                  className="border-4 border-skyblue h-full w-full pointer-events-none select-none"
                >
                  {children}
                </div>
                <ResizeSquare
                  id="bottom-left"
                  cursor="sw-resize"
                  style={{
                    transform: `translate(-8px,-8px)`,
                  }}
                  onMouseDown={(e: MouseEvent) => resize(e, true)}
                />
                <ResizeSquare
                  id="bottom"
                  cursor="s-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.halfHorizontal - 6
                    }px,-8px)`,
                  }}
                  onMouseDown={resize}
                />
                <ResizeSquare
                  id="bottom-right"
                  cursor="se-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.fullHorizontal - 6
                    }px,-8px)`,
                  }}
                  onMouseDown={resize}
                />
              </>
            ) : (
              <div className="h-full w-full" ref={childRef}>
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

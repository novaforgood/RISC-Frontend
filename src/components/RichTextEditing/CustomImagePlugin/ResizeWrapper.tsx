import classNames from "classnames";
import React, {
  HTMLProps,
  useEffect,
  useRef,
  useState,
  HTMLAttributes,
} from "react";

//Determines micro-movement of the resize squares
const OFFSET = -6;

enum Direction {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

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

type ResizeWrapperProps = HTMLProps<HTMLDivElement> & {
  difference: number;
  mergeData: (newContent: Object) => void;
};

//Allows the children of this component to be resized
export default React.forwardRef<HTMLDivElement, ResizeWrapperProps>(
  ({ className, children, mergeData, difference, ...props }, ref) => {
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
    const resize = (
      e_click: React.MouseEvent<HTMLDivElement>,
      direction: Direction
    ) => {
      const mousemove = (e_move: MouseEvent) => {
        const container = containerRef.current;
        if (container) {
          //If the resizing is on a direction resize box, invert the difference
          let dif = 0;
          switch (direction) {
            case Direction.LEFT:
              dif = e_click.pageX - e_move.pageX;
              break;
            case Direction.RIGHT:
              dif = e_move.pageX - e_click.pageX;
              break;
            case Direction.TOP:
              dif = e_click.pageY - e_move.pageY;
              break;
            case Direction.BOTTOM:
              dif = e_move.pageY - e_click.pageY;
              break;
          }
          container.style.width = `${adjustedSize.fullHorizontal + dif}px`;

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
        mergeData({ difference: adjustedSize.fullHorizontal - size.width });
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
          mergeData({ width: props.width, height: props.height });
          setBounds();
          if (difference) {
            const width = props.width + difference;
            const height = props.height + difference;
            setAdjustedSize({
              halfHorizontal: width / 2,
              halfVertical: height / 2,
              fullHorizontal: width,
              fullVertical: height,
            });
          }
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
                    transform: `translate(${OFFSET}px,${OFFSET}px)`,
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                    resize(e, Direction.LEFT)
                  }
                />
                <ResizeSquare
                  id="top"
                  cursor="s-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.halfHorizontal + OFFSET
                    }px,${OFFSET}px)`,
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                    resize(e, Direction.TOP)
                  }
                />
                <ResizeSquare
                  id="top-right"
                  cursor="sw-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.fullHorizontal + OFFSET
                    }px,${OFFSET}px)`,
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                    resize(e, Direction.RIGHT)
                  }
                />
                <ResizeSquare
                  id="direction"
                  cursor="w-resize"
                  style={{
                    transform: `translate(${OFFSET}px,${
                      adjustedSize.halfVertical + OFFSET
                    }px)`,
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                    resize(e, Direction.LEFT)
                  }
                />
                <ResizeSquare
                  id="right"
                  cursor="w-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.fullHorizontal + OFFSET
                    }px,${adjustedSize.halfVertical + OFFSET}px)`,
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                    resize(e, Direction.RIGHT)
                  }
                />
                <div
                  ref={childRef}
                  className="border-4 border-skyblue h-full w-full pointer-events-none select-none"
                >
                  {children}
                </div>
                <ResizeSquare
                  id="bottom-direction"
                  cursor="sw-resize"
                  style={{
                    transform: `translate(${OFFSET}px,${OFFSET}px)`,
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                    resize(e, Direction.LEFT)
                  }
                />
                <ResizeSquare
                  id="bottom"
                  cursor="s-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.halfHorizontal + OFFSET
                    }px,${OFFSET}px)`,
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                    resize(e, Direction.BOTTOM)
                  }
                />
                <ResizeSquare
                  id="bottom-right"
                  cursor="se-resize"
                  style={{
                    transform: `translate(${
                      adjustedSize.fullHorizontal + OFFSET
                    }px,${OFFSET}px)`,
                  }}
                  onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                    resize(e, Direction.RIGHT)
                  }
                />
              </>
            ) : (
              <div
                className="border-4 border-white h-full w-full"
                ref={childRef}
              >
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

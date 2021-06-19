import React, { HTMLAttributes, ReactElement } from "react";
import classNames from "classnames";
import { ContentBlock, ContentState } from "draft-js";
import { ImagePluginTheme } from "../CustomImagePlugin";
import ResizeWrapper from "./ResizeWrapper";

export interface ImageProps extends HTMLAttributes<HTMLDivElement> {
  block: ContentBlock;
  className?: string;
  theme?: ImagePluginTheme;
  contentState: ContentState;
  readonly: boolean | undefined;

  //removed props
  blockStyleFn: unknown;
  blockProps: unknown;
  customStyleMap: unknown;
  customStyleFn: unknown;
  decorator: unknown;
  forceSelection: unknown;
  offsetKey: unknown;
  selection: unknown;
  tree: unknown;
  preventScroll: unknown;
}

export default React.forwardRef<HTMLDivElement, ImageProps>(
  (props, ref): ReactElement => {
    const {
      block,
      className,
      theme = {},
      readonly,
      contentState,
      ...otherProps
    } = props;
    // leveraging destructuring to omit certain properties from props
    const {
      blockProps, // eslint-disable-line @typescript-eslint/no-unused-vars
      customStyleMap, // eslint-disable-line @typescript-eslint/no-unused-vars
      customStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
      decorator, // eslint-disable-line @typescript-eslint/no-unused-vars
      forceSelection, // eslint-disable-line @typescript-eslint/no-unused-vars
      offsetKey, // eslint-disable-line @typescript-eslint/no-unused-vars
      selection, // eslint-disable-line @typescript-eslint/no-unused-vars
      tree, // eslint-disable-line @typescript-eslint/no-unused-vars
      blockStyleFn, // eslint-disable-line @typescript-eslint/no-unused-vars
      preventScroll, // eslint-disable-line @typescript-eslint/no-unused-vars
      style,
      ...elementProps
    } = otherProps;
    const combinedClassName = classNames(
      theme.image,
      className,
      readonly ? "m-auto" : "h-full w-full"
    );
    // const [extraData, setExtraData] = useState(
    //   contentState.getEntity(block.getEntityAt(0)).getData()
    // );
    const {
      src,
      alt,
      width,
      height,
      difference = 0,
    } = contentState.getEntity(block.getEntityAt(0)).getData();
    const entityKey = block.getEntityAt(0);

    const mergeData = (data: Object) => {
      contentState.mergeEntityData(entityKey, data);
    };

    return readonly ? (
      <img
        className={combinedClassName}
        src={src}
        alt={alt}
        style={{
          width: `${width + difference}px`,
          height: `${height + difference}px`,
        }}
      />
    ) : (
      <ResizeWrapper
        ref={ref}
        mergeData={mergeData}
        width={width + difference}
        height={height + difference}
        difference={difference}
        {...elementProps}
      >
        <img src={src} alt={alt} className={combinedClassName} />
      </ResizeWrapper>
    );
  }
);

import React, { HTMLAttributes, ReactElement } from "react";
import classNames from "classnames";
import { ContentBlock, ContentState } from "draft-js";
import { ImagePluginTheme } from "../CustomImagePlugin";
import ResizeWrapper from "./ResizeableComponent";

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
  /**This forwarded ref returns null: need to figure out why */
  (props, ref): ReactElement => {
    const { block, className, theme = {}, readonly, ...otherProps } = props;
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
      contentState,
      style,
      ...elementProps
    } = otherProps;
    const combinedClassName = classNames(
      theme.image,
      className,
      readonly ? "m-auto" : "h-full w-full"
    );
    const {
      src,
      alt,
      width,
      height,
      difference = 0,
      entityKey,
    } = contentState.getEntity(block.getEntityAt(0)).getData();

    const mergeData = (newData: { [key: string]: any }) => {
      contentState.mergeEntityData(entityKey, newData);
    };
    console.log(readonly);
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
        difference={difference}
        {...elementProps}
      >
        <img src={src} alt={alt} className={combinedClassName} />
      </ResizeWrapper>
    );
  }
);

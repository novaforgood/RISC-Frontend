import React, { ImgHTMLAttributes, ComponentType, ReactElement } from "react";
import {
  EditorState,
  AtomicBlockUtils,
  ContentBlock,
  ContentState,
} from "draft-js";
import classNames from "classnames";
import { EditorPlugin } from "@draft-js-plugins/editor";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  block: ContentBlock;
  className?: string;
  theme?: ImagePluginTheme;
  contentState: ContentState;

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

export interface ImagePluginTheme {
  image?: string;
}

export interface ImagePluginConfig {
  decorator?(component: ComponentType<ImageProps>): ComponentType<ImageProps>;
  theme?: ImagePluginTheme;
  imageComponent?: ComponentType<ImageProps>;
}

let imgProps: ImgHTMLAttributes<HTMLImageElement> | undefined = undefined;

const addImage = (
  editorState: EditorState,
  url: string,
  extraData: ImgHTMLAttributes<HTMLImageElement>
): EditorState => {
  const urlType = "IMAGE";
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    urlType,
    "IMMUTABLE",
    { src: url }
  );
  imgProps = extraData;
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    " "
  );
  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
};

export type ImageEditorPlugin = EditorPlugin & {
  addImage: typeof addImage;
};

const defaultTheme: ImagePluginTheme = {};

const ImageComponent = React.forwardRef<HTMLImageElement, ImageProps>(
  (props, ref): ReactElement => {
    const { block, className, theme = {}, ...otherProps } = props;
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
      imgProps?.className
    );
    const { src } = contentState.getEntity(block.getEntityAt(0)).getData();
    return (
      <img
        {...elementProps}
        {...imgProps}
        ref={ref}
        src={src}
        style={{
          minWidth: "30%",
          minHeight: "30%",
          margin: "0 auto",
          objectFit: "cover",
          ...style,
        }}
        role="presentation"
        className={combinedClassName}
      />
    );
  }
);

const createImagePlugin = (
  config: ImagePluginConfig = {}
): ImageEditorPlugin => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Image = config.imageComponent || ImageComponent;
  if (config.decorator) {
    Image = config.decorator(Image);
  }
  const ThemedImage = (props: ImageProps): ReactElement => (
    <Image {...props} theme={theme} />
  );
  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === "atomic") {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === "IMAGE" || type === "image") {
          return {
            component: ThemedImage,
            editable: false,
          };
        }
        return null;
      }

      return null;
    },
    addImage,
  };
};

export default createImagePlugin;

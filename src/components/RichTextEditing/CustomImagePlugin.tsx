import React, {
  ImgHTMLAttributes,
  ComponentType,
  ReactElement,
  useEffect,
  useRef,
} from "react";
import {
  EditorState,
  AtomicBlockUtils,
  ContentBlock,
  ContentState,
} from "draft-js";
import classNames from "classnames";
import { EditorPlugin } from "@draft-js-plugins/editor";

/**
 * THIS IS AN EDIT OF THE CODE FOUND AT https://github.com/draft-js-plugins/draft-js-plugins/tree/f4b5e696ed1c8354d98ac53bc58372486589cf83/packages/image
 *
 * Rights reserved by the MIT License; Code creation by Facebook
 */

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
    { src: url, ...extraData }
  );
  imgProps = extraData;
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  contentState.mergeEntityData(entityKey, { entityKey: entityKey });
  console.log(entityKey);
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
  /**This forwarded ref returns null: need to figure out why */
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
    const { src, entityKey } = contentState
      .getEntity(block.getEntityAt(0))
      .getData();
    const imageRef = useRef<HTMLImageElement | null>(null);

    const clickedOutside = (e: MouseEvent) => {
      if (imageRef.current && !imageRef.current?.contains(e.target as Node)) {
        imageRef.current.style.border = "none";
        imageRef.current.style.cursor = "default";
      }
      document.removeEventListener("click", clickedOutside);
    };

    const resize = () => {
      if (!imageRef.current) return;
      imageRef.current.focus();
      imageRef.current.style.border = "1px solid #707070";
      imageRef.current.style.cursor = "col-resize";
      document.addEventListener("click", clickedOutside);
      imageRef.current.onmousedown = (e_mousedown: MouseEvent) => {
        const start_x = e_mousedown.clientX;
        console.log(entityKey);
        if (!imageRef.current) return;
        const imgProperties = imageRef.current.getBoundingClientRect();
        const originalWidth = imgProperties.width;
        const move = (e_mousemove: MouseEvent) => {
          const dif = (e_mousemove.clientX - start_x) / 100;
          if (!imageRef.current) return;
          imageRef.current.style.width = `calc(${originalWidth} * ${dif}%)`;
        };
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", function up() {
          if (entityKey)
            contentState.mergeEntityData(entityKey, {
              width: imageRef.current?.style.width,
            });
          document.removeEventListener("mouseup", up);
          document.removeEventListener("mousemove", move);
        });
      };
    };

    useEffect(() => {
      if (!imageRef.current) return;
      imageRef.current.ondragstart = () => false;
      imageRef.current.onclick = resize;
      return () => {
        document.removeEventListener("click", clickedOutside);
      };
    }, [imageRef]);

    return (
      <img
        onClick={resize}
        {...elementProps}
        {...imgProps}
        ref={imageRef}
        src={src}
        style={{
          minWidth: "25vw",
          maxWidth: "80vw",
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

import React, { ComponentType, ReactElement } from "react";
import { EditorPlugin } from "@draft-js-plugins/editor";
import addImage from "./addImage";
import ImageComponent, { ImageProps } from "./Image";

/**
 * THIS IS AN EDIT OF THE CODE FOUND AT https://github.com/draft-js-plugins/draft-js-plugins/tree/f4b5e696ed1c8354d98ac53bc58372486589cf83/packages/image
 *
 * Rights reserved by the MIT License; Code creation by Facebook
 */

export interface ImagePluginTheme {
  image?: string;
}

const defaultTheme: ImagePluginTheme = {};

export interface ImagePluginConfig {
  decorator?(component: ComponentType<ImageProps>): ComponentType<ImageProps>;
  theme?: ImagePluginTheme;
  imageComponent?: ComponentType<ImageProps>;
  readonly?: boolean;
}

export type ImageEditorPlugin = EditorPlugin & {
  addImage: typeof addImage;
};

const ImagePlugin = (config: ImagePluginConfig = {}): ImageEditorPlugin => {
  const theme = config.theme ? config.theme : defaultTheme;
  let Image = config.imageComponent || ImageComponent;
  if (config.decorator) {
    Image = config.decorator(Image);
  }
  const ThemedImage = (props: ImageProps): ReactElement => (
    <Image {...props} readonly={config.readonly} theme={theme} />
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

export const Image = ImageComponent;

export default ImagePlugin;

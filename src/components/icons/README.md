# Adding Icons

Whenever adding icons to this folder for use throughout the application, follow these steps:

1. Add the icon `.svg` file into this folder.
2. Change `width` and `height` both to `100%`. This ensures that you can set the size of the icon using `classname="h-x w-y"`.
3. Replace all the customizeable colors in the icon with `currentColor`. For example, `stroke="black" -> stroke="currentColor"`. This ensures that the icon color can be modified using the `color` attribute.
4. Add a line in `index.ts` to export the icon.

Caveats:

- Try to keep the viewport of your icon equal dimensions so the icon does not get distorted due to step 2 above.

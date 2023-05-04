import { Image } from "@fluentui/react-components";

import { TeamsFxContext } from "../internal/context";

/**
 * This function takes a themeImageMap object as input and returns a JSX.Element.
 * The JSX.Element is an Image component that displays an image based on the current theme.
 * If the current theme is not found in the themeImageMap object, the default image is displayed.
 *
 * @param themeImageMap An object that maps theme names to image URLs.
 * @returns A JSX.Element that displays an image based on the current theme.
 */
export function getImageByTheme(themeImageMap: Record<string, string>): JSX.Element {
  return (
    <TeamsFxContext.Consumer>
      {({ themeString }) => (
        <Image width="20px" src={themeImageMap[themeString] ?? themeImageMap.default} />
      )}
    </TeamsFxContext.Consumer>
  );
}

import "../styles/Common.css";

import { Image } from "@fluentui/react-components";

import { TeamsFxContext } from "../internal/context";

// This component is used to display an empty image with a theme-specific background color
export const EmptyThemeImg = (): JSX.Element => {
  // Use the TeamsFxContext to get the current theme string
  return (
    <TeamsFxContext.Consumer>
      {({ themeString }) => <Image src={`empty-${themeString}.svg`} className="empty-img" />}
    </TeamsFxContext.Consumer>
  );
};

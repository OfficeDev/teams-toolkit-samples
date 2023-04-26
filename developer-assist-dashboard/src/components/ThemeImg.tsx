import { Image } from "@fluentui/react-components";

import { TeamsFxContext } from "../internal/context";

export const EmptyThemeImg = (): JSX.Element => {
  return (
    <TeamsFxContext.Consumer>
      {({ themeString }) => <Image src={`empty-${themeString}.svg`} className="empty-img" />}
    </TeamsFxContext.Consumer>
  );
};

export function getImageByTheme(themeImageMap: Record<string, string>): JSX.Element {
  return (
    <TeamsFxContext.Consumer>
      {({ themeString }) => (
        <Image width="20px" src={themeImageMap[themeString] ?? themeImageMap.default} />
      )}
    </TeamsFxContext.Consumer>
  );
}

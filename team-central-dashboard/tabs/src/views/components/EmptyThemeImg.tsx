import { Image } from "@fluentui/react-components";

import { TeamsFxContext } from "../../internal/context";
import "../styles/Common.css";

export const EmptyThemeImg = (): JSX.Element => {
  return (
    <TeamsFxContext.Consumer>
      {({ themeString }) => <Image src={`empty-${themeString}.svg`} className="empty-img" />}
    </TeamsFxContext.Consumer>
  );
};

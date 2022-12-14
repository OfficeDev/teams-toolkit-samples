import { ReactElement } from "react";
import { Menu } from "@fluentui/react-northstar";
import "./Welcome.css";

type TabProps = {
    selectedTab: string,
    onTabChange: (selectedTab: string) => void,
    environment?: string,
}
export function SampleTabs(props: TabProps): ReactElement {
    const steps = ["tab1", "tab2", "tab3"];
    const friendlyStepsName: { [key: string]: string } = {
        tab1: "Tab 1",
        tab2: "Tab 2",
        tab3: "Tab 3",
    };
    const { selectedTab, onTabChange } = props;
    const items = steps.map((step) => {
        return {
            key: step,
            content: friendlyStepsName[step] || "",
            onClick: () => {
                onTabChange(step);
            },
        };
    });

    return (
        <div className="menu-container">
            <Menu activeIndex={steps.indexOf(selectedTab)} items={items} underlined secondary />
            <div className="sections">
                {selectedTab === "tab1" && (
                    <div>
                        <p>You selected Tab 1</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Quis recusandae quibusdam doloremque repellendus voluptatibus eaque pariatur officia perferendis deleniti,
                            quasi numquam quas veniam quos maxime iusto delectus beatae dolores iste?
                        </p>
                    </div>
                )}
                {selectedTab === "tab2" && (
                    <div>
                        <p>You selected Tab 2</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Quis recusandae quibusdam doloremque repellendus voluptatibus eaque pariatur officia perferendis deleniti,
                            quasi numquam quas veniam quos maxime iusto delectus beatae dolores iste?
                        </p>
                    </div>
                )}
                {selectedTab === "tab3" && (
                    <div>
                        <p>You selected Tab 3</p>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Quis recusandae quibusdam doloremque repellendus voluptatibus eaque pariatur officia perferendis deleniti,
                            quasi numquam quas veniam quos maxime iusto delectus beatae dolores iste?
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

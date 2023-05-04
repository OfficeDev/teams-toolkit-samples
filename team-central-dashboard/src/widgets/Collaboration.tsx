import "../styles/Collaboration.css";

import { Button, Image, Text } from "@fluentui/react-components";
import {
  ArrowRight16Filled,
  CircleSmall20Filled,
  MoreHorizontal32Regular,
  Share20Regular,
} from "@fluentui/react-icons";
import { BaseWidget, IWidgetClassNames } from "@microsoft/teamsfx-react";

import { CollaborationModel } from "../models/collaborationModel";
import { getCollaborationData } from "../services/collaborationService";

interface ICollaborationState {
  data: CollaborationModel[];
}

export class Collaboration extends BaseWidget<any, ICollaborationState> {
  async getData(): Promise<ICollaborationState> {
    return { data: getCollaborationData() };
  }

  override header(): JSX.Element | undefined {
    return (
      <div id="no-icon-header">
        <Text>Team collaborations</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  override body(): JSX.Element | undefined {
    return (
      <div className="colla-content">
        {this.state.data?.map((item: CollaborationModel) => {
          return (
            <div key={`colla-container-${item.id}`} className="collo-item">
              <Image src={item.img} shape="rounded" />
              <Text className="title">{item.title}</Text>
              <Text className="description">{item.description}</Text>
              <div>
                <Button icon={<Share20Regular />} appearance="transparent" className="share-btn" />
                <CircleSmall20Filled className="dot" />
                <Text className="time">{item.updateTime}</Text>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  override footer(): JSX.Element | undefined {
    return (
      <Button
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
      >
        View all
      </Button>
    );
  }

  override styling(): IWidgetClassNames {
    return { root: "concise-root", body: "colla-body", footer: "footer-btn" };
  }
}

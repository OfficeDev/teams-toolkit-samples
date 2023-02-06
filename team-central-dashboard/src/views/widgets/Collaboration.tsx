import "../styles/Collaboration.css";

import { Button, Image, Text } from "@fluentui/react-components";
import {
  ArrowRight16Filled,
  CircleSmall20Filled,
  MoreHorizontal32Regular,
  Share20Regular,
} from "@fluentui/react-icons";

import { CollaborationModel } from "../../models/collaborationModel";
import { getCollaborationData } from "../../services/collaborationService";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface ICollaborationState {
  data: CollaborationModel[];
}

export class Collaboration extends Widget<ICollaborationState> {
  async getData(): Promise<ICollaborationState> {
    return { data: getCollaborationData() };
  }

  protected headerContent(): JSX.Element | undefined {
    return (
      <div className={widgetStyle.headerWithoutIcon}>
        <Text className={widgetStyle.headerText}>Team collaborations</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  protected bodyContent(): JSX.Element | undefined {
    return (
      <div className="colla-body-layout">
        {this.state.data?.map((item: CollaborationModel) => {
          return (
            <div key={`colla-container-${item.id}`} className="collo-display">
              <Image key={`colla-img-${item.id}`} src={item.img} width="100%" shape="rounded" />
              <Text key={`colla-title-${item.id}`} className="colla-title">
                {item.title}
              </Text>
              <Text key={`colla-description-${item.id}`} className="colla-description">
                {item.description}
              </Text>
              <div key={`colla-footer-${item.id}`} className="footer-layout">
                <Button
                  key={`colla-share-${item.id}`}
                  icon={<Share20Regular />}
                  appearance="transparent"
                  className="share-btn"
                />
                <CircleSmall20Filled
                  key={`colla-circle-${item.id}`}
                  className="colorNeutralForeground3"
                />
                <Text key={`colla-time-${item.id}`} className="colorNeutralForeground3">
                  {item.updateTime}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  protected footerContent(): JSX.Element | undefined {
    return (
      <Button
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        className={widgetStyle.footerBtn}
        onClick={() => {}} // navigate to detailed page
      >
        View all
      </Button>
    );
  }
}

import "../styles/Common.css";
import "../styles/Document.css";

import { CSSProperties } from "react";

import { mergeStyles } from "@fluentui/react";
import {
  Button,
  Image,
  Label,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Text,
} from "@fluentui/react-components";
import {
  ArrowDownload24Regular,
  ArrowRight16Filled,
  Link24Regular,
  MoreHorizontal16Filled,
  MoreHorizontal32Regular,
} from "@fluentui/react-icons";

import { TEAMS_SVG } from "../../common/constants";
import { DocumentModel } from "../../models/documentModel";
import { getDocuments, getIconByFileType } from "../../services/documentService";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface IDocumentState {
  activeIndex: number;
  documents?: DocumentModel[];
}

export class Documents extends Widget<IDocumentState> {
  protected async getData(): Promise<IDocumentState> {
    return { documents: await getDocuments(), activeIndex: -1 };
  }

  protected headerContent(): JSX.Element | undefined {
    return (
      <div className={mergeStyles(widgetStyle.headerWithoutIcon, "header-padding")}>
        <Text className={widgetStyle.headerText}>Your documents</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  protected bodyContent(): JSX.Element | undefined {
    const hasDocument = this.state.documents?.length !== 0;
    return (
      <div className={hasDocument ? "has-doc-layout" : "no-doc-layout"}>
        {hasDocument ? (
          this.state.documents?.map((item: DocumentModel, i) => {
            return (
              <div
                key={`div-container-${item.id}`}
                className="doc-container"
                onMouseOver={() => this.mouseOver(i)}
                onMouseLeave={() => this.mouseLeave()}
              >
                {i !== 0 && <div key={`divider-${item.id}`} className="doc-divider" />}
                <div
                  key={`div-content-${item.id}`}
                  className={mergeStyles(
                    "doc-item-content",
                    i === this.state.activeIndex ? "doc-item-active" : "doc-item-non-active"
                  )}
                >
                  <div
                    key={`div-doc-info-${item.id}`}
                    className="doc-info-layout"
                    onClick={() => window.open(item.weburl)}
                  >
                    <Image
                      key={`img-${item.id}`}
                      src={getIconByFileType(item.type)}
                      width="28px"
                      height="28px"
                    />
                    <Label key={`label-${item.id}`} weight="semibold">
                      {item.name}
                    </Label>
                  </div>
                  <Menu key={`menu-more-${item.id}`}>
                    <MenuTrigger key={`menu-more-trigger-${item.id}`}>
                      <MenuButton
                        key={`menu-more-button-${item.id}`}
                        appearance="transparent"
                        icon={<MoreHorizontal16Filled />}
                      />
                    </MenuTrigger>
                    <MenuPopover key={`menu-pop-${item.id}`}>
                      <MenuList key={`menu-list-${item.id}`}>
                        <Menu key={`menu-${item.id}`}>
                          <MenuTrigger key={`menu-trigger-${item.id}`}>
                            <MenuItem
                              key={`menu-item-${item.id}`}
                              icon={<Image src={getIconByFileType(item.type)} />}
                            >
                              Open in
                            </MenuItem>
                          </MenuTrigger>
                          <MenuPopover key={`menu-open-pop-${item.id}`}>
                            <MenuList key={`menu-open-list-${item.id}`}>
                              <MenuItem
                                key={`menu-teams-${item.id}`}
                                icon={<Image src={TEAMS_SVG} width="20px" />}
                                onClick={() => window.open(item.teamsurl)}
                              >
                                Teams
                              </MenuItem>
                              <MenuItem
                                key={`menu-desktop-${item.id}`}
                                onClick={() => window.open(item.webDavurl)}
                                icon={<Image src={getIconByFileType(item.type)} />}
                              >
                                Desktop app
                              </MenuItem>
                              <MenuItem
                                key={`menu-browser-${item.id}`}
                                icon={<Image src={getIconByFileType(item.type)} />}
                                onClick={() => window.open(item.weburl)}
                              >
                                Browser
                              </MenuItem>
                            </MenuList>
                          </MenuPopover>
                        </Menu>

                        <MenuItem
                          key={`menu-download-${item.id}`}
                          icon={<ArrowDownload24Regular />}
                          onClick={() => window.open(item.webDavurl)}
                        >
                          Download
                        </MenuItem>
                        <MenuItem
                          key={`menu-copy-${item.id}`}
                          icon={<Link24Regular />}
                          onClick={() => navigator.clipboard.writeText(item.weburl!)}
                        >
                          Copy link
                        </MenuItem>
                      </MenuList>
                    </MenuPopover>
                  </Menu>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-layout">
            <EmptyThemeImg />
            <Text weight="semibold" className="empty-text">
              Once you have a document, you'll find it here
            </Text>
          </div>
        )}
      </div>
    );
  }

  protected footerContent(): JSX.Element | undefined {
    return this.state.documents?.length !== 0 ? (
      <Button
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        className={mergeStyles(widgetStyle.footerBtn, "footer-padding")}
        onClick={() => window.open("https://www.office.com/mycontent")}
      >
        View all
      </Button>
    ) : undefined;
  }

  protected loadingContent(): JSX.Element | undefined {
    return (
      <div style={{ display: "grid" }}>
        <Spinner label="Loading..." labelPosition="below" />
      </div>
    );
  }

  protected stylingWidget(): CSSProperties | string {
    return "doc-no-padding";
  }

  mouseOver = (i: number) => {
    this.setState({
      activeIndex: i,
      documents: this.state.documents,
      loading: false,
    });
  };

  mouseLeave = () => {
    this.setState({
      activeIndex: -1,
      documents: this.state.documents,
      loading: false,
    });
  };
}

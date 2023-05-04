import "../styles/Common.css";
import "../styles/Document.css";

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
import { BaseWidget, IWidgetClassNames } from "@microsoft/teamsfx-react";

import { TEAMS_SVG } from "../common/constants";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { DocumentModel } from "../models/documentModel";
import { getDocuments, getIconByFileType } from "../services/documentService";

interface IDocumentState {
  activeIndex: number;
  documents?: DocumentModel[];
}

export class Documents extends BaseWidget<any, IDocumentState> {
  override async getData(): Promise<IDocumentState> {
    try {
      const documents = await getDocuments();
      return { documents, activeIndex: -1 };
    } catch (error) {
      console.error(error);
      return { documents: [], activeIndex: -1 };
    } finally {
      this.setState({ loading: false });
    }
  }

  override header(): JSX.Element | undefined {
    return (
      <div id="no-icon-header">
        <Text>Your documents</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  override body(): JSX.Element | undefined {
    const hasDocument = this.state.documents?.length !== 0;
    return (
      <div className={hasDocument ? "has-doc-layout" : ""}>
        {hasDocument ? (
          this.state.documents?.map((item: DocumentModel, i) => {
            return (
              <div
                key={`div-container-${item.id}`}
                className="doc-container"
                onMouseOver={() => this.mouseOver(i)}
                onMouseLeave={() => this.mouseLeave()}
              >
                {i !== 0 && <div className="doc-divider" />}
                <div
                  className={`doc-item-content ${
                    i === this.state.activeIndex ? "doc-item-active" : "doc-item-non-active"
                  }`}
                >
                  <div className="doc-info-layout" onClick={() => window.open(item.weburl)}>
                    <Image src={getIconByFileType(item.type)} width="28px" height="28px" />
                    <Label weight="semibold">{item.name}</Label>
                  </div>
                  <Menu>
                    <MenuTrigger>
                      <MenuButton appearance="transparent" icon={<MoreHorizontal16Filled />} />
                    </MenuTrigger>
                    <MenuPopover>
                      <MenuList>
                        <Menu>
                          <MenuTrigger>
                            <MenuItem icon={<Image src={getIconByFileType(item.type)} />}>
                              Open in
                            </MenuItem>
                          </MenuTrigger>
                          <MenuPopover>
                            <MenuList>
                              <MenuItem
                                icon={<Image src={TEAMS_SVG} width="20px" />}
                                onClick={() => window.open(item.teamsurl)}
                              >
                                Teams
                              </MenuItem>
                              <MenuItem
                                onClick={() => window.open(item.webDavurl)}
                                icon={<Image src={getIconByFileType(item.type)} />}
                              >
                                Desktop app
                              </MenuItem>
                              <MenuItem
                                icon={<Image src={getIconByFileType(item.type)} />}
                                onClick={() => window.open(item.weburl)}
                              >
                                Browser
                              </MenuItem>
                            </MenuList>
                          </MenuPopover>
                        </Menu>

                        <MenuItem
                          icon={<ArrowDownload24Regular />}
                          onClick={() => window.open(item.webDavurl)}
                        >
                          Download
                        </MenuItem>
                        <MenuItem
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
            <Text>Once you have a document, you'll find it here</Text>
          </div>
        )}
      </div>
    );
  }

  override footer(): JSX.Element | undefined {
    return this.state.documents?.length !== 0 ? (
      <Button
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        onClick={() => window.open("https://www.office.com/mycontent")}
      >
        View all
      </Button>
    ) : undefined;
  }

  override loading(): JSX.Element | undefined {
    return (
      <div className="loading-layout">
        <Spinner label="Loading..." labelPosition="below" />
      </div>
    );
  }

  override styling(): IWidgetClassNames {
    return { root: "doc-no-padding", header: "doc-header", footer: "doc-footer footer-btn" };
  }

  // This function is called when the mouse hovers over a document item.
  // It updates the state to set the active index to the index of the hovered item,
  // and sets loading to false.
  mouseOver = (i: number) => {
    this.setState({
      activeIndex: i,
      documents: this.state.documents,
      loading: false,
    });
  };

  // This function is called when the mouse leaves a document item.
  // It updates the state to set the active index to -1 (no item is active),
  // and sets loading to false.
  mouseLeave = () => {
    this.setState({
      activeIndex: -1,
      documents: this.state.documents,
      loading: false,
    });
  };
}

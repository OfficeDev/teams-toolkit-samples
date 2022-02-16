// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Flex, Text, Loader } from "@fluentui/react-northstar";
import PopupMoreMenu from "./popup-more-menu";
import Tag from "./tag";
import { IDiscoverPost } from "./discover-wrapper-page";
import TypeLabel from "./type-label";
import Thumbnail from "./thumbnail";
import Upvotes from "./upvotes";
import { getInitials } from "../../helpers/helper";
import { deletePost, addUserVote, deleteUserVote } from "../../api/discover-api";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

import "../../styles/card.css";

interface ICardProps extends WithTranslation {
    cardDetails: IDiscoverPost;
    index: number;
    onDeleteButtonClick: (postId: string, isSuccess: boolean) => void;
    onAddPrivatePostClick: (isSuccess: boolean, message?: string) => void;
    onCardUpdate: (cardDetails: IDiscoverPost, isSuccess: boolean) => void;
    onVoteClick: (isSuccess: boolean, isLiked: boolean) => void;
}

interface ICardState {
    isVoteLoading: boolean;
    isMoreMenuLoading: boolean;
    cardDetails: IDiscoverPost;
}

class Card extends React.Component<ICardProps, ICardState> {
    localize: TFunction;
    constructor(props) {
      super(props);

      this.localize = this.props.t;
      this.state = {
        isVoteLoading: false,
        isMoreMenuLoading: false,
        cardDetails: this.props.cardDetails
      }
    }

    componentWillReceiveProps(nextProps: ICardProps) {
      if (nextProps.cardDetails !== this.props.cardDetails) {
        this.setState({ cardDetails: nextProps.cardDetails })
      }
    }

    /**
    *Submits user vote information to API.
    */
    onVoteClick = async () => {
      const cardDetails = { ...this.state.cardDetails };
      this.setState({ isVoteLoading: true });
      if (!cardDetails.isVotedByUser) {
        const response = await addUserVote(cardDetails);
        if (response.status === 200 && response.data) {
          cardDetails.isVotedByUser = true;
          cardDetails.totalVotes = cardDetails.totalVotes + 1;
          this.setState({ cardDetails: cardDetails });
          this.props.onVoteClick(true, true);
        }
        else {
          this.props.onVoteClick(false, true);
        }
      }
      else {
        const response = await deleteUserVote(cardDetails);
        if (response.status === 200 || response.data) {
          cardDetails.isVotedByUser = false;
          cardDetails.totalVotes = cardDetails.totalVotes - 1;
          this.setState({ cardDetails: cardDetails });
          this.props.onVoteClick(true, false);
        }
        else {
          this.props.onVoteClick(false, false);
        }
      }

      this.setState({ isVoteLoading: false });
    }

    /**
    *Deletes selected blog post from storage
    */
    handleDeleteButtonClick = async () => {
      this.setState({ isMoreMenuLoading: true });
      const response = await deletePost(this.state.cardDetails);
      if (response.status === 200 && response.data) {
        this.setState({ isMoreMenuLoading: false });
        this.props.onDeleteButtonClick(this.state.cardDetails.postId, true);
      }
      else {
        this.setState({ isMoreMenuLoading: false });
        this.props.onDeleteButtonClick(this.state.cardDetails.postId, false);
      }
    }

    /**
	*Invoked when item from more menu is clicked.
	*@param key Selected menu key
	*/
    onMenuItemClick = (key: number) => {
      if (key === 3) // delete
      {
        this.handleDeleteButtonClick();
      }
    };

    /**
	*Invoked when card is updated.
    *@param cardDetails Post card details.
    *@param isSuccess  Success status.
	*/
    onUpdateCard = (cardDetails: IDiscoverPost, isSuccess: boolean) => {
      this.setState({
        cardDetails: cardDetails
      });

      this.props.onCardUpdate(cardDetails, isSuccess);
    };

    /**
    * Renders the component
    */
    public render(): JSX.Element {
      return (
        <div id={this.props.index.toString()} className="card-bg">
          <Flex gap="gap.smaller" vAlign="center">
            <Thumbnail isVisible={false} imageUrl={this.state.cardDetails.contentUrl} />
          </Flex>
          <div className="card-body">
            <Flex gap="gap.smaller" column vAlign="start">
              <Flex gap="gap.smaller" className="title-flex">
                <Text onClick={() => window.open(this.state.cardDetails.contentUrl, "_blank")} className="title-text" size="large" content={this.state.cardDetails.title} title={this.state.cardDetails.title} weight="bold" />
              </Flex>
              <Flex gap="gap.smaller">
                <TypeLabel postType={this.state.cardDetails.type as number} size="small" />
              </Flex>
              <Flex className="content-flex" gap="gap.small">
                <Text size="small" className="content-text" title={this.state.cardDetails.description} content={this.state.cardDetails.description} />
              </Flex>
            </Flex>
          </div>
          <div className="footer-flex">
            <Flex gap="gap.smaller" className="tags-flex" vAlign="center">
              {
                this.state.cardDetails.tags.split(";").map((value: string, index: number) => {
                  if (value.trim().length > 0) {
                    return <Tag index={index} tagContent={value.trim()} showRemoveIcon={false} />
                  }
                })
              }
            </Flex>
            <Flex gap="gap.smaller" className="more-menu-bar" vAlign="center">
              <Flex vAlign="center">
                <div className="user-avatar-card" style={{ backgroundColor: this.state.cardDetails.avatarBackgroundColor }}>
                  <Text className="initials-color" content={getInitials(this.state.cardDetails.createdByName)} title={this.state.cardDetails.createdByName} />
                </div>&nbsp;<Text className="author-name" title={this.state.cardDetails.createdByName} content={this.state.cardDetails.createdByName} /></Flex>
              <Flex.Item push>
                <div></div>
              </Flex.Item>
              {
                this.state.isVoteLoading === false ? <Upvotes onVoteClick={() => this.onVoteClick()} isSelected={this.state.cardDetails.isVotedByUser === undefined ? false : this.state.cardDetails.isVotedByUser} upvoteCount={this.state.cardDetails.totalVotes.toString()} />
                  : <Loader size="small" />
              }
              <div className="more-menu-wrapper">
                {
                  this.state.isMoreMenuLoading === false
                    ? <PopupMoreMenu
                      onMenuItemClick={this.onMenuItemClick}
                      onEditSubmit={this.onUpdateCard}
                      cardDetails={this.state.cardDetails} />
                    : <Loader size="small" className="more-menu-loader" />
                }
              </div>
            </Flex>
          </div>
        </div>
      );
    }
}

export default withTranslation()(Card)
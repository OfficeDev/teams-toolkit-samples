// <copyright file="private-list-table.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Table, Text, Dialog, Button, Flex, Label, List } from "@fluentui/react-northstar";
import { TrashCanIcon } from "@fluentui/react-icons-northstar";
import { useTranslation } from 'react-i18next';
import Resources from "../../constants/resources";
import Tag from "../card-view/tag";
import TypeLabel from "../card-view/type-label";
import UserAvatar from "./user-avatar";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";

import "../../styles/card.css";
import "../../styles/private-list.css";

interface IPrivateListTableProps {
    privateListData: IDiscoverPost[],
    onDeleteButtonClick: (postId: string) => void;
    onTitleClick: (contentUrl: string) => void;
    screenWidth: number;
}

const PrivateListTable: React.FunctionComponent<IPrivateListTableProps> = props => {
    const localize = useTranslation().t;
    const privateListTableHeader = {
        key: "header",
        items: [
            { content: <Text weight="regular" content={localize("headingFormLabel")} />, key: "heading" },
            { content: <Text weight="regular" content={localize("descriptionText")} />, key: "description" },
            { content: <Text weight="regular" content={localize("sharedBy")} />, key: "user", className: "table-user-cell" },
            { content: <Text weight="regular" content={localize("tags")} />, key: "Tags" },
            { content: <Text weight="regular" content={localize("postType")} />, key: "Type", className: "table-posttype-cell" },
            { content: <div />, key: "delete-action", className: "table-delete-cell" }
        ],
    };


    let privateListTableRows = props.privateListData.map((userPost: IDiscoverPost, index: number) => (
        {
            key: index,
            items: [
                { content: <Text className="user-heading" onClick={() => props.onTitleClick(userPost.contentUrl)} title={userPost.title} content={userPost.title} />, truncateContent: true },
                { content: <Text content={userPost.description} title={userPost.description} />, truncateContent: true, },
                {
                    content: <UserAvatar avatarColor={userPost.avatarBackgroundColor} showFullName={true} content={userPost.createdByName} title={userPost.createdByName} />, truncateContent: true, className: "table-user-cell"
                },
                {
                    content:
                        <Flex gap="gap.smaller" className="tags-flex" vAlign="center">
                            {
                                userPost.tags.split(";").map((value: string, index: number) => {
                                    console.log(index);
                                    if (value.trim().length) {
                                        if (props.screenWidth <= Resources.screenWidthLarge && props.screenWidth > Resources.screenWidthSmall) {
                                            if (index <= 1) {
                                                return <Tag index={index} tagContent={value.trim()} showRemoveIcon={false} />
                                            }
                                            else {
                                                return (
                                                    <Label
                                                        key={index}
                                                        circular
                                                        content="+1"
                                                        title={value.trim()}
                                                        className="tags-label-wrapper"
                                                    />
                                                )
                                            }
                                        }
                                        else if (props.screenWidth <= Resources.screenWidthSmall) {

                                            if (index <= 0) {
                                                return <Tag index={index} tagContent={value.trim()} showRemoveIcon={false} />
                                            }
                                            else {
                                                if (index === 1) {
                                                    let tags = userPost.tags.substring(userPost.tags.indexOf(";") + 1);
                                                    let commaSeperatedTags = tags.replace(';', ',');
                                                    return (
                                                        <Label
                                                            key={index}
                                                            circular
                                                            content="+2"
                                                            title={commaSeperatedTags}
                                                            className="tags-label-wrapper"
                                                        />
                                                    )
                                                }
                                                else {
                                                    return (
                                                        <></>
                                                    )
                                                }
                                            }
                                        }
                                        else {
                                            return <Tag index={index} tagContent={value.trim()} showRemoveIcon={false} />
                                        }

                                    }
                                })
                            }
                        </Flex>
                },
                {
                    content: <TypeLabel postType={userPost.type!} size="medium" />,
                    className: "table-posttype-cell"
                },
                {
                    content: <Dialog
                        className="dialog-container-private-list"
                        cancelButton={localize("cancel")}
                        confirmButton={localize("Confirm")}
                        content={localize("deleteConfirmBodyText")}
                        header={localize("deleteConfirmTitleText")}
                        trigger={<Button primary icon={<TrashCanIcon />} content={localize("Confirm")} text className="delete-button" />}
                        onConfirm={() => { props.onDeleteButtonClick(userPost.postId) }}
                    />, truncateContent: true, className: "table-delete-cell"
                },
            ],
        }
    ));

    let privateListListViewItems = props.privateListData.map((userPost: IDiscoverPost, index: number) => (
        {
            key: index,
            header: <></>,
            media: <UserAvatar avatarColor={userPost.avatarBackgroundColor} showFullName={false} content={userPost.createdByName} title={userPost.createdByName} />,
            contentMedia: <></>,
            content:
                <Flex vAlign="stretch">
                    <Flex.Item>
                        <Flex column gap="gap.small" vAlign="stretch">
                            <Flex>
                                <Text as="h4" className="user-heading" onClick={() => props.onTitleClick(userPost.contentUrl)} title={userPost.title} content={userPost.title} /><br />
                            </Flex>
                            <Flex>
                                <Text className="content-text-private-list" content={userPost.description} title={userPost.description} />
                            </Flex>
                        </Flex>
                    </Flex.Item>
                    <Flex.Item push align="end">
                        <Dialog
                            className="dialog-container-private-list"
                            cancelButton={localize("cancel")}
                            confirmButton={localize("Confirm")}
                            content={localize("deleteConfirmBodyText")}
                            header={localize("deleteConfirmTitleText")}
                            trigger={<Button primary icon={<TrashCanIcon />} text iconOnly className="delete-button-list" />}
                            onConfirm={() => { props.onDeleteButtonClick(userPost.postId) }}
                        />
                    </Flex.Item>
                </Flex>,
            className: "list-item"
        }
    ));

    return (
        <>
            {props.screenWidth <= 750 && <List items={privateListListViewItems} />}
            {props.screenWidth > 750 && <Table rows={privateListTableRows}
                header={privateListTableHeader} className="nonmobile-private-list table-cell-content" />}
        </>
    );
}

export default PrivateListTable;
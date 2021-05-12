// <copyright file="team-config-page.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { getBaseUrl } from '../configVariables';
import { submitConfigTags, getConfigTags } from "../api/teams-config-tab-api";
import { filterTags } from "../api/preferences-api";
import PreferencesSuggestion from "../components/configure-preference-dialog/preferences-suggestion-list";
import Resources from '../constants/resources';
import Tag from "../components/card-view/tag";
import NoTagFound from "../components/configure-preference-dialog/no-tag-found"
import { Flex, Text, Input, Loader } from "@fluentui/react-northstar";
import { SearchIcon } from '@fluentui/react-icons-northstar';
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

import "../styles/teams-config-tab.css";

interface ITeamConfigDetailsProps extends WithTranslation {
    teamConfigDetails: ITeamConfigDetails;
    changeDialogOpenState: (isOpen: boolean) => void;
}

interface ITeamConfigDetails {
    tags: string;
    teamId: string;
    serviceUrl: string;
}

interface ITeamConfigState {
    tagsList: Array<string>;
    showSuggestion: boolean;
    savedTagItems: Array<string>;
    showTagError: boolean;
    searchText: string;
    showNoTagFound: boolean;
    showEmptyStringError: boolean;
    disableSubmitButton: boolean;
    showLoader: boolean;
    showSuggestionLoader: boolean;
    showNoTagsMessage: boolean;
    teamConfigDetails: ITeamConfigDetails;
}

class TeamsConfigPage extends React.Component<ITeamConfigDetailsProps, ITeamConfigState> {
    localize: TFunction;
    url = getBaseUrl() + "/discover-team?teamId={teamId}";
    teamId: string;
    nodeConfig: any;
    constructor(props: any) {
        super(props);
        this.localize = this.props.t;
        this.teamId = "";
        this.state = {
            tagsList: [],
            savedTagItems: [],
            showSuggestion: false,
            showTagError: false,
            searchText: "",
            showNoTagFound: false,
            showEmptyStringError: false,
            disableSubmitButton: false,
            showLoader: false,
            showSuggestionLoader: false,
            showNoTagsMessage: false,
            teamConfigDetails: { ...this.props.teamConfigDetails }
        }
    }

    /**
    * Used to initialize Microsoft Teams sdk
    */
    public componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext(async (context: microsoftTeams.Context) => {
            this.teamId = context.teamId!;
            setTimeout(async () => {
                let response = await getConfigTags(this.teamId);
                if (response.status === 200 && response.data) {
                    this.setState({ teamConfigDetails: response.data });
                    if (response.data.tags.length) {
                        this.setState({
                            tagsList: response.data.tags.split(";")
                        })
                    }
                    else {
                        this.setState({
                            showNoTagsMessage: true
                        })
                    }
                }
            }, 300);
        });

        microsoftTeams.settings.registerOnSaveHandler(async (saveEvent: microsoftTeams.settings.SaveEvent) => {
            this.setState({
                showLoader: true
            })

            let configureDetails = this.state.teamConfigDetails;
            configureDetails.tags = this.state.tagsList.join(';');
            configureDetails.teamId = this.teamId;

            let response = await submitConfigTags(configureDetails);
            if (response.status === 200 && response.data) {
                this.setState({
                    showLoader: false
                })
                microsoftTeams.settings.setSettings({
                    entityId: "GoodReads_Bot_App",
                    contentUrl: this.url,
                    suggestedDisplayName: this.localize("discover"),
                });
                saveEvent.notifySuccess();
            }
            else {
                microsoftTeams.settings.setSettings({
                    entityId: "GoodReads_Bot_App",
                    contentUrl: this.url,
                    suggestedDisplayName: this.localize("discover"),
                });
                saveEvent.notifySuccess();
            }

        });

        microsoftTeams.settings.setValidityState(true);

    }

    /**
    * Method to render error if particular tag is already added.
    */
    showTagsAlreadyAddedError() {
        if (this.state.showTagError) {
            if (this.state.tagsList.length === Resources.tagsMaxCountPreferences)

                return (
                    <Flex gap="gap.smaller" className="tag-error-maxfive-config">
                        <Text content={this.localize("preferenceTagCountError")} />
                    </Flex>
                )
            else {
                return (
                    <Flex gap="gap.smaller" className="tag-error-label-config">
                        <Text content={this.localize("tagAlreadyAddedError")} />
                    </Flex>
                )
            }
        }
        else if (this.state.showEmptyStringError) {
            return (
                <Flex gap="gap.smaller" className="tag-error-label-config">
                    <Text content={this.localize("emptyTagFieldError")} />
                </Flex>
            )
        }
        else {
            return (<></>)
        }
    }

    /**
    * Remove selected tag for configuration in a team.
    * @param index Index of the tag which need to be removed.
    */
    onTagRemoveClick = (index: number) => {
        let tags = this.state.tagsList;
        tags.splice(index, 1);
        if (this.state.tagsList.length) {
            this.setState({
                disableSubmitButton: false,
                tagsList: tags,
                showTagError: false
            })
        }
        else {
            this.setState({
                disableSubmitButton: true,
                tagsList: tags,
                showTagError: false
            })
        }
    }

    /**
    * Method add tags in to taglist
    * @param value Tag to be added
    */
    onTagAddClick = (value: string) => {
        const taglist = this.state.tagsList.slice(0);

        if (this.state.tagsList.indexOf(value) === -1 && this.state.tagsList.length < 5) {
            this.setState({
                showTagError: false
            })
            taglist.push(value);
            this.setState({
                tagsList: taglist,
                disableSubmitButton: false,
                showNoTagsMessage: false
            });
        }
        else {
            this.setState({
                showTagError: true
            })
        }
    }

    /**
    * Method to show loader while submitting preferences details.
    */
    showLoader() {
        if (this.state.showLoader) {
            return (<Loader className="preference-loader" />)
        }
    }

    /**
    * Clear all tags
    */
    closeSuggestionBox = () => {
        this.setState({
            savedTagItems: [],
            showNoTagFound: false
        })
    }

    /**
    * Close no tag found box
    */
    closeNoTagFoundBox = () => {
        this.setState({
            showNoTagFound: false
        })
    }

    /**
    * Method render filtered tags in autosuggest dropdown.
    */
    showSuggestedTags() {
        if (this.state.savedTagItems.length && this.state.searchText.length) {
            return (
                <PreferencesSuggestion
                    digestFrequency=""
                    node={this.nodeConfig}
                    onTagAddClick={this.onTagAddClick}
                    savedTagItems={this.state.savedTagItems}
                    showSuggestion={this.state.showSuggestion}
                    closeSuggestionBox={this.closeSuggestionBox} />
            )
        }
        else {
            if (this.state.showNoTagFound) {
                return (
                    <NoTagFound
                        node={this.nodeConfig}
                        closeNoTagFoundBox={this.closeNoTagFoundBox} />
                )
            }
            else if (this.state.showSuggestionLoader) {
                return (<div className="suggestion-loader-config">
                    <Loader />
                </div>)
            }
        }
    }

    /**
    * Method to fetch filtered tags based on search text.
    */
    filterSavedTags = async (searchText: string) => {
        if (this.state.searchText.length === 0) {
            this.setState({
                showEmptyStringError: true
            })
        }
        else {
            this.setState({
                showSuggestionLoader: true
            });
            let response = await filterTags(searchText);
            if (response.status === 200 && response.data) {
                if (response.data.length) {
                    this.setState({
                        savedTagItems: response.data
                    })
                }
                else {
                    this.setState({
                        showNoTagFound: true
                    })
                }
            }
            else {
                this.setState({
                    showNoTagFound: true
                })
            }
        }
        this.setState({
            showSuggestionLoader: false
        });
    }

    /**
    * Method to get input search text in state
    * @param searchText User entered search text
    */
    getInputValue = (searchText: string) => {
        this.setState({
            searchText: searchText
        })
        if (searchText.length === 0) {
            this.setState({
                savedTagItems: [],
                showNoTagFound: false,
            });
        }
        this.setState({
            showTagError: false,
            showEmptyStringError: false
        })
    }

    /**
    * Enter key Press method to fetch tags in autosuggest
    * @param event Event object for input
    */
    onEnterKeyPress = async (event: any) => {
        if (event.keyCode === Resources.keyCodeEnter) {

            if (this.state.searchText.length === 0) {
                this.setState({
                    showEmptyStringError: true
                })
            }
            else {
                this.setState({
                    showSuggestionLoader: true
                });
                let response = await filterTags(this.state.searchText);
                if (response.status === 200 && response.data) {
                    if (response.data.length) {
                        this.setState({
                            savedTagItems: response.data
                        })
                    }
                    else {
                        this.setState({
                            showNoTagFound: true
                        })
                    }
                }
                else {
                    this.setState({
                        showNoTagFound: true
                    })
                }
            }
            this.setState({
                showSuggestionLoader: false
            });
        }
    }

    /**
    * Method to show tag list after selecting them from dropdown
    */
    showTags() {
        if (this.state.showNoTagsMessage) {
            return (
                <Text content={this.localize("noTagConfiguredNote")} />
            )
        }
        else {
            return (
                <div>
                    {
                        this.state.tagsList.map((value: string, index: number) => {
                            return <Tag index={index} tagContent={value.trim()} showRemoveIcon={true} onRemoveClick={this.onTagRemoveClick} />
                        })
                    }
                </div>
            )
        }
    }

    /**
    * Renders the component
    */
    public render(): JSX.Element {
        return (
            <div className="dialog-container-div-config">
                <div className="config-container" ref={nodeConfig => this.nodeConfig = nodeConfig}>
                    <Flex gap="gap.smaller" className="tag-searchbox-label">
                        <Text content={this.localize("tagsLabel")} />
                        <Flex.Item push>
                            {this.showTagsAlreadyAddedError()}
                        </Flex.Item>
                    </Flex>
                    <Flex className="search-div">
                        <Input onKeyDown={(event: any) => this.onEnterKeyPress(event)} icon={<SearchIcon onClick={(event: any) => this.filterSavedTags(this.state.searchText)} key="search" className="search-icon" />} fluid onChange={(event: any) => this.getInputValue(event.target.value)} placeholder={this.localize("searchPlaceholder")} />
                    </Flex>
                    <Flex>
                        {this.showSuggestedTags()}
                    </Flex>

                    <Flex gap="gap.smaller" className="tags-flex-preferences" vAlign="center">
                        {this.showTags()}
                    </Flex>
                </div>

            </div>
        );
    }

}

export default withTranslation()(TeamsConfigPage)

// <copyright file="configure-preference.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Button, Flex, Text, Tooltip, Input, RadioGroup, Loader, InfoIcon } from "@fluentui/react-northstar";
import { SearchIcon } from "@fluentui/react-icons-northstar";
import { filterTags } from "../../api/preferences-api";
import { getTags } from "../../helpers/helper";
import PreferencesSuggestion from "./preferences-suggestion-list";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";
import * as microsoftTeams from '@microsoft/teams-js';
import Tag from "../card-view/tag";
import NoTagFound from "./no-tag-found";
import Resources from '../../constants/resources';

import "../../styles/site.css";
import "../../styles/configure-preferences.css";

interface IConfigurePreferencesProps extends WithTranslation {
    configurePreferencesDetails: IConfigurePreferencesDetails;
    changeDialogOpenState: (isOpen: boolean) => void;
}

interface IConfigurePreferencesDetails {
    tags: string;
    digestFrequency: string;
    teamId: string;
}

interface IConfigurePreferencesState {
    tagsList: Array<string>;
    showSuggestion: boolean;
    savedTagItems: Array<string>;
    showTagError: boolean;
    searchText: string;
    digestFrequency: string;
    showNoTagFound: boolean;
    showEmptyStringError: boolean;
    disableSubmitButton: boolean;
    showLoader: boolean;
    showSuggestionLoader: boolean;
    configurePreferencesDetails: IConfigurePreferencesDetails;
}

class ConfigurePreferences extends React.Component<IConfigurePreferencesProps, IConfigurePreferencesState>{
    elementRef: any
    teamId: string;
    localize: TFunction;

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
            digestFrequency: Resources.weeklyDigestFrequencyText,
            showNoTagFound: false,
            showEmptyStringError: false,
            disableSubmitButton: false,
            showLoader: false,
            showSuggestionLoader: false,
            configurePreferencesDetails: { ...this.props.configurePreferencesDetails }
        }
    }

    /**
    * Used to initialize Microsoft Teams sdk
    */
    async componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext(async (context) => {
            this.teamId = context.teamId!;
            this.setState({
                showLoader: true
            });
            let result = await getTags(this.teamId);
            if (result != null) {
                this.setState({
                    tagsList: result.tags,
                    digestFrequency: result.Frequency
                });
            }
            this.setState({
                showLoader: false
            });
        });
    }

    /**
    * Method to submit and save preferences details.
    */
    onSubmitClick = async () => {
        this.setState({
            showLoader: true
        });

        let configureDetails = this.state.configurePreferencesDetails;
        configureDetails.tags = this.state.tagsList.join(';');
        configureDetails.digestFrequency = this.state.digestFrequency;
        configureDetails.teamId = this.teamId;

        let toBot =
        {
            configureDetails,
            command: Resources.submitPreferencesTaskModule
        };
        microsoftTeams.tasks.submitTask(toBot);
        this.setState({
            showLoader: false
        });
    }

    /**
    * Method to close preferences task module.
    */
    closeTaskModule = () => {

        let configureDetails = this.state.configurePreferencesDetails;
        let toBot =
        {
            configureDetails,
            command: Resources.closePreferencesTaskModule
        };
        microsoftTeams.tasks.submitTask(toBot);
    }

    /**
    * Method to remove selected tag
     * @param index Index of tag value which need to be remove.
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
    * Method to add tags in to taglist on click of tag in autosuggest.
     * @param value Tag value which need to be added
    */
    onTagAddClick = (value: string) => {
        const taglist = this.state.tagsList.slice(0);

        if (this.state.tagsList.indexOf(value) === -1 && this.state.tagsList.length < 5) {
            taglist.push(value);
            this.setState({
                showTagError: false,
                tagsList: taglist,
                disableSubmitButton: false
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
            return (
                <div className="dialog-container-div-preferences">
                    <Loader className="preference-loader" />
                </div>
            )
        }
    }

    /**
    *Clear tag array
    */
    closeSuggestionBox = () => {
        this.setState({
            savedTagItems: []
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
    * Method to render filtered tags in autosuggest.
    */
    showSuggestedTags() {
        if (this.state.savedTagItems.length != 0 && this.state.searchText.length != 0) {
            return (
                <PreferencesSuggestion
                    digestFrequency={this.state.digestFrequency}
                    node={this.elementRef}
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
                        node={this.elementRef}
                        closeNoTagFoundBox={this.closeNoTagFoundBox} />
                )
            }
            else if (this.state.showSuggestionLoader) {
                return (<div className="suggestion-loader">
                    <Loader />
                </div>)
            }
        }
    }

    /**
    * Method to show autosuggest.
    */
    showSuggestions = () => {
        this.setState({
            showSuggestion: true
        });
    }

    /**
    * Method to show autosuggest.
     * @param searchText Search text to filter tags.
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
    * Method to render error if particular tag is already added.
    */
    showTagsAlreadyAddedError() {
        if (this.state.showTagError) {
            if (this.state.tagsList.length === Resources.tagsMaxCountPreferences)

                return (
                    <Flex gap="gap.smaller" className="tag-error-maxfive">
                        <Text content={this.localize("preferenceTagCountError")} />
                    </Flex>
                )
            else {
                return (
                    <Flex gap="gap.smaller" className="tag-error-label">
                        <Text content={this.localize("tagAlreadyAddedError")} />
                    </Flex>
                )
            }
        }
        else if (this.state.showEmptyStringError) {
            return (
                <Flex gap="gap.smaller" className="tag-error-label">
                    <Text content={this.localize("emptyTagFieldError")} />
                </Flex>
            )
        }
        else {
            return (<></>)
        }
    }

    /**
    * Method to get input search text in state.
     * @param searchText Search text which user type.
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
    * Method to get selected digest frequency value in state.
    * @param e event parameter.
    * @param props event parameter.
    */
    getDigestFrequency = (e: any, props: any) => {
        this.setState({
            digestFrequency: props.value
        })
    }

    /**
    * Enter key Press method to fetch tags in autosuggest.
    * @param event event parameter.
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
    * Digest frequency radio button details.
    */
    getItems() {
        return [
            {
                name: Resources.digestFrequencyRadioName,
                key: Resources.weeklyDigestFrequencyText,
                label: this.localize("weeklyDigestFrequencyText"),
                value: Resources.weeklyDigestFrequencyText,
            },
            {
                name: Resources.digestFrequencyRadioName,
                key: Resources.monthlyDigestFrequencyText,
                label: this.localize("monthlyDigestFrequencyText"),
                value: Resources.monthlyDigestFrequencyText,
            },
        ]
    }

    /**
    * Method to show loader until the page details load.
    */
    showContent() {
        if (this.state.showLoader) {
            this.showLoader();
        }
        else {
            return (
                <div ref={elementRef => this.elementRef = elementRef} className="configure-preferences-div">
                    <Flex gap="gap.smaller" className="frequency-label">
                        <Text content={this.localize("digestFrequencyLabel")} /><InfoIcon outline className="info-icon" size="small" title={this.localize("digestFrequencyLabelInfo")} />
                    </Flex>
                    <Flex gap="gap.smaller" className="frequency-radio">
                        <RadioGroup
                            vertical
                            items={this.getItems()}
                            defaultCheckedValue={this.state.digestFrequency}
                            onCheckedValueChange={(e: any, props: any) => this.getDigestFrequency(e, props)}
                        />
                    </Flex>
                    <Flex gap="gap.smaller" className="tag-searchbox-label">
                        <Text content={this.localize("tagsLabel")} />
                        <Flex.Item push>
                            {this.showTagsAlreadyAddedError()}
                        </Flex.Item>
                    </Flex>
                    <Flex className="search-div">
                        <Input onKeyDown={(event: any) => this.onEnterKeyPress(event)} fluid icon={<SearchIcon onClick={(event: any) => this.filterSavedTags(this.state.searchText)} key="search" className="search-icon-preferences" />} onChange={(event: any) => this.getInputValue(event.target.value)} placeholder="Search..." />
                    </Flex>
                    <Flex>
                        {this.showSuggestedTags()}
                    </Flex>


                    <Flex gap="gap.smaller" className="tags-flex-preferences" vAlign="center">
                        <div>
                            {
                                this.state.tagsList.map((value: string, index: number) => {
                                    return <Tag index={index} tagContent={value.trim()} showRemoveIcon={true} onRemoveClick={this.onTagRemoveClick} />
                                })
                            }
                        </div>
                    </Flex>
                    <Flex gap="gap.smaller" className="footer">
                        <Flex.Item push>
                            <Button onClick={this.closeTaskModule} content={this.localize("cancel")} />
                        </Flex.Item>
                        <Button loader={this.state.showLoader} content={this.localize("save")} primary disabled={this.state.disableSubmitButton} onClick={this.onSubmitClick} />
                    </Flex>
                </div>
            )
        }
    }
    /**
	* Renders the component
	*/
    public render(): JSX.Element {

        return (
            <>
                {this.showLoader()}
                {this.showContent()}
            </>
        );
    }
}

export default withTranslation()(ConfigurePreferences)
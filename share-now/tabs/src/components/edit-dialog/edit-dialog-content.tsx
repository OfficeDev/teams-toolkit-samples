// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Button, Flex, Text, Input, Tooltip, TextArea, ItemLayout, Label, Image, Provider, Dropdown } from "@fluentui/react-northstar";
import { CloseIcon, AddIcon, InfoIcon } from "@fluentui/react-icons-northstar";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";
import { updatePostContent } from "../../api/discover-api";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { ITagValidationParameters } from "../add-new-dialog/add-new-dialog-content";
import Resources, { IPostType } from "../../constants/resources";
import { getLocalizedPostTypes } from "../../helpers/helper";
import applicationLogo from "../../artifacts/applicationLogo.png";

import "../../styles/edit-dialog.css";

interface IEditDialogContentProps extends WithTranslation {
    cardDetails: IDiscoverPost;
    onSubmit: (cardDetails: IDiscoverPost, isSuccess: boolean) => void;
    onCancel: () => void;
    changeDialogOpenState: (isOpen: boolean) => void;
}

interface IEditDialogContentStateState {
    postDetails: IDiscoverPost;
    tagsList: Array<string>;
    typeList: Array<IPostType>;
    tag: string;
    editDialogOpen: boolean;
    isTitleValid: boolean;
    isTypeValid: boolean;
    isDescriptionValid: boolean;
    isLinkValid: boolean;
    tagValidation: ITagValidationParameters;
    isLoading: boolean;
    theme: string;
}

class EditItemDialogContent extends React.Component<IEditDialogContentProps, IEditDialogContentStateState> {
    localize: TFunction;

    constructor(props) {
      super(props);

      this.localize = this.props.t;
      const localizedPostTypes = getLocalizedPostTypes(this.localize);
      this.state = {
        tagsList: this.props.cardDetails.tags.split(";"),
        postDetails: { ...this.props.cardDetails },
        typeList: localizedPostTypes,
        tag: "",
        editDialogOpen: false,
        isTitleValid: true,
        isDescriptionValid: true,
        isLinkValid: true,
        isTypeValid: true,
        tagValidation: { isEmpty: false, isExisting: false, isLengthValid: true, isTagsCountValid: true, containsSemicolon: false },
        isLoading: false,
        theme: ""
      }
    }

    componentDidMount() {
      window.addEventListener("resize", function () {
        if (this.document) {
          if (document?.activeElement?.tagName == "INPUT") {
            window.setTimeout(function () {
              document?.activeElement?.scrollIntoView();
            }, 0);
          }
        }
      })
    }

    /**
	*Close the dialog and pass back card properties to parent component.
	*/
    onSubmitClick = async () => {
      if (this.checkIfSubmitAllowed()) {
        this.setState({
          isLoading: true
        });
        const cardDetails = this.state.postDetails;
        cardDetails.tags = this.state.tagsList.join(";");

        const response = await updatePostContent(cardDetails);
        if (response.status === 200 && response.data) {
          this.props.onSubmit(cardDetails, true);
          this.props.changeDialogOpenState(false);
        }
        else {
          this.props.onSubmit(cardDetails, false);
        }

        this.setState({
          isLoading: false
        });
      }
    }


    /**
	*Sets description state.
	*@param description Description string
	*/
    onDescriptionChange = (description: string) => {
      const cardDetails = this.state.postDetails;
      cardDetails.description = description;
      this.setState({ postDetails: cardDetails, isDescriptionValid: true });
    }

    /**
	*Sets heading state.
	*@param headingText Heading string
	*/
    onHeadingChange = (headingText: string) => {
      const cardDetails = this.state.postDetails;
      cardDetails.title = headingText;
      this.setState({ postDetails: cardDetails, isTitleValid: true });
    }

    /**
	*Sets link state.
	*@param link Link string
	*/
    onLinkChange = (link: string) => {
      const cardDetails = this.state.postDetails;
      cardDetails.contentUrl = link;
      this.setState({ postDetails: cardDetails });
    }

    /**
	*Sets tag state.
	*@param tag Tag string
	*/
    onTagChange = (tag: string) => {
      this.setState({ tag: tag })
    }

    /**
	*Sets state of tagsList by adding new tag.
	*/
    onTagAddClick = () => {
      if (this.checkIfTagIsValid()) {
        this.setState(prevState => ({ tagsList: [...prevState.tagsList, this.state.tag.toLowerCase()], tag: "" }));
      }
    }

    /**
	*Sets state of tagsList by removing tag using its index.
	*@param index Index of tag to be deleted.
	*/
    onTagRemoveClick = (index: number) => {
      const tags = this.state.tagsList;
      tags.splice(index, 1);
      this.setState({ tagsList: tags });
    }

    /**
	* Checks whether all validation conditions are matched before user submits edited post content
	*/
    checkIfSubmitAllowed = () => {
      const postValidationStatus = { isTypeValid: true, isTitleValid: true, isDescriptionValid: true, isLinkValid: false };
      if (this.state.postDetails.type === undefined) {
        postValidationStatus.isTypeValid = false;
      }

      if (this.state.postDetails.title.trim() === "" || this.state.postDetails.title.length > Resources.postTitleMaxLength) {
        postValidationStatus.isTitleValid = false;
      }

      if (this.state.postDetails.description.trim() === "" ||
            this.state.postDetails.description.length > Resources.postDesriptionMaxLength ||
            this.state.postDetails.description.length < Resources.postDesriptionMinLength) {
        postValidationStatus.isDescriptionValid = false;
      }

      if (this.state.postDetails.contentUrl.trim() === "" || this.state.postDetails.contentUrl.length > Resources.postContentUrlMaxLength) {
        postValidationStatus.isLinkValid = false;
      }
      else {
        const expression = Resources.urlValidationRegEx;
        const regex = new RegExp(expression);
        if (this.state.postDetails.contentUrl.match(regex)) {
          postValidationStatus.isLinkValid = true;
        }
        else {
          postValidationStatus.isLinkValid = false;
        }
      }
      this.setState({ isLinkValid: postValidationStatus.isLinkValid, isDescriptionValid: postValidationStatus.isDescriptionValid, isTitleValid: postValidationStatus.isTitleValid, isTypeValid: postValidationStatus.isTypeValid });
      if (postValidationStatus.isTitleValid && postValidationStatus.isDescriptionValid && postValidationStatus.isLinkValid && postValidationStatus.isTypeValid) {
        return true;
      }
      else {
        return false;
      }
    }

    /**
    *Returns text component containing error message for failed title field validation
    */
    private getTitleError = () => {
      if (!this.state.isTitleValid) {
        if (this.state.postDetails.title.trim() === "") {
          return (<Text content={this.localize("emptyTitleError")} className="field-error-message" error size="medium" />);
        }
        if (this.state.postDetails.title.length > Resources.postTitleMaxLength) {
          return (<Text content={this.localize("maxCharactersTitleError")} className="field-error-message" error size="medium" />);
        }
      }
      return (<></>);
    }

    /**
    *Returns text component containing error message for failed description field validation
    */
    private getDescriptionError = () => {
      if (!this.state.isDescriptionValid) {
        if (this.state.postDetails.description.trim() === "") {
          return (<Text content={this.localize("emptyDescriptionError")} className="field-error-message" error size="medium" />);
        }

        if (this.state.postDetails.description.length < 20) {
          return (<Text content={this.localize("minLengthDescriptionError")} className="field-error-message" error size="medium" />);
        }

        if (this.state.postDetails.description.length > Resources.postDesriptionMaxLength) {
          return (<Text content={this.localize("maxCharactersDescriptionError")} className="field-error-message" error size="medium" />);
        }
      }
      return (<></>);
    }

    /**
    *Returns text component containing error message for failed link field validation
    */
    private getLinkError = () => {
      if (!this.state.isLinkValid) {
        if (this.state.postDetails.contentUrl.trim() === "") {
          return (<Text content={this.localize("emptyLinkError")} className="field-error-message" error size="medium" />);
        }
        if (this.state.postDetails.contentUrl.length > Resources.postContentUrlMaxLength) {
          return (<Text content={this.localize("maxCharacterLinkError")} className="field-error-message" error size="medium" />);
        }
        return (<Text content={this.localize("invalidLinkError")} className="field-error-message" error size="medium" />);
      }
      return (<></>);
    }

    /**
	*Check if tag is valid
	*/
    checkIfTagIsValid = () => {
      const validationParams: ITagValidationParameters = { isEmpty: false, isLengthValid: true, isExisting: false, isTagsCountValid: false, containsSemicolon: false };
      if (this.state.tag.trim() === "") {
        validationParams.isEmpty = true;
      }

      if (this.state.tag.length > Resources.tagMaxLength) {
        validationParams.isLengthValid = false;
      }

      const tags = this.state.tagsList;
      const isTagExist = tags.find((tag: string) => {
        if (tag.toLowerCase() === this.state.tag.toLowerCase()) {
          return tag;
        }
      });

      if (this.state.tag.split(";").length > 1) {
        validationParams.containsSemicolon = true;
      }

      if (isTagExist) {
        validationParams.isExisting = true;
      }

      if (this.state.tagsList.length < Resources.tagsMaxCount) {
        validationParams.isTagsCountValid = true;
      }

      this.setState({ tagValidation: validationParams });

      if (!validationParams.isEmpty && !validationParams.isExisting && validationParams.isLengthValid && validationParams.isTagsCountValid && !validationParams.containsSemicolon) {
        return true;
      }
      return false;
    }

    /**
    *Returns text component containing error message for failed post type field validation
    */
    private getTypeError = () => {
      if (!this.state.isTypeValid) {
        return (<Text content={this.localize("invalidTypeError")} className="field-error-message" error size="medium" />);
      }
      return (<></>);
    }

    /**
	*Returns text component containing error message for empty tag input field
	*/
    private getTagError = () => {
      if (this.state.tagValidation.isEmpty) {
        return (<Text content={this.localize("emptyTagError")} className="field-error-message" error size="medium" />);
      }
      else if (!this.state.tagValidation.isLengthValid) {
        return (<Text content={this.localize("tagLengthError")} className="field-error-message" error size="medium" />);
      }
      else if (this.state.tagValidation.isExisting) {
        return (<Text content={this.localize("sameTagExistsError")} className="field-error-message" error size="medium" />);
      }
      else if (!this.state.tagValidation.isTagsCountValid) {
        return (<Text content={this.localize("tagsCountError")} className="field-error-message" error size="medium" />);
      }
      else if (this.state.tagValidation.containsSemicolon) {
        return (<Text content={this.localize("semicolonTagError")} className="field-error-message" error size="medium" />);
      }
      return (<></>);
    }

    /**
	*Invoked when user hits enter key in tag input box
	*@param event Input box event object
	*/
    onTagKeyDown = (event) => {
      if (event.key === 'Enter') {
        this.onTagAddClick();
      }
    }

    /**
	* Renders the component
	*/
    public render(): JSX.Element {
      const onTypeSelection = {
        onAdd: item => {
          this.setState((prevState: IEditDialogContentStateState) => ({ postDetails: { ...prevState.postDetails, type: item?.key } }));
          return "";
        },
      };

      return (
        <Provider className="dialog-provider-wrapper">
          <Flex>
            <Flex.Item grow>
              <ItemLayout
                className="app-name-container"
                media={<Image className="app-logo-container" src={applicationLogo} />}
                header={<Text content={this.localize("dialogTitleAppName")} weight="bold" />}
                content={<Text content={this.localize("editPostDialogHeader")} weight="semibold" size="small" />}
              />
            </Flex.Item>
            <CloseIcon className="icon-hover close-icon-dialog" onClick={() => this.props.changeDialogOpenState(false)} />
          </Flex>
          <Flex>
            <div className="dialog-body">
              <Flex gap="gap.smaller">
                <Text className="form-label" content={"*" + this.localize("type")} /><Tooltip position="below" trigger={<InfoIcon outline className="info-icon" size="small" />} content={this.localize("typeInfo")} />
                <Flex.Item push>
                  {this.getTypeError()}
                </Flex.Item>
              </Flex>
              <Flex gap="gap.smaller" className="input-label-space-between">
                <div className="type-dropdown-wrapper">
                  <Dropdown
                    fluid
                    items={this.state.typeList.map((value: IPostType) => { return { key: value.id, header: value.name } })}
                    placeholder={this.localize("typePlaceholder")}
                    getA11ySelectionMessage={onTypeSelection}
                    defaultValue={this.state.typeList.find((type: IPostType) => type.id === this.state.postDetails.type)?.name}
                  />
                </div>
              </Flex>
              <Flex gap="gap.smaller" className="input-fields-margin-between-add-post">
                <Text className="form-label" content={"*" + this.localize("headingFormLabel")} /><Tooltip position="below" trigger={<InfoIcon outline className="info-icon" size="small" />} content={this.localize("titleInfo")} />
                <Flex.Item push>
                  {this.getTitleError()}
                </Flex.Item>
              </Flex>
              <Flex gap="gap.smaller" className="input-label-space-between">
                <Flex.Item>
                  <Input maxLength={Resources.postTitleMaxLength} placeholder={this.localize("titlePlaceholder")} fluid value={this.state.postDetails.title} onChange={(event: {target}) => this.onHeadingChange(event.target.value)} />
                </Flex.Item>
              </Flex>

              <Flex gap="gap.smaller" className="input-fields-margin-between-add-post">
                <Text className="form-label" content={"*" + this.localize("descriptionFormLabel")} /><Tooltip position="below" trigger={<InfoIcon outline className="info-icon" size="small" />} content={this.localize("descriptionInfo")} />
                <Flex.Item push>
                  {this.getDescriptionError()}
                </Flex.Item>
              </Flex>
              <Flex gap="gap.smaller" className="text-area input-label-space-between">
                <Flex.Item>
                  <TextArea maxLength={Resources.postDesriptionMaxLength} placeholder={this.localize("descriptionPlaceholder")} fluid className="text-area" value={this.state.postDetails.description} onChange={(event: {target}) => this.onDescriptionChange(event.target.value)} />
                </Flex.Item>
              </Flex>

              <Flex gap="gap.smaller" className="input-fields-margin-between-add-post">
                <Text className="form-label" content={"*" + this.localize("linkFormLabel")} /><Tooltip position="below" trigger={<InfoIcon outline className="info-icon" size="small" />} content={this.localize("linkInfo")} />
                <Flex.Item push>
                  {this.getLinkError()}
                </Flex.Item>
              </Flex>
              <Flex gap="gap.smaller" className="input-label-space-between">
                <Flex.Item>
                  <Input maxLength={Resources.postContentUrlMaxLength} placeholder={this.localize("linkPlaceholder")} fluid value={this.state.postDetails.contentUrl} onChange={(event: {target}) => this.onLinkChange(event.target.value)} />
                </Flex.Item>
              </Flex>

              <Flex gap="gap.smaller" className="input-fields-margin-between-add-post">
                <Text className="form-label" content={this.localize("tagsFormLabel")} /><Tooltip position="below" trigger={<InfoIcon outline className="info-icon" size="small" />} content={this.localize("tagInfo")} />
                <Flex.Item push>
                  <div>
                    {this.getTagError()}
                  </div>
                </Flex.Item>
              </Flex>
              <Flex gap="gap.smaller" vAlign="center" className="input-label-space-between">
                <Input maxLength={Resources.tagMaxLength} placeholder={this.localize("tagPlaceholder")} fluid value={this.state.tag} onKeyDown={this.onTagKeyDown} onChange={(event: {target}) => this.onTagChange(event.target.value)} />
                <Flex.Item push>
                  <div></div>
                </Flex.Item>
                <AddIcon key="search" onClick={this.onTagAddClick} className="add-icon icon-hover" />
              </Flex>
              <Flex gap="gap.smaller" className="tags-flex" vAlign="center">
                <div>
                  {
                    this.state.tagsList.map((value: string, index: number) => {
                      if (value.trim().length) {
                        return (
                          <Label
                            circular
                            content={<Text className="tag-text-form" content={value.trim()} title={value.trim()} size="small" />}
                            className={this.state.theme === Resources.dark ? "tags-label-wrapper-dark" : "tags-label-wrapper"}
                            icon={<CloseIcon key={index} className="icon-hover" onClick={() => this.onTagRemoveClick(index)} />}
                          />
                        )
                      }
                    })
                  }
                </div>
              </Flex>
            </div>
          </Flex>
          <Flex className="dialog-footer-wrapper">
            <Flex gap="gap.smaller" className="dialog-footer input-fields-margin-between-add-post">
              <Flex.Item push>
                <Button content={this.localize("submit")} primary loading={this.state.isLoading} disabled={this.state.isLoading} onClick={this.onSubmitClick} />
              </Flex.Item>
            </Flex>
          </Flex>
        </Provider>
      );
    }
}

export default withTranslation()(EditItemDialogContent)
// <copyright file="private-list.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Loader } from "@fluentui/react-northstar";
import PrivateListTable from "./private-list-table";
import { generateColor } from "../../helpers/helper";
import { getUserPrivateListPosts, deletePrivatePostContent } from "../../api/private-list-api";
import NoPrivatePosts from './no-private-posts';
import { IDiscoverPost } from "../card-view/discover-wrapper-page";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";
import NotificationMessage from "../notification-message/notification-message";

import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/site.css";

interface IPrivateListState {
    isLoading: boolean;
    discoverPosts: Array<IDiscoverPost>;
    alertMessage: string;
    alertType: number;
    showAlert: boolean;
    screenWidth: number;
}

class PrivateListWrapperPage extends React.Component<WithTranslation, IPrivateListState> {
    localize: TFunction;
    authorAvatarBackground: Array<any>;

    constructor(props: any) {
        super(props)
        let colors = localStorage.getItem("avatar-colors");
        this.localize = this.props.t;
        window.addEventListener("resize", this.update);
        this.authorAvatarBackground = colors === null ? [] : JSON.parse(colors!);

        this.state = {
            isLoading: true,
            discoverPosts: [],
            alertMessage: "",
            alertType: 0,
            showAlert: false,
            screenWidth: 0
        }
    }

    /**
   *Sets state for showing alert notification.
   *@param content Notification message
   *@param type Boolean value indicating 1- Success 2- Error
   */
    showAlert = (content: string, type: number) => {
        this.setState({ alertMessage: content, alertType: type, showAlert: true }, () => {
            setTimeout(() => {
                this.setState({ showAlert: false })
            }, 4000);
        });
    }

    /**
    *Sets state for hiding alert notification.
    */
    hideAlert = () => {
        this.setState({ showAlert: false })
    }

    /**
    * Used to initialize Microsoft Teams sdk
    */
    async componentDidMount() {
        this.setState({ isLoading: true });
        this.getUserPrivateListPosts();
        window.addEventListener("resize", this.update.bind(this));
        this.update();
    }

    /**
    * get screen width real time
    */
    update = () => {
        if (window.innerWidth !== this.state.screenWidth) {
            this.setState({ screenWidth: window.innerWidth });
        }
    };

    /**
    * Fetch posts for user private list tab from API
    */
    getUserPrivateListPosts = async () => {
        let allposts = new Array<any>();
        let response = await getUserPrivateListPosts();
        if (response.status === 200 && response.data) {
            response.data.map((post: IDiscoverPost) => {
                let searchedAuthor = this.authorAvatarBackground.find((author) => author.id === post.userId);
                if (searchedAuthor) {
                    post.avatarBackgroundColor = searchedAuthor.color;
                }
                else {
                    let color = generateColor();
                    this.authorAvatarBackground.push({ id: post.userId, color: color });
                    post.avatarBackgroundColor = color;

                    localStorage.setItem("avatar-colors", JSON.stringify(this.authorAvatarBackground));
                }

                allposts.push(post)
            });

            this.setState({
                discoverPosts: allposts
            });
        }

        this.setState({
            isLoading: false
        });
    }

    /**
    * Delete the post from private post list.
    * @param postId Id of the post
    */
    handleDeletePrivatePost = async (postId: string) => {
        let selectedBlogPost = this.state.discoverPosts.filter((blogPost: IDiscoverPost) => {
            return blogPost.postId === postId;
        });

        if (selectedBlogPost && selectedBlogPost.length) {
            let postContent = {
                postId: selectedBlogPost[0].postId,
                userId: selectedBlogPost[0].userId
            };
            let response = await deletePrivatePostContent(postContent);

            if (response.status === 200 && response.data) {
                let filteredBlogPosts = this.state.discoverPosts.filter((blogPost: IDiscoverPost) => {
                    return blogPost.postId !== postId;
                });
                this.setState({
                    discoverPosts: filteredBlogPosts
                });

                this.showAlert(this.localize("deletePostFromPrivateListSuccess"), 1);
            }
            else {
                this.showAlert(this.localize("postDeletedError"), 2);
            }
        }
    }

    /**
     * Private list tab, hyperlink on title field.
     * @param contentUrl redirect url of the post.
     */
    ontitleClick(contentUrl: string) {
        window.open(contentUrl, "_blank");
    }

    /**
    * Renders the component
    */
    public render(): JSX.Element {
        return (
            <div className="container-div">
                <NotificationMessage onClose={this.hideAlert} showAlert={this.state.showAlert} content={this.state.alertMessage} notificationType={this.state.alertType} />
                <div className="container-subdiv">
                    {this.getWrapperPage()}
                </div>
            </div>
        );
    }

    /**
    *Get wrapper for page which acts as container for all child components
    */
    private getWrapperPage = () => {
        if (this.state.isLoading) {
            return (
                <div className="container-div">
                    <div className="container-subdiv">
                        <div className="loader">
                            <Loader />
                        </div>
                    </div>
                </div>
            );
        } else {
            return this.state.discoverPosts.length ?
                <PrivateListTable
                    screenWidth={this.state.screenWidth}
                    onTitleClick={this.ontitleClick}
                    privateListData={this.state.discoverPosts}
                    onDeleteButtonClick={this.handleDeletePrivatePost} />
                : <NoPrivatePosts />
        }
    }
}

export default withTranslation()(PrivateListWrapperPage)
import { ReactElement, useState, useEffect } from "react";
import { app, chat, people, mail } from "@microsoft/teams-js";
import './sample/Welcome.css'
import { Button, ChatIcon, Flex, InfoIcon, Input, ParticipantAddIcon, TextArea, Text, EmailIcon } from "@fluentui/react-northstar";


export default function NavigateWithinHub(): ReactElement {
    const [selectedUsersList, setSelectedUsersList] = useState([] as people.PeoplePickerResult[]);
    const [groupChatTitleTxt, setGroupChatTitleTxt] = useState("" as string);
    const [groupMessageTxt, setGroupMessageTxt] = useState("" as string);
    const [emailTxt, setEmailTxt] = useState("" as string);
    const [context, setContext] = useState({} as app.Context);
    const [currentHubName, setCurrentHubName] = useState("");

    useEffect(() => {

        if (!app.isInitialized()) {
            app.initialize();
        }

        app.getContext().then((context) => {
            setContext(context);
            console.log(context);
        }).catch((err) => {
            console.error("Error getting context -> ", err);
        });


    }, []);

    useEffect(() => {
        if (context && Object.keys(context).length > 0 && currentHubName !== context.app.host.name) {
            setCurrentHubName(context.app.host.name);
        }

    }, [context, currentHubName])

    const renderTeamsUI = () => {
        return <>
            <h1 className="center">Chat functionality</h1>
            <p className="center">Select users and start a group chat and it will open default chat application(MS Teams in this instance) app from any hub.</p>
            <div className="sections">
                <div id="open-chat-section">
                    <Flex column gap="gap.small" space="between">
                        {(!people.isSupported() || !chat.isSupported()) && (
                            <Flex.Item grow>
                                <Flex gap="gap.small" vAlign="center" >
                                    <InfoIcon color="red" /> <Text color="red" content="Functionality not supported in this hub." important weight="bold" />
                                </Flex>
                            </Flex.Item>
                        )}
                        <Flex.Item grow>
                            <Flex gap="gap.small" vAlign="center" >
                                <p>Select users to start your group chat with: </p>
                                <Button content={selectedUsersList && selectedUsersList.length > 0 ? `${selectedUsersList.length} users selected ` : ""} primary icon={<ParticipantAddIcon />} onClick={() => {
                                    if (people.isSupported()) {
                                        const peoplePromise = people.selectPeople({ title: 'Select people to chat with', openOrgWideSearchInChatOrChannel: true, singleSelect: false, setSelected: (selectedUsersList.map(x => x.objectId) as string[]) });
                                        peoplePromise.then((result) => {
                                            setSelectedUsersList(result);
                                            console.log(result);
                                        }).catch((err) => {
                                            console.error(err);
                                        })
                                    }
                                    else {
                                        alert("Functionality not supported in this hub");
                                    }
                                }} />
                            </Flex>
                        </Flex.Item>
                        <Input clearable fluid inverted defaultValue={groupChatTitleTxt} value={groupChatTitleTxt} onChange={(e: any) => {
                            setGroupChatTitleTxt(e.target.value);
                        }} placeholder="Enter topic for the chat" />
                        <TextArea fluid inverted defaultValue={groupMessageTxt} value={groupMessageTxt} onChange={(e: any) => {
                            setGroupMessageTxt(e.target.value);
                        }} resize="vertical" placeholder="Enter message you want to send when the chat is opened" style={{ height: '120px' }} />
                        <Button disabled={!groupChatTitleTxt || !groupMessageTxt || selectedUsersList.length === 0} content="Open chat" primary icon={<ChatIcon />} style={{ marginRight: '10px' }} onClick={() => {
                            if (chat.isSupported()) {
                                const emailList = (selectedUsersList.map(x => x.email)) as string[];
                                const chatPromise = chat.openGroupChat({ users: emailList, topic: groupChatTitleTxt, message: groupMessageTxt });
                                chatPromise.then((result) => {
                                    /*Successful operation*/
                                    console.log(result);
                                }).catch((error) => {
                                    /*Unsuccessful operation*/
                                    console.error(error);
                                });
                            }
                            else {
                                alert("Functionality not supported in this hub");
                            }
                        }} />
                    </Flex>
                </div>
            </div>
        </>;
    }
    const renderOutlookUI = () => {
        return <>
            <h1 className="center">Mail functionality</h1>
            <p className="center">Enter email addresses to start composing your email.</p>
            <div className="sections">
                <div id="open-chat-section">
                    <Flex column gap="gap.small" space="between">
                        <Input clearable fluid inverted defaultValue={emailTxt} value={emailTxt} onChange={(e: any) => {
                            setEmailTxt(e.target.value);
                        }} placeholder="Enter email" />
                        <Input clearable fluid inverted defaultValue={groupChatTitleTxt} value={groupChatTitleTxt} onChange={(e: any) => {
                            setGroupChatTitleTxt(e.target.value);
                        }} placeholder="Enter mail subject" />
                        <TextArea fluid inverted defaultValue={groupMessageTxt} value={groupMessageTxt} onChange={(e: any) => {
                            setGroupMessageTxt(e.target.value);
                        }} resize="vertical" placeholder="Enter mail body" style={{ height: '120px' }} />
                        <Button disabled={!groupChatTitleTxt || !groupMessageTxt || !emailTxt} content="Open Mail" primary icon={<EmailIcon />} style={{ marginRight: '10px' }} onClick={() => {
                            if (mail.isSupported()) {
                                const mailPromise = mail.composeMail(
                                    {
                                        toRecipients: [emailTxt],
                                        type: mail.ComposeMailType.New,
                                        subject: groupChatTitleTxt,
                                        message: groupMessageTxt
                                    }
                                )
                                mailPromise.then((result) => {
                                    /*Successful operation*/
                                    console.log(result);
                                }).catch((error) => {
                                    /*Unsuccessful operation*/
                                    console.error(error);
                                });
                            }
                            else {
                                alert("Functionality not supported in web version. Please use Outlook desktop app to test it.");
                            }
                        }} />
                    </Flex>
                </div>
            </div>
        </>
    }
    const renderOfficeUI = () => {
        return <><h2>Capablities not supported</h2></>
    }
    const renderUIBasedOnHub = () => {

        if (!currentHubName || currentHubName === "") {
            return <h2>Loading...</h2>
        }
        if (currentHubName === "Teams")
            return renderTeamsUI();
        if (currentHubName === "Outlook")
            return renderOutlookUI();
        if (currentHubName === "Office")
            return renderOfficeUI();

    }
    return (
        <div>
            <div className="welcome page">
                <div className="narrow page-padding">
                    {renderUIBasedOnHub()}
                </div>
            </div>
        </div>
    );
}
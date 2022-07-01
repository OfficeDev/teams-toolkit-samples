import { ReactElement, useState } from "react";

import { chat, people } from "@microsoft/teams-js";
import './sample/Welcome.css'

import { Button, ChatIcon, Flex, Input, ParticipantAddIcon, TextArea } from "@fluentui/react-northstar";

export default function NavigateWithinHub(): ReactElement {
    const [selectedUsersList, setSelectedUsersList] = useState([] as people.PeoplePickerResult[]);
    const [groupChatTitleTxt, setGroupChatTitleTxt] = useState("" as string);
    const [groupMessageTxt, setGroupMessageTxt] = useState("" as string);

    return (
        <div>
            <div className="welcome page">
                <div className="narrow page-padding">
                    <h1 className="center">App to hub scenario #2- Chat functionality</h1>
                    <p className="center">Select users and start a group chat and it will open default chat application(MS Teams in this instance) app from any hub.</p>

                    <div className="sections">
                        <div id="open-chat-section">
                            <Flex column gap="gap.small" space="between">
                                <Flex.Item grow>
                                    <Flex gap="gap.small" vAlign="center" >
                                        <p>Select users to start your group chat with: </p>
                                        <Button content={selectedUsersList && selectedUsersList.length > 0 ? `${selectedUsersList.length} users selected ` : ""} primary icon={<ParticipantAddIcon />} onClick={() => {
                                            if (people.isSupported()) {
                                                const peoplePromise = people.selectPeople({ title: 'Select people to chat with', openOrgWideSearchInChatOrChannel: true, singleSelect: false, setSelected: (selectedUsersList.map(x => x.objectId) as string[]) })
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
                </div>
            </div>

        </div>
    );

}

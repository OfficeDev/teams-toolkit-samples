// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Text } from "@fluentui/react-northstar";
import { LikeIcon } from "@fluentui/react-icons-northstar";

interface IUpvotesProps {
    upvoteCount: string;
    isSelected: boolean;
    onVoteClick: () => void;
}

const Upvotes: React.FunctionComponent<IUpvotesProps> = props => {

  return (
    <div className="like-count-wrapper" onClick={() => props.onVoteClick()}>
      <Text className="like-count-text" content={props.upvoteCount} title={props.upvoteCount} size="small" />
      {!props.isSelected ? <LikeIcon outline={true} className="vote-icon" /> : <LikeIcon outline={false} className=" vote-icon-filled" />}
    </div>
  );
}

export default React.memo(Upvotes);
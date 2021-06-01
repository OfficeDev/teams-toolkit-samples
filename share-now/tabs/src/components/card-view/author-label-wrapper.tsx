// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Label, Text } from "@fluentui/react-northstar";

interface IAuthorProps {
    authorName: string;
    authorImageUrl?: string;
    showImage: boolean;
}

const AuthorLabelWrapper: React.FunctionComponent<IAuthorProps> = props => {
  if (props.showImage) {
    return (
      <Label
        content={<Text content={props.authorName} weight="semibold" className="author-name" title={props.authorName} size="small" />}
        circular
        className="author-name-container"
        image={{
          src: props.authorImageUrl,
          avatar: true,
        }}
      />
    );
  }
  else {
    return (
      <Label
        className="author-name-container"
        content={<Text content={props.authorName} weight="semibold" className="author-name" title={props.authorName} size="small" />}
        circular
      />
    );
  }
}

export default React.memo(AuthorLabelWrapper);
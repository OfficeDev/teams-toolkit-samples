// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Label, Text } from "@fluentui/react-northstar";
import { CloseIcon } from "@fluentui/react-icons-northstar";

import "../../styles/card.css";

interface ITagProps {
    tagContent: string;
    index: number;
    showRemoveIcon: boolean;
    onRemoveClick?: (index: number) => void
}

const Tag: React.FunctionComponent<ITagProps> = props => {

  /**
    *Invoked when 'X' icon is clicked of the label and passes control back to parent component.
    */
  const onRemoveClick = () => {
    props.onRemoveClick?.(props.index);
  }

  // Check whether remove icon is to be displayed or not
  if (props.showRemoveIcon) {
    return (
      <Label
        circular
        content={<Text className="tag-text-form" content={props.tagContent} title={props.tagContent} size="small" />}
        className="tags-label-wrapper"
        icon={<CloseIcon key={props.index} onClick={onRemoveClick} />}
      />
    );
  }
  else {
    return (
      <Label
        key={props.index}
        circular
        content={<div className="tag-text-card"><Text className="tag-text-card" content={props.tagContent} title={props.tagContent} size="small" /></div>}
        className="tags-label-wrapper"
      />
    );
  }
}

export default React.memo(Tag);
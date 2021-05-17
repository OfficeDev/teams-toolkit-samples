// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Text, Status, Flex } from "@fluentui/react-northstar";
import { useTranslation } from 'react-i18next';
import { IPostType } from "../../constants/resources";
import { getLocalizedPostTypes } from "../../helpers/helper";

interface ITypeLabelProps {
    postType: number;
    size: "small" | "smaller" | "smallest" | "medium" | "large" | "larger" | "largest";
}

const TypeLabel: React.FunctionComponent<ITypeLabelProps> = props => {
  const localize = useTranslation().t;
  const postTypes: Array<IPostType> = getLocalizedPostTypes(localize);

  const postType = postTypes.filter((value) => {
    if (value.id === props.postType) {
      return value;
    }
  });
  return (
    <Flex vAlign="center">
      <Status styles={{ backgroundColor: postType[0].color }} />&nbsp;<Text content={postType[0].name} title={postType[0].name} size={props.size} />
    </Flex>
  );
}

export default React.memo(TypeLabel);
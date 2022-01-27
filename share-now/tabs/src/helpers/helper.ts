// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IPostType } from "../constants/resources";
import Resources from "../constants/resources";
import { TFunction } from "i18next";

/**
* Get localized post types.
* @param localize i18n TFunction received from props.
*/
export const getLocalizedPostTypes = (localize: TFunction): Array<IPostType> => {
  return Resources.postTypes.map((value: IPostType) => {
    switch (value.id) {
    case 1:
      value.name = localize("blogPostType");
      return value;

    case 2:
      value.name = localize("otherPostType");
      return value;

    case 3:
      value.name = localize("podCasePostType");
      return value;

    case 4:
      value.name = localize("videoPostType");
      return value;

    case 5:
      value.name = localize("bookPostType");
      return value;

    default:
      return value;
    }
  });
}

/**
* Get random colors for avatar.
*/
export const generateColor:()=>string = () => {
  return Resources.avatarColors[Math.floor(Math.random() * Resources.avatarColors.length)];
}

/**
* get initial of user names to show in avatar.
*/
export const getInitials:(string) => string = (userPostName: string) => {
  const fullName = userPostName;
  const names = fullName.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
}
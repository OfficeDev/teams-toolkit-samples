// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface IPostType {
    name: string;
    id: number;
    color: string;
}

export default class Resources {

    // Themes
    public static readonly body: string = "body";
    public static readonly theme: string = "theme";
    public static readonly default: string = "default";
    public static readonly light: string = "light";
    public static readonly dark: string = "dark";
    public static readonly contrast: string = "contrast";

    // KeyCodes
    public static readonly keyCodeEnter: number = 13;
    public static readonly keyCodeSpace: number = 32;

    // Screen size
    public static readonly screenWidthLarge: number = 1200;
    public static readonly screenWidthSmall: number = 1000;

    // Bot commands
    public static readonly submitPreferencesTaskModule: string = "submit";
    public static readonly closePreferencesTaskModule: string = "close";

    // Text
    public static readonly weeklyDigestFrequencyText: string = "Weekly";
    public static readonly monthlyDigestFrequencyText: string = "Monthly";
    public static readonly digestFrequencyRadioName: string = "frequency";

    public static readonly lazyLoadPerPagePostCount: number = 50;
    public static readonly maxPrivateListPostCount: number = 50;
    public static readonly postTitleMaxLength: number = 100;
    public static readonly postDesriptionMaxLength: number = 500;
    public static readonly postDesriptionMinLength: number = 20;
    public static readonly postContentUrlMaxLength: number = 400;
    public static readonly tagMaxLength: number = 20;
    public static readonly tagsMaxCount: number = 3;
    public static readonly tagsMaxCountPreferences: number = 5;

    public static readonly urlValidationRegEx: RegExp = /^http(s)?:\/\/(www\.)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    public static readonly postTypes: Array<IPostType> = [
      { name: "Blog post", id: 1, color: "#E4A512" },
      { name: "Other", id: 2, color: "#1E53A3" },
      { name: "Podcast", id: 3, color: "#2B9B62" },
      { name: "Video", id: 4, color: "#CA4A55" },
      { name: "Book", id: 5, color: "#7F7F86" }
    ];

    public static readonly sortBy: Array<IPostType> = [
      { name: "Newest", id: 0, color: "" },
      { name: "Popularity", id: 1, color: "" }
    ];

    public static readonly avatarColors: Array<string> = [
      "#B3DBF2", "#A7CFE8", "#92E0EA", "#ABDDD3", "#F7B189",
      "#EE9889", "#EEC7C2", "#FAC1B4", "#FFB8C6", "#D8A3D8",
      "#BBB0D6", "#B4A0FF", "#AAE5AA", "#E6EDC0"];
}
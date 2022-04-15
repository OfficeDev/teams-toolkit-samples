/**
 * Adaptive card data model bound to the card template in `adaptiveCards/notification-default.json`.
 * For more details of the Adaptive Card schema, you can refer to https://adaptivecards.io/explorer/AdaptiveCard.html.
 */
export interface CardData {
    title: string;
    appName: string;
    description: string;
    notificationUrl: string;
}

/**
 * Adaptive card data model that bound to the ColumnSet template in `adaptiveCards/notification-columnset.json`.
 * For more details of the ColumnSet schema, you can refer to https://adaptivecards.io/explorer/ColumnSet.html
 */
export interface ColumnsetData extends CardData {
    data: { property1: string, property2: string, property3: string }[];
}

/**
 * Adaptive card data model that bound to the FactSet template in `adaptiveCards/notification-factset.json`.
 * For more details of the FactSet schema, you can refer to https://adaptivecards.io/explorer/FactSet.html
 */
export interface FactsetData extends CardData {
    factSet: { property1: string, property2: string, property3: string };
}

/**
 * Adaptive card data model that bound to the List template in `adaptiveCards/notification-list.json`.
 * For more details of the List schema, you can refer to https://adaptivecards.io/explorer/ColumnSet.html
 */
export interface ListData extends CardData {
    data: string[];
}

/**
 * Adaptive card data model that bound to the Mention template in `adaptiveCards/notification-mention.json`.
 * For more details of the Mention schema, you can refer to https://docs.microsoft.com/microsoftteams/platform/task-modules-and-cards/cards/cards-format?tabs=adaptive-md%2Cconnector-html#mention-support-within-adaptive-cards
 */
export interface MentionData extends CardData {
    userId: string;
    userName: string;
}

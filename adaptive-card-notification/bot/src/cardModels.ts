/**
 * Adaptive card data model bound to the card template.
 */
export interface CardData {
    title: string;
    appName: string;
    description: string;
    notificationUrl: string;
}

/**
 * Columnset sample data model bound to the columnset card template.
 */
export interface ColumnsetData extends CardData {
    data: { property1: string, property2: string, property3: string }[];
}

/**
 * Factset sample data model bound to the factset card template.
 */
export interface FactsetData extends CardData {
    factSet: { property1: string, property2: string, property3: string };
}

/**
 * List sample data model bound to the list card template.
 */
export interface ListData extends CardData {
    data: string[];
}

/**
 * Mention sample data model bound to the mention card template.
 */
export interface MentionData extends CardData {
    userId: string;
    userName: string;
}

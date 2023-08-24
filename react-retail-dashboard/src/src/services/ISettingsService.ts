import { RetailSettings } from "./RetailSettings";

/**
 * Defines the abstract interface for the Settings Service
 */
export interface ISettingsService {

    /**
     * Saves the settings
     */
    Save: (settings: RetailSettings) => Promise<void>;

    /**
     * Loads the settings
     */
    Load: () => Promise<RetailSettings>;

    /**
     * Checks if the current user is an admin in the app catalog
     * @returns True if the current user is an admin, false otherwise
     */
    UserIsAppCatalogAdmin: () => Promise<boolean>;
}
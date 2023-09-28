import { RetailSettings } from "../../../services/RetailSettings";

export interface ISettingsDialogContentProps {
    currentSettings: RetailSettings;
    cancel: () => Promise<void>;
    save: (settings: RetailSettings) => Promise<void>;
}
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import styles from './SettingsDialog.module.scss';
import * as strings from 'RetailHomeWebPartStrings';

import {
    PrimaryButton,
    DefaultButton,
    DialogFooter,
    DialogContent,
    Toggle,
    TextField
} from '@fluentui/react';

import { ISettingsDialogContentProps } from './ISettingsDialogContentProps';
import { ISettingsDialogContentState } from './ISettingsDialogContentState';

import { RetailSettings } from '../../../services/RetailSettings';

class SettingsDialogContent extends
  React.Component<ISettingsDialogContentProps, ISettingsDialogContentState> {

    public constructor(props: ISettingsDialogContentProps) {
        super(props);

        this.state = {
            useMockData: props.currentSettings.useMockData,
            apiBaseUrl: props.currentSettings.apiBaseUrl
        };
    }

    public render(): JSX.Element {

        const {
            cancel,
            save
        } = this.props;

        return (<div className={styles.settingsDialogRoot}>
            <DialogContent
                title={strings.Settings.DialogTitle}
                subText={strings.Settings.DialogDescription}
                onDismiss={cancel}>

                <div className={styles.settingsDialogContent}>
                    <div>
                        <Toggle label={strings.Settings.UseMockDataLabel}
                            onText={strings.Settings.UseMockDataOnText}
                            offText={strings.Settings.UseMockDataOffText}
                            checked={this.state.useMockData}
                            onChange={(ev, checked) => this.setState({ useMockData: checked })} />
                    </div>
                    <div>
                        <TextField label={strings.Settings.ApiBaseUrlLabel}
                            value={this.state.apiBaseUrl}
                            disabled={this.state.useMockData}
                            onChange={(ev, newValue) => this.setState({ apiBaseUrl: newValue })} />
                    </div>
                </div>

                <DialogFooter>
                    <DefaultButton text={strings.Settings.CancelButton}
                            title={strings.Settings.CancelButton} onClick={cancel} />
                    <PrimaryButton text={strings.Settings.SaveButton} 
                        title={strings.Settings.SaveButton} onClick={() => save({ useMockData: this.state.useMockData, apiBaseUrl: this.state.apiBaseUrl })} />
                </DialogFooter>
            </DialogContent>
        </div>);
    }
}

export default class SettingsDialog extends BaseDialog {

    public currentSettings: RetailSettings;
    public cancel: () => Promise<void>;
    public save: (settings: RetailSettings) => Promise<void>;

    /**
     * Constructor to initialize fundamental properties
     */
    public constructor() {
        super();
    }

    public render(): void {

        ReactDOM.render(<SettingsDialogContent
            currentSettings={this.currentSettings}
            cancel={ this._cancel }
            save={ this._save }
        />, this.domElement);
    }

    public getConfig(): IDialogConfiguration {
        return {
            isBlocking: false
        };
    }

    private _cancel = async (): Promise<void> => {
        await this.close();
        await this.cancel();
    }

    private _save = async (settings: RetailSettings): Promise<void> => {
        await this.close();
        await this.save(settings);
    }

    protected onAfterClose(): void {
        super.onAfterClose();

        // Clean up the element for the next dialog
        ReactDOM.unmountComponentAtNode(this.domElement);
    }
}
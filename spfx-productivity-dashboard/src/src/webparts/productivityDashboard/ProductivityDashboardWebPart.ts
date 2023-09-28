import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { Providers, SharePointProvider } from '@microsoft/mgt-spfx';

import styles from './ProductivityDashboardWebPart.module.scss';

export interface IProductivityDashboardWebPartProps {
}

export default class ProductivityDashboardWebPart extends BaseClientSideWebPart<IProductivityDashboardWebPartProps> {
  protected onInit(): Promise<void> {
    if (!Providers.globalProvider) {
      Providers.globalProvider = new SharePointProvider(this.context);
    }

    return super.onInit();
  }

  public render(): void {
    this.domElement.innerHTML = `<div class="${styles.productivityDashboard}">
    <div>
      <mgt-person person-query="me" view="oneline"></mgt-person>
    </div>
    <div class="${styles.features}">
      <div class="${styles.header}">
        <div class="${styles.title}">
          <h2>One Productivity Hub</h2>
          <div class="${styles.row}">
              <div class="column"><h3>Calendar events</h3></div>
              <div class="column"><h3>To-do tasks</h3></div>
              <div class="column"><h3>Files</h3></div>
          </div>
        </div>
      </div>
      <div class="${styles.row}">
        <div class="column ${styles.mgtCol}"><mgt-agenda></mgt-agenda></div>
        <div class="column ${styles.mgtCol}"><mgt-todo></mgt-todo></div>
        <div class="column ${styles.mgtCol}"><mgt-file-list></mgt-file-list></div>
      </div>
    </div>
  </div>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

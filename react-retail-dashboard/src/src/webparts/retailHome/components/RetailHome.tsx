import * as React from 'react';
import styles from './RetailHome.module.scss';
import * as strings from 'RetailHomeWebPartStrings';
import { IRetailHomeProps } from './IRetailHomeProps';
import { IRetailHomeState } from './IRetailHomeState';

import { WidgetSize, Dashboard, IWidget } from '@pnp/spfx-controls-react/lib/Dashboard';
import { Spinner, SpinnerSize, initializeIcons, IIconProps, IconButton  } from '@fluentui/react';

import { TopSellerProduct } from '../../../components/TopSellerProduct/TopSellerProduct';
import { ProductsOnLaunch } from '../../../components/ProductsOnLaunch/ProductsOnLaunch';
import { ReturnReasons } from '../../../components/ReturnReasons/ReturnReasons';
import { CurrentInventory } from '../../../components/CurrentInventory/CurrentInventory';
import { CustomerSatisfaction } from '../../../components/CustomerSatisfaction/CustomerSatisfaction';
import { QuarterlyRevenues } from '../../../components/QuarterlyRevenues/QuarterlyRevenues';
import { ReturnVolumes } from '../../../components/ReturnVolumes/ReturnVolumes';
import SettingsDialog from './SettingsDialog';
import { RetailSettings } from '../../../services/RetailSettings';

const settingsIcon: IIconProps = { iconName: 'Settings' };

export default class RetailHome extends React.Component<IRetailHomeProps, IRetailHomeState> {

  constructor(props: IRetailHomeProps) {
    super(props);

    // Initialize Office UI Fabric icons
    initializeIcons();
    
    // Initialize the state
    this.state = {
      isLoading: true,
      userIsAppCatalogAdmin: false
    };
  }

  public render(): React.ReactElement<IRetailHomeProps> {
    let content: JSX.Element = null;

    content = <Dashboard widgets={this.getHomeWidgets()} />;

    return (
      <div className={styles.retailHome}>
        {this.state.userIsAppCatalogAdmin &&
          <div className={styles.settingsArea}>
            <IconButton iconProps={settingsIcon} 
              aria-label={strings.Settings.ShowSettingsButton}
              text={strings.Settings.ShowSettingsButton}
              onClick={this._onConfigure} />
          </div>
        }
        {this.state.isLoading && <Spinner size={SpinnerSize.large} title={strings.Generic.Loading} className={styles.loader} />}
        {!this.state.isLoading && content}
      </div>
    );
  }

  componentDidMount(): void {
    setTimeout(async () => {
      const userIsAdmin: boolean = await this.props.settingsService.UserIsAppCatalogAdmin();
      this.setState({
        isLoading: false,
        userIsAppCatalogAdmin: userIsAdmin
      })
    }, 50);
  }

  private _onConfigure = async (): Promise<void> => {
    // Prepare the settings dialog
    const settingsDialog: SettingsDialog = new SettingsDialog();
    settingsDialog.currentSettings = await this.props.settingsService.Load();
    settingsDialog.cancel = async (): Promise<void> => { 
      // Do nothing in case of cancel
      console.log('Cancel');
    };
    settingsDialog.save = async (settings: RetailSettings): Promise<void> => { 
      // Save the settings via the settings service
      await this.props.settingsService.Save(settings);
    };

    // Show the dialog
    await settingsDialog.show();
  }

  /*
  * Get the Home Dashboard widgets
  * @returns An array of the widgets to be added to the Home Dashboard element
  */
 private getHomeWidgets() : IWidget[] {
   return [
    {
     title: strings.Home.ReturnVolumeWidgetTitle,
     size: WidgetSize.Box,
     body: [
       {
         id: "returnVolume",
         title: strings.Home.ReturnVolumeWidgetTitle,
         content: (
           this.getReturnVolumes()
         )
       }
     ]
    },
    {
     title: strings.Home.CurrentInventoryWidgetTitle,
     size: WidgetSize.Single,
     body: [
       {
         id: "currentInventory",
         title: strings.Home.CurrentInventoryWidgetTitle,
         content: (
           this.getCurrentInventory()
         )
       }
     ]
    },
    {
      title: strings.Home.CustomerSatisfactionWidgetTitle,
      size: WidgetSize.Single,
      body: [
        {
          id: "customerSatisfaction",
          title: strings.Home.CustomerSatisfactionWidgetTitle,
          content: (
            this.getCustomerSatisfaction()
          )
        }
      ]
     },
     {
      title: strings.Home.QuarterlyRevenuesWidgetTitle,
      size: WidgetSize.Single,
      body: [
        {
          id: "quarterlyRevenues",
          title: strings.Home.QuarterlyRevenuesWidgetTitle,
          content: (
            this.getQuarterlyRevenues()
          )
        }
      ]
     },
     {
      title: strings.Home.TopSellerProductWidgetTitle,
      size: WidgetSize.Single,
      body: [
        {
          id: "topSellerProduct",
          title: strings.Home.TopSellerProductWidgetTitle,
          content: (
            this.getTopSellerProduct()
          )
        }
      ]
     },
     {
      title: strings.Home.ProductsOnLaunchWidgetTitle,
      size: WidgetSize.Single,
      body: [
        {
          id: "productsOnLaunch",
          title: strings.Home.ProductsOnLaunchWidgetTitle,
          content: (
            this.getProductsOnLaunch()
          )
        }
      ]
     },
     {
      title: strings.Home.ReturnReasonsWidgetTitle,
      size: WidgetSize.Single,
      body: [
        {
          id: "returnReasons",
          title: strings.Home.ReturnReasonsWidgetTitle,
          content: (
            this.getReturnReasons()
          )
        }
      ]
     }  
  ];
 }

 /**
 * Get the content for the Return Volume widget
 * @returns Element representing the Return Volume widget
 */
  private getReturnVolumes(): JSX.Element {
    return <ReturnVolumes 
      retailDataService={this.props.retailDataService}
      settingsService={this.props.settingsService}
      maxMonths={5}
      showDetails={true}
    />;
  }

  /**
   * Get the content for the Return Volume widget
   * @returns Element representing the Return Volume widget
   */
  private getCurrentInventory(): JSX.Element {
    return <CurrentInventory 
      retailDataService={this.props.retailDataService}
      settingsService={this.props.settingsService}
    />;
  }

  /**
   * Get the content for the Return Volume widget
   * @returns Element representing the Return Volume widget
   */
  private getCustomerSatisfaction(): JSX.Element {
    return <CustomerSatisfaction 
      retailDataService={this.props.retailDataService}
      settingsService={this.props.settingsService}
    />;
  }

  /**
   * Get the content for the Return Volume widget
   * @returns Element representing the Return Volume widget
   */
  private getQuarterlyRevenues(): JSX.Element {
    return <QuarterlyRevenues 
      retailDataService={this.props.retailDataService}
      settingsService={this.props.settingsService}
    />;
  }

  /**
   * Get the content for the Return Volume widget
   * @returns Element representing the Return Volume widget
   */
  private getTopSellerProduct(): JSX.Element {
    return <TopSellerProduct
      retailDataService={this.props.retailDataService}
      settingsService={this.props.settingsService}
      />;
  }

  /**
   * Get the content for the Return Volume widget
   * @returns Element representing the Return Volume widget
   */
  private getProductsOnLaunch(): JSX.Element {
    return <ProductsOnLaunch 
      retailDataService={this.props.retailDataService}
      settingsService={this.props.settingsService} 
      />;
  }

  /**
   * Get the content for the Return Volume widget
   * @returns Element representing the Return Volume widget
   */
  private getReturnReasons(): JSX.Element {
    return <ReturnReasons 
      retailDataService={this.props.retailDataService}
      settingsService={this.props.settingsService}
    />;
  }
}

// Import the service related types
import { ISettingsService } from './ISettingsService';
import { RetailSettings } from './RetailSettings';

// Import types for supporting SPFx with the service class
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";

// Import PnPjs related types
import { spfi, SPFI, SPFx } from '@pnp/sp';
import '@pnp/sp/appcatalog';
import '@pnp/sp/appcatalog/web';
import "@pnp/sp/webs";
import "@pnp/sp/site-users/web";

/**
 * Defines the concrete implementation of the interface for the Settings Service
 */
export class SettingsService implements ISettingsService {

    public static readonly serviceKey: ServiceKey<ISettingsService> = ServiceKey.create<ISettingsService>('PnP:Retail:SettingsService', SettingsService);
    private _sp: SPFI = null;

    // private _msGraphClient: MSGraphClientV3 = null;

    /**
     * Constructor for the service class
     * @param serviceScope Service Scope to initialize the service class
     */
    public constructor(serviceScope: ServiceScope) {

        // Initialize the MSGraphClientV3 client
        serviceScope.whenFinished(async () => {
            const pageContext = serviceScope.consume(PageContext.serviceKey);
            this._sp = spfi().using(SPFx({ pageContext }));
            return;
        });
    }

    /**
     * Saves the settings
     */
    public async Save(settings: RetailSettings): Promise<void> {
        // Fixup the URL in order to end with /
        if (!(settings.apiBaseUrl.charAt(settings.apiBaseUrl.length - 1) === '/')) {
            settings.apiBaseUrl += '/';
        }

        const appCatalog = await this._sp.getTenantAppCatalogWeb();
        await appCatalog.setStorageEntity('PnP.Contoso.Retail.Settings', JSON.stringify(settings));
    }

    /**
     * Loads the settings
     */
    public async Load(): Promise<RetailSettings> {
        const appCatalog = await this._sp.getTenantAppCatalogWeb();
        const settings = await appCatalog.getStorageEntity('PnP.Contoso.Retail.Settings');
        if (settings && settings.Value) {
            return JSON.parse(settings.Value);
        } else {
            return { useMockData: true, apiBaseUrl: 'https://pnp-contoso-retail.azurewebsites.net/' };        
        }
    }

    /**
     * Checks if the current user is an admin in the app catalog
     */
    public async UserIsAppCatalogAdmin(): Promise<boolean> {
        const appcatalog = await this._sp.getTenantAppCatalogWeb();
        const currentUser = await appcatalog.currentUser();
        const isAdmin = currentUser.IsSiteAdmin;
        return isAdmin;
    }
}

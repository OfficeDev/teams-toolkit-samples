// Import the service related types
import { IRetailDataService } from './IRetailDataService';
import { 
    RetailReturnVolumes, 
    RetailReturnReasonsStats, 
    RetailInventory, 
    RetailCustomerSatisfactionStats, 
    RetailQuarterlyRevenues, 
    RetailProduct 
} from "../models";

// Import types for supporting SPFx with the service class
import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { AadHttpClientFactory, AadHttpClient, HttpClientResponse } from "@microsoft/sp-http";

// Import the Settings Service related types
import { ISettingsService } from './ISettingsService';
import { SettingsService } from './SettingsService';
import { RetailSettings } from './RetailSettings';

/**
 * Defines the concrete implementation of the interface for the Retail Data Service
 */
export class RetailDataService implements IRetailDataService {

    public static readonly serviceKey: ServiceKey<IRetailDataService> = ServiceKey.create<IRetailDataService>('PnP:Retail:RetailDataService', RetailDataService);
    private _serviceClient: AadHttpClient = null;
    private _settingsService: ISettingsService;

    /**
     * Constructor for the service class
     * @param serviceScope Service Scope to initialize the service class
     */
    public constructor(serviceScope: ServiceScope) {

        // Initialize the service instance clients
        serviceScope.whenFinished(async () => {
            const aadHttpClientFactory = serviceScope.consume(AadHttpClientFactory.serviceKey);
            this._serviceClient = await aadHttpClientFactory.getClient('api://pnp.contoso.retail');
            this._settingsService = serviceScope.consume(SettingsService.serviceKey);
        });
    }

    private async ReadApiBaseUrl(): Promise<string> {
        const settings: RetailSettings = await this._settingsService.Load();
        return settings.apiBaseUrl;
    }

    /**
     * Loads the Retail Return Volumes
     */
    public async LoadReturnVolumes(): Promise<RetailReturnVolumes> {
        // Read the API base URL
        const serviceBaseUrl: string = await this.ReadApiBaseUrl();

        // Buil the actual service endpoint URL
        const serviceEndpointUrl: string = `${serviceBaseUrl}api/ReturnVolumes`;

        // Invoke the target service endpoint
        try {
            const response: HttpClientResponse = await this._serviceClient.get(
                serviceEndpointUrl, 
                AadHttpClient.configurations.v1);  
    
            const result: RetailReturnVolumes = await response.json();
            return result;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    /**
     * Loads the Retail Return Reason stats
     */
    public async LoadReturnReasonStats(): Promise<RetailReturnReasonsStats> {
        // Read the API base URL
        const serviceBaseUrl: string = await this.ReadApiBaseUrl();

        // Buil the actual service endpoint URL
        const serviceEndpointUrl: string = `${serviceBaseUrl}api/ReturnReasonStats`;

        // Invoke the target service endpoint
        try {
            const response: HttpClientResponse = await this._serviceClient.get(
                serviceEndpointUrl, 
                AadHttpClient.configurations.v1);  
    
            const result: RetailReturnReasonsStats = await response.json();
            return result;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    /**
     * Loads the Retail Inventory
     */
    public async LoadInventory(): Promise<RetailInventory> {
        // Read the API base URL
        const serviceBaseUrl: string = await this.ReadApiBaseUrl();

        // Buil the actual service endpoint URL
        const serviceEndpointUrl: string = `${serviceBaseUrl}api/Inventory`;

        // Invoke the target service endpoint
        try {
            const response: HttpClientResponse = await this._serviceClient.get(
                serviceEndpointUrl, 
                AadHttpClient.configurations.v1);  
    
            const result: {
                inventoryDate: string; 
                womenItems: number;
                menItems: number;
                accessoriesItems: number;
                handbagsItems: number;
                salesItems: number;
                } = await response.json();

            return {
                inventoryDate: new Date(result.inventoryDate),
                womenItems: result.womenItems,
                menItems: result.menItems,
                accessoriesItems: result.accessoriesItems,
                handbagsItems: result.handbagsItems,
                salesItems: result.salesItems
            };
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    /**
     * Loads the Retail Customer Satisfaction stats
     */
    public async LoadCustomerSatisfactionStats(): Promise<RetailCustomerSatisfactionStats> {
        // Read the API base URL
        const serviceBaseUrl: string = await this.ReadApiBaseUrl();

        // Buil the actual service endpoint URL
        const serviceEndpointUrl: string = `${serviceBaseUrl}api/CustomerSatisfactionStats`;

        // Invoke the target service endpoint
        try {
            const response: HttpClientResponse = await this._serviceClient.get(
                serviceEndpointUrl, 
                AadHttpClient.configurations.v1);  
    
            const result: RetailCustomerSatisfactionStats = await response.json();
            return result;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    /**
     * Loads the Retail Quarterly Revenues stats (for the last 4 quarters)
     */
    public async LoadQuarterlyRevenues(): Promise<RetailQuarterlyRevenues[]> {

        // Prepare the result variable
        const result: RetailQuarterlyRevenues[] = [];

        // Read the API base URL
        const serviceBaseUrl: string = await this.ReadApiBaseUrl();

        // Buil the actual service endpoint URL
        const serviceEndpointUrl: string = `${serviceBaseUrl}api/QuarterlyRevenues`;

        // Invoke the target service endpoint
        try {
            const response: HttpClientResponse = await this._serviceClient.get(
                serviceEndpointUrl, 
                AadHttpClient.configurations.v1);  
    
            const serviceResult: { revenues: {
                quarter: number, 
                revenues: number; 
                }[] } = await response.json();
            
            // For each product, load the picture, fix the date and add it to the result
            for (const r of serviceResult.revenues) {
                result.push(
                    {
                        quarter: r.quarter,
                        revenues: r.revenues
                    });
            }

            return result;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    /**
     * Loads the Retail Top Seller Product
     */
    public async GetTopSellerProduct(): Promise<RetailProduct> {
        // Read the API base URL
        const serviceBaseUrl: string = await this.ReadApiBaseUrl();

        // Buil the actual service endpoint URL
        const serviceEndpointUrl: string = `${serviceBaseUrl}api/TopSellerProduct`;

        // Invoke the target service endpoint
        try {
            const response: HttpClientResponse = await this._serviceClient.get(
                serviceEndpointUrl, 
                AadHttpClient.configurations.v1);  
    
            const result: RetailProduct = await response.json();
            return result;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    /**
     * Loads the list of Retail Products on launch
     */
    public async ListProductsOnLaunch(): Promise<RetailProduct[]> {

        // Prepare the result variable
        const result: RetailProduct[] = [];

        // Read the API base URL
        const serviceBaseUrl: string = await this.ReadApiBaseUrl();

        // Buil the actual service endpoint URL
        const serviceEndpointUrl: string = `${serviceBaseUrl}api/ProductsOnLaunch`;

        // Invoke the target service endpoint
        try {
            const response: HttpClientResponse = await this._serviceClient.get(
                serviceEndpointUrl, 
                AadHttpClient.configurations.v1);  
    
            const serviceResult: { items: {
                    code: string;
                    description: string;
                    price: number;
                    picture: string;
                    launchDate: string;
                    sales: number;
                }[] } = await response.json();

            // For each product, fix the date and add it to the result
            for (const p of serviceResult.items) {
                result.push(
                    {
                        code: p.code,
                        description: p.description,
                        price: p.price,
                        sales: p.sales,
                        picture: p.picture,
                        launchDate: new Date(p.launchDate)
                    });
            }
            
            return result;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }

    /**
     * Loads the list of Retail Products in the inventory
     */
    public async ListProductsInventory(): Promise<RetailProduct[]> {

        // Prepare the result variable
        const result: RetailProduct[] = [];

        // Read the API base URL
        const serviceBaseUrl: string = await this.ReadApiBaseUrl();

        // Buil the actual service endpoint URL
        const serviceEndpointUrl: string = `${serviceBaseUrl}api/ProductsInventory`;

        // Invoke the target service endpoint
        try {
            const response: HttpClientResponse = await this._serviceClient.get(
                serviceEndpointUrl, 
                AadHttpClient.configurations.v1);  
    
            const serviceResult: { items: {
                code: string;
                description: string;
                price: number;
                picture: string;
                launchDate: string;
                sales: number;
            }[] } = await response.json();

            // For each product, fix the date and add it to the result
            for (const p of serviceResult.items) {
                result.push(
                    {
                        code: p.code,
                        description: p.description,
                        price: p.price,
                        sales: p.sales,
                        picture: p.picture,
                        launchDate: new Date(p.launchDate)
                    });
            }
            
            return result;
        }
        catch (ex) {
            console.log(ex);
            return null;
        }
    }
}

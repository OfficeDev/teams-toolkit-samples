import { TableService, createTableService } from 'azure-storage';

export class ConfigurationDataProvider {
    private readonly ConfigurationTableName: string = "ConfigurationInfo";

    private readonly ConfigurationPartitionKey: string = "ConfigurationInfo";

    private readonly ConnectionString: string;
    private tableService: TableService;

    constructor(connectionString: string) {
        this.ConnectionString = connectionString;

    }

    public async GetSavedEntityDetailAsync(entityType: string): Promise<string> {
        await this.EnsureInitialize();
        return new Promise((resolve, reject) => {
            this.tableService.retrieveEntity(this.ConfigurationTableName,
                this.ConfigurationPartitionKey, entityType,
                (error, result: any, response) => {
                    if (!error) {
                        resolve(result?.Data ?? "");
                    }
                    reject(error);
                }
            );
        });
    }

    public async EnsureInitialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.tableService) {
                resolve();
            } else {
                this.tableService = createTableService(this.ConnectionString);
                this.tableService.createTableIfNotExists(this.ConfigurationTableName, (error, result, response) => {
                    if (!error) {
                        resolve();
                    }
                    reject(error);
                })
            };
        })
    }
}
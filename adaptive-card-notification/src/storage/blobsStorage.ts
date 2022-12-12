import { ContainerClient } from "@azure/storage-blob";
import { NotificationTargetStorage } from "@microsoft/teamsfx";

// A sample implementation to use Azure Blob Storage as notification target storage
export class BlobsStorage implements NotificationTargetStorage {
  private readonly client: ContainerClient;
  private initializePromise?: Promise<unknown>;

  // This implementation uses connection string and container name to connect Azure Blob Storage
  constructor(connectionString: string, containerName: string) {
    this.client = new ContainerClient(connectionString, containerName);
  }

  async read(key: string): Promise<{ [key: string]: unknown; }> {
    await this.initialize();

    const blobName = this.normalizeKey(key);

    try {
      const stream = await this.client.getBlobClient(blobName).download();
      const content = await this.streamToBuffer(stream.readableStreamBody);
      return JSON.parse(content.toString());
    } catch (error) {
      if (error.statusCode === 404) {
        return undefined;
      } else {
        throw error;
      }
    }
  }

  async list(): Promise<{ [key: string]: unknown; }[]> {
    await this.initialize();

    const result = [];
    const blobsIter = this.client.listBlobsFlat();
    let blobItem = await blobsIter.next();
    while (!blobItem.done) {
      try {
        const stream = await this.client.getBlockBlobClient(blobItem.value.name).download();
        const content = await this.streamToBuffer(stream.readableStreamBody);
        result.push(JSON.parse(content.toString()));
      } catch (error) {
        if (error.statusCode !== 404) {
          throw error;
        }
      }
      blobItem = await blobsIter.next();
    }

    return result;
  }

  async write(key: string, object: { [key: string]: unknown; }): Promise<void> {
    await this.initialize();

    const blobName = this.normalizeKey(key);

    try {
      const content = JSON.stringify(object);
      await this.client.getBlockBlobClient(blobName).upload(content, Buffer.byteLength(content));
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }
  }

  async delete(key: string): Promise<void> {
    await this.initialize();

    const blobName = this.normalizeKey(key);

    try {
      await this.client.getBlobClient(blobName).delete();
    } catch (error) {
      if (error.statusCode !== 404) {
        throw error;
      }
    }
  }

  // Initialize to create container if not exists yet
  private initialize(): Promise<unknown> {
    if (!this.initializePromise) {
      this.initializePromise = this.client.createIfNotExists();
    }

    return this.initializePromise;
  }

  // A help method to normalize key to meet Azure Blob naming requirement
  private normalizeKey(key: string): string {
    return encodeURIComponent(key);
  }

  // A helper method used to read a Node.js readable stream into a Buffer
  private streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on("data", (data) => {
        chunks.push(Buffer.isBuffer(data) ? data : Buffer.from(data));
      });
      stream.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      stream.on("error", reject);
    });
  }
}
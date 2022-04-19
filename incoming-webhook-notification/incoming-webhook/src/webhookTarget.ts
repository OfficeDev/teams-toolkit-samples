import axios from "axios";

export class WebhookTarget {
    /**
     * The bound incoming webhook URL.
     */
    public readonly webhook: URL;
  
    /**
     * Constructor.
     * 
     * @param webhook - the incoming webhook URL.
     */
    constructor(webhook: URL) {
      this.webhook = webhook;
    }
  
    /**
     * Send a plain text message.
     *
     * @param text - the plain text message.
     * @returns A `Promise` representing the asynchronous operation.
     */
    public sendMessage(text: string): Promise<void> {
      return axios.post(
        this.webhook.toString(),
        {
          text: text,
        },
        {
          headers: { "content-type": "application/json" },
        }
      );
    }
  
    /**
     * Send an adaptive card message.
     *
     * @param card - the adaptive card raw JSON.
     * @returns A `Promise` representing the asynchronous operation.
     */
    public sendAdaptiveCard(card: unknown): Promise<void> {
      return axios.post(
        this.webhook.toString(),
        {
          type: "message",
          attachments: [
            {
              contentType: "application/vnd.microsoft.card.adaptive",
              contentUrl: null,
              content: card,
            },
          ],
        },
        {
          headers: { "content-type": "application/json" },
        }
      );
    }
}
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import * as fs from "fs-extra";
import * as path from "path";
import { IncomingWebhook } from "./incomingWebhook";

/**
 * Fill in your incoming webhook url.
 */
const webhookUrl: string = "<webhook-url>";

const incomingWebhook = new IncomingWebhook(new URL(webhookUrl));
const adaptiveCardNames = ["default", "columnset", "factset", "list", "mention"];

/**
 * Load adaptive card and send it to incoming webhook.
 */
async function sendAdaptiveCard(name: string) {
    const cardData = await fs.readJson(path.join(__dirname, `./adaptiveCards/notification-${name}.data.json`));
    const cardTemplate = await fs.readJson(path.join(__dirname, `./adaptiveCards/notification-${name}.json`));
    await incomingWebhook.sendAdaptiveCard(
        AdaptiveCards.declare(cardTemplate).render(cardData)
    );
}

/**
 * Send message.
 */
incomingWebhook.sendMessage("New Event Occurred!")
    .then(() => console.log(`Send message suffessfully.`))
    .catch(e => console.log(`Failed to send message. ${e}`));;

/**
* Send adaptive cards.
*/
for (const name of adaptiveCardNames) {
    sendAdaptiveCard(name)
        .then(() => console.log(`Send ${name} adaptive card suffessfully.`))
        .catch(e => console.log(`Failed to send ${name} adaptive card. ${e}`));
}

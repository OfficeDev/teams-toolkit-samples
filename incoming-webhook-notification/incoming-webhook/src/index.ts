import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IncomingWebhook } from "./incomingWebhook";
import template from "./adaptiveCards/notification.json";
import data from "./adaptiveCards/notification.data.json";

/**
 * Fill in your incoming webhook url.
 */
const webhookUrl: string = "<webhook-url>";
const incomingWebhook = new IncomingWebhook(new URL(webhookUrl));

/**
 * Send message.
 */
incomingWebhook.sendMessage("New Event Occurred!")
    .then(() => console.log("Send message successfully."))
    .catch(e => console.log(`Failed to send message. ${e}`));;

/**
* Send adaptive cards.
*/
incomingWebhook.sendAdaptiveCard(AdaptiveCards.declare(template).render(data))
    .then(() => console.log("Send adaptive card successfully."))
    .catch(e => console.log(`Failed to send adaptive card. ${e}`));


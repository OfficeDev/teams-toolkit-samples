import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { IncomingWebhookNotificationTarget } from "./incomingWebhookNotificationTarget";
import template from "./adaptiveCards/notification.json";

/**
 * Fill in your incoming webhook url.
 */
const webhookUrl: string = "<webhook-url>"
const notification = new IncomingWebhookNotificationTarget(new URL(webhookUrl));

/**
* Send adaptive cards.
*/
notification.sendAdaptiveCard(
    AdaptiveCards.declare(template).render(
    {
        "title": "New Event Occurred!",
        "appName": "Contoso App",
        "description": "Detailed description of what happened so the user knows what's going on.",
        "notificationUrl" : "https://www.adaptivecards.io/"
    }))
.then(() => console.log("Send adaptive card successfully."))
.catch(e => console.log(`Failed to send adaptive card. ${e}`));


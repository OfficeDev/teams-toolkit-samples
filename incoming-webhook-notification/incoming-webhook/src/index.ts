// Import required packages
import { IncomingWebhookTarget, NotificationTarget } from "@microsoft/teamsfx";
import { buildAdaptiveCard } from "./adaptiveCard";
import * as fs from "fs-extra";
import * as path from "path";

const webhookUrl: string = "<webhook-url>";
const target: NotificationTarget = new IncomingWebhookTarget(new URL(webhookUrl));
const testNames = ["default", "columnset", "factset", "list", "mention"];

async function triggerIncomingWebhook<TData, TTemplate>(dataFileName: string, templateFileName: string) {
    const cardData = await fs.readJson(dataFileName);
    const cardTemplate = await fs.readJson(templateFileName);
    await target.sendAdaptiveCard(buildAdaptiveCard(() => {
        return cardData;
    }, cardTemplate));
}

for (const name of testNames) {
    const dataFileName = path.join(__dirname, `./adaptiveCards/notification-${name}.data.json`);
    const templateFileName = path.join(__dirname, `./adaptiveCards/notification-${name}.json`);
    triggerIncomingWebhook(dataFileName, templateFileName)
    .then(() => console.log(`Send ${name} adaptive card suffessfully.`))
    .catch(e => console.log(`Failed to send ${name} adaptive card. ${e}`));
}

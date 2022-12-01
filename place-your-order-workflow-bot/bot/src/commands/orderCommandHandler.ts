import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { CommandMessage, TeamsFxBotCommandHandler, TriggerPatterns } from "@microsoft/teamsfx";
import { TurnContext, Activity, CardFactory, MessageFactory } from "botbuilder";
import orderCard from "../adaptiveCards/orderCommandResponse.json";
import { OrderData } from "../cardModels";

export class OrderCommandHandler implements TeamsFxBotCommandHandler {

    triggerPatterns: TriggerPatterns = "order";

    async handleCommandReceived(context: TurnContext, message: CommandMessage): Promise<string | void | Partial<Activity>> {
        const orderData: OrderData = {
            "FormInfo": {
                "title": "Malt & Vine Order Form"
            },
            "Order": {
                "questions": [
                    {
                        "question": "Which entree would you like?",
                        "items": [
                            {
                                "choice": "Steak",
                                "value": "Steak"
                            },
                            {
                                "choice": "Chicken",
                                "value": "Chicken"
                            },
                            {
                                "choice": "Tofu",
                                "value": "Tofu"
                            }
                        ]
                    },
                    {
                        "question": "Which side would you like?",
                        "items": [
                            {
                                "choice": "Baked Potato",
                                "value": "Baked Potato"
                            },
                            {
                                "choice": "Rice",
                                "value": "Baked Potato"
                            },
                            {
                                "choice": "Vegetables",
                                "value": "Baked Potato"
                            },
                            {
                                "choice": "Noodles",
                                "value": "Baked Potato"
                            },
                            {
                                "choice": "No Side",
                                "value": "Baked Potato"
                            }
                        ]
                    },
                    {
                        "question": "Which drink would you like?",
                        "items": [
                            {
                                "choice": "Water",
                                "value": "Water"
                            },
                            {
                                "choice": "Soft Drink",
                                "value": "Soft Drink"
                            },
                            {
                                "choice": "Coffee",
                                "value": "Coffee"
                            },
                            {
                                "choice": "Natural Juice",
                                "value": "Natural Juice"
                            },
                            {
                                "choice": "No Drink",
                                "value": "No Drink"
                            }
                        ]
                    }
                ]
            }
        }
        const cardJson = AdaptiveCards.declare(orderCard).render(orderData);
        return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
    }
}

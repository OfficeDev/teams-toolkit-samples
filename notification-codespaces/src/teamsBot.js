const { TeamsActivityHandler, MemoryStorage, UserState, ConversationState, MessageFactory, CardFactory } = require("botbuilder");
const { Utils } = require("./helpers/utils");
const rawWelcomeCard = require("./adaptiveCards/welcome-template.json");
const tourCard = require("./adaptiveCards/tour.json");

const WELCOMED_USER = 'WELCOMED_USER';
const image1 = 'https://images.unsplash.com/photo-1579353977828-2a4eab540b9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FtcGxlfGVufDB8fDB8fHww&w=1000&q=80';
const image2 = 'https://images.unsplash.com/photo-1587053522141-7baa3a8ce67a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE4fHx8ZW58MHx8fHx8&w=1000&q=80';
const image3 = 'https://images.unsplash.com/photo-1609548234532-f5aadffe1eaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fA%3D%3D&w=1000&q=80';
// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
class TeamsBot extends TeamsActivityHandler {
  userState;
  conversationState;

  constructor() {
    super();
    const memoryStorage = new MemoryStorage();
    this.conversationState = new ConversationState(memoryStorage);
    this.userState = new UserState(memoryStorage);
    this.welcomedUserProperty = this.userState.createProperty(WELCOMED_USER);
  

    this.onMembersAdded(async (context, next) => {
      // Iterate over all new members added to the conversation
      console.log("Member Added");

      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          const card = Utils.renderAdaptiveCard(rawWelcomeCard);
          await context.sendActivity({ attachments: [card] });
          break;
        }
      }
  
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMessage(async (context, next) => {
      // Read UserState. If the 'DidBotWelcomedUser' does not exist (first time ever for a user)
      // set the default to false.
      console.log("Users onMessage");
      const card = Utils.renderAdaptiveCard(rawWelcomeCard);
        await context.sendActivity({ attachments: [card] });
        
      // const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
  
      // Your bot should proactively send a welcome message to a personal chat the first time
      // (and only the first time) a user initiates a personal chat with your bot.
      // if (didBotWelcomedUser === false) {
      //     // The channel should send the user name in the 'From' object
      //     const userName = context.activity.from.name;

      //     await context.sendActivity('You are seeing this message because this was your first message ever sent to this bot.');
      //     await context.sendActivity(`It is a good practice to welcome the user and provide personal greeting. For example, welcome ${ userName }.`);
  
      //     // Set the flag indicating the bot handled the user's first message.
      //     await this.welcomedUserProperty.set(context, true);
      // } else {
      //   const card = Utils.renderAdaptiveCard(rawWelcomeCard);
      //   await context.sendActivity({ attachments: [card] });
      //   // do nothing for now
      // }
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }

  async run(context) {
    await super.run(context);

    // Save any state changes. The load happened during the execution of the Dialog.
    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
    console.log("Inside run funtion");
  }
  

  async onAdaptiveCardInvoke(context, invokeValue){
    // The verb "userlike" is sent from the Adaptive Card defined in adaptiveCards/learn.json
    if (invokeValue.action.verb === "tour") {
      const card = Utils.renderAdaptiveCard(tourCard, { title: 'Add Advocacy to chats', description:'Search for Jira tickets inside of Teams and share them as rich cards into your chats and channels.', imageUrl: image1, buttonText: 'Set Up'});
      const card2 = Utils.renderAdaptiveCard(tourCard, { title: 'Stay on top of Advocacy notifications', description:'Get all your personal Advocacy notifications collected here in Teams so you can manage your work without having to go to Advocacy or your email inbox.', imageUrl: image2, buttonText: 'Set up personal notification'});
      const card3 = Utils.renderAdaptiveCard(tourCard, { title: 'Add Advocacy to chats', description:'Perform actions such as Like, Comment and Share your advocacy content from Teams.', imageUrl: image3, buttonText: 'Check out now'});
      const message = MessageFactory.carousel([
        card, card2, card3
      ]);
      await context.sendActivity(message);
      
      return { statusCode: 200, type: undefined, value: undefined };
    }
  }
}

module.exports.TeamsBot = TeamsBot;

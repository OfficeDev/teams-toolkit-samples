import {
  ChannelInfo,
  TeamInfo,
  TeamsActivityHandler,
  TurnContext,
} from "botbuilder";

export class SimpleBot extends TeamsActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      if (context.activity.value) {
        const value = context.activity.value;
        if (value.action === "SubmitForm") {
          await context.sendActivity(`The form is submitted, your name is ${value.firstName} ${value.lastName}.`)
        }
      }

      await next();
    })

    // this.onInstallationUpdateAdd(async (context: TurnContext, next) => {
    //   await context.sendActivity("Thanks for installing me.");
    //   await next();
    // });

    // this.onInstallationUpdateRemove(async (context: TurnContext, next) => {
    //   await context.sendActivity("Thanks for uninstall me.");
    //   await next();
    // });

    // this.onMembersAdded(async (context: TurnContext, next) => {
    //   const idList = context.activity.membersAdded?.map((user) => `"${user.id}"`).join(",");
    //   await context.sendActivity(`Members added to conversation: ${idList}.`);
    //   await next();
    // });

    // this.onMembersRemoved(async (context: TurnContext, next) => {
    //   const idList = context.activity.membersRemoved?.map((user) => `"${user.id}"`).join(",");
    //   await context.sendActivity(`Members removed from conversation: ${idList}.`);
    //   await next();
    // });

    // this.onTeamsChannelCreatedEvent(
    //   async (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next) => {
    //     await context.sendActivity(
    //       `Create channel '${channelInfo.name}' in team: '${teamInfo.id}'`
    //     );
    //     await next();
    //   }
    // );

    // this.onTeamsChannelDeletedEvent(
    //   async (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next) => {
    //     await context.sendActivity(
    //       `Delete channel '${channelInfo.name}' in team: '${teamInfo.id}'`
    //     );
    //     await next();
    //   }
    // );

    // this.onTeamsChannelRenamedEvent(
    //   async (channelInfo: ChannelInfo, teamInfo: TeamInfo, context: TurnContext, next) => {
    //     await context.sendActivity(
    //       `Rename channel '${channelInfo.name}' in team: '${teamInfo.id}'`
    //     );
    //     await next();
    //   }
    // );

    // this.onTeamsTeamRenamedEvent(async (teamInfo: TeamInfo, context: TurnContext, next) => {
    //   await context.sendActivity(`Rename team '${teamInfo.name}'`);
    //   await next();
    // });

    // this.onTeamsTeamDeletedEvent(async (teamInfo: TeamInfo, context: TurnContext, next) => {
    //   await context.sendActivity(`Delete team '${teamInfo.name}'`);
    //   await next();
    // });
  }
}

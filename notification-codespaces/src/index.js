const notificationTemplate = require("./adaptiveCards/notification-default.json");
const newContentPostedNotificationTemplate = require("./adaptiveCards/new-content-posted.json");
const gamificationNotificationTempalte = require("./adaptiveCards/gamification-points-earned.json");
const { notificationApp } = require("./internal/initialize");
const { AdaptiveCards } = require("@microsoft/adaptivecards-tools");
const { TeamsBot } = require("./teamsBot");
const restify = require("restify");

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nApp Started, ${server.name} listening to ${server.url}`);
});

// HTTP trigger to send notification. You need to add authentication / authorization for this API. Refer https://aka.ms/teamsfx-notification for more details.
server.post(
  "/api/notification",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(), // Add more parsers if needed
  async (req, res) => {
    for (const target of await notificationApp.notification.installations()) {
      await target.sendAdaptiveCard(
        AdaptiveCards.declare(notificationTemplate).render({
          title: "New Event Occurred!",
          appName: "Contoso App Notification",
          description: `This is a sample http-triggered notification to ${target.type}`,
          notificationUrl: "https://aka.ms/teamsfx-notification-new",
        })
      );
    }

    /****** To distinguish different target types ******/
    /** "Channel" means this bot is installed to a Team (default to notify General channel)
    if (target.type === NotificationTargetType.Channel) {
      // Directly notify the Team (to the default General channel)
      await target.sendAdaptiveCard(...);

      // List all channels in the Team then notify each channel
      const channels = await target.channels();
      for (const channel of channels) {
        await channel.sendAdaptiveCard(...);
      }

      // List all members in the Team then notify each member
      const members = await target.members();
      for (const member of members) {
        await member.sendAdaptiveCard(...);
      }
    }
    **/

    /** "Group" means this bot is installed to a Group Chat
    if (target.type === NotificationTargetType.Group) {
      // Directly notify the Group Chat
      await target.sendAdaptiveCard(...);

      // List all members in the Group Chat then notify each member
      const members = await target.members();
      for (const member of members) {
        await member.sendAdaptiveCard(...);
      }
    }
    **/

    /** "Person" means this bot is installed as a Personal app
    if (target.type === NotificationTargetType.Person) {
      // Directly notify the individual person
      await target.sendAdaptiveCard(...);
    }
    **/

    /** You can also find someone and notify the individual person
    const member = await notificationApp.notification.findMember(
      async (m) => m.account.email === "someone@contoso.com"
    );
    await member?.sendAdaptiveCard(...);
    **/

    /** Or find multiple people and notify them
    const members = await notificationApp.notification.findAllMembers(
      async (m) => m.account.email?.startsWith("test")
    );
    for (const member of members) {
      await member.sendAdaptiveCard(...);
    }
    **/

    res.json({});
  }
);

// curl -X POST http://localhost:3978/api/notification/newContentPosted
server.post(
  "/api/notification/newContentPosted",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(), // Add more parsers if needed
  async (req, res) => {
    for (const target of await notificationApp.notification.installations()) {
      await target.sendAdaptiveCard(
        AdaptiveCards.declare(newContentPostedNotificationTemplate).render({
          title: "New Content Posted!",
          appName: "Sprinklr Advocacy",
          description: `This is a sample notification for content being posted from Advocacy site.`,
          notificationUrl: "https://579d299c-2e66-4f5d-a199-720758b14096.qa4-advocacy-client.sprinklr.com/content/ADVOCACY_205_6476fa9812a2131c0b3f622e?referrer=MS_TEAMS",
          imageUrl: "https://qa4-cdata-app.sprinklr.com/DAM/0/9e53e924-f0fe-46c6-827b-43b3a0265a58-383799432/advocacy_400002_1685518999974.jpg",
        })
      );
    }

    res.json({});
  }
);

// curl -X POST http://localhost:3978/api/notification/gamification
server.post(
  "/api/notification/gamification",
  restify.plugins.queryParser(),
  restify.plugins.bodyParser(), // Add more parsers if needed
  async (req, res) => {
    for (const target of await notificationApp.notification.installations()) {
      await target.sendAdaptiveCard(
        AdaptiveCards.declare(gamificationNotificationTempalte).render({
          title: "Points earned!",
          appName: "Sprinklr Advocacy",
          description: `Congratulation! You have earned 8 points for sharing on social channel.`,
          notificationUrl: "https://579d299c-2e66-4f5d-a199-720758b14096.qa4-advocacy-client.sprinklr.com/content/ADVOCACY_205_6476fa9812a2131c0b3f622e?referrer=MS_TEAMS",
        })
      );
    }

    res.json({});
  }
);



// Bot Framework message handler.
const teamsBot = new TeamsBot();
server.post("/api/messages", async (req, res) => {
  console.log("User typed message mohan");
  await notificationApp.requestHandler(req, res, async (context) => {
    await teamsBot.run(context);
  });
});



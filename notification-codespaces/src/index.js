const notificationTemplate = require("./adaptiveCards/notification-default.json");
const { notificationApp } = require("./internal/initialize");
const ACData = require("adaptivecards-templating");
const { TeamsBot } = require("./teamsBot");
const express = require("express");
// server.js
const WebSocket = require('ws');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Create express application.
const expressApp = express();
expressApp.use(express.json());

const server = expressApp.listen(
  process.env.port || process.env.PORT || 3978,
  () => {
    console.log(
      `\nBot Started, ${expressApp.name} listening to`,
      server.address()
    );
  }
);

expressApp.post("/api/notification", async (req, res) => {
  const pageSize = 100;
  let continuationToken = undefined;
  do {
    const pagedData = await notificationApp.notification.getPagedInstallations(
      pageSize,
      continuationToken
    );
    const installations = pagedData.data;
    continuationToken = pagedData.continuationToken;

    for (const target of installations) {
      // Prepare the alert data from the request body
      const alertData = req.body.alert; // Assuming the alert data is sent in the request body
      console.log(req.body.alert)
      console.log("--------------\n"+alertData.title)
      // Define an adaptive card template
      const alertTemplate = new ACData.Template(notificationTemplate);

      // Send the adaptive card to the target (Team, Group, Person)
      await target.sendAdaptiveCard(
        alertTemplate.expand({
          $root: {
            title: `Alert: ${alertData.title}`,
            appName: "Security Alert Notification",
            description: alertData.description || "No description provided",
            severity: alertData.severity || "Unknown",
            incidentUrl: alertData.incidentWebUrl || "Not available",
            createdDateTime: alertData.createdDateTime || "Unknown",
            userPrincipalName: alertData.userPrincipalName || "Unknown User",
            azureTenantId: alertData.azureTenantId || "Unknown Tenant",
            azureSubscriptionId: alertData.azureSubscriptionId || "Unknown Subscription",
            status: alertData.status || "Unknown",
            alertCategory: alertData.category || "Unknown",
            userLogonIp: alertData.userLogonIp || "Not Available",
            userLogonLocation: alertData.userLogonLocation || "Not Available",

            // Additional fields can be added here as needed
            incidentSeverity: alertData.severity || "Unknown",  // Example for severity, can be expanded further

            // Buttons for actions
            buttons: [
              {
                type: "Action.OpenUrl",
                title: "View Incident",
                url: alertData.incidentWebUrl || "https://default-url.com"
              },
              {
                type: "Action.OpenUrl",
                title: "Resolve Incident",
                url: `https://resolve-incident-url/${alertData.id}`
              },
              {
                type: "Action.Submit",
                title: "Mark as False Positive",
                data: { action: "false_positive", alertId: alertData.id }
              },
              {
                type: "Action.Submit",
                title: "Dismiss Alert",
                data: { action: "dismiss", alertId: alertData.id }
              }
            ]
          },
        })
      );

    }
  } while (continuationToken);

  res.json({});
});


// Bot Framework message handler.
const teamsBot = new TeamsBot();
expressApp.post("/api/messages", async (req, res) => {
  await notificationApp.requestHandler(req, res, async (context) => {
    await teamsBot.run(context);
  });
});


wss.on('connection', (ws) => {
    console.log('Client connected');

    // Send JSON data to client
    const sendData = () => {
        const jsonData = JSON.stringify({ message: 'Hello from server', timestamp: new Date() });
        ws.send(jsonData);
    };

    // Ping the client every 5 seconds
    const interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
        }
    }, 5000);

    // Send initial data
    sendData();

    // Listen for messages from the client
    ws.on('message', (message) => {
        console.log('Received from client:', message);
    });

    // Handle pings and pongs
    ws.on('pong', () => {
        console.log('Received pong from client');
    });

    // Cleanup on disconnect
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');

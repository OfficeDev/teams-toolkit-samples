// Create HTTP server.
const express = require("express");
const { commandApp } = require("./internal/initialize");
const { TeamsBot } = require("./teamsBot");

// This template uses `express` to serve HTTP responses.
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

// Register an API endpoint with `express`. Teams sends messages to your application
// through this endpoint.
//
// The Microsoft 365 Agents Toolkit bot registration configures the bot with `/api/messages` as the
// Bot Framework endpoint. If you customize this route, update the Bot registration
// in `templates/azure/provision/botservice.bicep`.
const teamsBot = new TeamsBot();
expressApp.post("/api/messages", async (req, res) => {
  await commandApp.requestHandler(req, res, async (context) => {
    await teamsBot.run(context);
  });
});

import * as restify from "restify";
import { commandBot } from "./internal/initialize";
const path = require("path");
import "isomorphic-fetch";

// This template uses `restify` to serve HTTP responses.
// Create a restify server.
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
});

// Register an API endpoint with `restify`. Teams sends messages to your application
// through this endpoint.
//
// The Teams Toolkit bot registration configures the bot with `/api/messages` as the
// Bot Framework endpoint. If you customize this route, update the Bot registration
// in `templates/azure/provision/botservice.bicep`.
// Process Teams activity with Bot Framework.
server.post("/api/messages", async (req, res) => {
  await commandBot.requestHandler(req, res).catch((err) => {
    // Error message including "412" means it is waiting for user's consent, which is a normal process of SSO, shouldn't throw this error.
    if (!err.message.includes("412")) {
      throw err;
    }
  });
});

server.get(
  "/auth-*.html",
  restify.plugins.serveStatic({
    directory: path.join(__dirname, "public"),
  })
);

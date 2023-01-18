const cp = require("child_process");
const utils = require("@microsoft/teamsfx-run-utils");

// This script is used by Teams Toolkit to launch your service locally

async function run() {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.log(`Usage: node ${__filename} [project path] [env path].`);
    process.exit(1);
  }

  const envs = await utils.loadEnv(args[0], args[1]);

  // set up environment variables required by teamsfx
  process.env.BOT_ID = envs.BOT_ID;
  process.env.BOT_PASSWORD = envs.SECRET_BOT_PASSWORD;
  process.env.BOT_DOMAIN = envs.BOT_DOMAIN;
  process.env.AAD_APP_CLIENT_ID = envs.AAD_APP_CLIENT_ID;
  process.env.AAD_APP_CLIENT_SECRET = envs.SECRET_AAD_APP_CLIENT_SECRET;
  process.env.AAD_APP_TENANT_ID = envs.AAD_APP_TENANT_ID;
  process.env.AAD_APP_OAUTH_AUTHORITY_HOST = envs.AAD_APP_OAUTH_AUTHORITY_HOST;

  // launch service locally by executing npm command
  cp.spawn(/^win/.test(process.platform) ? "npm.cmd" : "npm", ["run", "dev"], { stdio: "inherit" });
}

run();

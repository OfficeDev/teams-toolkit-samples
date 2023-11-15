## Try sample with TeamsFx CLI

1. Install [Node.js](https://nodejs.org/en/download/) (Recommend LTS 16.x)
1. To install the TeamsFx CLI, use the npm package manager:
    ```
    npm install -g @microsoft/teamsapp-cli
    ```
1. Create team-central-dashboard project.
    ```
    teamsapp new sample team-central-dashboard --interactive false
    ```
1. Provision the project to Azure.
    ```
    teamsapp provision
    ```
1. Deploy.
    ```
    teamsapp deploy
    ```
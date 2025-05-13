## Try sample with Microsoft 365 Agents Toolkit CLI

1. Install [Node.js](https://nodejs.org/en/download/) (Recommend LTS 16.x)
1. To install the Microsoft 365 Agents Toolkit CLI, use the npm package manager:
    ```
    npm install -g @microsoft/m365agentstoolkit-cli
    ```
1. Create adaptive-card-notification project.
    ```
    atk new sample adaptive-card-notification --interactive false
    ```
1. Provision the project to Azure.
    ```
    atk provision
    ```
1. Deploy.
    ```
    atk deploy
    ```
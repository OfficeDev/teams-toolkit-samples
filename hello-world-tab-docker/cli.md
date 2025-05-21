## Try sample with Microsoft 365 Agents Toolkit CLI

1. Install [Node.js](https://nodejs.org/download/)
1. To install the Microsoft 365 Agents Toolkit CLI, use the npm package manager:
    ```
    npm install -g @microsoft/m365agentstoolkit-cli
    ```
1. Create hello-world-tab project.
    ```
    atk new sample hello-world-tab-docker --interactive false
    ```
1. Provision the project to Azure.
    ```
    atk provision
    ```
1. Install [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli)
1. Login to Azure CLI.
   ```
   az login
   ```
1. Deploy.
    ```
    atk deploy
    ```
## Try sample with Microsoft 365 Agents Toolkit CLI

1. Install [Node.js](https://nodejs.org/en/download/) (Recommend LTS 20.x)
1. To install the Microsoft 365 Agents Toolkit CLI, use the npm package manager:
   ```
   npm install -g @microsoft/m365agentstoolkit-cli
   ```
1. Create intelligent-data-chart-generator project.
   ```
   atk new sample intelligent-data-chart-generator --interactive false
   ```
1. Provision the project to Azure.
   ```
   atk provision
   ```
1. Deploy.
   ```
   atk deploy
   ```

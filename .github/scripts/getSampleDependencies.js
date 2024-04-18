const axios = require("axios");
const glob = require("glob");
const fs = require("fs");
const path = require("path");

const repoRoot = "../TeamsFx-Samples";

const codeOwnerMap = new Map([
  ["adaptive-card-notification", "tianyuan@microsoft.com"],
  ["basic-blazor-tab-app", "nintan@microsoft.com"],
  ["bot-sso", "yukundong@microsoft.com"],
  ["bot-sso-docker", "zhijie.huang@microsoft.com"],
  ["command-bot-with-sso", "rentu@microsoft.com"],
  ["developer-assist-dashboard", "huimiao@microsoft.com"],
  ["graph-connector-app", "junhan@microsoft.com"],
  ["graph-connector-bot", "junhan@microsoft.com"],
  ["graph-toolkit-contact-exporter", "rentu@microsoft.com"],
  ["graph-toolkit-one-productivity-hub", "rentu@microsoft.com"],
  ["hello-world-bot-with-tab", "zhijie.huang@microsoft.com"],
  ["hello-world-in-meeting", "kaiyan@microsoft.com"],
  ["hello-world-tab-codespaces", "qinzhu@microsoft.com"],
  ["hello-world-tab-docker", "yiminjin@microsoft.com"],
  ["hello-world-tab-with-backend", "bowsong@microsoft.com"],
  ["hello-world-teams-tab-and-outlook-add-in", "zhijie.huang@microsoft.com"],
  ["incoming-webhook-notification", "kuojianlu@microsoft.com"],
  ["intelligent-data-chart-generator", "huimiao@microsoft.com"],
  ["large-scale-notification", "yiqingzhao@microsoft.com"],
  ["live-share-dice-roller", "nintan@microsoft.com"],
  ["notification-codespaces", "qinzhu@microsoft.com"],
  ["NPM-search-connector-M365", "kuojianlu@microsoft.com"],
  ["NPM-search-message-extension-codespaces", "qinzhu@microsoft.com"],
  ["query-org-user-with-message-extension-sso", "wenyutang@microsoft.com"],
  ["react-retail-dashboard", "yuqzho@microsoft.com"],
  ["share-now", "zhaofengxu@microsoft.com"],
  ["spfx-productivity-dashboard", "yuqzho@microsoft.com"],
  ["sso-enabled-tab-via-apim-proxy", "bowsong@microsoft.com"],
  ["stocks-update-notification-bot", "kuojianlu@microsoft.com"],
  ["stocks-update-notification-bot-dotnet", "tianyuan@microsoft.com"],
  ["team-central-dashboard", "huimiao@microsoft.com"],
  ["test-tool-sample-app", "qinzhu@microsoft.com"],
  ["todo-list-SPFx", "yuqzho@microsoft.com"],
  ["todo-list-with-Azure-backend", "junhan@microsoft.com"],
  ["todo-list-with-Azure-backend-M365", "kuojianlu@microsoft.com"],
  ["whos-next-meeting-app", "nintan@microsoft.com"],
]);

async function getSamplesDependencies() {
  var dependenciesMap = new Map();
  const samplePkgJsonPath = `${repoRoot}/**/package.json`;
  const packageJsonFiles = await glob.glob(samplePkgJsonPath, {
    ignore: "node_modules/**",
  });

  packageJsonFiles.forEach((packageJsonFile) => {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf8"));
    let sampleDir = path.relative(`${repoRoot}`, path.dirname(packageJsonFile));
    let codeOwners = "";
    if (sampleDir.includes("validation-tool")) {
      return;
    }

    for (const [key, value] of codeOwnerMap) {
      if (
        key === path.basename(sampleDir) ||
        key === path.dirname(sampleDir) ||
        key === path.dirname(path.dirname(sampleDir))
      ) {
        codeOwners = value;
      }
    }
    let dependencies = packageJson["dependencies"] ?? {};
    Object.assign(dependencies, packageJson["devDependencies"]);
    for (dependency in dependencies) {
      if (
        dependenciesMap.has(dependency) &&
        dependenciesMap.get(dependency).has(codeOwners)
      ) {
        dependenciesMap.get(dependency).get(codeOwners).push({
          sampleDir,
          version: dependencies[dependency],
        });
      } else if (dependenciesMap.has(dependency)) {
        dependenciesMap
          .get(dependency)
          .set(codeOwners, [{ sampleDir, version: dependencies[dependency] }]);
      } else {
        const codeOwnerTemplateMap = new Map([
          [codeOwners, [{ sampleDir, version: dependencies[dependency] }]],
        ]);
        dependenciesMap.set(dependency, codeOwnerTemplateMap);
      }
    }
  });

  return dependenciesMap;
}

async function getCsharpSampleDependencies() {
  var dependenciesMap = new Map();
  const sampleCsprojPath = `${repoRoot}/**/*.csproj`;
  const csprojFiles = await glob.glob(sampleCsprojPath);
  csprojFiles.forEach((csprojFile) => {
    const csproj = fs.readFileSync(csprojFile, "utf8");
    let sampleDir = path.relative(`${repoRoot}`, path.dirname(csprojFile));
    let codeOwners = "";
    for (const [key, value] of codeOwnerMap) {
      if (
        key === path.basename(sampleDir) ||
        key === path.dirname(sampleDir) ||
        key === path.dirname(path.dirname(sampleDir))
      ) {
        codeOwners = value;
      }
    }

    const dependencies = csproj
      .split("\n")
      .filter((line) => line.includes("<PackageReference"))
      .map((line) => {
        const name = line.match(/Include="(.*)" Version/)[1];
        const version = line.match(/Version="(.*)"/)[1];
        return { name, version };
      });

    for (dependency in dependencies) {
      const dependencyName = dependencies[dependency].name;
      const dependencyVersion = dependencies[dependency].version;
      if (
        dependenciesMap.has(dependencyName) &&
        dependenciesMap.get(dependencyName).has(codeOwners)
      ) {
        dependenciesMap.get(dependencyName).get(codeOwners).push({
          sampleDir,
          version: dependencyVersion,
        });
      } else if (dependenciesMap.has(dependencyName)) {
        dependenciesMap
          .get(dependencyName)
          .set(codeOwners, [{ sampleDir, version: dependencyVersion }]);
      } else {
        const codeOwnerSampleMap = new Map([
          [codeOwners, [{ sampleDir, version: dependencyVersion }]],
        ]);
        dependenciesMap.set(dependencyName, codeOwnerSampleMap);
      }
    }
  });

  return dependenciesMap;
}

function generateAdaptiveCardColumnSets(arr) {
  if (arr.length === 0) {
    return [];
  }
  let columnSets = [
    {
      type: "ColumnSet",
      columns: [
        {
          type: "Column",
          width: 22,
          items: [
            {
              type: "TextBlock",
              text: "Package",
              wrap: true,
              weight: "Bolder",
            },
          ],
          verticalContentAlignment: "Center",
        },
        {
          type: "Column",
          width: 38,
          items: [
            {
              type: "TextBlock",
              text: "Templates",
              wrap: true,
              weight: "Bolder",
            },
          ],
          verticalContentAlignment: "Center",
        },
        {
          type: "Column",
          width: 17,
          items: [
            {
              type: "TextBlock",
              text: "Version",
              wrap: true,
              weight: "Bolder",
            },
          ],
          verticalContentAlignment: "Center",
        },
        {
          type: "Column",
          width: 23,
          items: [
            {
              type: "TextBlock",
              text: "Owners",
              wrap: true,
              weight: "Bolder",
            },
          ],
          verticalContentAlignment: "Center",
        },
      ],
      separator: true,
    },
  ];
  for (package of arr) {
    let ownerColumnSets = [];
    package.ownerMap.forEach(function (templatesInfo, owner) {
      ownerColumnSets.push({
        type: "ColumnSet",
        separator: true,
        columns: [
          {
            type: "Column",
            width: 56,
            items: templatesInfo.map((templateInfo) => {
              return {
                type: "ColumnSet",
                columns: [
                  {
                    type: "Column",
                    width: 40,
                    items: [
                      {
                        type: "TextBlock",
                        text: templateInfo.sampleDir,
                        wrap: true,
                        size: "Small",
                      },
                    ],
                  },
                  {
                    type: "Column",
                    width: 16,
                    items: [
                      {
                        type: "TextBlock",
                        text:
                          templateInfo.version[0] === ">"
                            ? "\\" + templateInfo.version
                            : templateInfo.version,
                        wrap: true,
                        size: "Small",
                      },
                    ],
                  },
                ],
              };
            }),
          },
          {
            type: "Column",
            width: 24,
            items: [
              {
                type: "TextBlock",
                text: owner,
                wrap: true,
                size: "Small",
              },
            ],
          },
        ],
      });
    });

    columnSets.push({
      type: "ColumnSet",
      columns: [
        {
          type: "Column",
          width: 20,
          items: [
            {
              type: "TextBlock",
              text:
                `[${package.name}](${
                  package.ownerMap
                    .values()
                    .next()
                    .value[0].sampleDir.includes("csharp")
                    ? `https://www.nuget.org/packages/${package.name}`
                    : `https://www.npmjs.com/package/${package.name}`
                })` +
                "\n\r" +
                `LTS-${package.version}`,
              wrap: true,
              size: "Small",
            },
          ],
        },
        {
          type: "Column",
          width: 80,
          items: ownerColumnSets,
        },
      ],
      separator: true,
    });
  }

  return columnSets;
}

async function main() {
  const dependenciesMap = await getSamplesDependencies();
  let arr = [];
  for (const entry of dependenciesMap.entries()) {
    await axios
      .get(`https://registry.npmjs.org/${entry[0]}`)
      .then((response) => {
        const ltsVersion = response.data["dist-tags"].latest;
        const ltsVersionTime = response.data.time[ltsVersion];
        const timeDiff = (new Date() - new Date(ltsVersionTime)) / 1000;
        if (timeDiff <= 86400) {
          arr.push({
            name: entry[0],
            version: ltsVersion,
            ownerMap: entry[1],
          });
        }
      });
  }

  const csharpDependencyMap = await getCsharpSampleDependencies();
  for (const entry of csharpDependencyMap.entries()) {
    await axios
      .get(
        `https://api.nuget.org/v3/registration5-gz-semver2/${entry[0].toLowerCase()}/index.json`
      )
      .then((response) => {
        const ltsVersion = response.data["items"].at(-1).upper;
        const ltsVersionTime = response.data.commitTimeStamp;
        const timeDiff = (new Date() - new Date(ltsVersionTime)) / 1000;
        if (timeDiff <= 86400) {
          arr.push({
            name: entry[0],
            version: ltsVersion,
            ownerMap: entry[1],
          });
        }
      });
  }

  const table = generateAdaptiveCardColumnSets(arr);
  const tableString = JSON.stringify(table);
  return JSON.stringify(tableString);
}

main().then((result) => {
  console.log(result);
});

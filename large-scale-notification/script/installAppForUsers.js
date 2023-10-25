const axios = require("axios");

const TEAMS_APP_ID = "<TEAMS_APP_ID>";
const ACCESS_TOKEN = "<GRAPH_ACCESS_TOKEN>";

let index = 0;

async function getUserList() {
  // Limits rate varies based on the number of users in the tenant requests. Reference: https://learn.microsoft.com/en-us/graph/throttling-limits#identity-and-access-service-limits.
  const getUsers = axios.create({
    baseURL: "https://graph.microsoft.com/v1.0/users?$top=999",
    headers: {
      Authorization: ACCESS_TOKEN,
    },
  });
  try {
    let userList;
    let userListByPage = await getUsers({});
    userList = userListByPage;
    while (userListByPage.data["@odata.nextLink"]) {
      let getUsersByPage = axios.create({
        baseURL: userList.data["@odata.nextLink"],
        headers: {
          Authorization: ACCESS_TOKEN,
        },
      });
      userListByPage = await getUsersByPage({});
      userList.data.value = userList.data.value.concat(
        userListByPage.data.value
      );
    }
    console.log(userList.data.value.length);
    return userList.data.value;
  } catch (error) {
    console.log(error);
  }
}

async function asyncPool(poolLimit, TargetArray) {
  const ret = [];
  const executing = [];

  // Microsoft Teams service limits: 30 rps. Reference: https://learn.microsoft.com/en-us/graph/throttling-limits#microsoft-teams-service-limits.
  const installApp = axios.create({
    baseURL: "https://graph.microsoft.com/v1.0/users",
    headers: {
      Authorization: ACCESS_TOKEN,
    },
  });
  for (index = 0; index < TargetArray.length; index++) {
    if (index % 100 == 0) {
      console.log(index);
    }
    const target = TargetArray[index];
    const p = Promise.resolve().then(() => {
      return installApp
        .post("/" + target.id + "/teamwork/installedApps", {
          "teamsApp@odata.bind": `https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/${TEAMS_APP_ID}`,
        })
        .catch((err) => {
          if (err?.response?.status == "409") {
            console.log(
              "User " +
                target.displayName +
                " with id " +
                target.id +
                " already installed the app"
            );
          } else if (err.response.statusCode == "401") {
            console.log("Please update access token");
            process.exit(1);
          } else {
            process.exit(1);
          }
        });
      // uncomment following lines to delete the app installation
      // return installApp
      //   .get("/" + target.id + "/teamwork/installedApps?$expand=teamsApp")
      //   .then((res) => {
      //     for (const app of res.data.value) {
      //       if (app.teamsApp.id == TEAMS_APP_ID) {
      //         console.log(
      //           "Delete " +
      //             app.teamsApp.displayName +
      //             " with id " +
      //             app.teamsApp.id
      //         );
      //         installApp.delete(
      //           "/" + target.id + "/teamwork/installedApps/" + app.id
      //         );
      //         return;
      //       }
      //     }
      //   });
    });
    ret.push(p);

    if (poolLimit <= TargetArray.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

async function main() {
  let startTime = new Date();
  let userList = await getUserList();

  // Create at most 5 Axios post in the same time
  await asyncPool(5, userList);
  let endTime = new Date();
  console.log("Total User: " + index);
  console.log(
    "Duration: " + (endTime.getTime() - startTime.getTime()) / 1000 + "s"
  );
}

// Call the main function
main().catch((err) => {
  console.log("Error occurred: ", err);
  process.exit(1);
});

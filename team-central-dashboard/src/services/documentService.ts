import { Client } from "@microsoft/microsoft-graph-client";
import { createMicrosoftGraphClientWithCredential, TeamsUserCredential } from "@microsoft/teamsfx";

import { EXCEL_SVG, PPT_SVG, VISIO_SVG, WORD_SVG } from "../common/constants";
import { FilesType } from "../common/filesType";
import { TeamsUserCredentialContext } from "../internal/singletonContext";
import { DocumentModel } from "../models/documentModel";

/**
 * @returns :
 * {
 *   "name": string,
 *   "webUrl": string, // use it to open the file in the browser
 *   "createdBy": {
 *      "user": {
 *        "email": string,
 *        "displayName": string
 *      }
 *   },
 *   "lastModifiedBy": {
 *      "user": {
 *        "email": string,
 *        "displayName": string
 *      }
 *   },
 *   "remoteItem": {
 *     "...": ...,
 *     "webDavUrl": string // use it to open the file in the corresponded desktop app
 *     "...": ...
 *   }
 * }
 */
export function generateTeamsUrl(obj: any): string {
  let url = "https://teams.microsoft.com/l/file/";
  // fileId
  const webUrl: string = obj["webUrl"];
  url += webUrl.substring(webUrl.indexOf("sourcedoc=%7B") + 13, webUrl.indexOf("%7D")) + "?";
  // filetype
  const fileType: string = obj["remoteItem"]["file"]["mimeType"];
  url +=
    "fileType=" +
    (fileType === FilesType.WORD
      ? "docx"
      : fileType === FilesType.EXCEL
      ? "xlsx"
      : fileType === FilesType.PPT
      ? "pptx"
      : fileType === FilesType.VISIO
      ? "vsd"
      : fileType.substring(fileType.indexOf("application/" + 12)));
  // objectUrl
  const objectURL: string = obj["remoteItem"]["webDavUrl"];
  url += "&objectUrl=" + objectURL.replace(":", "%3A").replace("/", "%2F");
  // baseUrl
  const baseUrl: string = obj["remoteItem"]["sharepointIds"]["siteUrl"];
  url += "&baseUrl=" + baseUrl.replace(":", "%3A").replace("/", "%2F");

  console.log(url);

  return url;
}

export async function getDocuments(): Promise<DocumentModel[]> {
  let credential: TeamsUserCredential;
  try {
    credential = TeamsUserCredentialContext.getInstance().getCredential();
    const token = await credential.getToken(["Files.Read"]);
  } catch (e) {
    throw e;
  }

  try {
    const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
      "Files.Read",
    ]);
    const drives = await graphClient
      .api("/me/drive/recent?$top=5&$select=id,name,webUrl,createdBy,lastModifiedBy,remoteItem")
      .get();

    const driveInfo = drives["value"];

    let returnAnswer: DocumentModel[] = [];
    for (const obj of driveInfo) {
      const tmp: DocumentModel = {
        id: obj.id,
        name: obj["name"],
        createdBy: obj["remoteItem"]["createdBy"]["user"]["displayName"],
        lastModifiedBy: obj["remoteItem"]["lastModifiedBy"]["user"]["displayName"],
        createdDateTime: obj["remoteItem"]["createdDateTime"],
        lastModifiedDateTime: obj["remoteItem"]["lastModifiedDateTime"],
        type: obj["remoteItem"]["file"]["mimeType"],
        weburl: obj["remoteItem"]["webUrl"],
        webDavurl: obj["remoteItem"]["webDavUrl"],
        teamsurl: generateTeamsUrl(obj),
      };
      returnAnswer.push(tmp);
    }
    return returnAnswer;
  } catch (e) {
    throw e;
  }
}

/**
 * get the file icon based on the file type
 * @param type file type
 * @returns file icon url
 */
export function getIconByFileType(type: string): string | undefined {
  switch (type) {
    case FilesType.WORD:
      return WORD_SVG;
    case FilesType.EXCEL:
      return EXCEL_SVG;
    case FilesType.PPT:
      return PPT_SVG;
    case FilesType.VISIO:
      return VISIO_SVG;
    default:
      return undefined;
  }
}


export const chart1Points_7D = [
  { x: new Date("2022/01/01"), y: 18000, },
  { x: new Date("2022/01/06"), y: 14000, },
  { x: new Date("2022/01/11"), y: 19000, },
  { x: new Date("2022/01/16"), y: 13000, },
  { x: new Date("2022/01/21"), y: 21000, },
  { x: new Date("2022/01/26"), y: 18000, },
  { x: new Date("2022/01/31"), y: 23000, },
];

export const chart2Points_7D = [
  { x: new Date("2022/01/01"), y: 8000 },
  { x: new Date("2022/01/06"), y: 10000 },
  { x: new Date("2022/01/11"), y: 100 },
  { x: new Date("2022/01/16"), y: 9000 },
  { x: new Date("2022/01/21"), y: 11000 },
  { x: new Date("2022/01/26"), y: 7000 },
  { x: new Date("2022/01/31"), y: 7200 },
];

export const chart1Points_30D = [
  { x: new Date("2022/01/01"), y: 18000 },
  { x: new Date("2022/01/02"), y: 14000 },
  { x: new Date("2022/01/03"), y: 19000 },
  { x: new Date("2022/01/04"), y: 13000 },
  { x: new Date("2022/01/05"), y: 21000 },
  { x: new Date("2022/01/06"), y: 18000 },
  { x: new Date("2022/01/07"), y: 18000 },
  { x: new Date("2022/01/08"), y: 14000 },
  { x: new Date("2022/01/09"), y: 19000 },
  { x: new Date("2022/01/10"), y: 13000 },
  { x: new Date("2022/01/11"), y: 21000 },
  { x: new Date("2022/01/12"), y: 18000 },
  { x: new Date("2022/01/13"), y: 23000 },
  { x: new Date("2022/01/14"), y: 18000 },
  { x: new Date("2022/01/15"), y: 14000 },
  { x: new Date("2022/01/16"), y: 19000 },
  { x: new Date("2022/01/17"), y: 13000 },
  { x: new Date("2022/01/18"), y: 21000 },
  { x: new Date("2022/01/19"), y: 18000 },
  { x: new Date("2022/01/20"), y: 23000 },
  { x: new Date("2022/01/21"), y: 18000 },
  { x: new Date("2022/01/22"), y: 14000 },
  { x: new Date("2022/01/23"), y: 19000 },
  { x: new Date("2022/01/24"), y: 13000 },
  { x: new Date("2022/01/25"), y: 21000 },
  { x: new Date("2022/01/26"), y: 18000 },
  { x: new Date("2022/01/27"), y: 23000 },
  { x: new Date("2022/01/28"), y: 13000 },
  { x: new Date("2022/01/29"), y: 21000 },
  { x: new Date("2022/01/30"), y: 18000 },
  { x: new Date("2022/01/31"), y: 23000 },
];

export const chart2Points_30D = [
  { x: new Date("2022/01/01"), y: 18000 },
  { x: new Date("2022/01/02"), y: 18000 },
  { x: new Date("2022/01/03"), y: 18000 },
  { x: new Date("2022/01/04"), y: 18000 },
  { x: new Date("2022/01/05"), y: 18000 },
  { x: new Date("2022/01/06"), y: 14000 },
  { x: new Date("2022/01/07"), y: 18000 },
  { x: new Date("2022/01/08"), y: 18000 },
  { x: new Date("2022/01/09"), y: 18000 },
  { x: new Date("2022/01/10"), y: 18000 },
  { x: new Date("2022/01/11"), y: 19000 },
  { x: new Date("2022/01/12"), y: 18000 },
  { x: new Date("2022/01/13"), y: 18000 },
  { x: new Date("2022/01/14"), y: 18000 },
  { x: new Date("2022/01/15"), y: 18000 },
  { x: new Date("2022/01/16"), y: 13000 },
  { x: new Date("2022/01/17"), y: 18000 },
  { x: new Date("2022/01/18"), y: 18000 },
  { x: new Date("2022/01/19"), y: 18000 },
  { x: new Date("2022/01/20"), y: 18000 },
  { x: new Date("2022/01/21"), y: 12000 },
  { x: new Date("2022/01/22"), y: 18000 },
  { x: new Date("2022/01/23"), y: 18000 },
  { x: new Date("2022/01/24"), y: 18000 },
  { x: new Date("2022/01/25"), y: 18000 },
  { x: new Date("2022/01/26"), y: 14000 },
  { x: new Date("2022/01/27"), y: 18000 },
  { x: new Date("2022/01/28"), y: 18000 },
  { x: new Date("2022/01/29"), y: 18000 },
  { x: new Date("2022/01/30"), y: 18000 },
  { x: new Date("2022/01/31"), y: 15000 },
];

export const chart1Points_60D = [
  { x: new Date("2022/01/01"), y: 18000 },
  { x: new Date("2022/01/02"), y: 14000 },
  { x: new Date("2022/01/03"), y: 19000 },
  { x: new Date("2022/01/04"), y: 13000 },
  { x: new Date("2022/01/05"), y: 21000 },
  { x: new Date("2022/01/06"), y: 18000 },
  { x: new Date("2022/01/07"), y: 18000 },
  { x: new Date("2022/01/08"), y: 14000 },
  { x: new Date("2022/01/09"), y: 19000 },
  { x: new Date("2022/01/10"), y: 13000 },
  { x: new Date("2022/01/11"), y: 21000 },
  { x: new Date("2022/01/12"), y: 18000 },
  { x: new Date("2022/01/13"), y: 23000 },
  { x: new Date("2022/01/14"), y: 18000 },
  { x: new Date("2022/01/15"), y: 14000 },
  { x: new Date("2022/01/16"), y: 19000 },
  { x: new Date("2022/01/17"), y: 13000 },
  { x: new Date("2022/01/18"), y: 21000 },
  { x: new Date("2022/01/19"), y: 18000 },
  { x: new Date("2022/01/20"), y: 23000 },
  { x: new Date("2022/01/21"), y: 18000 },
  { x: new Date("2022/01/22"), y: 14000 },
  { x: new Date("2022/01/23"), y: 19000 },
  { x: new Date("2022/01/24"), y: 13000 },
  { x: new Date("2022/01/25"), y: 21000 },
  { x: new Date("2022/01/26"), y: 18000 },
  { x: new Date("2022/01/27"), y: 23000 },
  { x: new Date("2022/01/28"), y: 13000 },
  { x: new Date("2022/01/29"), y: 21000 },
  { x: new Date("2022/01/30"), y: 18000 },
  { x: new Date("2022/01/31"), y: 23000 },
  { x: new Date("2022/02/01"), y: 18000 },
  { x: new Date("2022/02/02"), y: 14000 },
  { x: new Date("2022/02/03"), y: 19000 },
  { x: new Date("2022/02/04"), y: 13000 },
  { x: new Date("2022/02/05"), y: 21000 },
  { x: new Date("2022/02/06"), y: 18000 },
  { x: new Date("2022/02/07"), y: 18000 },
  { x: new Date("2022/02/08"), y: 14000 },
  { x: new Date("2022/02/09"), y: 19000 },
  { x: new Date("2022/02/10"), y: 13000 },
  { x: new Date("2022/02/11"), y: 21000 },
  { x: new Date("2022/02/12"), y: 18000 },
  { x: new Date("2022/02/13"), y: 23000 },
  { x: new Date("2022/02/14"), y: 18000 },
  { x: new Date("2022/02/15"), y: 14000 },
  { x: new Date("2022/02/16"), y: 19000 },
  { x: new Date("2022/02/17"), y: 13000 },
  { x: new Date("2022/02/18"), y: 21000 },
  { x: new Date("2022/02/19"), y: 18000 },
  { x: new Date("2022/02/20"), y: 23000 },
  { x: new Date("2022/02/21"), y: 18000 },
  { x: new Date("2022/02/22"), y: 14000 },
  { x: new Date("2022/02/23"), y: 19000 },
  { x: new Date("2022/02/24"), y: 13000 },
  { x: new Date("2022/02/25"), y: 21000 },
  { x: new Date("2022/02/26"), y: 18000 },
  { x: new Date("2022/02/27"), y: 23000 },
  { x: new Date("2022/02/28"), y: 13000 },
];

export const chart2Points_60D = [
  { x: new Date("2022/01/01"), y: 18000 },
  { x: new Date("2022/01/02"), y: 18000 },
  { x: new Date("2022/01/03"), y: 18000 },
  { x: new Date("2022/01/04"), y: 18000 },
  { x: new Date("2022/01/05"), y: 18000 },
  { x: new Date("2022/01/06"), y: 14000 },
  { x: new Date("2022/01/07"), y: 18000 },
  { x: new Date("2022/01/08"), y: 18000 },
  { x: new Date("2022/01/09"), y: 18000 },
  { x: new Date("2022/01/10"), y: 18000 },
  { x: new Date("2022/01/11"), y: 19000 },
  { x: new Date("2022/01/12"), y: 18000 },
  { x: new Date("2022/01/13"), y: 18000 },
  { x: new Date("2022/01/14"), y: 18000 },
  { x: new Date("2022/01/15"), y: 18000 },
  { x: new Date("2022/01/16"), y: 13000 },
  { x: new Date("2022/01/17"), y: 18000 },
  { x: new Date("2022/01/18"), y: 18000 },
  { x: new Date("2022/01/19"), y: 18000 },
  { x: new Date("2022/01/20"), y: 18000 },
  { x: new Date("2022/01/21"), y: 12000 },
  { x: new Date("2022/01/22"), y: 18000 },
  { x: new Date("2022/01/23"), y: 18000 },
  { x: new Date("2022/01/24"), y: 18000 },
  { x: new Date("2022/01/25"), y: 18000 },
  { x: new Date("2022/01/26"), y: 14000 },
  { x: new Date("2022/01/27"), y: 18000 },
  { x: new Date("2022/01/28"), y: 18000 },
  { x: new Date("2022/01/29"), y: 18000 },
  { x: new Date("2022/01/30"), y: 18000 },
  { x: new Date("2022/01/31"), y: 15000 },
  { x: new Date("2022/02/01"), y: 15000 },
  { x: new Date("2022/02/02"), y: 15000 },
  { x: new Date("2022/02/03"), y: 15000 },
  { x: new Date("2022/02/04"), y: 15000 },
  { x: new Date("2022/02/05"), y: 15000 },
  { x: new Date("2022/02/06"), y: 15000 },
  { x: new Date("2022/02/07"), y: 15000 },
  { x: new Date("2022/02/08"), y: 15000 },
  { x: new Date("2022/02/09"), y: 15000 },
  { x: new Date("2022/02/10"), y: 15000 },
  { x: new Date("2022/02/11"), y: 15000 },
  { x: new Date("2022/02/12"), y: 15000 },
  { x: new Date("2022/02/13"), y: 15000 },
  { x: new Date("2022/02/14"), y: 15000 },
  { x: new Date("2022/02/15"), y: 15000 },
  { x: new Date("2022/02/16"), y: 15000 },
  { x: new Date("2022/02/17"), y: 15000 },
  { x: new Date("2022/02/18"), y: 15000 },
  { x: new Date("2022/02/19"), y: 15000 },
  { x: new Date("2022/02/20"), y: 15000 },
  { x: new Date("2022/02/21"), y: 15000 },
  { x: new Date("2022/02/22"), y: 15000 },
  { x: new Date("2022/02/23"), y: 15000 },
  { x: new Date("2022/02/24"), y: 15000 },
  { x: new Date("2022/02/25"), y: 15000 },
  { x: new Date("2022/02/26"), y: 15000 },
  { x: new Date("2022/02/27"), y: 15000 },
  { x: new Date("2022/02/28"), y: 15000 },
];

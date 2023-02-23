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
  url += "&objectUrl=" + objectURL.replaceAll(":", "%3A").replaceAll("/", "%2F");
  // baseUrl
  const baseUrl: string = obj["remoteItem"]["sharepointIds"]["siteUrl"];
  url += "&baseUrl=" + baseUrl.replaceAll(":", "%3A").replaceAll("/", "%2F");

  console.log(url);

  return url;
}

export async function getDocuments(): Promise<DocumentModel[]> {
  let credential: TeamsUserCredential;
  try {
    credential = TeamsUserCredentialContext.getInstance().getCredential();
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

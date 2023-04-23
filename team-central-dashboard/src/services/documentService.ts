import { WORD_SVG, EXCEL_SVG, PPT_SVG, VISIO_SVG } from "../common/constants";
import { FilesType } from "../common/filesType";
import { DocumentModel } from "../models/documentModel";
import { callFunction } from "./callFunction";

export async function getDocuments(): Promise<DocumentModel[]> {
  try {
    const respData = await callFunction("GET", "callGraph", { graphType: "files" });
    return respData["filesResult"];
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

import { EXCEL_SVG, PPT_SVG, VISIO_SVG, WORD_SVG } from "../common/constants";
import { FilesType } from "../common/filesType";
import { DocumentModel } from "../models/documentModel";
import { callFunction } from "./callFunction";

/**
 * Retrieves a list of documents from the server.
 * @returns A promise that resolves to an array of DocumentModel objects.
 * @throws An error if the server request fails.
 */
export async function getDocuments(): Promise<DocumentModel[]> {
  try {
    const respData = await callFunction("GET", "callGraph", { graphType: "files" });
    return respData["filesResult"];
  } catch (e) {
    throw e;
  }
}

/**
 * Returns the icon for a given file type.
 * @param type The file type.
 * @returns The icon for the file type, or undefined if the file type is not recognized.
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

export interface DocumentModel {
  // The unique identifier for the document
  id: string;

  // The icon associated with the document (optional)
  icon?: string;

  // The name of the document
  name: string;

  // The user who created the document (optional)
  createdBy?: string;

  // The user who last modified the document (optional)
  lastModifiedBy?: string;

  // The date and time the document was created (optional)
  createdDateTime?: string;

  // The date and time the document was last modified (optional)
  lastModifiedDateTime?: string;

  // The type of the document
  type: string;

  // A description of the document (optional)
  description?: string;

  // A tag associated with the document (optional)
  tag?: string;

  // The web URL of the document (optional)
  weburl?: string;

  // The WebDAV URL of the document (optional)
  webDavurl?: string;

  // The Teams URL of the document (optional)
  teamsurl?: string;
}

export interface DocumentModel {
  id: string;
  icon?: string;
  name: string;
  createdBy?: string;
  lastModifiedBy?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  type: string;
  description?: string;
  tag?: string;
  weburl?: string;
  webDavurl?: string;
  teamsurl?: string;
}
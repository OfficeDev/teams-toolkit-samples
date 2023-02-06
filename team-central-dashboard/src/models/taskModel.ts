export interface TaskModel {
  id: string;
  name: string;
  status?: string;
  importance?: string;
  content?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  url?: string;
  icon?: string;
}

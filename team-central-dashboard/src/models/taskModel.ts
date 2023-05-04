export interface TaskModel {
  // A unique identifier for the task
  id: string;

  // The name of the task
  name: string;

  // The status of the task (optional)
  status?: string;

  // The importance of the task (optional)
  importance?: string;

  // The content of the task (optional)
  content?: string;

  // The date and time the task was created (optional)
  createdDateTime?: string;

  // The date and time the task was last modified (optional)
  lastModifiedDateTime?: string;

  // The URL associated with the task (optional)
  url?: string;

  // The icon associated with the task (optional)
  icon?: string;
}

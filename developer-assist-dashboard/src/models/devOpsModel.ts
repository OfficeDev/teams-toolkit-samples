// This interface represents a DevOps work item
export interface DevOpsModel {
  // The ID of the work item
  id?: string;

  // The URL of the work item
  url?: string;

  // The title of the work item
  title?: string;

  // The type of work item (e.g. bug, task, feature)
  workItemType?: string;

  // The name of the person the work item is assigned to
  assignedToName?: string;

  // The avatar URL of the person the work item is assigned to
  assignedToAvatar?: string;

  // The current state of the work item (e.g. active, closed)
  state?: string;
}

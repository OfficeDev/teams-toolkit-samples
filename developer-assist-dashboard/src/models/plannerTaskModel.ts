// Interface for a task
export interface TaskModel {
  // Unique identifier for the task
  id: string;

  // Title of the task
  title: string;

  // Percentage of completion for the task (optional)
  percentComplete?: string;

  // Priority of the task (optional)
  priority?: string;

  // Array of users assigned to the task
  assigned?: TaskAssignedToModel[];

  // Array of users over-assigned to the task
  overAssigned?: TaskAssignedToModel[];
}

// Interface for a user assigned to a task
export interface TaskAssignedToModel {
  // Unique identifier for the user
  userId: string;

  // Display name of the user
  displayName: string;

  // Avatar of the user
  avatar: any;
}

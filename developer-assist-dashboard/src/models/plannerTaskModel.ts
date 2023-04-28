export interface TaskModel {
    id: string;
    title: string;
    percentComplete?: string;
    priority?: string;
    assigned?: TaskAssignedToModel[];
    overAssigned?: TaskAssignedToModel[];
}

export interface TaskAssignedToModel {
    userId: string;
    displayName: string;
    avatar: any;
}

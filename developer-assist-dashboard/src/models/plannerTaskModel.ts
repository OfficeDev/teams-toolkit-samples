export interface TaskModel {
    id: string;
    name: string;
    percentComplete?: string;
    priority?: string;
    createdDateTime?: string;
    assignments?: TaskAssignedToModel[];
    overAssignments?: TaskAssignedToModel[];
}

export interface TaskAssignedToModel {
    userId: string;
    userDisplayName: string;
    userAvatar: any;
}

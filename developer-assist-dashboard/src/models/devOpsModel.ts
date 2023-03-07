export interface DevOpsModel {
    id?: string;
    url?: string;
    fields: DevOpsFieldsModel;
}

export interface DevOpsFieldsModel {
    title?: string;
    workItemType?: string;
    assigendTo?: DevOpsFieldsAssignedToModel;
    state?: string;
}

export interface DevOpsFieldsAssignedToModel {
    displayName?: string;
    links?: DevOpsFieldsAssignedToAvatarModel;
}
export interface DevOpsFieldsAssignedToAvatarModel {
    avatar?: DevOpsFieldsAssignedToAvatarHrefModel;
}
export interface DevOpsFieldsAssignedToAvatarHrefModel {
    href?: string;
}

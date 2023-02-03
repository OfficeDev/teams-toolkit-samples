import CollaborationData from "../data/CollaborationData.json";
import { CollaborationModel } from "../models/collaborationModel";

export const getCollaborationData = (): CollaborationModel[] => CollaborationData;

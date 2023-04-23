export interface CollaborationModel {
  // Unique identifier for the collaboration model
  id: string;

  // Image URL for the collaboration model
  img: string;
  
  // Title of the collaboration model
  title: string;
  
  // Description of the collaboration model
  description: string;
  
  // Time when the collaboration model was last updated
  updateTime: string;
  
  // Optional link to the collaboration model
  link?: string;
}

export interface TableModel {
  // Unique identifier for the table model
  id: string;

  // Title of the table
  title: string;

  // Avatar of the user assigned to the table
  assignedAvatar: string;

  // Name of the user assigned to the table
  assignedName: string;

  // Avatar of the owner of the table
  ownerAvatar: string;

  // Name of the owner of the table
  ownerName: string;

  // Priority of the table
  priority: string;

  // Color of the table
  color: string;

  // State of the table
  state: number;
}

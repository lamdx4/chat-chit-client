export interface GetRelationshipBetweenUser {
    relationship: RelationType;
    direction:    RelationDirection;
}
export enum RelationType {
  Pending = "Pending",
  Friend = "Friend",
  Block = "Block",
  ReplyAccepted = "ReplyAccepted",
}
export enum RelationDirection {
  Sender = "Outgoing",
  Receiver = "Incoming",
}
export interface PublisherMember {
  id: string;
  userId: string;
  memberRole: string;
  memberStatus: string;
  invitedBy?: string;
  joinedAt?: string;
}

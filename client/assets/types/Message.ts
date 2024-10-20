export type Message = {
    id: number;
    groupId: number;
    userId: number;
    content: string;
    createdAt: Date;
    seenBy: number[]; // list of user ids
}
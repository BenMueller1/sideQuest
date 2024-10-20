import { Message } from './Message';
import { EventType } from './Event';

export type Group = {
    id: number;
    event: EventType
    users: number[]; // ids of users in groups
    messages: Message[];
}
export type InterestType = {
    id: number;
    name: string;
    description: string;
};
  
export type EventType = {
    id: number;
    createdAt: Date;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    capacity: number;
    interests: InterestType[];
};